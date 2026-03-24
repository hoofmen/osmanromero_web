import { BioEntry } from '../../data/bioContent'

interface InfoPanelProps {
  entries: BioEntry[]
  onDismiss: () => void
}

const categoryColors: Record<BioEntry['category'], string> = {
  about: '#00ccff',
  experience: '#ff6600',
  skills: '#00ff88',
  projects: '#ff44cc',
  contact: '#ffcc00',
}

export default function InfoPanel({ entries, onDismiss }: InfoPanelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '48px',
        right: '16px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '360px',
        width: '90vw',
      }}
    >
      {entries.map((entry, i) => {
        const color = categoryColors[entry.category]
        const isOldest = i === 0
        return (
          <div
            key={entry.id}
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
            {/* Category tag */}
            <div
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color,
                marginBottom: '4px',
              }}
            >
              {entry.category}
            </div>
            {/* Title */}
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: 700,
                borderBottom: `1px solid ${color}40`,
                paddingBottom: '8px',
              }}
            >
              {entry.title}
            </h3>
            {/* Content */}
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                lineHeight: '1.5',
                color: '#c0b0a8',
              }}
            >
              {entry.content}
            </p>
            {/* Dismiss hint on the oldest card only */}
            {isOldest && (
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
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
            )}
          </div>
        )
      })}
      <style>{`
        @keyframes panelSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
