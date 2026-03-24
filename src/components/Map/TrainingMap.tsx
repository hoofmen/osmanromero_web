import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { playerRigidBodyRef } from '../Player/PlayerController'

// --- Reusable components ---

function Floor() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[120, 1, 120]} />
        <meshStandardMaterial color="#5a2020" roughness={0.9} />
      </mesh>
    </RigidBody>
  )
}

interface BoxProps {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
  rotation?: [number, number, number]
}

function Box({ position, size, color = '#3d1a1a', rotation }: BoxProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </RigidBody>
  )
}

interface LaunchPadProps {
  position: [number, number, number]
  force?: number
}

function LaunchPad({ position, force = 22 }: LaunchPadProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const cooldown = useRef(0)

  useFrame((_, delta) => {
    // Animate glow
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial
      const pulse = 0.6 + Math.sin(performance.now() / 1000 * 3) * 0.4
      mat.opacity = pulse
    }

    // Check if player is on the pad
    const rb = playerRigidBodyRef.current
    if (!rb) return
    cooldown.current -= delta
    if (cooldown.current > 0) return

    const playerPos = rb.translation()
    const dx = playerPos.x - position[0]
    const dy = playerPos.y - (position[1] + 0.5)
    const dz = playerPos.z - position[2]

    if (Math.abs(dx) < 1.5 && Math.abs(dz) < 1.5 && dy >= -0.3 && dy < 1.5) {
      const vel = rb.linvel()
      rb.setLinvel({ x: vel.x, y: force, z: vel.z }, true)
      cooldown.current = 0.5
    }
  })

  return (
    <group>
      {/* Pad base */}
      <RigidBody type="fixed" colliders="cuboid" position={position}>
        <mesh receiveShadow>
          <boxGeometry args={[3, 0.2, 3]} />
          <meshStandardMaterial color="#4a2010" roughness={0.8} />
        </mesh>
      </RigidBody>
      {/* Glowing indicator */}
      <mesh ref={meshRef} position={[position[0], position[1] + 0.15, position[2]]}>
        <boxGeometry args={[2.5, 0.05, 2.5]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      {/* Light */}
      <pointLight position={[position[0], position[1] + 1, position[2]]} color="#ff4400" intensity={3} distance={10} />
    </group>
  )
}

interface TorchProps {
  position: [number, number, number]
}

function Torch({ position }: TorchProps) {
  const flameRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (!flameRef.current) return
    // Flicker effect
    const t = performance.now() / 1000
    const flicker = 8 + Math.sin(t * 12 + position[0]) * 2 + Math.sin(t * 7.3 + position[2]) * 1.5
    flameRef.current.intensity = flicker
  })

  return (
    <group position={position}>
      {/* Stick */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.8, 6]} />
        <meshStandardMaterial color="#2a1508" roughness={1} />
      </mesh>
      {/* Flame (glowing sphere) */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ff6600" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshBasicMaterial color="#ffaa00" toneMapped={false} />
      </mesh>
      {/* Light */}
      <pointLight ref={flameRef} position={[0, 0.2, 0]} color="#ff4400" intensity={8} distance={18} />
    </group>
  )
}

// --- Map Zones ---

function SpawnArea() {
  return (
    <group>
      {/* Low walls framing the spawn */}
      <Box position={[-6, 0.75, -6]} size={[0.5, 1.5, 12]} color="#4a2010" />
      <Box position={[6, 0.75, -6]} size={[0.5, 1.5, 12]} color="#4a2010" />
      <Box position={[0, 0.75, -12]} size={[12, 1.5, 0.5]} color="#4a2010" />
      {/* A few simple boxes to practice shooting */}
      <Box position={[3, 0.75, -8]} size={[1.5, 1.5, 1.5]} />
      <Box position={[-3, 0.75, -9]} size={[1.5, 1.5, 1.5]} />
      <Box position={[0, 0.5, -5]} size={[2, 1, 2]} color="#4a2010" />
    </group>
  )
}

function StrafeJumpCorridor() {
  // Long corridor along X axis, starting from spawn area going east
  const corridorZ = 15
  const startX = 5
  const length = 60
  const endX = startX + length

  return (
    <group>
      {/* Corridor walls */}
      <Box position={[startX + length / 2, 2, corridorZ - 3]} size={[length, 4, 0.5]} color="#4a1818" />
      <Box position={[startX + length / 2, 2, corridorZ + 3]} size={[length, 4, 0.5]} color="#4a1818" />
      {/* Corridor floor */}
      <Box position={[startX + length / 2, -0.25, corridorZ]} size={[length, 0.5, 6]} color="#4a2010" />
      {/* Entry arch */}
      <Box position={[startX, 3, corridorZ]} size={[0.5, 2, 6]} color="#5a2818" />
      {/* Torches along the corridor wall */}
      <Torch position={[startX + 10, 3, corridorZ - 2.6]} />
      <Torch position={[startX + 30, 3, corridorZ + 2.6]} />
      <Torch position={[startX + 50, 3, corridorZ - 2.6]} />
      {/* Gap before landing platform */}
      {/* Landing platform at far end — need speed to clear the gap */}
      <Box position={[endX + 6, -0.25, corridorZ]} size={[8, 0.5, 6]} color="#5a2818" />
    </group>
  )
}

