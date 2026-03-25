import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useVisualSettings } from '../../hooks/useVisualSettings'

const COUNT = 16
const LIFETIME = 0.3

interface Props {
  position: THREE.Vector3
  direction: THREE.Vector3
  createdAt: number
}

export default function RailgunImpact({ position, direction, createdAt }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const { particles: particlesEnabled } = useVisualSettings()

  const particles = useMemo(() => {
    const normal = direction.clone().negate().normalize()
    return Array.from({ length: COUNT }, () => {
      const spread = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ).normalize()
      const v = normal.clone().lerp(spread, 0.5).normalize()
      const speed = 4 + Math.random() * 10
      return { vx: v.x * speed, vy: v.y * speed, vz: v.z * speed }
    })
  }, [direction])

  useFrame(() => {
    if (!particlesEnabled || !meshRef.current) return
    const age = performance.now() / 1000 - createdAt
    const t = age / LIFETIME

    if (t >= 1) { meshRef.current.visible = false; return }

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i]
      dummy.position.set(
        position.x + p.vx * age,
        position.y + p.vy * age - 5 * age * age,
        position.z + p.vz * age,
      )
      dummy.scale.setScalar(0.05 * (1 - t))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - t
  })

  if (!particlesEnabled) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ff2222" transparent opacity={1} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}
