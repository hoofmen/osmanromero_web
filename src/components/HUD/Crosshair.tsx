export default function Crosshair() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Horizontal line */}
      <div
        style={{
          position: 'absolute',
          width: 16,
          height: 2,
          background: 'rgba(255, 255, 255, 0.8)',
          left: -8,
          top: -1,
        }}
      />
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          width: 2,
          height: 16,
          background: 'rgba(255, 255, 255, 0.8)',
          left: -1,
          top: -8,
        }}
      />
      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#e94560',
          left: -2,
          top: -2,
        }}
      />
    </div>
  )
}
