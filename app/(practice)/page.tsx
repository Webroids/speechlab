import Link from 'next/link'

import { listRecent, getRecentScores } from '@/actions/list-recordings'
import { getStreak } from '@/actions/streak'
import { formatDistanceToNow } from '@/lib/format'
import { ThemeSwitch } from '@/components/theme-switch'
import { VLRing } from '@/components/vl-ring'
import { topics, getAllTopics } from '@/lib/topics'

import { HomeClient } from './home-client'

export const dynamic = 'force-dynamic'

// Category -> VL colour + short label (same mapping as home-client)
const CAT_STYLE: Record<string, { color: string; label: string }> = {
  business_pitch:        { color: 'var(--vl-coral)',    label: 'Pitch' },
  persoenlich_reflexion: { color: 'var(--vl-rose)',     label: 'Reflexion' },
  smalltalk:             { color: 'var(--vl-mint)',     label: 'Smalltalk' },
  erklaerung_teachback:  { color: 'var(--vl-ocean)',    label: 'Erklaerung' },
  streit_position:       { color: 'var(--vl-lavender)', label: 'Debatte' },
  storytelling:          { color: 'var(--vl-amber)',    label: 'Story' },
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen,'
  if (h < 18) return 'Guten Tag,'
  return 'Guten Abend,'
}

function findCategory(topicText: string): string | null {
  const match = topics.find((t) => t.text === topicText)
  return match?.category ?? null
}

interface Props {
  searchParams: Promise<{ framework?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { framework } = await searchParams

  let recentRecordings: Awaited<ReturnType<typeof listRecent>> = []
  let streak = { currentStreak: 0, totalSessions: 0, todayDone: false, weeklyCount: 0 }
  let recentScores: { date: string; score: number }[] = []

  try {
    ;[recentRecordings, streak, recentScores] = await Promise.all([
      listRecent(5),
      getStreak(),
      getRecentScores(20),
    ])
  } catch {
    // Supabase not configured -- graceful empty state
  }

  // Compute avg score + delta
  const scores = recentScores.map((s) => s.score)
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null
  const recent5 = scores.slice(-5)
  const prev5 = scores.slice(-10, -5)
  const avgRecent = recent5.length > 0 ? recent5.reduce((a, b) => a + b, 0) / recent5.length : null
  const avgPrev = prev5.length > 0 ? prev5.reduce((a, b) => a + b, 0) / prev5.length : null
  const delta = avgRecent !== null && avgPrev !== null ? Math.round(avgRecent - avgPrev) : null

  const greeting = getGreeting()
  const subtitle = streak.currentStreak > 0
    ? `Ein kurzer Drill halt den Streak am Leben.`
    : streak.totalSessions > 0
      ? 'Starte heute wieder und bau deinen Streak auf.'
      : 'Starte deine erste Aufnahme.'

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 pb-6 md:pt-10">
        <p className="label-caps">SPEECHLAB</p>
        <div className="flex items-center gap-3">
          <span className="md:hidden"><ThemeSwitch /></span>
          {/* Avatar placeholder */}
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full font-display"
            style={{
              background: 'var(--secondary)',
              border: '1px solid var(--vl-hairline)',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--muted-foreground)',
            }}
          >
            S
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-7">
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
        >
          {greeting}<br />
          <em style={{ color: 'var(--muted-foreground)' }}>Deine Stimme.</em>
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {subtitle}
        </p>
      </div>

