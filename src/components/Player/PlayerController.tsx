import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { Ray } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useMouseLook } from '../../hooks/useMouseLook'
import {
  MOVE_SPEED,
  AIR_ACCEL,
  AIR_SPEED_CAP,
  FRICTION,
  JUMP_FORCE,
  GRAVITY,
  MAX_GROUND_SPEED,
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

export default function PlayerController() {
  const rigidBody = useRef<RapierRigidBody>(null)
  const keys = useKeyboard()
  const { yaw, pitch } = useMouseLook()
  const grounded = useRef(false)
  const { world } = useRapier()

  // Temp vectors to avoid allocation
  const _forward = new THREE.Vector3()
  const _right = new THREE.Vector3()
  const _wishDir = new THREE.Vector3()

  useFrame((state, delta) => {
    const rb = rigidBody.current
    if (!rb) return

    // Clamp delta to avoid physics explosion on tab-switch
    const dt = Math.min(delta, 0.05)

    // --- Camera orientation ---
    const cam = state.camera
    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    cam.quaternion.setFromEuler(euler)

    const pos = rb.translation()
    const vel = rb.linvel()
    playerVelocity.current.set(vel.x, vel.y, vel.z)

    // --- Ground detection via multiple raycasts ---
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
    _wishDir.y = 0
    if (_wishDir.lengthSq() > 0) _wishDir.normalize()

    let vx = vel.x
    let vz = vel.z
    let vy = vel.y

    if (grounded.current) {
      // --- Ground movement ---
      // Apply friction
      const speed = Math.sqrt(vx * vx + vz * vz)
      if (speed > 0.1) {
        const drop = speed * FRICTION * dt
        const scale = Math.max(speed - drop, 0) / speed
        vx *= scale
        vz *= scale
      }

      // Accelerate
      if (_wishDir.lengthSq() > 0) {
        const currentSpeed = vx * _wishDir.x + vz * _wishDir.z
        const addSpeed = MAX_GROUND_SPEED - currentSpeed
        if (addSpeed > 0) {
          const accelSpeed = Math.min(MOVE_SPEED * dt * MAX_GROUND_SPEED, addSpeed)
          vx += _wishDir.x * accelSpeed
          vz += _wishDir.z * accelSpeed
        }
      }

      // Prevent sinking — zero out downward velocity when grounded
      if (vy < 0) vy = 0

      // Jump
      if (keys.current.has('Space')) {
        vy = JUMP_FORCE
        grounded.current = false
      }
    } else {
      // --- Air movement (Quake air-strafing) ---
      if (_wishDir.lengthSq() > 0) {
        const currentSpeed = vx * _wishDir.x + vz * _wishDir.z
        const addSpeed = AIR_SPEED_CAP - currentSpeed
        if (addSpeed > 0) {
          const accelSpeed = Math.min(AIR_ACCEL * dt * MAX_GROUND_SPEED, addSpeed)
          vx += _wishDir.x * accelSpeed
          vz += _wishDir.z * accelSpeed
        }
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
