// VL Arc Gauge -- half-circle (180°) score gauge with multi-stop gradient
// Matches the Voicelabs design system ArcGauge component

interface VLArcGaugeProps {
  score: number        // 0–100
  width?: number
  stroke?: number
  label?: string
  gradientId?: string
}

export function VLArcGauge({
  score,
  width = 280,
  stroke = 14,
  label,
  gradientId = 'vlArcGrad',
}: VLArcGaugeProps) {
  const value = Math.min(1, Math.max(0, score / 100))
  const h = width / 2 + stroke + 4
  const cy = width / 2 + stroke / 2
  const r = width / 2 - stroke / 2
  const total = Math.PI * r
  const filled = total * value

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: h }}>
        <svg
          width={width}
          height={h}
          viewBox={`0 0 ${width} ${h}`}
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%"   stopColor="oklch(0.85 0.18 95)" />
              <stop offset="30%"  stopColor="oklch(0.80 0.18 70)" />
              <stop offset="55%"  stopColor="oklch(0.70 0.20 35)" />
              <stop offset="80%"  stopColor="oklch(0.66 0.22 350)" />
              <stop offset="100%" stopColor="oklch(0.62 0.24 295)" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d={`M ${stroke / 2 + 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke / 2 - 2} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="text-border"
          />
          {/* Progress */}
          <path
            d={`M ${stroke / 2 + 2} ${cy} A ${r} ${r} 0 0 1 ${width - stroke / 2 - 2} ${cy}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${total}`}
          />
        </svg>

        {/* Score centred above the baseline */}
        <div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{ bottom: 2 }}
        >
          <span
            className="font-display tabular-nums"
            style={{ fontSize: width * 0.22, lineHeight: 1, letterSpacing: '-0.03em' }}
          >
            {score}
          </span>
          {label && (
            <span className="label-caps mt-1">{label}</span>
          )}
        </div>
      </div>
    </div>
  )
}