      {/* HomeClient -- hero card + [streak tiles as children] + controls */}
      <HomeClient initialFramework={framework ?? ''}>
        {/* Streak tiles -- server-rendered, slotted between hero card and controls */}
        {streak.totalSessions > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4"
                style={{ border: '1px solid var(--vl-hairline)' }}
              >
                <p className="label-caps mb-2">STREAK</p>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-display tabular-nums"
                    style={{ fontSize: '2.375rem', lineHeight: 1, letterSpacing: '-0.04em' }}
                  >
                    {streak.currentStreak}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {streak.currentStreak === 1 ? 'Tag' : 'Tage'}
                  </span>
                </div>
              </div>

              <div
                className="rounded-2xl p-4"
                style={{ border: '1px solid var(--vl-hairline)' }}
              >
                <p className="label-caps mb-2">AVG SCORE</p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display tabular-nums"
                    style={{ fontSize: '2.375rem', lineHeight: 1, letterSpacing: '-0.04em' }}
                  >
                    {avgScore ?? '--'}
                  </span>
                  {delta !== null && delta !== 0 && (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: delta > 0 ? 'var(--vl-sage)' : 'var(--vl-coral)' }}
                    >
                      {delta > 0 ? '+' : ''}{delta}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly goal tile */}
            {(() => {
              const WEEKLY_GOAL = 5
              const done = Math.min(streak.weeklyCount, WEEKLY_GOAL)
              const pct = Math.round((done / WEEKLY_GOAL) * 100)
              return (
                <div
                  className="rounded-2xl p-4"
                  style={{ border: '1px solid var(--vl-hairline)' }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="label-caps">WOCHENZIEL</p>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                      {done}/{WEEKLY_GOAL}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ background: 'var(--muted)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: done >= WEEKLY_GOAL ? 'var(--vl-sage)' : 'var(--vl-coral)',
                      }}
                    />
                  </div>
                  {/* Dot dots row */}
                  <div className="mt-2.5 flex gap-1.5">
                    {Array.from({ length: WEEKLY_GOAL }).map((_, i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full"
                        style={{
                          background: i < done
                            ? (done >= WEEKLY_GOAL ? 'var(--vl-sage)' : 'var(--vl-coral)')
                            : 'var(--muted)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </HomeClient>

      {/* Themen entdecken -- compact link card */}
      <Link
        href="/topics"
        className="mt-8 flex items-center justify-between rounded-2xl p-4 transition-opacity hover:opacity-80"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--vl-hairline)',
          boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
        }}
      >
        <div>
          <p className="label-caps mb-1">THEMEN</p>
          <p className="text-sm font-medium" style={{ letterSpacing: '-0.01em' }}>
            Alle Themen entdecken
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(['Pitch', 'Story', 'Debatte', 'Smalltalk'] as const).map((label, i) => {
              const colors = [
                'var(--vl-coral)',
                'var(--vl-amber)',
                'var(--vl-lavender)',
                'var(--vl-mint)',
              ]
              return (
                <span
                  key={i}
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ background: colors[i], color: 'var(--background)' }}
                >
                  {label}
                </span>
              )
            })}
            <span className="text-xs" style={{ color: 'var(--muted-foreground)', alignSelf: 'center' }}>
              +{getAllTopics().length - 4} mehr
            </span>
          </div>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 14 14"
          fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
          className="shrink-0 ml-3"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <path d="M5 2l5 5-5 5" />
        </svg>
      </Link>

      {/* Recent recordings -- server-rendered after controls */}
      {recentRecordings.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="label-caps">RECENT</p>
            <Link
              href="/library"
              className="text-xs font-medium transition-opacity hover:opacity-60"
              style={{ color: 'var(--foreground)' }}
            >
              See all
            </Link>
          </div>

          <ul>
            {recentRecordings.map((rec, i) => {
              const cat = findCategory(rec.topic_text)
              const catStyle = cat ? CAT_STYLE[cat] : null
              const durMin = Math.round(rec.duration_actual / 60)
              const durLabel = durMin >= 1 ? `${durMin} min` : `${rec.duration_actual}s`

              return (
                <li
                  key={rec.id}
                  style={{
                    borderBottom: i < recentRecordings.length - 1
                      ? '1px solid var(--vl-hairline)'
                      : 'none',
                  }}
                >
                  <Link
                    href={`/feedback/${rec.id}`}
                    className="flex items-center gap-4 py-4 transition-opacity hover:opacity-70"
                  >
                    {rec.overall_score !== null ? (
                      <VLRing score={rec.overall_score} size={48} stroke={3.5} />
                    ) : (
                      <div
                        className="h-12 w-12 shrink-0 rounded-full"
                        style={{ background: 'var(--muted)' }}
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium leading-snug">{rec.topic_text}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {catStyle && (
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-semibold"
                            style={{ background: catStyle.color, color: 'var(--background)' }}
                          >
                            {catStyle.label}
                          </span>
                        )}
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{ background: 'var(--vl-lemon)', color: 'var(--foreground)' }}
                        >
                          {durLabel}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {formatDistanceToNow(new Date(rec.created_at))}
                        </span>
                      </div>
                    </div>

                    <svg
                      width="14" height="14" viewBox="0 0 14 14"
                      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
                      className="shrink-0"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      <path d="M5 2l5 5-5 5" />
                    </svg>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </main>
  )
}
