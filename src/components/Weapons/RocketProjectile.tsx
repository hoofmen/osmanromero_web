import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Ray } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { checkExplosionHits, checkProjectileHit } from '../../utils/targetRegistry'
import ExplosionParticles from './ExplosionParticles'

const ROCKET_SPEED = 30
const ROCKET_LIFETIME = 5
const EXPLOSION_DURATION = 0.4
const EXPLOSION_RADIUS = 4
const EXPLOSION_FORCE = 20

interface RocketProjectileProps {
  origin: THREE.Vector3
  direction: THREE.Vector3
  createdAt: number
  playerRbRef: { current: any }
  rapierWorld: any
  onExpired: () => void
}

export default function RocketProjectile({
  origin,
  direction,
  createdAt,
  playerRbRef,
  rapierWorld,
  onExpired,
}: RocketProjectileProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pos = useRef(origin.clone())
  const vel = useRef(direction.clone().normalize().multiplyScalar(ROCKET_SPEED))
  const alive = useRef(true)
  const [explosion, setExplosion] = useState<{ pos: THREE.Vector3; time: number } | null>(null)
  const explosionMeshRef = useRef<THREE.Mesh>(null)
  const explosionMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const explosionLightRef = useRef<THREE.PointLight>(null)
  const appliedImpulse = useRef(false)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const now = performance.now() / 1000

    // Handle explosion animation
    if (explosion) {
      const age = now - explosion.time
      if (age > EXPLOSION_DURATION) {
        onExpired()
        return
      }
      if (explosionMeshRef.current && explosionMatRef.current) {
        const t = age / EXPLOSION_DURATION
        explosionMeshRef.current.scale.setScalar(EXPLOSION_RADIUS * t)
        explosionMatRef.current.opacity = 1 - t
        if (explosionLightRef.current) {
          explosionLightRef.current.intensity = (1 - t) * 50
        }
      }

      // Check if explosion hits any targets
      if (!appliedImpulse.current) {
        checkExplosionHits(explosion.pos, EXPLOSION_RADIUS)
      }

      // Apply impulse to player once
      if (!appliedImpulse.current && playerRbRef.current) {
        appliedImpulse.current = true
        const playerPos = playerRbRef.current.translation()
        const dx = playerPos.x - explosion.pos.x
        const dy = playerPos.y - explosion.pos.y
        const dz = playerPos.z - explosion.pos.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < EXPLOSION_RADIUS && dist > 0.01) {
          const falloff = 1 - dist / EXPLOSION_RADIUS
          const force = EXPLOSION_FORCE * falloff
          const nx = dx / dist
          const ny = dy / dist
          const nz = dz / dist
          const currentVel = playerRbRef.current.linvel()
          playerRbRef.current.setLinvel({
            x: currentVel.x + nx * force,
            y: currentVel.y + ny * force * 1.5,
            z: currentVel.z + nz * force,
          }, true)
        }
      }
      return
    }

    if (!alive.current) return

    if (now - createdAt > ROCKET_LIFETIME) {
      alive.current = false
      onExpired()
      return
    }

    // Move rocket
    const prevPos = pos.current.clone()
    pos.current.x += vel.current.x * dt
    pos.current.y += vel.current.y * dt
    pos.current.z += vel.current.z * dt

    // No gravity — rockets fly straight

    if (meshRef.current) {
      meshRef.current.position.copy(pos.current)
    }

    // Check if rocket hit a bullseye target directly
    const targetHit = checkProjectileHit(prevPos, pos.current, 0.15)
    if (targetHit) {
      alive.current = false
      setExplosion({ pos: pos.current.clone(), time: now })
      return
    }

    // Collision check via raycast (world geometry)
    if (rapierWorld) {
      const step = vel.current.clone().normalize()
      const ray = new Ray(
        { x: pos.current.x, y: pos.current.y, z: pos.current.z },
        { x: step.x, y: step.y, z: step.z },
      )
      const hit = rapierWorld.castRay(ray, ROCKET_SPEED * dt + 0.5, true, undefined, undefined, undefined, playerRbRef.current ?? undefined)
      if (hit !== null && hit.timeOfImpact <= ROCKET_SPEED * dt + 0.5) {
        alive.current = false
        setExplosion({ pos: pos.current.clone(), time: now })
      }
    }
  })

  return (
    <group>
      {explosion ? (
        <>
          <mesh ref={explosionMeshRef} position={explosion.pos}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              ref={explosionMatRef}
              color="#ff4400"
              transparent
              opacity={1}
              toneMapped={false}
            />
          </mesh>
          <pointLight ref={explosionLightRef} position={explosion.pos} color="#ff4400" intensity={50} distance={35} />
          <ExplosionParticles position={explosion.pos} startTime={explosion.time} />
        </>
      ) : (
        <mesh ref={meshRef} position={pos.current}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#ff6600" toneMapped={false} />
          <pointLight color="#ff4400" intensity={8} distance={15} />
        </mesh>
      )}
    </group>
  )
}
