import { create } from 'zustand'

export type GamePhase = 'menu' | 'playing' | 'paused'

interface GameState {
  phase: GamePhase
  startTime: number
  elapsed: number
  restartCount: number
  start: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  returnToMenu: () => void
  tick: () => void
}

export const useGameState = create<GameState>((set, get) => ({
  phase: 'menu',
  startTime: 0,
  elapsed: 0,
  restartCount: 0,

  start: () => {
    set({ phase: 'playing', startTime: performance.now(), elapsed: 0 })
  },

  pause: () => {
    const { phase, startTime, elapsed } = get()
    if (phase !== 'playing') return
    // Freeze elapsed at current value
    set({ phase: 'paused', elapsed: elapsed + (performance.now() - startTime) })
  },

  resume: () => {
    const { phase } = get()
    if (phase !== 'paused') return
    // Reset startTime so tick resumes from frozen elapsed
    set({ phase: 'playing', startTime: performance.now() })
  },

  restart: () => {
    set((s) => ({ phase: 'playing', startTime: performance.now(), elapsed: 0, restartCount: s.restartCount + 1 }))
  },

  returnToMenu: () => {
    set({ phase: 'menu', startTime: 0, elapsed: 0 })
  },

  tick: () => {
    const { phase, startTime, elapsed } = get()
    if (phase === 'playing') {
      // elapsed stores accumulated time from previous pause/resume cycles
      // startTime is the time of last resume
      set({ elapsed: elapsed }, false)
      // We don't set here — Timer reads live via get()
    }
  },
}))

// Helper to get current elapsed time (call in rAF)
export function getCurrentElapsed(): number {
  const { phase, startTime, elapsed } = useGameState.getState()
  if (phase === 'playing') {
    return elapsed + (performance.now() - startTime)
  }
  return elapsed
}
