import { useState } from 'react'
import VisualSettings from './VisualSettings'

interface PauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onMainMenu: () => void
}

const buttonStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: 16,
  padding: '12px 40px',
  background: 'transparent',
  border: '1px solid #cc2200',
  color: '#cc2200',
  cursor: 'pointer',
  letterSpacing: 2,
  transition: 'all 0.15s',
  width: 220,
}

function MenuButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#cc2200'
        e.currentTarget.style.color = '#1a0505'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#cc2200'
      }}
    >
      {label}
    </button>
  )
}

export default function PauseMenu({ onResume, onRestart, onMainMenu }: PauseMenuProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26, 5, 5, 0.85)',
        zIndex: 200,
        gap: 12,
      }}
    >
      {showSettings ? (
        <VisualSettings onBack={() => setShowSettings(false)} />
      ) : (
        <>
          <h2
            style={{
              fontFamily: 'monospace',
              fontSize: 36,
              color: '#cc2200',
              margin: '0 0 32px',
              textShadow: '0 0 30px rgba(204, 34, 0, 0.5)',
              letterSpacing: 6,
            }}
          >
            PAUSED
          </h2>
          <MenuButton label="RESUME"    onClick={onResume}  />
          <MenuButton label="RESTART"   onClick={onRestart} />
          <MenuButton label="SETTINGS"  onClick={() => setShowSettings(true)} />
          <MenuButton label="MAIN MENU" onClick={onMainMenu} />
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 11,
              color: 'rgba(255, 150, 100, 0.3)',
              marginTop: 24,
            }}
          >
            press ESC to resume
          </p>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: 'rgba(255, 150, 100, 0.25)',
              marginTop: 8,
            }}
          >
            Music: "Dragged Through Hellfire" by{' '}
            <a
              href="https://x.com/ZanderNoriega"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255, 150, 100, 0.4)', textDecoration: 'underline' }}
            >
              Zander Noriega
            </a>
            {' '}(CC-BY 3.0)
          </p>
        </>
      )}
    </div>
  )
}
