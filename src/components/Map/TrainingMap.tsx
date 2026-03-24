import { RigidBody } from '@react-three/rapier'

function Floor() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[80, 1, 80]} />
        <meshStandardMaterial color="#5a2020" roughness={0.9} />
      </mesh>
    </RigidBody>
  )
}

interface BoxObstacleProps {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
}

function BoxObstacle({ position, size, color = '#3d1a1a' }: BoxObstacleProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </RigidBody>
  )
}

export default function TrainingMap() {
  return (
    <group>
      <Floor />

      {/* Scattered box obstacles */}
      <BoxObstacle position={[5, 1, -5]} size={[3, 2, 3]} />
      <BoxObstacle position={[-8, 1.5, -10]} size={[4, 3, 2]} color="#4a2010" />
      <BoxObstacle position={[10, 0.75, 8]} size={[2, 1.5, 5]} />
      <BoxObstacle position={[-4, 2, 6]} size={[3, 4, 3]} color="#4a2010" />
      <BoxObstacle position={[15, 1, -15]} size={[5, 2, 2]} />
      <BoxObstacle position={[-12, 0.5, 0]} size={[2, 1, 6]} />
      <BoxObstacle position={[0, 1.5, -18]} size={[6, 3, 2]} color="#4a2010" />

      {/* Ramp */}
      <RigidBody type="fixed" colliders="cuboid" position={[8, 1, -12]} rotation={[0.3, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.3, 8]} />
          <meshStandardMaterial color="#4a2010" roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* Long dividing wall */}
      <BoxObstacle position={[0, 2, -25]} size={[60, 4, 0.5]} color="#4a2010" />

      {/* Taller pillars */}
      <BoxObstacle position={[-18, 3, -18]} size={[2, 6, 2]} color="#4a1818" />
      <BoxObstacle position={[20, 2.5, 15]} size={[2, 5, 2]} />
    </group>
  )
}
