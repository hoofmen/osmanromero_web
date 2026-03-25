import { create } from 'zustand'

export interface VisualSettingsState {
  skybox: boolean
  particles: boolean
  toggle: (key: keyof Omit<VisualSettingsState, 'toggle'>) => void
}

export const useVisualSettings = create<VisualSettingsState>((set) => ({
  skybox: true,
  particles: true,
  toggle: (key) => set((s) => ({ [key]: !s[key] })),
}))
