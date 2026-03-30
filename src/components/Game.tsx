import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense, useState, useCallback, useEffect } from 'react'
import PlayerController, { respawnPlayer } from './Player/PlayerController'
import CameraZoom from './Player/CameraZoom'
import TrainingMap from './Map/TrainingMap'
import Skybox from './Map/Skybox'
import WeaponSystem from './Weapons/WeaponSystem'
import Crosshair from './HUD/Crosshair'
import SpeedMeter from './HUD/SpeedMeter'
import WeaponIndicator from './HUD/WeaponIndicator'
import Timer from './HUD/Timer'
import TargetCounter from './HUD/TargetCounter'
import FPSCounter, { FPSTracker } from './HUD/FPSCounter'
import BullseyeTarget from './Targets/BullseyeTarget'
import InfoPanel from './Targets/InfoPanel'
import { bioEntries } from '../data/bioContent'
import { useGameState } from '../hooks/useGameState'
import { useVisualSettings } from '../hooks/useVisualSettings'
import TouchControls from './HUD/TouchControls'

// Wall-mounted target placements with facing rotations
// Rotation reference (cylinder bullseye face defaults to +Y):
//   Face +Z: [π/2, 0, 0]    Face -Z: [-π/2, 0, 0]
//   Face +X: [0, 0, -π/2]   Face -X: [0, 0, π/2]
const HP = Math.PI / 2
const targetPlacements: { id: string; position: [number, number, number]; rotation: [number, number, number] }[] = [
  // 1. About Me — spawn area, on the box right in front of player. Easy first find.
  { id: 'target-about', position: [0, 2, -5], rotation: [HP, 0, 0] },
  // 2. Education — vertical tower upper platform, facing +X.
  { id: 'target-experience-2', position: [-20, 16, -15], rotation: [0, 0, -HP] },
  // 3. Experience — final platform column, mounted on +X face.
  { id: 'target-experience-1', position: [0.85, 18, -40], rotation: [0, 0, -HP] },
  // 4. Skills — pillar garden tall pillar (x=26, z=-10, h=8), mounted on +X face toward Contact.
  { id: 'target-skills', position: [27.1, 5, -10], rotation: [0, 0, -HP] },
  // 5. Contact — strafe corridor landing platform, facing back down the corridor (-X).
  { id: 'target-contact', position: [67, 1.5, 15], rotation: [0, 0, HP] },
]

const bioMap = new Map(bioEntries.map((e) => [e.id, e]))

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
  const [hitTargets, setHitTargets] = useState<Set<string>>(new Set())
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const restartCount = useGameState((s) => s.restartCount)
  const inputMode = useGameState((s) => s.inputMode)

  // Reset game state on restart (without remounting Canvas/Physics)
  useEffect(() => {
    setHitTargets(new Set())
    setActivePanel(null)
    respawnPlayer()
  }, [restartCount])

  const handleTargetHit = useCallback((id: string) => {
    setHitTargets((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setActivePanel(id)
  }, [])

  const dismissPanel = useCallback(() => {
    setActivePanel(null)
    if (useGameState.getState().inputMode === 'desktop') document.body.requestPointerLock()
  }, [])

  // ENTER to dismiss panel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && activePanel) {
        e.preventDefault()
        e.stopPropagation()
        dismissPanel()
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [activePanel, dismissPanel])

  const activeBioEntry = activePanel ? bioMap.get(activePanel) : null

  const { skybox } = useVisualSettings()

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 90, near: 0.1, far: 500 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#2f0a0a']} />
        <fog attach="fog" args={['#1a0505', 40, 120]} />
        {skybox && <Skybox />}
        <FPSTracker />
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]} timeStep="vary">
            <Lights />
            <TrainingMap />
            <PlayerController />
            <CameraZoom />
            <WeaponSystem />
            {targetPlacements.map((t) => (
              <BullseyeTarget
                key={t.id}
                id={t.id}
                position={t.position}
                rotation={t.rotation}
                onHit={handleTargetHit}
                isHit={hitTargets.has(t.id)}
              />
            ))}
          </Physics>
        </Suspense>
      </Canvas>
      <Crosshair />
      <SpeedMeter />
      <WeaponIndicator />
      <Timer />
      <FPSCounter />
      <TargetCounter hit={hitTargets.size} total={targetPlacements.length} />
      {inputMode === 'mobile' && <TouchControls />}
      {/* Info panel */}
      {activeBioEntry && (
        <InfoPanel entry={activeBioEntry} onDismiss={dismissPanel} />
      )}
    </>
  )
}
