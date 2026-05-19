import Link from 'next/link'
import { Upload } from 'lucide-react'

import { listRecent, getRecentScores } from '@/actions/list-recordings'
import { getStreak } from '@/actions/streak'
import { formatDistanceToNow } from '@/lib/format'
import { ThemeSwitch } from '@/components/theme-switch'
import { VLRing } from '@/components/vl-ring'
import { topics, getAllTopics } from '@/lib/topics'
import { getUser } from '@/lib/supabase/session'

import { HomeClient } from './home-client'

export const dynamic = 'force-dynamic'

// HomeClient no longer accepts initialFramework


const CAT_STYLE: Record<string, { bg: string; accent: string; label: string }> = {
  business_pitch:        { bg: 'var(--vl-coral-bg)',    accent: 'var(--vl-coral)',    label: 'Pitch' },
  persoenlich_reflexion: { bg: 'var(--vl-rose-bg)',     accent: 'var(--vl-rose)',     label: 'Reflexion' },
  smalltalk:             { bg: 'var(--vl-mint-bg)',     accent: 'var(--vl-mint)',     label: 'Smalltalk' },
  erklaerung_teachback:  { bg: 'var(--vl-ocean-bg)',    accent: 'var(--vl-ocean)',    label: 'Erklärung' },
  streit_position:       { bg: 'var(--vl-lavender-bg)', accent: 'var(--vl-lavender)', label: 'Debatte' },
  storytelling:          { bg: 'var(--vl-amber-bg)',    accent: 'var(--vl-amber)',    label: 'Story' },
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen,'
  if (h < 18) return 'Guten Tag,'
  return 'Guten Abend,'
}

function findCategory(topicText: string): string | null {
  return topics.find((t) => t.text === topicText)?.category ?? null
}

const WEEKLY_GOAL = 5

