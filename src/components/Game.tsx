import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense, useState, useCallback, useEffect } from 'react'
import PlayerController, { respawnPlayer } from './Player/PlayerController'
import TrainingMap from './Map/TrainingMap'
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

// Wall-mounted target placements with facing rotations
// Rotation reference (cylinder bullseye face defaults to +Y):
//   Face +Z: [π/2, 0, 0]    Face -Z: [-π/2, 0, 0]
//   Face +X: [0, 0, -π/2]   Face -X: [0, 0, π/2]
const HP = Math.PI / 2
const targetPlacements: { id: string; position: [number, number, number]; rotation: [number, number, number] }[] = [
  // Zone 1: Spawn area back wall (z=-12, inner face z≈-11.75) — facing +Z toward player
  { id: 'target-about', position: [0, 1, -11.65], rotation: [HP, 0, 0] },
  // Zone 2: Strafe corridor south wall (z=12, inner face z≈12.25) — mid-corridor, facing +Z
  { id: 'target-experience-1', position: [35, 2.5, 12.35], rotation: [HP, 0, 0] },
  // Zone 3: Tower central pillar +X face (pillar at x=-20, face at x≈-19.5) — mid-height
  { id: 'target-skills', position: [-19.35, 7, -15], rotation: [0, 0, -HP] },
  // Zone 3: Tower central pillar +Z face — near the top
  { id: 'target-experience-2', position: [-20, 13, -14.35], rotation: [HP, 0, 0] },
  // Zone 4: Pillar garden, on pillar at [28,-22] h=6, -X face (face at x≈27)
  { id: 'target-project-1', position: [27, 4, -22], rotation: [0, 0, HP] },
  // Zone 4: Pillar garden, on pillar at [26,-10] h=8, -X face (face at x≈25)
  { id: 'target-project-2', position: [25, 5, -10], rotation: [0, 0, HP] },
  // Zone 5: Final platform column +Z face (column at z=-40, face at z≈-39.25)
  { id: 'target-contact', position: [0, 22, -39.15], rotation: [HP, 0, 0] },
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
  const [panelQueue, setPanelQueue] = useState<string[]>([])
  const restartCount = useGameState((s) => s.restartCount)
  const MAX_PANELS = 3

  // Reset game state on restart (without remounting Canvas/Physics)
  useEffect(() => {
    setHitTargets(new Set())
    setPanelQueue([])
    respawnPlayer()
  }, [restartCount])

  const handleTargetHit = useCallback((id: string) => {
    setHitTargets((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setPanelQueue((prev) => {
      // Don't add duplicates
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      // If over max, drop the oldest
      if (next.length > MAX_PANELS) return next.slice(next.length - MAX_PANELS)
      return next
    })
  }, [])

  const dismissOldestPanel = useCallback(() => {
    setPanelQueue((prev) => {
      if (prev.length === 0) return prev
      const next = prev.slice(1)
      if (next.length === 0) {
        // Re-request pointer lock when all panels dismissed
        document.body.requestPointerLock()
      }
      return next
    })
  }, [])

  // ENTER to dismiss oldest panel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && panelQueue.length > 0) {
        e.preventDefault()
        e.stopPropagation()
        dismissOldestPanel()
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [panelQueue, dismissOldestPanel])

  const visiblePanels = panelQueue.map((id) => bioMap.get(id)).filter(Boolean)

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 90, near: 0.1, far: 500 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#1a0505']} />
        <fog attach="fog" args={['#1a0505', 40, 120]} />
        <FPSTracker />
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]} timeStep="vary">
            <Lights />
            <TrainingMap />
            <PlayerController />
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
      {/* Info panel queue */}
      {visiblePanels.length > 0 && (
        <InfoPanel entries={visiblePanels as import('../data/bioContent').BioEntry[]} onDismiss={dismissOldestPanel} />
      )}
    </>
  )
}
