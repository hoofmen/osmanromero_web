import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useVisualSettings } from '../../hooks/useVisualSettings'

const COUNT = 28
const LIFETIME = 0.9

interface Props {
  position: THREE.Vector3
  startTime: number
}

export default function ExplosionParticles({ position, startTime }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const { particles: particlesEnabled } = useVisualSettings()

  const particles = useMemo(() =>
    Array.from({ length: COUNT }, () => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const speed = 5 + Math.random() * 10
      return {
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: 2 + Math.abs(Math.sin(phi) * Math.sin(theta)) * speed,
        vz: Math.cos(phi) * speed,
        size: 0.08 + Math.random() * 0.14,
      }
    }), [])

  useFrame(() => {
    if (!particlesEnabled || !meshRef.current) return
    const age = performance.now() / 1000 - startTime
    const t = age / LIFETIME

    if (t >= 1) { meshRef.current.visible = false; return }

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i]
      dummy.position.set(
        position.x + p.vx * age,
        position.y + p.vy * age - 9 * age * age,
        position.z + p.vz * age,
      )
      dummy.scale.setScalar(p.size * (1 - t))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - t * t
  })

  if (!particlesEnabled) return null

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff5500" transparent opacity={1} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}
