import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { weaponState } from '../../hooks/useWeapons'

export default function WeaponViewmodel() {
  const groupRef = useRef<THREE.Group>(null)
  const kickRef = useRef(0)

  useFrame((state) => {
    if (!groupRef.current) return

    const cam = state.camera

    // Position weapon relative to camera
    const offset = new THREE.Vector3(0, -0.25, -0.5)
    offset.applyQuaternion(cam.quaternion)
    groupRef.current.position.copy(cam.position).add(offset)
    groupRef.current.quaternion.copy(cam.quaternion)

    // Kickback animation
    const now = performance.now() / 1000
    const timeSinceFire = now - weaponState.lastFireTime
    if (timeSinceFire < 0.15) {
      kickRef.current = (1 - timeSinceFire / 0.15) * 0.1
    } else {
      kickRef.current *= 0.8
    }

    // Apply kick (push back along camera forward)
    const kickOffset = new THREE.Vector3(0, 0, kickRef.current)
    kickOffset.applyQuaternion(cam.quaternion)
    groupRef.current.position.add(kickOffset)

    // Subtle bob based on movement
    const time = state.clock.elapsedTime
    const bobX = Math.sin(time * 8) * 0.005
    const bobY = Math.cos(time * 16) * 0.003
    groupRef.current.position.x += bobX
    groupRef.current.position.y += bobY

    // Toggle visibility based on active weapon
    const children = groupRef.current.children
    if (children[0]) children[0].visible = weaponState.activeWeapon === 'railgun'
    if (children[1]) children[1].visible = weaponState.activeWeapon === 'rocketLauncher'
  })

  return (
    <group ref={groupRef}>
      {/* Railgun model — 10% thinner */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.0225, 0.6, 8]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.027, 0.15]}>
          <boxGeometry args={[0.054, 0.045, 0.25]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.027, 0.007, 8, 16]} />
          <meshBasicMaterial color="#ff2222" toneMapped={false} />
        </mesh>
      </group>

      {/* Rocket Launcher model — 10% thicker */}
      <group>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.0495, 0.055, 0.55, 8]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.044, 0.12]}>
          <boxGeometry args={[0.088, 0.077, 0.3]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.0066, 8, 16]} />
          <meshBasicMaterial color="#ff6600" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
