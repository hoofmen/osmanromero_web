export default function MainMenu({ onStart }: { onStart: () => void }) {
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
      <button
        onClick={onStart}
        style={{
          fontFamily: 'monospace',
          fontSize: 18,
          padding: '16px 48px',
          background: 'transparent',
          border: '2px solid #cc2200',
          color: '#cc2200',
          cursor: 'pointer',
          letterSpacing: 3,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#cc2200'
          e.currentTarget.style.color = '#1a0505'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#cc2200'
        }}
      >
        ENTER THE ARENA
      </button>
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: 'rgba(255, 150, 100, 0.25)',
          marginTop: 40,
          lineHeight: 1.8,
          textAlign: 'center',
        }}
      >
        WASD move &middot; MOUSE look &middot; RIGHT-CLICK jump
        <br />
        SPACE zoom &middot; Q railgun &middot; E rocket &middot; ESC pause
      </p>
    </div>
  )
}
