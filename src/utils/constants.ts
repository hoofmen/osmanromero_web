// Movement tuning — Quake-style
export const MOVE_SPEED = 10          // ground acceleration factor
export const AIR_ACCEL = 100          // air acceleration factor (high, but clamped by AIR_SPEED_CAP)
export const AIR_SPEED_CAP = 0.7      // wish-speed cap in air (the magic number for strafing)
export const FRICTION = 6.0           // ground friction
export const JUMP_FORCE = 8.0         // jump impulse
export const GRAVITY = -22.0          // gravity
export const MAX_GROUND_SPEED = 12.0  // max speed from ground accel alone
export const GROUND_ACCEL = 10        // ground acceleration factor

// Player capsule
export const PLAYER_HEIGHT = 1.8
export const PLAYER_RADIUS = 0.3
export const PLAYER_SPAWN = [0, 3, 0] as const

// Mouse
export const MOUSE_SENSITIVITY = 0.002
