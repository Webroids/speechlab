'use client'

import type { BodyAnalysisResult, BodySample } from '@/components/recorder/body-analyzer'

interface BodyLanguageCardProps {
  result: BodyAnalysisResult
}

// Map expression to German label + color
const EXPR_MAP: Record<string, { label: string; color: string }> = {
  neutral:    { label: 'Neutral',      color: 'var(--vl-ocean)' },
  happy:      { label: 'Ausdrucksstark', color: 'var(--vl-amber)' },
  focused:    { label: 'Konzentriert', color: 'var(--vl-lavender)' },
  expressive: { label: 'Lebendig',     color: 'var(--vl-coral)' },
}

function StatBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
        <span className="text-xs font-semibold tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: 'var(--vl-hairline)' }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// Mini presence timeline: each sample is a dot — face/hand visible = filled
function PresenceTimeline({ samples }: { samples: BodySample[] }) {
  if (!samples.length) return null
  // downsample to max 80 dots
  const step = Math.max(1, Math.floor(samples.length / 80))
  const dots = samples.filter((_, i) => i % step === 0)

  return (
    <div>
      <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Präsenz-Timeline</p>
      <div className="flex gap-px flex-wrap">
        {dots.map((s, i) => {
          const hasHand = s.lHand || s.rHand
          const bg = !s.faceVisible
            ? 'var(--vl-coral)'              // face missing = coral
            : hasHand
              ? 'var(--vl-sage)'             // hand gesture = sage
              : 'var(--muted-foreground)'    // face only = muted
          return (
            <span
              key={i}
              className="h-3 w-1.5 rounded-[1px] opacity-80"
              style={{ background: bg }}
              title={`t=${s.t}s — ${s.faceVisible ? 'Gesicht sichtbar' : 'Kein Gesicht'}${hasHand ? ' · Geste' : ''}`}
            />
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <Legend color="var(--muted-foreground)" label="Gesicht" />
        <Legend color="var(--vl-sage)" label="Geste" />
        <Legend color="var(--vl-coral)" label="Gesicht fehlt" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-[1px]" style={{ background: color }} />
      <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
    </div>
  )
}

export function BodyLanguageCard({ result }: BodyLanguageCardProps) {
  const { summary, samples } = result
  const expr = EXPR_MAP[summary.dominantExpression] ?? EXPR_MAP.neutral!

  return (
    <section
      className="rounded-2xl p-5 space-y-5"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--vl-hairline)',
        boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="label-caps">KÖRPERSPRACHE</p>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: expr.color, color: 'var(--background)' }}
        >
          {expr.label}
        </span>
      </div>

      {/* Stat bars */}
      <div className="space-y-3">
        <StatBar
          label="Gesicht erkannt"
          pct={summary.faceDetectedPct}
          color={summary.faceDetectedPct >= 80 ? 'var(--vl-sage)' : summary.faceDetectedPct >= 50 ? 'var(--vl-amber)' : 'var(--vl-coral)'}
        />
        <StatBar
          label="Blickkontakt (Kamera)"
          pct={summary.eyeContactPct}
          color={summary.eyeContactPct >= 70 ? 'var(--vl-sage)' : summary.eyeContactPct >= 40 ? 'var(--vl-amber)' : 'var(--vl-coral)'}
        />
        <StatBar
          label="Gestik aktiv"
          pct={summary.gestureActivePct}
          color="var(--vl-lavender)"
        />
      </div>

      {/* Smile + brow */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-3 text-center"
          style={{ background: 'var(--vl-hairline)', border: '1px solid var(--vl-hairline)' }}
        >
          <div
            className="font-display tabular-nums"
            style={{ fontSize: '1.375rem', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--vl-amber)' }}
          >
            {Math.round(summary.avgSmile * 100)}%
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>Lächeln</div>
        </div>
        <div
          className="rounded-xl p-3 text-center"
          style={{ background: 'var(--vl-hairline)', border: '1px solid var(--vl-hairline)' }}
        >
          <div
            className="font-display tabular-nums"
            style={{ fontSize: '1.375rem', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--vl-lavender)' }}
          >
            {Math.round(summary.gestureEnergy * 100)}%
          </div>
          <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>Gestenenergie</div>
        </div>
      </div>

      {/* Tips */}
      {summary.faceDetectedPct < 60 && (
        <p className="text-xs rounded-xl px-3 py-2.5" style={{ background: 'oklch(0.70 0.20 35 / 8%)', color: 'var(--vl-coral)' }}>
          💡 Gesicht war oft nicht sichtbar. Stelle sicher, dass du gut beleuchtet bist und die Kamera auf Augenhöhe ist.
        </p>
      )}
      {summary.eyeContactPct < 40 && (
        <p className="text-xs rounded-xl px-3 py-2.5" style={{ background: 'oklch(0.70 0.20 35 / 8%)', color: 'var(--vl-coral)' }}>
          💡 Wenig Blickkontakt zur Kamera. Übe, direkt in die Linse zu schauen statt auf dein Spiegelbild.
        </p>
      )}
      {summary.gestureActivePct < 20 && (
        <p className="text-xs rounded-xl px-3 py-2.5" style={{ background: 'oklch(0.64 0.12 240 / 8%)', color: 'var(--vl-ocean)' }}>
          💡 Wenig Gestik erkannt. Hände im Bild und aktive Gesten machen Sprecher überzeugender.
        </p>
      )}

      {/* Presence timeline */}
      {samples.length > 0 && <PresenceTimeline samples={samples} />}
    </section>
  )
}
