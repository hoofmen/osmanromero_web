import { useEffect } from 'react'

export type WeaponType = 'railgun' | 'rocketLauncher'

export const WEAPON_STATS = {
  railgun: { cooldown: 1.5, name: 'RAILGUN' },
  rocketLauncher: { cooldown: 0.8, name: 'ROCKET LAUNCHER' },
} as const

// Shared weapon state (module-level so both 3D and DOM components can read it)
export const weaponState = {
  activeWeapon: 'railgun' as WeaponType,
  lastFireTime: 0,
  fireRequested: false,
}

export function useWeaponInput() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyQ') weaponState.activeWeapon = 'railgun'
      if (e.code === 'KeyE') weaponState.activeWeapon = 'rocketLauncher'
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && document.pointerLockElement) {
        weaponState.fireRequested = true
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [])
}

export function tryFire(): boolean {
  if (!weaponState.fireRequested) return false
  weaponState.fireRequested = false

  const now = performance.now() / 1000
  const stats = WEAPON_STATS[weaponState.activeWeapon]
  if (now - weaponState.lastFireTime < stats.cooldown) return false

  weaponState.lastFireTime = now
  return true
}
