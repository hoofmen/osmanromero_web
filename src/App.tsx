import { useCallback, useEffect } from 'react'
import Game from './components/Game'
import MainMenu from './components/UI/MainMenu'
import PauseMenu from './components/UI/PauseMenu'
import { useGameState } from './hooks/useGameState'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'

export default function App() {
  const phase = useGameState((s) => s.phase)
  const start = useGameState((s) => s.start)
  const pause = useGameState((s) => s.pause)
  const resume = useGameState((s) => s.resume)
  const restart = useGameState((s) => s.restart)
  const returnToMenu = useGameState((s) => s.returnToMenu)

  useBackgroundMusic()

  const handleStart = useCallback(() => {
    start()
  }, [start])

  const handleResume = useCallback(() => {
    resume()
    document.body.requestPointerLock()
  }, [resume])

  const handleRestart = useCallback(() => {
    restart()
    document.body.requestPointerLock()
  }, [restart])

  const handleMainMenu = useCallback(() => {
    document.exitPointerLock()
    returnToMenu()
  }, [returnToMenu])

  // ESC to toggle pause
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const currentPhase = useGameState.getState().phase
        if (currentPhase === 'playing') {
          document.exitPointerLock()
          pause()
        } else if (currentPhase === 'paused') {
          handleResume()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [pause, handleResume])

  if (phase === 'menu') {
    return <MainMenu onStart={handleStart} />
  }

  return (
    <>
      <Game />
      {phase === 'paused' && (
        <PauseMenu onResume={handleResume} onRestart={handleRestart} onMainMenu={handleMainMenu} />
      )}
    </>
  )
}
