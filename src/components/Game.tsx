import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import PlayerController from './Player/PlayerController'
import TrainingMap from './Map/TrainingMap'
import WeaponSystem from './Weapons/WeaponSystem'
import Crosshair from './HUD/Crosshair'
import SpeedMeter from './HUD/SpeedMeter'
import WeaponIndicator from './HUD/WeaponIndicator'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ff4400" />
      <directionalLight
        position={[-40, 28, -30]}
        intensity={1.5}
        color="#cc3300"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={0.1}
        shadow-camera-far={160}
      />
      <directionalLight position={[40, 6, 30]} intensity={0.7} color="#882200" />
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
        <fog attach="fog" args={['#1a0505', 40, 120]} />
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]} timeStep="vary">
            <Lights />
            <TrainingMap />
            <PlayerController />
            <WeaponSystem />
          </Physics>
        </Suspense>
      </Canvas>
      <Crosshair />
      <SpeedMeter />
      <WeaponIndicator />
    </>
  )
}
