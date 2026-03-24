import { useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import { Ray } from '@dimforge/rapier3d-compat'
import * as THREE from 'three'
import { weaponState, tryFire, useWeaponInput } from '../../hooks/useWeapons'
import RailgunBeam from './RailgunBeam'
import RocketProjectile from './RocketProjectile'
import WeaponViewmodel from './WeaponViewmodel'
import { playerRigidBodyRef } from '../Player/PlayerController'

interface Beam {
  id: number
  start: THREE.Vector3
  end: THREE.Vector3
  createdAt: number
}

interface Rocket {
  id: number
  origin: THREE.Vector3
  direction: THREE.Vector3
  createdAt: number
}

let nextId = 0

export default function WeaponSystem() {
  useWeaponInput()
  const { world } = useRapier()
  const { camera } = useThree()
  const [beams, setBeams] = useState<Beam[]>([])
  const [rockets, setRockets] = useState<Rocket[]>([])

  const removeRocket = useCallback((id: number) => {
    setRockets((prev) => prev.filter((r) => r.id !== id))
  }, [])

  useFrame(() => {
    if (!tryFire()) return

    const now = performance.now() / 1000
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)

    if (weaponState.activeWeapon === 'railgun') {
      // Hitscan: raycast from camera
      const rayOrigin = camera.position.clone()
      const ray = new Ray(
        { x: rayOrigin.x, y: rayOrigin.y, z: rayOrigin.z },
        { x: forward.x, y: forward.y, z: forward.z },
      )
      const maxDist = 200
      const hit = world.castRay(ray, maxDist, true, undefined, undefined, undefined, playerRigidBodyRef.current ?? undefined)
      const dist = hit ? hit.timeOfImpact : maxDist
      // Start beam slightly ahead of camera so it's not clipped by the near plane
      const beamStart = rayOrigin.clone().add(forward.clone().multiplyScalar(0.5))
      const beamEnd = rayOrigin.clone().add(forward.clone().multiplyScalar(dist))

      const id = nextId++
      setBeams((prev) => [...prev.filter((b) => now - b.createdAt < 0.4), { id, start: beamStart, end: beamEnd, createdAt: now }])
    } else {
      // Rocket: spawn projectile
      const origin = camera.position.clone().add(forward.clone().multiplyScalar(1))
      const id = nextId++
      setRockets((prev) => [...prev, { id, origin, direction: forward.clone(), createdAt: now }])
    }
  })

  // Clean up old beams
  useFrame(() => {
    const now = performance.now() / 1000
    setBeams((prev) => {
      const filtered = prev.filter((b) => now - b.createdAt < 0.4)
      if (filtered.length !== prev.length) return filtered
      return prev
    })
  })

  return (
    <>
      <WeaponViewmodel />
      {beams.map((b) => (
        <RailgunBeam key={b.id} start={b.start} end={b.end} createdAt={b.createdAt} />
      ))}
      {rockets.map((r) => (
        <RocketProjectile
          key={r.id}
          origin={r.origin}
          direction={r.direction}
          createdAt={r.createdAt}
          playerRbRef={playerRigidBodyRef}
          rapierWorld={world}
          onExpired={() => removeRocket(r.id)}
        />
      ))}
    </>
  )
}
