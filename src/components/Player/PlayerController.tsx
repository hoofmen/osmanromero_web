import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { Ray } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useMouseLook, mouseLookState } from '../../hooks/useMouseLook'
import { touchInput } from '../../hooks/useTouchInput'
import {
  AIR_ACCEL,
  AIR_SPEED_CAP,
  FRICTION,
  JUMP_FORCE,
  GRAVITY,
  MAX_GROUND_SPEED,
  GROUND_ACCEL,
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_SPAWN,
} from '../../utils/constants'

// Shared velocity ref so HUD can read it
export const playerVelocity = { current: new THREE.Vector3() }

// Ray length from capsule center to detect ground
const GROUND_RAY_LENGTH = PLAYER_HEIGHT / 2 + 0.15
// Offsets for multi-ray ground check (center + 4 cardinal directions)
const RAY_OFFSETS = [
  { x: 0, z: 0 },
  { x: PLAYER_RADIUS * 0.8, z: 0 },
  { x: -PLAYER_RADIUS * 0.8, z: 0 },
  { x: 0, z: PLAYER_RADIUS * 0.8 },
  { x: 0, z: -PLAYER_RADIUS * 0.8 },
]

/**
 * Quake-style accelerate function.
 * This is the core of both ground and air movement.
 * In air, wishSpeed is clamped to AIR_SPEED_CAP, which is the key
 * to how strafe-jumping works: when wish direction differs from
 * velocity direction, the dot product is small, leaving room for
 * acceleration — so speed compounds with each strafe.
 */
function accelerate(
  vx: number, vz: number,
  wishX: number, wishZ: number,
  wishSpeed: number, accel: number, dt: number,
): [number, number] {
  // Project current velocity onto wish direction
  const currentSpeed = vx * wishX + vz * wishZ
  // How much speed we can add
  const addSpeed = wishSpeed - currentSpeed
  if (addSpeed <= 0) return [vx, vz]

  let accelSpeed = accel * wishSpeed * dt
  if (accelSpeed > addSpeed) accelSpeed = addSpeed

  return [vx + wishX * accelSpeed, vz + wishZ * accelSpeed]
}

function applyFriction(vx: number, vz: number, dt: number): [number, number] {
  const speed = Math.sqrt(vx * vx + vz * vz)
  if (speed < 0.1) return [0, 0]

  // Quake friction: drop is proportional to speed (or a minimum control speed)
  const control = Math.max(speed, MAX_GROUND_SPEED * 0.3)
  const drop = control * FRICTION * dt
  const newSpeed = Math.max(speed - drop, 0) / speed

  return [vx * newSpeed, vz * newSpeed]
}

// Shared ref so weapon system can apply rocket-jump impulse
export const playerRigidBodyRef = { current: null as RapierRigidBody | null }

// Teleport player back to spawn, zero velocity, and reset look direction
export function respawnPlayer() {
  const rb = playerRigidBodyRef.current
  if (!rb) return
  rb.setTranslation({ x: PLAYER_SPAWN[0], y: PLAYER_SPAWN[1], z: PLAYER_SPAWN[2] }, true)
  rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
  mouseLookState.yaw.current = 0
  mouseLookState.pitch.current = 0
}

