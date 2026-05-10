import Link from 'next/link'

import { FRAMEWORKS } from '@/lib/frameworks'
import { ThemeSwitch } from '@/components/theme-switch'

// VL category color + glyph mapping per framework (by id prefix / keyword)
const FW_ACCENTS: Record<string, { bg: string; color: string; glyph: string }> = {
  '1-2-3':     { bg: 'oklch(0.94 0.06 35)',  color: 'oklch(0.70 0.20 35)',   glyph: '◆' },
  'prep':      { bg: 'oklch(0.94 0.08 85)',  color: 'oklch(0.80 0.18 80)',   glyph: '✶' },
  'star':      { bg: 'oklch(0.94 0.08 85)',  color: 'oklch(0.80 0.18 80)',   glyph: '★' },
  'scq':       { bg: 'oklch(0.92 0.08 295)', color: 'oklch(0.65 0.22 295)',  glyph: '⊕' },
  'fab':       { bg: 'oklch(0.93 0.07 165)', color: 'oklch(0.78 0.16 165)',  glyph: '◇' },
  'hook':      { bg: 'oklch(0.93 0.06 235)', color: 'oklch(0.65 0.18 235)',  glyph: '◐' },
  'default':   { bg: 'oklch(0.94 0.06 10)',  color: 'oklch(0.70 0.20 10)',   glyph: '○' },
}

function getAccent(id: string) {
  for (const [key, val] of Object.entries(FW_ACCENTS)) {
    if (id.toLowerCase().startsWith(key)) return val
  }
  return FW_ACCENTS.default
}

export default function FrameworksPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8 pb-6 md:pt-10">
        <div className="flex-1">
          <p className="label-caps mb-1">FRAMEWORKS</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Kommunikations-<br/>
            <span style={{ fontStyle: 'italic' }}>Werkzeuge</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {FRAMEWORKS.length} Frameworks
          </span>
          <span className="md:hidden"><ThemeSwitch /></span>
        </div>
      </div>

      <div className="space-y-3">
        {FRAMEWORKS.map((fw) => {
          const accent = getAccent(fw.id)
          return (
            <Link
              key={fw.id}
              href={`/frameworks/${fw.id}`}
              className="flex items-start gap-4 rounded-2xl p-5 transition-opacity hover:opacity-80"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--vl-hairline)',
                boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
              }}
            >
              {/* Glyph tile */}
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ background: accent.bg, color: accent.color }}
              >
                {accent.glyph}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-semibold leading-tight">{fw.name}</h2>
                  <span className="shrink-0 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {fw.structure.length} Teile
                  </span>
                </div>
                <p className="text-sm font-medium mt-0.5" style={{ color: accent.color }}>
                  {fw.tagline}
                </p>
                <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                  {fw.shortExplanation}
                </p>
                <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>Wann: </span>
                  {fw.when}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
