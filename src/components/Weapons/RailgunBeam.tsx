import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import RailgunImpact from './RailgunImpact'

interface RailgunBeamProps {
  start: THREE.Vector3
  end: THREE.Vector3
  createdAt: number
  direction: THREE.Vector3
}

const BEAM_DURATION = 0.3

export default function RailgunBeam({ start, end, createdAt, direction }: RailgunBeamProps) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const lightStartRef = useRef<THREE.PointLight>(null)
  const lightMidRef = useRef<THREE.PointLight>(null)
  const lightEndRef = useRef<THREE.PointLight>(null)

  const { midpoint, quaternion, length } = useMemo(() => {
    const direction = new THREE.Vector3().subVectors(end, start)
    const len = direction.length()
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const quat = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 1, 0)
    const mat4 = new THREE.Matrix4().lookAt(start, end, up)
    quat.setFromRotationMatrix(mat4)
    quat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)))
    return { midpoint: mid, quaternion: quat, length: len }
  }, [start, end])

  // Place lights at start, middle, and end of beam
  const quarterPoint = useMemo(() =>
    new THREE.Vector3().lerpVectors(start, end, 0.25), [start, end])
  const threeQuarterPoint = useMemo(() =>
    new THREE.Vector3().lerpVectors(start, end, 0.75), [start, end])

  useFrame(() => {
    if (!groupRef.current) return
    const age = performance.now() / 1000 - createdAt
    const t = Math.max(0, 1 - age / BEAM_DURATION)

    if (materialRef.current) materialRef.current.opacity = t
    if (lightStartRef.current) lightStartRef.current.intensity = t * 25
    if (lightMidRef.current) lightMidRef.current.intensity = t * 35
    if (lightEndRef.current) lightEndRef.current.intensity = t * 25

    if (t <= 0) groupRef.current.visible = false
  })

  return (
    <group ref={groupRef}>
      {/* Beam cylinder */}
      <mesh position={midpoint} quaternion={quaternion}>
        <cylinderGeometry args={[0.03, 0.03, length, 6, 1]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#ff4444"
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>
      {/* Lights along the beam */}
      <pointLight ref={lightStartRef} position={quarterPoint} color="#ff2222" intensity={25} distance={25} />
      <pointLight ref={lightMidRef} position={midpoint} color="#ff3333" intensity={35} distance={30} />
      <pointLight ref={lightEndRef} position={threeQuarterPoint} color="#ff2222" intensity={25} distance={25} />
      <RailgunImpact position={end} direction={direction} createdAt={createdAt} />
    </group>
  )
}
