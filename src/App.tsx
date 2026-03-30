import { useCallback, useEffect } from 'react'
import Game from './components/Game'
import MainMenu from './components/UI/MainMenu'
import PauseMenu from './components/UI/PauseMenu'
import RotateDevice from './components/UI/RotateDevice'
import { useGameState } from './hooks/useGameState'
import { useBackgroundMusic } from './hooks/useBackgroundMusic'
import { useMobileDetect } from './hooks/useMobileDetect'

export default function App() {
  const phase = useGameState((s) => s.phase)
  const inputMode = useGameState((s) => s.inputMode)
  const start = useGameState((s) => s.start)
  const pause = useGameState((s) => s.pause)
  const resume = useGameState((s) => s.resume)
  const restart = useGameState((s) => s.restart)
  const returnToMenu = useGameState((s) => s.returnToMenu)

  const { isPortrait } = useMobileDetect()

  useBackgroundMusic()

  const handleDesktopStart = useCallback(() => {
    start('desktop')
    document.body.requestPointerLock()
  }, [start])

  const handleMobileStart = useCallback(() => {
    start('mobile')
  }, [start])

  const handleResume = useCallback(() => {
    resume()
    if (inputMode === 'desktop') document.body.requestPointerLock()
  }, [resume, inputMode])

  const handleRestart = useCallback(() => {
    restart()
    if (useGameState.getState().inputMode === 'desktop') document.body.requestPointerLock()
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
    return (
      <MainMenu onDesktop={handleDesktopStart} onMobile={handleMobileStart} />
    )
  }

  return (
    <>
      <Game />
      {phase === 'paused' && (
        <PauseMenu onResume={handleResume} onRestart={handleRestart} onMainMenu={handleMainMenu} />
      )}
      {inputMode === 'mobile' && isPortrait && <RotateDevice />}
    </>
  )
}
