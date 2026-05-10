// Tiny inline SVG sparkline -- no dependencies
interface MiniSparklineProps {
  values: (number | null)[]
  color?: string
  width?: number
  height?: number
  max?: number
}

export function MiniSparkline({
  values,
  color = 'var(--vl-coral)',
  width = 56,
  height = 24,
  max = 10,
}: MiniSparklineProps) {
  const pts = values.filter((v): v is number => v !== null)
  if (pts.length < 2) return null

  const minY = 0
  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2

  const toX = (i: number) => pad + (i / (pts.length - 1)) * w
  const toY = (v: number) => pad + (1 - (v - minY) / (max - minY)) * h

  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={pts.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      {/* Last point dot */}
      <circle
        cx={toX(pts.length - 1)}
        cy={toY(pts[pts.length - 1])}
        r={2}
        fill={color}
      />
    </svg>
  )
}
