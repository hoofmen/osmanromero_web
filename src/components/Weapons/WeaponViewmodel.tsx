import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { weaponState } from '../../hooks/useWeapons'
import { playerVelocity } from '../Player/PlayerController'

export default function WeaponViewmodel() {
  const groupRef = useRef<THREE.Group>(null)
  const bobPhase = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const cam = state.camera

    // Position weapon centered in front of camera
    const offset = new THREE.Vector3(0, -0.25, -0.5)
    offset.applyQuaternion(cam.quaternion)
    groupRef.current.position.copy(cam.position).add(offset)
    groupRef.current.quaternion.copy(cam.quaternion)

    // Speed-aware bob
    const hSpeed = Math.sqrt(
      playerVelocity.current.x ** 2 + playerVelocity.current.z ** 2
    )
    const speedNorm = Math.min(hSpeed / 10, 1)
    bobPhase.current += delta * 8 * speedNorm

    const bobAmp = 0.018 * speedNorm
    const bobX = Math.sin(bobPhase.current)           * bobAmp
    const bobY = Math.abs(Math.cos(bobPhase.current)) * bobAmp * 0.5

    // Apply lateral bob along camera's local right vector so the swing
    // is always screen-relative, not world-X-relative
    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion)
    groupRef.current.position.addScaledVector(camRight, bobX)
    groupRef.current.position.y -= bobY

    // Weapon visibility
    const children = groupRef.current.children
    if (children[0]) children[0].visible = weaponState.activeWeapon === 'railgun'
    if (children[1]) children[1].visible = weaponState.activeWeapon === 'rocketLauncher'
  })

  return (
    <group ref={groupRef}>
      {/* Railgun model */}
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

      {/* Rocket Launcher model */}
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
