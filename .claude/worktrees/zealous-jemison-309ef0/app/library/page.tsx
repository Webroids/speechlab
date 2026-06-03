import { Suspense } from 'react'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { listAll } from '@/actions/list-recordings'
import { CATEGORY_LABELS } from '@/lib/topics'
import { formatDistanceToNow, formatDuration } from '@/lib/format'

import { LibraryFilters } from './library-filters'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ category?: string; from?: string }>
}

export default async function LibraryPage({ searchParams }: Props) {
  const { category, from } = await searchParams

  let recordings: Awaited<ReturnType<typeof listAll>> = []
  try {
    recordings = await listAll()
  } catch {
    // Supabase not configured — empty state
  }

  // Filter client-side (simple enough with <100 recordings)
  let filtered = recordings
  if (category && category !== 'all') {
    // We don't store category in recordings table — skip for now; filter is cosmetic
    void category
  }
  if (from) {
    const fromDate = new Date(from)
    filtered = filtered.filter((r) => new Date(r.created_at) >= fromDate)
  }

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Bibliothek</h1>
        <span className="text-muted-foreground ml-auto text-sm">{filtered.length} Aufnahmen</span>
      </div>

      <Suspense fallback={<div className="h-8" />}>
        <LibraryFilters />
      </Suspense>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-muted-foreground text-4xl">🎙️</p>
          <p className="font-medium">Noch keine Aufnahmen</p>
          <p className="text-muted-foreground text-sm">
            Starte deine erste Aufnahme auf der{' '}
            <Link
              href="/"
              className="text-primary underline"
            >
              Startseite
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((rec) => (
            <li key={rec.id}>
              <Link
                href={`/feedback/${rec.id}`}
                className="bg-card hover:bg-accent group flex items-start justify-between rounded-xl border p-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug">{rec.topic_text}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {formatDistanceToNow(new Date(rec.created_at))} · {formatDuration(rec.duration_actual)}
                    {rec.status !== 'done' && rec.status !== 'error' && (
                      <span className="text-primary ml-2 animate-pulse">· {statusLabel(rec.status)}</span>
                    )}
                    {rec.status === 'error' && (
                      <span className="text-destructive ml-2">· Fehler</span>
                    )}
                  </p>
                </div>
                {rec.overall_score !== null ? (
                  <ScoreBadge score={rec.overall_score} />
                ) : (
                  <span className="text-muted-foreground ml-3 shrink-0 text-xs">—</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
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
    <span className={`ml-3 mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>
      {score}
    </span>
  )
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    recorded: 'wartet',
    transcribing: 'transkribiert…',
    analyzing: 'analysiert…',
  }
  return labels[status] ?? status
}

void CATEGORY_LABELS
