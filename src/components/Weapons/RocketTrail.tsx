import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const POOL_SIZE = 35
const EMIT_INTERVAL = 0.025
const PARTICLE_LIFETIME = 0.3

interface Props {
  positionRef: React.MutableRefObject<THREE.Vector3>
  aliveRef: React.MutableRefObject<boolean>
}

export default function RocketTrail({ positionRef, aliveRef }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const lastEmit = useRef(0)
  const nextSlot = useRef(0)

  const pool = useMemo(() =>
    Array.from({ length: POOL_SIZE }, () => ({ x: 0, y: 0, z: 0, born: -999 })), [])

  useFrame(() => {
    if (!meshRef.current) return
    const now = performance.now() / 1000

    if (aliveRef.current && now - lastEmit.current > EMIT_INTERVAL) {
      lastEmit.current = now
      const slot = pool[nextSlot.current % POOL_SIZE]
      nextSlot.current++
      slot.x = positionRef.current.x + (Math.random() - 0.5) * 0.15
      slot.y = positionRef.current.y + (Math.random() - 0.5) * 0.15
      slot.z = positionRef.current.z + (Math.random() - 0.5) * 0.15
      slot.born = now
    }

    for (let i = 0; i < POOL_SIZE; i++) {
      const p = pool[i]
      const age = now - p.born
      if (age > PARTICLE_LIFETIME) {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        continue
      }
      const t = age / PARTICLE_LIFETIME
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(0.12 * (1 - t))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, POOL_SIZE]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ff6600" transparent opacity={0.8} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}
