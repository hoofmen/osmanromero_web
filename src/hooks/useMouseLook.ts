import { useRef, useEffect } from 'react'
import { MOUSE_SENSITIVITY } from '../utils/constants'

export function useMouseLook() {
  const yaw = useRef(0)
  const pitch = useRef(0)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Only process when pointer is locked — movementX/Y are deltas
      if (!document.pointerLockElement) return

      yaw.current -= e.movementX * MOUSE_SENSITIVITY
      pitch.current -= e.movementY * MOUSE_SENSITIVITY
      pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current))
    }

    // Click anywhere to re-acquire pointer lock if lost
    const onClick = () => {
      if (!document.pointerLockElement) {
        document.body.requestPointerLock()
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return { yaw, pitch }
}
