import Link from 'next/link'

import { listRecent } from '@/actions/list-recordings'
import { formatDistanceToNow } from '@/lib/format'

import { HomeClient } from './home-client'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let recentRecordings: Awaited<ReturnType<typeof listRecent>> = []

  try {
    recentRecordings = await listRecent(5)
  } catch {
    // Supabase not configured yet — graceful empty state
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">SpeechLab</h1>
        <p className="text-muted-foreground mt-1 text-sm">Aufnehmen. Transkribieren. Besser werden.</p>
      </div>

      <HomeClient />

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