function VerticalTower() {
  // Tower in the negative X area — stacked platforms for rocket-jumping
  const baseX = -20
  const baseZ = -15

  return (
    <group>
      {/* Base */}
      <Box position={[baseX, 0.5, baseZ]} size={[10, 1, 10]} color="#4a2010" />
      {/* Ascending platforms — each requires a rocket-jump or good movement */}
      <Box position={[baseX - 2, 3, baseZ + 2]} size={[4, 0.5, 4]} />
      <Box position={[baseX + 2, 6, baseZ - 2]} size={[4, 0.5, 4]} color="#4a2010" />
      <Box position={[baseX - 1, 9, baseZ + 1]} size={[3.5, 0.5, 3.5]} />
      <Box position={[baseX + 1, 12, baseZ - 1]} size={[3, 0.5, 3]} color="#4a2010" />
      <Box position={[baseX, 15, baseZ]} size={[4, 0.5, 4]} color="#5a2818" />
      {/* Central pillar for visual reference */}
      <Box position={[baseX, 7.5, baseZ]} size={[1, 15, 1]} color="#3a1212" />
      {/* Spiral ramp as easier alternative */}
      <Box position={[baseX + 5, 1.5, baseZ]} size={[3, 0.3, 6]} rotation={[0.15, 0, 0]} color="#4a1818" />
      <Box position={[baseX + 5, 3.5, baseZ - 4]} size={[3, 0.3, 6]} rotation={[-0.15, 0, 0]} color="#4a1818" />
      <Box position={[baseX + 5, 5.5, baseZ]} size={[3, 0.3, 6]} rotation={[0.15, 0, 0]} color="#4a1818" />
    </group>
  )
}

function PillarGarden() {
  // Area with pillars of varying heights — tests air control and precision
  const baseX = 20
  const baseZ = -20

  const pillars: { pos: [number, number, number]; h: number }[] = [
    { pos: [baseX, 0, baseZ], h: 3 },
    { pos: [baseX + 5, 0, baseZ + 3], h: 5 },
    { pos: [baseX - 3, 0, baseZ + 6], h: 4 },
    { pos: [baseX + 8, 0, baseZ - 2], h: 6 },
    { pos: [baseX + 2, 0, baseZ + 9], h: 7 },
    { pos: [baseX - 5, 0, baseZ + 3], h: 2 },
    { pos: [baseX + 10, 0, baseZ + 6], h: 4.5 },
    { pos: [baseX + 6, 0, baseZ + 10], h: 8 },
    { pos: [baseX - 2, 0, baseZ + 12], h: 5.5 },
    { pos: [baseX + 12, 0, baseZ + 3], h: 3.5 },
  ]

  return (
    <group>
      {pillars.map((p, i) => (
        <Box
          key={i}
          position={[p.pos[0], p.h / 2, p.pos[2]]}
          size={[2, p.h, 2]}
          color={i % 2 === 0 ? '#3d1a1a' : '#4a2010'}
        />
      ))}
      {/* Torches mounted on outer pillars, facing inward toward garden center */}
      {/* On pillar at (baseX-5, baseZ+3) h=2 — inner face (+X side) */}
      <Torch position={[baseX - 5 + 1.2, 1.8, baseZ + 3]} />
      {/* On pillar at (baseX+12, baseZ+3) h=3.5 — inner face (-X side) */}
      <Torch position={[baseX + 12 - 1.2, 2.8, baseZ + 3]} />
      {/* On pillar at (baseX, baseZ) h=3 — inner face (+Z side) */}
      <Torch position={[baseX, 2.5, baseZ + 1.2]} />
    </group>
  )
}

function FinalPlatform() {
  // High platform that requires combining strafe-jumping and rocket-jumping
  return (
    <group>
      {/* Tall column */}
      <Box position={[0, 12, -40]} size={[1.5, 24, 1.5]} color="#3a1212" />
      {/* Platform on top */}
      <Box position={[0, 24.25, -40]} size={[6, 0.5, 6]} color="#5a2818" />
      {/* Intermediate stepping stone */}
      <Box position={[5, 14, -38]} size={[3, 0.5, 3]} color="#4a2010" />
      {/* Another stepping stone */}
      <Box position={[-4, 18, -42]} size={[3, 0.5, 3]} />
    </group>
  )
}

// --- Main Map ---

export default function TrainingMap() {
  return (
    <group>
      <Floor />

      {/* Zone 1: Spawn area — flat, simple, teaches shooting */}
      <SpawnArea />

      {/* Zone 2: Strafe-jump corridor */}
      <StrafeJumpCorridor />

      {/* Zone 3: Vertical tower — rocket-jump to ascend */}
      <VerticalTower />

      {/* Zone 4: Pillar garden — air control and precision */}
      <PillarGarden />

      {/* Zone 5: Final platform — the ultimate challenge */}
      <FinalPlatform />

      {/* Launch pads */}
      <LaunchPad position={[0, 0, 5]} />
      <LaunchPad position={[-20, 1, -8]} force={18} />
      <LaunchPad position={[20, 0, -10]} force={15} />
      <LaunchPad position={[-10, 0, 20]} force={25} />

      {/* Scattered connecting geometry */}
      <Box position={[10, 0.75, 0]} size={[3, 1.5, 6]} />
      <Box position={[-10, 1, 10]} size={[4, 2, 3]} color="#4a2010" />
      <Box position={[0, 0.5, 25]} size={[6, 1, 3]} />
      {/* Ramps between areas */}
      <Box position={[8, 1, -8]} size={[4, 0.3, 8]} rotation={[0.2, 0.5, 0]} color="#4a1818" />
      <Box position={[-8, 1, 8]} size={[4, 0.3, 8]} rotation={[-0.15, -0.3, 0]} color="#4a1818" />
    </group>
  )
}
