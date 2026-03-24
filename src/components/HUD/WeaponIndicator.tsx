import { useRef, useEffect } from 'react'
import { weaponState, WEAPON_STATS } from '../../hooks/useWeapons'

export default function WeaponIndicator() {
  const nameRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const weapon = weaponState.activeWeapon
      const stats = WEAPON_STATS[weapon]

      if (nameRef.current) {
        nameRef.current.textContent = stats.name
      }

      if (barRef.current) {
        const now = performance.now() / 1000
        const elapsed = now - weaponState.lastFireTime
        const progress = Math.min(elapsed / stats.cooldown, 1)
        barRef.current.style.width = `${progress * 100}%`
        barRef.current.style.background = progress >= 1 ? '#ff3300' : '#882200'
      }

      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        pointerEvents: 'none',
        zIndex: 100,
        textAlign: 'right',
      }}
    >
      <div
        ref={nameRef}
        style={{
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#ff3300',
          letterSpacing: 2,
          marginBottom: 6,
        }}
      >
        RAILGUN
      </div>
      <div
        style={{
          width: 120,
          height: 4,
          background: '#330a00',
          marginLeft: 'auto',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '100%',
            background: '#ff3300',
            transition: 'none',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 10,
          color: 'rgba(255, 150, 100, 0.4)',
          marginTop: 4,
          letterSpacing: 1,
        }}
      >
        Q railgun &middot; E rocket
      </div>
    </div>
  )
}
