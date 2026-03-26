import { mouseLookState } from './useMouseLook'
import { weaponState } from './useWeapons'

export const TOUCH_SENSITIVITY = 0.004

// Shared touch state that PlayerController can read
export const touchInput = {
  moveX: 0,       // -1 to 1 (left/right)
  moveY: 0,       // -1 to 1 (back/forward)
  jumpPressed: false,
}

// Apply look delta (called from TouchControls look joystick)
export function applyLookDelta(dx: number, dy: number) {
  mouseLookState.yaw.current -= dx * TOUCH_SENSITIVITY
  mouseLookState.pitch.current -= dy * TOUCH_SENSITIVITY
  mouseLookState.pitch.current = Math.max(
    -Math.PI / 2 + 0.01,
    Math.min(Math.PI / 2 - 0.01, mouseLookState.pitch.current)
  )
}

// Fire button handler
export function handleFireStart() {
  weaponState.fireRequested = true
}

// Jump handlers
export function handleJumpStart() {
  touchInput.jumpPressed = true
}

export function handleJumpEnd() {
  touchInput.jumpPressed = false
}
