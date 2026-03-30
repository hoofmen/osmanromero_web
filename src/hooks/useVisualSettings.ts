import { create } from 'zustand'
import type { BrightnessLevel } from '../utils/lightingPresets'

export interface VisualSettingsState {
  skybox: boolean
  particles: boolean
  brightness: BrightnessLevel
  toggle: (key: 'skybox' | 'particles') => void
  setBrightness: (level: BrightnessLevel) => void
}

export const useVisualSettings = create<VisualSettingsState>((set) => ({
  skybox:     true,
  particles:  true,
  brightness: 2,
  toggle:       (key)   => set((s) => ({ [key]: !s[key] })),
  setBrightness: (level) => set({ brightness: level }),
}))
