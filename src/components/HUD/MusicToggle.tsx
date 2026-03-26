import { useMusicSettings } from '../../hooks/useBackgroundMusic'

export default function MusicToggle() {
  const muted = useMusicSettings((s) => s.muted)
  const toggleMute = useMusicSettings((s) => s.toggleMute)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleMute()
      }}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: 42,
        right: 16,
        zIndex: 100,
        background: 'none',
        border: 'none',
        color: muted ? '#664422' : '#ff8844',
        fontSize: 12,
        cursor: 'pointer',
        fontFamily: "'Courier New', Courier, monospace",
        letterSpacing: 1,
        textShadow: muted ? 'none' : '0 0 8px #ff440060',
        pointerEvents: 'auto',
        padding: 0,
      }}
      title={muted ? 'Unmute music (M)' : 'Mute music (M)'}
    >
      {muted ? 'MUSIC OFF' : 'MUSIC ON'}
    </button>
  )
}
