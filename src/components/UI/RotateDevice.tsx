export default function RotateDevice() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#1a0505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 48,
          color: '#cc2200',
          animation: 'rotate-hint 1.5s ease-in-out infinite',
        }}
      >
        &#x21BB;
      </div>
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 16,
          color: '#cc2200',
          letterSpacing: 3,
          textShadow: '0 0 20px rgba(204, 34, 0, 0.5)',
          textAlign: 'center',
          padding: '0 32px',
        }}
      >
        ROTATE YOUR DEVICE
      </p>
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: 'rgba(255, 150, 100, 0.4)',
          letterSpacing: 2,
          textAlign: 'center',
          padding: '0 32px',
        }}
      >
        landscape mode required
      </p>
      <style>{`
        @keyframes rotate-hint {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  )
}
