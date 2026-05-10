// VL Score Ring -- SVG circular progress with serif number inside
// Matches the Voicelabs design system ring component

interface VLRingProps {
  score: number        // 0–100
  size?: number
  stroke?: number
  color?: string       // override auto colour
  children?: React.ReactNode
}

function scoreColor(score: number): string {
  if (score >= 80) return 'oklch(0.70 0.16 145)'  // sage
  if (score >= 60) return 'oklch(0.80 0.18 80)'   // amber
  return 'oklch(0.70 0.20 35)'                     // coral
}

export function VLRing({ score, size = 52, stroke = 4, color, children }: VLRingProps) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(1, Math.max(0, score / 100)))
  const ring = color ?? scoreColor(score)

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">
        {children ?? (
          <span
            className="font-display tabular-nums"
            style={{ fontSize: size * 0.32, lineHeight: 1, letterSpacing: '-0.02em' }}
          >
            {score}
          </span>
        )}
      </div>
    </div>
  )
}
