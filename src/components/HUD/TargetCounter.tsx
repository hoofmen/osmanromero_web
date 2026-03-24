interface TargetCounterProps {
  hit: number
  total: number
}

export default function TargetCounter({ hit, total }: TargetCounterProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        color: '#ff8844',
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 16,
        letterSpacing: 1,
        textShadow: '0 0 8px #ff440060',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {hit}/{total} DISCOVERED
    </div>
  )
}
