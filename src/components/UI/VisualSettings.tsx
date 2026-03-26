import { useVisualSettings, VisualSettingsState } from '../../hooks/useVisualSettings'
import { useMusicSettings } from '../../hooks/useBackgroundMusic'

type ToggleKey = keyof Omit<VisualSettingsState, 'toggle'>

interface SettingRow {
  key: ToggleKey
  label: string
}

const GRAPHICS_SETTINGS: SettingRow[] = [
  { key: 'skybox',        label: 'SKYBOX'    },
  { key: 'particles',     label: 'PARTICLES' },
]

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
  const settings = useVisualSettings()
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

      {GRAPHICS_SETTINGS.map(({ key, label }) => (
        <ToggleRow
          key={key}
          label={label}
          enabled={settings[key] as boolean}
          onToggle={() => settings.toggle(key)}
        />
      ))}

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