export default function PlayerController() {
  const rigidBody = useRef<RapierRigidBody>(null)
  const keys = useKeyboard()
  const { yaw, pitch } = useMouseLook()
  const grounded = useRef(false)
  const wasGrounded = useRef(false)
  const jumpQueued = useRef(false)
  const { world } = useRapier()

  // Temp vectors to avoid allocation
  const _forward = new THREE.Vector3()
  const _right = new THREE.Vector3()
  const _wishDir = new THREE.Vector3()

  useFrame((state, delta) => {
    const rb = rigidBody.current
    if (!rb) return
    // Sync shared ref for weapon system
    playerRigidBodyRef.current = rb

    const dt = Math.min(delta, 0.05)

    // --- Camera orientation ---
    const cam = state.camera
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    cam.quaternion.setFromEuler(euler)

    const pos = rb.translation()
    const vel = rb.linvel()
    playerVelocity.current.set(vel.x, vel.y, vel.z)

    // --- Ground detection via multiple raycasts ---
    wasGrounded.current = grounded.current
    const rayDir = { x: 0, y: -1, z: 0 }
    grounded.current = false
    for (const offset of RAY_OFFSETS) {
      const ray = new Ray({ x: pos.x + offset.x, y: pos.y, z: pos.z + offset.z }, rayDir)
      const hit = world.castRay(ray, GROUND_RAY_LENGTH, true, undefined, undefined, undefined, rb)
      if (hit !== null && hit.timeOfImpact <= GROUND_RAY_LENGTH) {
        grounded.current = true
        break
      }
    }

    // --- Build wish direction from keys ---
    _forward.set(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current)
    _right.set(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current)

    _wishDir.set(0, 0, 0)
    if (keys.current.has('KeyW')) _wishDir.add(_forward)
    if (keys.current.has('KeyS')) _wishDir.sub(_forward)
    if (keys.current.has('KeyD')) _wishDir.add(_right)
    if (keys.current.has('KeyA')) _wishDir.sub(_right)
    // Touch joystick input (additive — works alongside keyboard)
    if (touchInput.moveY !== 0) {
      _wishDir.addScaledVector(_forward, touchInput.moveY)
    }
    if (touchInput.moveX !== 0) {
      _wishDir.addScaledVector(_right, touchInput.moveX)
    }
    _wishDir.y = 0
    if (_wishDir.lengthSq() > 0) _wishDir.normalize()

    let vx = vel.x
    let vz = vel.z
    let vy = vel.y

    // --- Track jump input (space bar or touch button) ---
    const jumpPressed = keys.current.has('Space') || touchInput.jumpPressed

    if (grounded.current) {
      // --- Bunny-hop: if player is holding jump on the frame they land,
      // skip friction and jump immediately to preserve momentum ---
      const justLanded = !wasGrounded.current && grounded.current
      const bunnyHop = justLanded && jumpPressed

      if (!bunnyHop) {
        // Apply ground friction (only if not bunny-hopping)
        ;[vx, vz] = applyFriction(vx, vz, dt)
      }

      // Ground accelerate
      if (_wishDir.lengthSq() > 0) {
        ;[vx, vz] = accelerate(vx, vz, _wishDir.x, _wishDir.z, MAX_GROUND_SPEED, GROUND_ACCEL, dt)
      }

      // Prevent sinking
      if (vy < 0) vy = 0

      // Jump (or bunny-hop)
      if (jumpPressed) {
        vy = JUMP_FORCE
        grounded.current = false
      }
    } else {
      // --- Air movement (Quake air-strafing) ---
      // The magic: wishSpeed is clamped to AIR_SPEED_CAP (~0.7).
      // When strafing + turning, the wish direction diverges from velocity,
      // so the dot product (currentSpeed) is small, allowing acceleration
      // even when moving much faster than AIR_SPEED_CAP. Speed compounds.
      if (_wishDir.lengthSq() > 0) {
        ;[vx, vz] = accelerate(vx, vz, _wishDir.x, _wishDir.z, AIR_SPEED_CAP, AIR_ACCEL, dt)
      }

      // Gravity
      vy += GRAVITY * dt
    }

    rb.setLinvel({ x: vx, y: vy, z: vz }, true)

    // --- Respawn if fallen off the map ---
    if (pos.y < -20) {
      rb.setTranslation({ x: PLAYER_SPAWN[0], y: PLAYER_SPAWN[1], z: PLAYER_SPAWN[2] }, true)
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
      return
    }

    // --- Move camera to player position ---
    const newPos = rb.translation()
    cam.position.set(newPos.x, newPos.y + PLAYER_HEIGHT / 2 - 0.1, newPos.z)
  })

  return (
    <RigidBody
      ref={rigidBody}
      type="dynamic"
      position={[PLAYER_SPAWN[0], PLAYER_SPAWN[1], PLAYER_SPAWN[2]]}
      enabledRotations={[false, false, false]}
      linearDamping={0}
      angularDamping={0}
      colliders={false}
      mass={1}
    >
      <CapsuleCollider args={[PLAYER_HEIGHT / 2 - PLAYER_RADIUS, PLAYER_RADIUS]} />
    </RigidBody>
  )
}
