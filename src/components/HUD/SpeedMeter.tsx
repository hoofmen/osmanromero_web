import { useRef, useEffect } from 'react'
import { playerVelocity } from '../Player/PlayerController'

export default function SpeedMeter() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        const v = playerVelocity.current
        const horizSpeed = Math.sqrt(v.x * v.x + v.z * v.z)
        ref.current.textContent = Math.floor(horizSpeed * 10).toString()
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
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 100,
        textAlign: 'center',
      }}
    >
      <div
        ref={ref}
        style={{
          fontFamily: 'monospace',
          fontSize: 48,
          fontWeight: 'bold',
          color: '#ff3300',
          textShadow: '0 0 20px rgba(255, 51, 0, 0.5)',
        }}
      >
        0
      </div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          color: 'rgba(255, 150, 100, 0.5)',
          letterSpacing: 2,
        }}
      >
        SPEED
      </div>
    </div>
  )
}
