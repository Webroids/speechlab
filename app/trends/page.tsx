import Link from 'next/link'

import { ArrowLeft, BarChart2 } from 'lucide-react'

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
    <main className="container mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-1 items-center gap-2">
          <BarChart2 className="text-primary h-5 w-5" />
          <h1 className="text-xl font-semibold">Fortschritt</h1>
        </div>
        <span className="md:hidden"><ThemeSwitch /></span>
      </div>

      {/* Score over time */}
      <section className="bg-card rounded-xl border p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-60">
          Gesamt-Score über Zeit
        </h2>
        <TrendsChart data={scoreData} label="Score" color="hsl(142, 76%, 36%)" />
      </section>

      {/* WPM over time */}
      <section className="bg-card rounded-xl border p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-60">
          Sprechtempo (WPM)
        </h2>
        <p className="text-muted-foreground mb-4 text-xs">Zielbereich: 130–160 WPM für natürliches Deutsch</p>
        <TrendsChart
          data={wpmData}
          label="WPM"
          unit=" wpm"
          referenceBand={{ y1: 130, y2: 160, label: 'Ziel' }}
        />
      </section>

      {/* Filler ratio over time */}
      <section className="bg-card rounded-xl border p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-60">
          Füllwörter-Anteil
        </h2>
        <p className="text-muted-foreground mb-4 text-xs">Ziel: unter 2% — professionelle Redner liegen bei 0,5–1%</p>
        <TrendsChart
          data={fillerData}
          label="Füllwörter"
          unit="%"
          color="hsl(38, 92%, 50%)"
          referenceLines={[{ y: 2, label: '<2% Ziel', dashed: true, color: 'hsl(38, 92%, 50%)' }]}
        />
      </section>

      {/* Top fillers */}
      {topFillers.length > 0 && (
        <section className="bg-card rounded-xl border p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-60">
            Deine Top-Füllwörter
          </h2>
          <div className="space-y-3">
            {topFillers.map((f, i) => (
              <div key={f.word} className="flex items-center gap-3">
                <span className="text-muted-foreground w-4 text-right text-xs">{i + 1}.</span>
                <span className="bg-muted w-24 rounded px-2 py-0.5 font-mono text-sm">{f.word}</span>
                <div className="relative flex-1">
                  <div
                    className="bg-primary/30 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (f.count / maxFillerCount) * 100)}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right text-xs">{f.count}×</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-xs">Summe über alle Aufnahmen</p>
        </section>
      )}

      {trends.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-4xl">📈</p>
          <p className="font-medium">Noch keine Daten</p>
          <p className="text-muted-foreground text-sm">
            Nach deiner ersten abgeschlossenen Aufnahme siehst du hier deine Trends.
          </p>
        </div>
      )}
    </main>
  )
}
