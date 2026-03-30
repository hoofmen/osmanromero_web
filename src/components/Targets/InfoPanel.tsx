import { BioEntry } from '../../data/bioContent'
import { useGameState } from '../../hooks/useGameState'

interface InfoPanelProps {
  entry: BioEntry
  onDismiss: () => void
}

const categoryColors: Record<BioEntry['category'], string> = {
  about: '#00ccff',
  experience: '#ff6600',
  skills: '#00ff88',
  projects: '#ff44cc',
  contact: '#ffcc00',
}

export default function InfoPanel({ entry, onDismiss }: InfoPanelProps) {
  const color = categoryColors[entry.category]
  const inputMode = useGameState((s) => s.inputMode)

  if (inputMode === 'mobile') {
    return (
      <div
        onClick={onDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 400,
          background: 'rgba(10, 5, 5, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(10, 5, 5, 0.95)',
            border: `1px solid ${color}`,
            borderRadius: 4,
            padding: '12px 16px',
            color: '#e0d0c8',
            fontFamily: "'Courier New', Courier, monospace",
            boxShadow: `0 0 20px ${color}40, inset 0 0 15px ${color}10`,
            maxWidth: 360,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            animation: 'panelFadeIn 0.2s ease-out',
          }}
        >
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color, marginBottom: 3 }}>
            {entry.category}
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 14, color: '#fff', fontWeight: 700, borderBottom: `1px solid ${color}40`, paddingBottom: 6 }}>
            {entry.title}
          </h3>
          <p
            style={{ margin: 0, fontSize: 11, lineHeight: 1.5, color: '#c0b0a8' }}
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
          <button
            onClick={onDismiss}
            style={{
              marginTop: 10,
              background: 'transparent',
              border: `1px solid ${color}`,
              color,
              padding: '6px 16px',
              fontSize: 11,
              fontFamily: "'Courier New', Courier, monospace",
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
              width: '100%',
            }}
          >
            Dismiss
          </button>
        </div>
        <style>{`
          @keyframes panelFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '48px',
        right: '16px',
        zIndex: 100,
        maxWidth: '360px',
        width: '90vw',
      }}
    >
      <div
        style={{
          background: 'rgba(10, 5, 5, 0.92)',
          border: `1px solid ${color}`,
          borderRadius: '4px',
          padding: '16px 20px',
          color: '#e0d0c8',
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: `0 0 20px ${color}40, inset 0 0 15px ${color}10`,
          animation: 'panelSlideIn 0.25s ease-out',
        }}
      >
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color, marginBottom: '4px' }}>
          {entry.category}
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#ffffff', fontWeight: 700, borderBottom: `1px solid ${color}40`, paddingBottom: '8px' }}>
          {entry.title}
        </h3>
        <p
          style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#c0b0a8' }}
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: `1px solid ${color}`,
              color,
              padding: '3px 12px',
              fontSize: '11px',
              fontFamily: "'Courier New', Courier, monospace",
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${color}20`
              e.currentTarget.style.boxShadow = `0 0 10px ${color}40`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Dismiss [ENTER]
          </button>
        </div>
      </div>
      <style>{`
        @keyframes panelSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
