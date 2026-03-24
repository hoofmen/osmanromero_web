import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import PlayerController from './Player/PlayerController'
import TrainingMap from './Map/TrainingMap'
import Crosshair from './HUD/Crosshair'
import SpeedMeter from './HUD/SpeedMeter'

function Lights() {
  return (
    <>
      {/* Ambient fill — enough to see geometry from any angle */}
      <ambientLight intensity={0.5} color="#ff4400" />
      {/* Dusk sun — low angle, long shadows */}
      <directionalLight
        position={[-40, 28, -30]}
        intensity={1.5}
        color="#cc3300"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={0.1}
        shadow-camera-far={120}
      />
      {/* Fill light from opposite side so shadow faces aren't black */}
      <directionalLight position={[40, 6, 30]} intensity={0.7} color="#882200" />
      {/* Hemisphere — dark red sky, dim ground */}
      <hemisphereLight args={['#441100', '#0a0000', 0.5]} />
    </>
  )
}

export default function Game() {
  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 90, near: 0.1, far: 500 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#1a0505']} />
        <fog attach="fog" args={['#1a0505', 30, 80]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]} timeStep="vary">
            <Lights />
            <TrainingMap />
            <PlayerController />
          </Physics>
        </Suspense>
      </Canvas>
      <Crosshair />
      <SpeedMeter />
    </>
  )
}
