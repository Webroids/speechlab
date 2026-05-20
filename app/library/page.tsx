import { Suspense } from 'react'
import Link from 'next/link'

import { listAll } from '@/actions/list-recordings'
import { FRAMEWORKS } from '@/lib/frameworks'
import { formatDistanceToNow, formatDuration } from '@/lib/format'
import { DeleteRecordingButton } from '@/components/delete-recording-button'
import { ThemeSwitch } from '@/components/theme-switch'
import { VLRing } from '@/components/vl-ring'

import { LibraryFilters } from './library-filters'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string; from?: string }>
}

export default async function LibraryPage({ searchParams }: Props) {
  const { q, from } = await searchParams

  let recordings: Awaited<ReturnType<typeof listAll>> = []
  try {
    recordings = await listAll()
  } catch {
    // Supabase not configured -- empty state
  }

  let filtered = recordings
  if (q) {
    const lower = q.toLowerCase()
    filtered = filtered.filter((r) => r.topic_text.toLowerCase().includes(lower))
  }
  if (from) {
    const fromDate = new Date(from)
    filtered = filtered.filter((r) => new Date(r.created_at) >= fromDate)
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8 pb-6 md:pt-10">
        <div className="flex-1">
          <p className="label-caps mb-1">BIBLIOTHEK</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Deine Aufnahmen
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {filtered.length} Aufnahmen
          </span>
          <span className="md:hidden"><ThemeSwitch /></span>
        </div>
      </div>

      <Suspense fallback={<div className="h-10" />}>
        <LibraryFilters />
      </Suspense>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <span className="text-5xl">{q ? '🔍' : '🎙️'}</span>
          {q ? (
            <>
              <p className="font-medium">Keine Aufnahmen für „{q}"</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Versuche ein anderes Stichwort oder lösche die Suche.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Noch keine Aufnahmen</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Starte deine erste Aufnahme auf der{' '}
                <Link href="/" style={{ color: 'var(--vl-coral)' }}>Startseite</Link>.
              </p>
            </>
          )}
        </div>
      ) : (
        <ul className="mt-4">
          {filtered.map((rec, i) => (
            <li
              key={rec.id}
              className="flex items-center gap-2"
              style={{
                borderBottom: i < filtered.length - 1
                  ? '1px solid var(--vl-hairline)'
                  : 'none',
              }}
            >
              <Link
                href={`/feedback/${rec.id}`}
                className="flex flex-1 items-center gap-4 py-4 transition-opacity hover:opacity-70 min-w-0"
              >
                {rec.overall_score !== null ? (
                  <VLRing score={rec.overall_score} size={48} stroke={3.5} />
                ) : (
                  <div
                    className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--muted)' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>--</span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug">{rec.topic_text}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {formatDistanceToNow(new Date(rec.created_at))} · {formatDuration(rec.duration_actual)}
                    </span>
                    {rec.framework_hint && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          background: 'oklch(0.80 0.18 80 / 25%)',
                          color: 'oklch(0.60 0.18 80)',
                        }}
                      >
                        {FRAMEWORKS.find((f) => f.id === rec.framework_hint)?.name ?? rec.framework_hint}
                      </span>
                    )}
                    {rec.status !== 'done' && rec.status !== 'error' && (
                      <span
                        className="animate-pulse text-xs"
                        style={{ color: 'var(--vl-coral)' }}
                      >
                        {statusLabel(rec.status)}
                      </span>
                    )}
                    {rec.status === 'error' && (
                      <span className="text-xs" style={{ color: 'var(--vl-coral)' }}>Fehler</span>
                    )}
                  </div>
                </div>

                {rec.status !== 'error' && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="shrink-0"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <path d="M5 2l5 5-5 5" />
                  </svg>
                )}
              </Link>

              {rec.status !== 'done' && (
                <div className="shrink-0 py-4">
                  <DeleteRecordingButton recordingId={rec.id} compact />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    recorded: 'wartet…',
    transcribing: 'transkribiert…',
    analyzing: 'analysiert…',
  }
  return labels[status] ?? status
}
