import Link from 'next/link'

import { BarChart2, BookOpen, Library } from 'lucide-react'

import { listRecent } from '@/actions/list-recordings'
import { getStreak } from '@/actions/streak'
import { formatDistanceToNow } from '@/lib/format'
import { ThemeSwitch } from '@/components/theme-switch'

import { HomeClient } from './home-client'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ framework?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { framework } = await searchParams

  let recentRecordings: Awaited<ReturnType<typeof listRecent>> = []
  let streak = { currentStreak: 0, totalSessions: 0, todayDone: false }

  try {
    ;[recentRecordings, streak] = await Promise.all([listRecent(5), getStreak()])
  } catch {
    // Supabase not configured yet — graceful empty state
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SpeechLab</h1>
          <p className="text-muted-foreground mt-1 text-sm">Aufnehmen. Transkribieren. Besser werden.</p>
        </div>
        <span className="md:hidden"><ThemeSwitch /></span>
      </div>

      {/* Streak + stats bar */}
      {streak.totalSessions > 0 && (
        <div className="bg-card mb-8 grid grid-cols-3 divide-x rounded-xl border">
          <div className="flex flex-col items-center py-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tabular-nums">
                {streak.currentStreak}
              </span>
              <span className="text-lg">{streak.currentStreak > 0 ? '🔥' : '💤'}</span>
            </div>
            <span className="text-muted-foreground text-xs">Tage in Folge</span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className="text-2xl font-black tabular-nums">{streak.totalSessions}</span>
            <span className="text-muted-foreground text-xs">Aufnahmen total</span>
          </div>
          <div className="flex flex-col items-center py-3">
            <span className={`text-2xl font-black ${streak.todayDone ? 'text-green-500' : 'text-muted-foreground'}`}>
              {streak.todayDone ? '✓' : '—'}
            </span>
            <span className="text-muted-foreground text-xs">Heute geübt</span>
          </div>
        </div>
      )}

      {/* Quick nav */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <Link href="/library" className="bg-card hover:bg-accent flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors">
          <Library className="text-primary h-5 w-5" />
          <span className="text-xs font-medium">Bibliothek</span>
        </Link>
        <Link href="/frameworks" className="bg-card hover:bg-accent flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors">
          <BookOpen className="text-primary h-5 w-5" />
          <span className="text-xs font-medium">Frameworks</span>
        </Link>
        <Link href="/trends" className="bg-card hover:bg-accent flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors">
          <BarChart2 className="text-primary h-5 w-5" />
          <span className="text-xs font-medium">Fortschritt</span>
        </Link>
      </div>

      <HomeClient initialFramework={framework ?? ''} />

      {recentRecordings.length > 0 && (
        <section className="mt-12">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide opacity-60">
              Letzte Aufnahmen
            </h2>
            <Link
              href="/library"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Alle ansehen →
            </Link>
          </div>

          <ul className="space-y-2">
            {recentRecordings.map((rec) => (
              <li key={rec.id}>
                <Link
                  href={`/feedback/${rec.id}`}
                  className="bg-card hover:bg-accent flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{rec.topic_text}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(rec.created_at))} ·{' '}
                      {Math.round(rec.duration_actual / 60)}min{' '}
                      {rec.duration_actual % 60}s
                    </p>
                  </div>
                  {rec.overall_score !== null && (
                    <ScoreBadge score={rec.overall_score} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-green-500/15 text-green-600 dark:text-green-400'
      : score >= 60
        ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
        : 'bg-red-500/15 text-red-600 dark:text-red-400'
  return (
    <span className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {score}
    </span>
  )
}
