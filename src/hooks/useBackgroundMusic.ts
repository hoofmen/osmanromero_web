import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import { useGameState, type GamePhase } from './useGameState'
import { useMobileDetect } from './useMobileDetect'

interface MusicSettings {
  volume: number
  muted: boolean
  setVolume: (v: number) => void
  toggleMute: () => void
}

export const useMusicSettings = create<MusicSettings>((set) => ({
  volume: 0.3,
  muted: false,
  setVolume: (v) => set({ volume: v }),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
}))

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const phase = useGameState((s) => s.phase)
  const inputMode = useGameState((s) => s.inputMode)
  const volume = useMusicSettings((s) => s.volume)
  const muted = useMusicSettings((s) => s.muted)
  const { isPortrait } = useMobileDetect()

  // Create audio element once
  useEffect(() => {
    const audio = new Audio('/sounds/music.mp3')
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  // React to phase changes and portrait state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (inputMode === 'mobile' && isPortrait) {
      audio.pause()
    } else if (phase === 'playing') {
      audio.play().catch(() => {
        // Browser may block autoplay — will start on next user interaction
      })
    } else if (phase === 'paused') {
      audio.pause()
    } else if (phase === 'menu') {
      audio.pause()
      audio.currentTime = 0
    }
  }, [phase, inputMode, isPortrait])

  // React to volume/mute changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])
}
