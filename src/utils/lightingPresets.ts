export type BrightnessLevel = 1 | 2 | 3

export interface LightingPreset {
  ambientIntensity: number
  ambientColor: string
  mainDirIntensity: number
  mainDirColor: string
  fillDirIntensity: number
  fillDirColor: string
  hemiSky: string
  hemiGround: string
  hemiIntensity: number
  fogColor: string
  fogNear: number
  fogFar: number
  bgColor: string
  torchDistance: number
}

export const LIGHTING_PRESETS: Record<BrightnessLevel, LightingPreset> = {
  // Original — dark martian atmosphere
  1: {
    ambientIntensity: 0.5,
    ambientColor:     '#ff4400',
    mainDirIntensity: 1.5,
    mainDirColor:     '#cc3300',
    fillDirIntensity: 0.7,
    fillDirColor:     '#882200',
    hemiSky:          '#441100',
    hemiGround:       '#0a0000',
    hemiIntensity:    0.5,
    fogColor:         '#1a0505',
    fogNear:          40,
    fogFar:           120,
    bgColor:          '#2f0a0a',
    torchDistance:    18,
  },
  // Intermediate
  2: {
    ambientIntensity: 0.85,
    ambientColor:     '#ff4400',
    mainDirIntensity: 2.0,
    mainDirColor:     '#d03a00',
    fillDirIntensity: 1.05,
    fillDirColor:     '#993300',
    hemiSky:          '#5d2200',
    hemiGround:       '#160400',
    hemiIntensity:    0.7,
    fogColor:         '#2a0a0a',
    fogNear:          52,
    fogFar:           130,
    bgColor:          '#341010',
    torchDistance:    24,
  },
  // Bright — improved visibility, same hue
  3: {
    ambientIntensity: 1.2,
    ambientColor:     '#ff4400',
    mainDirIntensity: 2.5,
    mainDirColor:     '#dd4400',
    fillDirIntensity: 1.4,
    fillDirColor:     '#aa3300',
    hemiSky:          '#773300',
    hemiGround:       '#220800',
    hemiIntensity:    0.9,
    fogColor:         '#3a0f0f',
    fogNear:          65,
    fogFar:           140,
    bgColor:          '#3a0f0f',
    torchDistance:    30,
  },
}
