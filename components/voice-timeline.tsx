'use client'

import { useMemo } from 'react'

interface VoiceSample {
  t: number
  hz: number
  rms: number
}

interface VoiceTimelineProps {
  samples: VoiceSample[]
  durationSec: number
}

// Classify pitch relative to speaker's own voiced range
function pitchColor(hz: number, minHz: number, maxHz: number): string {
  if (hz === 0) return 'transparent'
  const range = maxHz - minHz || 1
  const norm = (hz - minHz) / range // 0=low, 1=high
  if (norm < 0.33) return 'oklch(0.72 0.13 280)'  // lavender = low
  if (norm < 0.67) return 'oklch(0.72 0.14 145)'  // sage = mid
  return 'oklch(0.70 0.20 35)'                     // coral = high
}

function pitchLabel(hz: number, minHz: number, maxHz: number): string {
  if (hz === 0) return 'Stille'
  const range = maxHz - minHz || 1
  const norm = (hz - minHz) / range
  if (norm < 0.33) return 'Tief'
  if (norm < 0.67) return 'Mittel'
  return 'Hoch'
}

export function VoiceTimeline({ samples, durationSec }: VoiceTimelineProps) {
  const { voiced, minHz, maxHz, avgHz, maxRms, buckets } = useMemo(() => {
    const voiced = samples.filter((s) => s.hz > 0)
    const hzValues = voiced.map((s) => s.hz)
    const minHz = hzValues.length ? Math.min(...hzValues) : 80
    const maxHz = hzValues.length ? Math.max(...hzValues) : 300
    const avgHz = hzValues.length ? Math.round(hzValues.reduce((a, b) => a + b, 0) / hzValues.length) : 0
    const maxRms = Math.max(...samples.map((s) => s.rms), 0.001)

    // Bucket samples into ~60 visual columns
    const COLS = Math.min(60, samples.length)
    const buckets: { hz: number; rms: number }[] = []
    if (samples.length > 0) {
      for (let i = 0; i < COLS; i++) {
        const start = Math.floor((i / COLS) * samples.length)
        const end = Math.floor(((i + 1) / COLS) * samples.length)
        const slice = samples.slice(start, end)
        const voicedSlice = slice.filter((s) => s.hz > 0)
        const hz = voicedSlice.length
          ? voicedSlice.reduce((a, b) => a + b.hz, 0) / voicedSlice.length
          : 0
        const rms = slice.reduce((a, b) => a + b.rms, 0) / (slice.length || 1)
        buckets.push({ hz, rms })
      }
    }

    return { voiced, minHz, maxHz, avgHz, maxRms, buckets }
  }, [samples])

  if (samples.length < 3) return null

  const W = 100   // SVG viewBox width (%)
  const H = 48    // SVG viewBox height (px)
  const barW = W / (buckets.length || 1)

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'var(--card)', border: '1px solid var(--vl-hairline)' }}
    >
      <div className="flex items-center justify-between">
        <p className="label-caps">STIMME</p>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {avgHz > 0 && <span>Ø {avgHz} Hz</span>}
          <span>{Math.round((voiced.length / samples.length) * 100)}% gesprochen</span>
        </div>
      </div>

      {/* Timeline SVG */}
      <svg
        viewBox={`0 0 100 ${H}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: H }}
      >
        {buckets.map((b, i) => {
          const x = i * barW
          const energyH = Math.max(2, (b.rms / maxRms) * H * 0.85)
          const y = H - energyH
          const color = pitchColor(b.hz, minHz, maxHz)
          const isSilence = b.hz === 0

          return (
            <rect
              key={i}
              x={x + barW * 0.1}
              y={isSilence ? H - 3 : y}
              width={barW * 0.8}
              height={isSilence ? 3 : energyH}
              rx={barW * 0.3}
              fill={isSilence ? 'var(--muted)' : color}
              opacity={isSilence ? 0.3 : 0.85}
            />
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {[
          { color: 'oklch(0.72 0.13 280)', label: 'Tief' },
          { color: 'oklch(0.72 0.14 145)', label: 'Mittel' },
          { color: 'oklch(0.70 0.20 35)',  label: 'Hoch' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-1">
          <span className="h-1 w-3 rounded-full shrink-0" style={{ background: 'var(--muted)', opacity: 0.5 }} />
          <span className="text-[10px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Pause</span>
        </div>
      </div>

      {/* Pitch summary row */}
      {voiced.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Tiefster Ton', value: `${Math.round(minHz)} Hz` },
            { label: 'Durchschnitt', value: `${avgHz} Hz` },
            { label: 'Höchster Ton', value: `${Math.round(maxHz)} Hz` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: 'var(--secondary)' }}>
              <div className="text-xs font-semibold tabular-nums">{value}</div>
              <div className="mt-0.5 text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
