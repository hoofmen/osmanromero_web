import { useVisualSettings, VisualSettingsState } from '../../hooks/useVisualSettings'

type ToggleKey = keyof Omit<VisualSettingsState, 'toggle'>

interface SettingRow {
  key: ToggleKey
  label: string
  ready: boolean   // false = grayed out / not yet implemented
}

const SETTINGS: SettingRow[] = [
  { key: 'skybox',        label: 'SKYBOX',          ready: true  },
  { key: 'particles',     label: 'PARTICLES',       ready: true  },
]

export default function VisualSettings({ onBack }: { onBack: () => void }) {
  const settings = useVisualSettings()

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
      <h3
        style={{
          fontFamily: 'monospace',
          fontSize: 13,
          color: 'rgba(255, 150, 100, 0.5)',
          letterSpacing: 6,
          margin: '0 0 28px',
        }}
      >
        GRAPHICS
      </h3>

      {SETTINGS.map(({ key, label, ready }) => {
        const enabled = settings[key] as boolean
        return (
          <div
            key={key}
            onClick={() => ready && settings.toggle(key)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: '11px 0',
              borderBottom: '1px solid rgba(204, 34, 0, 0.15)',
              cursor: ready ? 'pointer' : 'default',
              opacity: ready ? 1 : 0.3,
              userSelect: 'none',
            }}
            onMouseEnter={(e) => {
              if (ready) (e.currentTarget as HTMLDivElement).style.background = 'rgba(204, 34, 0, 0.08)'
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
                color: ready ? '#cc2200' : '#663300',
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
              {ready ? (enabled ? 'ON' : 'OFF') : 'SOON'}
            </span>
          </div>
        )
      })}

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