export default async function HomePage() {
  const user = await getUser().catch(() => null)
  const initial = ((user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'S')[0].toUpperCase()

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
    // Supabase not configured — graceful empty state
  }

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
    ? 'Ein kurzer Drill hält den Streak am Leben.'
    : streak.totalSessions > 0
      ? 'Starte heute wieder und bau deinen Streak auf.'
      : 'Starte deine erste Aufnahme.'

  const weeklyDone = Math.min(streak.weeklyCount, WEEKLY_GOAL)

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 md:pb-10">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-8 pb-6 md:pt-10">
        <p className="label-caps tracking-widest" style={{ fontSize: '0.65rem' }}>SPEECHLAB</p>
        <div className="flex items-center gap-3">
          <span className="md:hidden"><ThemeSwitch /></span>
          <Link
            href="/account"
            className="flex h-9 w-9 items-center justify-center rounded-full font-display transition-opacity hover:opacity-70"
            style={{
              background: 'var(--secondary)',
              border: '1px solid var(--vl-hairline)',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--muted-foreground)',
            }}
          >
            {initial}
          </Link>
        </div>
      </div>

      {/* ── Greeting ────────────────────────────────────────── */}
      <div className="mb-8">
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2.25rem, 8vw, 3.25rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
          }}
        >
          {greeting}<br />
          <em style={{ color: 'var(--muted-foreground)' }}>Deine Stimme.</em>
        </h1>
        <p
          className="mt-3 text-sm"
          style={{ color: 'var(--muted-foreground)', maxWidth: '38ch', lineHeight: 1.6 }}
        >
          {subtitle}
        </p>
      </div>

      {/* ── HomeClient ──────────────────────────────────────── */}
      <HomeClient>

        {/* Streak + stats tiles — slotted between drill card and controls */}
        {streak.totalSessions > 0 && (
          <div className="space-y-3">

            {/* 2-col stat tiles */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--vl-hairline)',
                  boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
                }}
              >
                <p className="label-caps mb-2.5">STREAK</p>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-display tabular-nums"
                    style={{ fontSize: '2.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}
                  >
                    {streak.currentStreak}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    {streak.currentStreak === 1 ? 'Tag' : 'Tage'}
                  </span>
                </div>
                {streak.todayDone && (
                  <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--vl-sage)' }}>
                    Heute erledigt
                  </p>
                )}
              </div>

              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--vl-hairline)',
                  boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
                }}
              >
                <p className="label-caps mb-2.5">AVG SCORE</p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display tabular-nums"
                    style={{ fontSize: '2.5rem', lineHeight: 1, letterSpacing: '-0.04em' }}
                  >
                    {avgScore ?? '--'}
                  </span>
                  {delta !== null && delta !== 0 && (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
                      style={{
                        background: delta > 0 ? 'var(--vl-sage)' : 'var(--vl-coral)',
                        color: 'oklch(0.967 0.012 75)',
                      }}
                    >
                      {delta > 0 ? '+' : ''}{delta}
                    </span>
                  )}
                </div>
                {scores.length > 0 && (
                  <p className="mt-1.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {scores.length} Aufnahmen
                  </p>
                )}
              </div>
            </div>

            {/* Weekly goal — segmented dots only */}
            <div
              className="rounded-2xl px-4 py-3.5"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--vl-hairline)',
                boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <p className="label-caps">WOCHENZIEL</p>
                <span
                  className="text-[10px] font-semibold tabular-nums"
                  style={{ color: weeklyDone >= WEEKLY_GOAL ? 'var(--vl-sage)' : 'var(--muted-foreground)' }}
                >
                  {weeklyDone}/{WEEKLY_GOAL}
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: WEEKLY_GOAL }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 rounded-full transition-colors duration-300"
                    style={{
                      background: i < weeklyDone
                        ? (weeklyDone >= WEEKLY_GOAL ? 'var(--vl-sage)' : 'var(--vl-coral)')
                        : 'var(--muted)',
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        )}
      </HomeClient>

      {/* ── Upload existing recording link ───────────────────── */}
      <Link
        href="/upload"
        className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-60"
        style={{ color: 'var(--muted-foreground)' }}
      >
        <Upload className="h-3.5 w-3.5" />
        Bestehende Aufnahme analysieren
      </Link>

      {/* ── Discover topics link ─────────────────────────────── */}
      <Link
        href="/topics"
        className="mt-8 flex items-center justify-between rounded-2xl p-4 transition-opacity hover:opacity-75 active:scale-[0.99]"
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
            {([
              { label: 'Pitch', bg: 'var(--vl-coral-bg)', accent: 'var(--vl-coral)' },
              { label: 'Story', bg: 'var(--vl-amber-bg)', accent: 'var(--vl-amber)' },
              { label: 'Debatte', bg: 'var(--vl-lavender-bg)', accent: 'var(--vl-lavender)' },
              { label: 'Smalltalk', bg: 'var(--vl-mint-bg)', accent: 'var(--vl-mint)' },
            ]).map(({ label, bg, accent }) => (
              <span
                key={label}
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ background: bg, color: accent }}
              >
                {label}
              </span>
            ))}
            <span className="text-xs self-center" style={{ color: 'var(--muted-foreground)' }}>
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

      {/* ── Recent recordings ───────────────────────────────── */}
      {recentRecordings.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="label-caps">ZULETZT</p>
            <Link
              href="/library"
              className="text-xs font-medium transition-opacity hover:opacity-60"
              style={{ color: 'var(--foreground)' }}
            >
              Alle anzeigen
            </Link>
          </div>

          <ul
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
            }}
          >
            {recentRecordings.map((rec, i) => {
              const cat = findCategory(rec.topic_text)
              const catStyle = cat ? CAT_STYLE[cat] : null
              const durSec = rec.duration_actual
              const durLabel = durSec >= 60 ? `${Math.round(durSec / 60)} min` : `${durSec}s`

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
                    className="flex items-center gap-3.5 px-4 py-3.5 transition-opacity hover:opacity-70"
                  >
                    {rec.overall_score !== null ? (
                      <VLRing score={rec.overall_score} size={44} stroke={3.5} />
                    ) : (
                      <div
                        className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--muted)' }}
                      >
                        <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>--</span>
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium leading-snug"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {rec.topic_text}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {catStyle && (
                          <span
                            className="rounded-full px-1.5 py-px text-[10px] font-semibold"
                            style={{ background: catStyle.bg, color: catStyle.accent }}
                          >
                            {catStyle.label}
                          </span>
                        )}
                        <span
                          className="rounded-full px-1.5 py-px text-[10px] font-semibold"
                          style={{ background: 'var(--vl-amber-bg)', color: 'var(--vl-amber)' }}
                        >
                          {durLabel}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
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
