import { useRef, useEffect } from 'react'
import { getCurrentElapsed } from '../../hooks/useGameState'

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const millis = Math.floor((ms % 1000) / 10)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(2, '0')}`
}

export default function Timer() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        ref.current.textContent = formatTime(getCurrentElapsed())
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
        top: 16,
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
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ff8844',
          textShadow: '0 0 12px rgba(255, 136, 68, 0.4)',
          letterSpacing: 2,
        }}
      >
        00:00.00
      </div>
    </div>
  )
}
