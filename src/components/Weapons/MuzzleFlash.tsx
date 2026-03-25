import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { weaponState } from '../../hooks/useWeapons'
import { useVisualSettings } from '../../hooks/useVisualSettings'

const COUNT = 12
const LIFETIME = 0.18
const BARREL_OFFSET = new THREE.Vector3(0, -0.22, -0.78)

export default function MuzzleFlash() {
  const { camera } = useThree()
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const lastFireTime = useRef(weaponState.lastFireTime)
  const { particles: particlesEnabled } = useVisualSettings()

  const particles = useMemo(() =>
    Array.from({ length: COUNT }, () => ({
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      born: -999,
    })), [])

  useFrame(() => {
    if (!particlesEnabled || !meshRef.current) return
    const now = performance.now() / 1000

    if (weaponState.lastFireTime !== lastFireTime.current) {
      lastFireTime.current = weaponState.lastFireTime

      const tip = BARREL_OFFSET.clone().applyQuaternion(camera.quaternion).add(camera.position)
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i]
        p.x = tip.x; p.y = tip.y; p.z = tip.z
        p.born = now
        const spread = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
        ).normalize()
        const v = forward.clone().lerp(spread, 0.35).normalize()
        const speed = 2 + Math.random() * 4
        p.vx = v.x * speed; p.vy = v.y * speed; p.vz = v.z * speed
      }
    }

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i]
      const age = now - p.born
      if (age > LIFETIME) {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        continue
      }
      const t = age / LIFETIME
      dummy.position.set(p.x + p.vx * age, p.y + p.vy * age, p.z + p.vz * age)
      dummy.scale.setScalar(0.13 * (1 - t))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity =
      Math.max(0, 1 - (now - lastFireTime.current) / LIFETIME)
  })

  if (!particlesEnabled) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffaa00" transparent opacity={1} toneMapped={false} depthWrite={false} depthTest={false} />
    </instancedMesh>
  )
}
