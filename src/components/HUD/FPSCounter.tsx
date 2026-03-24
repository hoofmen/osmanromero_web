import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

// Shared state so the HTML overlay can read the actual render FPS
export const fpsState = { current: 0 }

/** Place this inside the R3F <Canvas> to count real render frames */
export function FPSTracker() {
  const frames = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frames.current++
    const now = performance.now()
    const delta = now - lastTime.current
    if (delta >= 500) {
      fpsState.current = Math.round((frames.current * 1000) / delta)
      frames.current = 0
      lastTime.current = now
    }
  })

  return null
}

/** Place this outside the Canvas as an HTML overlay */
export default function FPSCounter() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        ref.current.textContent = `${fpsState.current} FPS`
      }
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        fontFamily: 'monospace',
        fontSize: 14,
        color: 'rgba(255, 150, 100, 0.5)',
        textShadow: '0 0 6px rgba(255, 100, 50, 0.3)',
        pointerEvents: 'none',
        zIndex: 100,
        letterSpacing: 1,
      }}
    >
      0 FPS
    </div>
  )
}
