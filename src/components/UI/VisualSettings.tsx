import { useVisualSettings } from '../../hooks/useVisualSettings'
import { useMusicSettings } from '../../hooks/useBackgroundMusic'
import type { BrightnessLevel } from '../../utils/lightingPresets'

const BRIGHTNESS_OPTIONS: { level: BrightnessLevel; label: string }[] = [
  { level: 1, label: 'DARK'   },
  { level: 2, label: 'DIM'    },
  { level: 3, label: 'BRIGHT' },
]

function BrightnessRow({ current, onChange }: { current: BrightnessLevel; onChange: (l: BrightnessLevel) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '11px 0',
        borderBottom: '1px solid rgba(204, 34, 0, 0.15)',
      }}
    >
      <span style={{ fontFamily: 'monospace', fontSize: 14, letterSpacing: 2, color: '#cc2200' }}>
        BRIGHTNESS
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        {BRIGHTNESS_OPTIONS.map(({ level, label }) => {
          const active = current === level
          return (
            <span
              key={level}
              onClick={() => onChange(level)}
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                letterSpacing: 2,
                padding: '3px 10px',
                cursor: 'pointer',
                border: `1px solid ${active ? '#ff4400' : 'rgba(204, 34, 0, 0.3)'}`,
                color: active ? '#ff4400' : 'rgba(204, 34, 0, 0.45)',
                textShadow: active ? '0 0 10px rgba(255, 68, 0, 0.6)' : 'none',
                background: active ? 'rgba(255, 68, 0, 0.1)' : 'transparent',
                transition: 'all 0.15s',
                userSelect: 'none',
              }}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ToggleRow({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '11px 0',
        borderBottom: '1px solid rgba(204, 34, 0, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(204, 34, 0, 0.08)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent'
      }}
    >
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 14,
          letterSpacing: 2,
          color: '#cc2200',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          letterSpacing: 2,
          color: enabled ? '#ff4400' : 'rgba(204, 34, 0, 0.35)',
          textShadow: enabled ? '0 0 10px rgba(255, 68, 0, 0.6)' : 'none',
          minWidth: 40,
          textAlign: 'right',
        }}
      >
        {enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h3
      style={{
        fontFamily: 'monospace',
        fontSize: 13,
        color: 'rgba(255, 150, 100, 0.5)',
        letterSpacing: 6,
        margin: '0 0 12px',
      }}
    >
      {label}
    </h3>
  )
}

export default function VisualSettings({ onBack }: { onBack: () => void }) {
  const { skybox, particles, brightness, toggle, setBrightness } = useVisualSettings()
  const muted = useMusicSettings((s) => s.muted)
  const toggleMute = useMusicSettings((s) => s.toggleMute)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        width: 340,
      }}
    >
      <SectionHeader label="GRAPHICS" />

      <BrightnessRow current={brightness} onChange={setBrightness} />
      <ToggleRow label="SKYBOX"    enabled={skybox}    onToggle={() => toggle('skybox')}    />
      <ToggleRow label="PARTICLES" enabled={particles} onToggle={() => toggle('particles')} />

      <div style={{ marginTop: 24, width: '100%' }}>
        <SectionHeader label="AUDIO" />
        <ToggleRow
          label="MUSIC"
          enabled={!muted}
          onToggle={toggleMute}
        />
      </div>

      <button
        onClick={onBack}
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          padding: '10px 32px',
          marginTop: 28,
          background: 'transparent',
          border: '1px solid rgba(204, 34, 0, 0.5)',
          color: 'rgba(204, 34, 0, 0.6)',
          cursor: 'pointer',
          letterSpacing: 3,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#cc2200'
          e.currentTarget.style.color = '#1a0505'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(204, 34, 0, 0.6)'
        }}
      >
        ← BACK
      </button>
    </div>
  )
}
