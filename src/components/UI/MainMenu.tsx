export default function MainMenu({ onDesktop, onMobile }: { onDesktop: () => void; onMobile: () => void }) {
  const btnBase: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: 18,
    padding: '16px 48px',
    background: 'transparent',
    border: '2px solid #cc2200',
    color: '#cc2200',
    cursor: 'pointer',
    letterSpacing: 3,
    transition: 'all 0.2s',
    width: '100%',
  }

  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = '#cc2200'
    e.currentTarget.style.color = '#1a0505'
  }

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'transparent'
    e.currentTarget.style.color = '#cc2200'
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a0505',
        zIndex: 200,
      }}
    >
      <h1
        style={{
          fontFamily: 'monospace',
          fontSize: 64,
          color: '#cc2200',
          margin: 0,
          textShadow: '0 0 40px rgba(204, 34, 0, 0.6)',
        }}
      >
        OSMANROMERO
      </h1>
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 14,
          color: 'rgba(255, 150, 100, 0.4)',
          margin: '8px 0 40px',
          letterSpacing: 4,
        }}
      >
        A BIO DEFRAG EXPERIENCE
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
        <div>
          <button
            onClick={onDesktop}
            style={btnBase}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            DESKTOP
          </button>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: 'rgba(255, 150, 100, 0.25)',
              margin: '6px 0 0',
              letterSpacing: 2,
              textAlign: 'center',
            }}
          >
            KEYBOARD + MOUSE
          </p>
        </div>

        <div>
          <button
            onClick={onMobile}
            style={{ ...btnBase, border: '1px solid rgba(204, 34, 0, 0.5)', color: 'rgba(204, 34, 0, 0.6)' }}
            onMouseEnter={handleEnter}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(204, 34, 0, 0.6)'
            }}
          >
            MOBILE
          </button>
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: 'rgba(255, 150, 100, 0.25)',
              margin: '6px 0 0',
              letterSpacing: 2,
              textAlign: 'center',
            }}
          >
            TOUCH CONTROLS
          </p>
        </div>
      </div>
    </div>
  )
}
