import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { registerTarget, unregisterTarget } from '../../utils/targetRegistry'
import { useVisualSettings } from '../../hooks/useVisualSettings'

interface BullseyeTargetProps {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  onHit: (id: string) => void
  isHit: boolean
}

const TARGET_RADIUS = 0.8
const SPARK_COUNT = 40
const SPARK_DURATION = 1.2 // seconds

export default function BullseyeTarget({ id, position, rotation, onHit, isHit }: BullseyeTargetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const outerMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const midMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const centerMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const [hitTime, setHitTime] = useState<number | null>(null)
  const [sparksComplete, setSparksComplete] = useState(false)
  const posVec = useRef(new THREE.Vector3(...position))

  useEffect(() => {
    posVec.current.set(...position)
  }, [position])

  // Register in target registry for hit detection
  useEffect(() => {
    if (isHit) return
    const handleHit = () => {
      setHitTime(performance.now() / 1000)
      onHit(id)
    }
    registerTarget({
      id,
      position: posVec.current,
      radius: TARGET_RADIUS,
      onHit: handleHit,
    })
    return () => unregisterTarget(id)
  }, [id, onHit, isHit, position])

  // Idle glow pulse animation
  useFrame(() => {
    if (isHit) return
    const t = performance.now() / 1000
    const pulse = 0.4 + Math.sin(t * 2.5 + position[0]) * 0.3
    if (outerMatRef.current) outerMatRef.current.emissiveIntensity = pulse
    if (midMatRef.current) midMatRef.current.emissiveIntensity = pulse + 0.2
    if (centerMatRef.current) centerMatRef.current.emissiveIntensity = pulse + 0.6
    if (lightRef.current) lightRef.current.intensity = 3 + pulse * 4
  })

  // Determine colors: gray immediately on hit, colored when active
  const outerColor = isHit ? '#333333' : '#ff2200'
  const midColor = isHit ? '#444444' : '#ff8800'
  const centerColor = isHit ? '#555555' : '#ffcc00'
  const outerEmissive = isHit ? '#222222' : '#ff2200'
  const midEmissive = isHit ? '#333333' : '#ff8800'
  const centerEmissive = isHit ? '#444444' : '#ffcc00'

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Outer ring */}
      <mesh>
        <cylinderGeometry args={[TARGET_RADIUS, TARGET_RADIUS, 0.06, 32]} />
        <meshStandardMaterial
          ref={outerMatRef}
          color={outerColor}
          emissive={outerEmissive}
          emissiveIntensity={isHit ? 0.15 : 0.5}
          roughness={isHit ? 0.8 : 0.3}
        />
      </mesh>
      {/* Middle ring */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[TARGET_RADIUS * 0.65, TARGET_RADIUS * 0.65, 0.07, 32]} />
        <meshStandardMaterial
          ref={midMatRef}
          color={midColor}
          emissive={midEmissive}
          emissiveIntensity={isHit ? 0.1 : 0.6}
          roughness={isHit ? 0.8 : 0.3}
        />
      </mesh>
      {/* Center bullseye */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[TARGET_RADIUS * 0.3, TARGET_RADIUS * 0.3, 0.08, 32]} />
        <meshStandardMaterial
          ref={centerMatRef}
          color={centerColor}
          emissive={centerEmissive}
          emissiveIntensity={isHit ? 0.1 : 1}
          roughness={isHit ? 0.7 : 0.2}
        />
      </mesh>
      {/* Light: dim when hit, glowing when active */}
      <pointLight
        ref={lightRef}
        color={isHit ? '#666666' : '#ff4400'}
        intensity={isHit ? 0.5 : 4}
        distance={isHit ? 6 : 12}
      />

      {/* Spark explosion on hit */}
      {hitTime && !sparksComplete && <SparkExplosionGated hitTime={hitTime} onComplete={() => setSparksComplete(true)} />}
    </group>
  )
}

// --- Particles toggle gate ---
function SparkExplosionGated(props: SparkExplosionProps) {
  const { particles } = useVisualSettings()
  if (!particles) return null
  return <SparkExplosion {...props} />
}

// --- Spark particle system ---

interface SparkExplosionProps {
  hitTime: number
  onComplete: () => void
}

function SparkExplosion({ hitTime, onComplete }: SparkExplosionProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const completedRef = useRef(false)

  // Pre-compute random velocities and colors for each spark
  const sparkData = useMemo(() => {
    const data = []
    for (let i = 0; i < SPARK_COUNT; i++) {
      // Explode outward from center in the local +Y direction (bullseye face normal)
      // with random spread in all directions
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.8 // bias toward the face normal (+Y)
      const speed = 2 + Math.random() * 5
      data.push({
        vx: Math.sin(phi) * Math.cos(theta) * speed,
        vy: Math.cos(phi) * speed, // primarily outward from face
        vz: Math.sin(phi) * Math.sin(theta) * speed,
        // Random warm colors: yellow, orange, red, white
        color: new THREE.Color().setHSL(
          Math.random() * 0.12, // hue 0-0.12 (red to yellow)
          0.9 + Math.random() * 0.1,
          0.5 + Math.random() * 0.4
        ),
        life: 0.5 + Math.random() * 0.7, // individual lifetime variation
        size: 0.03 + Math.random() * 0.06,
      })
    }
    return data
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Set initial colors
  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < SPARK_COUNT; i++) {
      meshRef.current.setColorAt(i, sparkData[i].color)
    }
    meshRef.current.instanceColor!.needsUpdate = true
  }, [sparkData])

  useFrame(() => {
    if (!meshRef.current) return
    const now = performance.now() / 1000
    const age = now - hitTime

    if (age > SPARK_DURATION && !completedRef.current) {
      completedRef.current = true
      onComplete()
      return
    }

    const tempColor = new THREE.Color()

    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = sparkData[i]
      const t = Math.min(age, s.life)
      const progress = t / s.life // 0→1 over this spark's lifetime
      const alive = age < s.life

      if (alive) {
        // Position: velocity * time + gravity pull
        const gravity = -4
        const x = s.vx * t
        const y = s.vy * t + 0.5 * gravity * t * t
        const z = s.vz * t

        // Shrink and fade as spark dies
        const fadeScale = 1 - progress * progress // ease out
        const scale = s.size * fadeScale

        dummy.position.set(x, y, z)
        dummy.scale.setScalar(scale > 0.001 ? scale : 0.001)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)

        // Fade color toward dim red
        tempColor.copy(s.color).lerp(new THREE.Color('#330000'), progress)
        meshRef.current.setColorAt(i, tempColor)
      } else {
        // Dead spark — hide it
        dummy.position.set(0, 0, 0)
        dummy.scale.setScalar(0.001)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPARK_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </instancedMesh>
  )
}
