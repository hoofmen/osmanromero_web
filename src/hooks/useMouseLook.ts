import { useRef, useEffect } from 'react'
import { MOUSE_SENSITIVITY } from '../utils/constants'

// Shared refs so external code (e.g. respawn) can reset look direction
export const mouseLookState = {
  yaw: { current: 0 },
  pitch: { current: 0 },
  rightMouseDown: { current: false },
}

export function useMouseLook() {
  const yaw = useRef(0)
  const pitch = useRef(0)
  // Sync shared state
  mouseLookState.yaw = yaw
  mouseLookState.pitch = pitch
  const rightMouseDown = mouseLookState.rightMouseDown

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement) return

      yaw.current -= e.movementX * MOUSE_SENSITIVITY
      pitch.current -= e.movementY * MOUSE_SENSITIVITY
      pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current))
    }

    const onClick = () => {
      if (!document.pointerLockElement) {
        document.body.requestPointerLock()
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) rightMouseDown.current = true
    }

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) rightMouseDown.current = false
    }

    const onContextMenu = (e: Event) => e.preventDefault()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('click', onClick)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('contextmenu', onContextMenu)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('click', onClick)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('contextmenu', onContextMenu)
    }
  }, [])

  return { yaw, pitch, rightMouseDown }
}
