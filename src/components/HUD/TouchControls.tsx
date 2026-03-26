import { useRef, useCallback, useState } from 'react'
import { touchInput, handleFireStart, handleJumpStart, handleJumpEnd, applyLookDelta } from '../../hooks/useTouchInput'
import { weaponState } from '../../hooks/useWeapons'
import { useGameState } from '../../hooks/useGameState'

const JOYSTICK_SIZE = 120
const KNOB_SIZE = 50
const MAX_DIST = (JOYSTICK_SIZE - KNOB_SIZE) / 2

const LOOK_SIZE = 120
const LOOK_KNOB = 44
const LOOK_MAX = (LOOK_SIZE - LOOK_KNOB) / 2

function SwapWeaponButton() {
  const [, forceUpdate] = useState(0)

  const handleSwap = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    weaponState.activeWeapon = weaponState.activeWeapon === 'railgun' ? 'rocketLauncher' : 'railgun'
    forceUpdate((n) => n + 1)
  }, [])

  const label = weaponState.activeWeapon === 'railgun' ? 'RAIL' : 'ROCKET'

  return (
    <div
      data-touch-button
      onTouchStart={handleSwap}
      style={{
        position: 'fixed',
        bottom: 165,
        left: 55,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(204, 34, 0, 0.15)',
        border: '2px solid rgba(255, 68, 0, 0.4)',
        zIndex: 300,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: 9,
        color: '#ff4400',
        letterSpacing: 1,
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  )
}

export default function TouchControls() {
  // --- Move joystick state ---
  const joystickRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLDivElement>(null)
  const touchIdRef = useRef<number | null>(null)
  const centerRef = useRef({ x: 0, y: 0 })

  // --- Look joystick state ---
  const lookJoystickRef = useRef<HTMLDivElement>(null)
  const lookKnobRef = useRef<HTMLDivElement>(null)
  const lookTouchIdRef = useRef<number | null>(null)
  const lookCenterRef = useRef({ x: 0, y: 0 })

  // --- Move joystick handlers ---
  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    let dx = clientX - centerRef.current.x
    let dy = clientY - centerRef.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > MAX_DIST) {
      dx = (dx / dist) * MAX_DIST
      dy = (dy / dist) * MAX_DIST
    }

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    }

    touchInput.moveX = dx / MAX_DIST
    touchInput.moveY = -dy / MAX_DIST
  }, [])

  const onJoystickStart = useCallback((e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    touchIdRef.current = t.identifier
    const rect = joystickRef.current?.getBoundingClientRect()
    if (rect) {
      centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }
    updateJoystick(t.clientX, t.clientY)
  }, [updateJoystick])

  const onJoystickMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY)
      }
    }
  }, [updateJoystick])

  const onJoystickEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null
        touchInput.moveX = 0
        touchInput.moveY = 0
        if (knobRef.current) {
          knobRef.current.style.transform = 'translate(0px, 0px)'
        }
      }
    }
  }, [])

  // --- Look joystick handlers ---
  const lastLookPos = useRef({ x: 0, y: 0 })

  const onLookStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const t = e.changedTouches[0]
    lookTouchIdRef.current = t.identifier
    const rect = lookJoystickRef.current?.getBoundingClientRect()
    if (rect) {
      lookCenterRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }
    lastLookPos.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onLookMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      if (t.identifier === lookTouchIdRef.current) {
        const dx = t.clientX - lastLookPos.current.x
        const dy = t.clientY - lastLookPos.current.y
        lastLookPos.current = { x: t.clientX, y: t.clientY }

        // Apply camera look
        applyLookDelta(dx, dy)

        // Visual knob — clamp to circle
        let knobDx = t.clientX - lookCenterRef.current.x
        let knobDy = t.clientY - lookCenterRef.current.y
        const dist = Math.sqrt(knobDx * knobDx + knobDy * knobDy)
        if (dist > LOOK_MAX) {
          knobDx = (knobDx / dist) * LOOK_MAX
          knobDy = (knobDy / dist) * LOOK_MAX
        }
        if (lookKnobRef.current) {
          lookKnobRef.current.style.transform = `translate(${knobDx}px, ${knobDy}px)`
        }
      }
    }
  }, [])

  const onLookEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null
        if (lookKnobRef.current) {
          lookKnobRef.current.style.transform = 'translate(0px, 0px)'
        }
      }
    }
  }, [])

  const buttonStyle: React.CSSProperties = {
    borderRadius: '50%',
    background: 'rgba(204, 34, 0, 0.15)',
    border: '2px solid rgba(255, 68, 0, 0.4)',
    zIndex: 300,
    touchAction: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    color: '#ff4400',
    letterSpacing: 1,
    userSelect: 'none',
    position: 'fixed' as const,
  }

  const pause = useGameState((s) => s.pause)

  return (
    <>
      {/* Move joystick — bottom left */}
      <div
        ref={joystickRef}
        onTouchStart={onJoystickStart}
        onTouchMove={onJoystickMove}
        onTouchEnd={onJoystickEnd}
        onTouchCancel={onJoystickEnd}
        data-touch-button
        style={{
          ...buttonStyle,
          bottom: 30,
          left: 30,
          width: JOYSTICK_SIZE,
          height: JOYSTICK_SIZE,
          background: 'rgba(204, 34, 0, 0.15)',
          border: '2px solid rgba(204, 34, 0, 0.3)',
        }}
      >
        <div
          ref={knobRef}
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: '50%',
            background: 'rgba(255, 68, 0, 0.4)',
            border: '2px solid rgba(255, 68, 0, 0.6)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Pause — above swap weapon */}
      <div
        data-touch-button
        onTouchStart={() => pause()}
        style={{
          ...buttonStyle,
          bottom: 235,
          left: 58,
          width: 50,
          height: 50,
          fontSize: 8,
        }}
      >
        PAUSE
      </div>

      {/* Swap weapon — above move joystick */}
      <SwapWeaponButton />

      {/* Fire button — bottom right */}
      <div
        data-touch-button
        onTouchStart={() => handleFireStart()}
        style={{
          ...buttonStyle,
          bottom: 30,
          right: 30,
          width: 70,
          height: 70,
          background: 'rgba(204, 34, 0, 0.2)',
          border: '2px solid rgba(255, 68, 0, 0.5)',
          fontSize: 11,
        }}
      >
        FIRE
      </div>

      {/* Jump button — left of fire */}
      <div
        data-touch-button
        onTouchStart={() => handleJumpStart()}
        onTouchEnd={() => handleJumpEnd()}
        onTouchCancel={() => handleJumpEnd()}
        style={{
          ...buttonStyle,
          bottom: 35,
          right: 115,
          width: 60,
          height: 60,
          fontSize: 10,
        }}
      >
        JUMP
      </div>

      {/* Look joystick — above buttons */}
      <div
        ref={lookJoystickRef}
        onTouchStart={onLookStart}
        onTouchMove={onLookMove}
        onTouchEnd={onLookEnd}
        onTouchCancel={onLookEnd}
        data-touch-button
        style={{
          ...buttonStyle,
          bottom: 120,
          right: 30,
          width: LOOK_SIZE,
          height: LOOK_SIZE,
          background: 'rgba(204, 34, 0, 0.1)',
          border: '2px solid rgba(204, 34, 0, 0.25)',
        }}
      >
        <div
          ref={lookKnobRef}
          style={{
            width: LOOK_KNOB,
            height: LOOK_KNOB,
            borderRadius: '50%',
            background: 'rgba(255, 68, 0, 0.3)',
            border: '2px solid rgba(255, 68, 0, 0.5)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  )
}
