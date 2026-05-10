import { getTrends, getTopFillers } from '@/actions/trends'
import { ThemeSwitch } from '@/components/theme-switch'
import { TrendsChart } from '@/components/trends-chart'

export const dynamic = 'force-dynamic'

export default async function TrendsPage() {
  const [trends, topFillers] = await Promise.all([getTrends(), getTopFillers()])

  const wpmData = trends.map((t) => ({ date: t.date, value: t.wpm }))
  const fillerData = trends.map((t) => ({ date: t.date, value: t.filler_ratio ? +(t.filler_ratio * 100).toFixed(1) : null }))
  const scoreData = trends.map((t) => ({ date: t.date, value: t.overall_score }))

  const maxFillerCount = topFillers[0]?.count ?? 1

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-5 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8 md:pt-10">
        <div className="flex-1">
          <p className="label-caps mb-1">FORTSCHRITT</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Deine Entwicklung
          </h1>
        </div>
        <span className="md:hidden"><ThemeSwitch /></span>
      </div>

      {trends.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-5xl">📈</span>
          <p className="font-medium">Noch keine Daten</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Nach deiner ersten abgeschlossenen Aufnahme siehst du hier deine Trends.
          </p>
        </div>
      ) : (
        <>
          {/* Score over time */}
          <section
            className="rounded-2xl p-5"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
            }}
          >
            <p className="label-caps mb-4">GESAMT-SCORE</p>
            <TrendsChart data={scoreData} label="Score" color="oklch(0.70 0.16 145)" />
          </section>

          {/* WPM */}
          <section
            className="rounded-2xl p-5"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
            }}
          >
            <p className="label-caps mb-1">SPRECHTEMPO (WPM)</p>
            <p className="mb-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Zielbereich: 130–160 WPM
            </p>
            <TrendsChart
              data={wpmData}
              label="WPM"
              unit=" wpm"
              referenceBand={{ y1: 130, y2: 160, label: 'Ziel' }}
            />
          </section>

          {/* Filler ratio */}
          <section
            className="rounded-2xl p-5"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
            }}
          >
            <p className="label-caps mb-1">FÜLLWÖRTER-ANTEIL</p>
            <p className="mb-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Ziel: unter 2%
            </p>
            <TrendsChart
              data={fillerData}
              label="Füllwörter"
              unit="%"
              color="oklch(0.80 0.18 80)"
              referenceLines={[{ y: 2, label: '<2% Ziel', dashed: true, color: 'oklch(0.80 0.18 80)' }]}
            />
          </section>

          {/* Top fillers */}
          {topFillers.length > 0 && (
            <section
              className="rounded-2xl p-5"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--vl-hairline)',
              }}
            >
              <p className="label-caps mb-4">DEINE TOP-FÜLLWÖRTER</p>
              <div className="space-y-3">
                {topFillers.map((f, i) => (
                  <div key={f.word} className="flex items-center gap-3">
                    <span className="w-4 text-right text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                      {i + 1}.
                    </span>
                    <span
                      className="w-20 shrink-0 rounded-lg px-2 py-0.5 font-mono text-sm text-center"
                      style={{
                        background: 'var(--muted)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {f.word}
                    </span>
                    <div className="relative flex-1">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (f.count / maxFillerCount) * 100)}%`,
                          background: 'oklch(0.80 0.18 80 / 60%)',
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                      {f.count}×
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Summe über alle Aufnahmen
              </p>
            </section>
          )}
        </>
      )}
    </main>
  )
}
