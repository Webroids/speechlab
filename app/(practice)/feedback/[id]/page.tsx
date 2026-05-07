import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { createServerClient } from '@/lib/supabase/server'
import { formatDistanceToNow, formatDuration } from '@/lib/format'
import type { Feedback } from '@/lib/ai/feedback-schema'
import type { Metrics, Transcript } from '@/types/db'

import { FeedbackPolling } from './feedback-polling'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: rec } = await supabase
    .from('recordings')
    .select('*, transcripts(*), metrics(*), feedback(*)')
    .eq('id', id)
    .single()

  if (!rec) notFound()

  const transcript = rec.transcripts as unknown as Transcript | null
  const metrics = rec.metrics as unknown as Metrics | null
  const feedbackRow = rec.feedback as unknown as { data: Feedback; overall_score: number | null; summary: string | null } | null

  // Still processing — show polling component
  if (rec.status !== 'done' && rec.status !== 'error') {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <FeedbackPolling
          recordingId={id}
          initialStatus={rec.status}
          topic={rec.topic_text}
        />
      </main>
    )
  }

  const feedback = feedbackRow?.data
  const isError = rec.status === 'error'

  return (
    <main className="container mx-auto max-w-2xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mt-1 shrink-0 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl leading-snug font-semibold">{rec.topic_text}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {formatDistanceToNow(new Date(rec.created_at))} · {formatDuration(rec.duration_actual)}
          </p>
        </div>
      </div>

      {/* Audio player */}
      <AudioPlayerSection recordingId={id} filePath={rec.file_path} />

      {/* Error state */}
      {isError && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
          Verarbeitung fehlgeschlagen. Du kannst die Aufnahme trotzdem anhören, aber kein Feedback ist verfügbar.
        </div>
      )}

      {/* Overall score */}
      {feedback && (
        <>
          <OverallScoreCard
            score={feedback.overall_score}
            summary={feedback.one_sentence_summary}
          />

          {/* Sub-score cards */}
          <div className="grid grid-cols-2 gap-4">
            <SubCard
              title="Struktur"
              score={feedback.structure.score}
              comment={feedback.structure.comment}
              detail={`Framework: ${feedback.structure.framework_detected}`}
            />
            <SubCard
              title="Klarheit"
              score={feedback.clarity.score}
              comment={feedback.clarity.comment}
            />
            <SubCard
              title="Delivery"
              score={null}
              comment={feedback.delivery.comment}
              detail={`${feedback.delivery.wpm_assessment} · ${feedback.delivery.filler_assessment}`}
            />
            <SubCard
              title="Engagement"
              score={feedback.engagement.score}
              comment={feedback.engagement.comment}
              detail={`Hook: ${feedback.engagement.hook_quality}`}
            />
          </div>

          {/* Strengths */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">
              Top 3 Stärken
            </h2>
            <ul className="space-y-2">
              {feedback.top_3_strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm"
                >
                  <span className="mt-0.5 text-green-500">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Improvements */}
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">
              Top 3 Verbesserungen
            </h2>
            <ul className="space-y-4">
              {feedback.top_3_improvements.map((item, i) => (
                <li
                  key={i}
                  className="bg-card rounded-lg border p-4 text-sm"
                >
                  <p className="font-medium">{item.issue}</p>
                  <blockquote className="text-muted-foreground mt-2 border-l-2 pl-3 italic">
                    „{item.example_from_transcript}"
                  </blockquote>
                  <p className="text-primary mt-2">→ {item.better_alternative}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Framework suggestion */}
          <section className="bg-card rounded-lg border p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-60">
              Framework-Vorschlag
            </h2>
            <p className="mt-2 text-lg font-bold">{feedback.framework_suggestion.name}</p>
            <p className="text-muted-foreground mt-1 text-sm">{feedback.framework_suggestion.why}</p>
            <blockquote className="mt-3 border-l-2 pl-3 text-sm italic">
              „{feedback.framework_suggestion.how_it_would_have_sounded}"
            </blockquote>
          </section>

          {/* Next drill */}
          <section className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-r p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-60">
              Nächste Übung
            </h2>
            <p className="mt-1 text-sm font-medium">{feedback.next_drill}</p>
          </section>
        </>
      )}

      {/* Transcript */}
      {transcript && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">
            Transkript
          </h2>
          <p className="text-muted-foreground bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
            {transcript.text}
          </p>
        </section>
      )}

      {/* Metrics */}
      {metrics && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">
            Metriken
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MetricTile label="WPM" value={String(metrics.wpm ?? '—')} />
            <MetricTile label="Füllwörter" value={String(metrics.filler_count ?? 0)} />
            <MetricTile label="Abschwächungen" value={String(metrics.hedging_count ?? 0)} />
            <MetricTile label="Lange Pausen" value={String(metrics.long_pauses ?? 0)} />
            <MetricTile
              label="Erste-Wort-Latenz"
              value={`${metrics.first_word_latency ?? 0}s`}
            />
            <MetricTile label="Wörter" value={String(metrics.word_count ?? 0)} />
          </div>
        </section>
      )}
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

async function AudioPlayerSection({ recordingId, filePath }: { recordingId: string; filePath: string }) {
  const supabase = createServerClient()
  const { data } = supabase.storage.from('recordings').getPublicUrl(filePath)
  // For private buckets we need a signed URL
  const { data: signed } = await supabase.storage
    .from('recordings')
    .createSignedUrl(filePath, 3600)

  const url = signed?.signedUrl ?? data?.publicUrl
  if (!url) return null
  void recordingId

  return (
    <section>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        controls
        src={url}
        className="w-full"
      />
    </section>
  )
}

function OverallScoreCard({ score, summary }: { score: number; summary: string }) {
  const colorClass =
    score >= 80
      ? 'text-green-600 dark:text-green-400'
      : score >= 60
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-red-600 dark:text-red-400'
  const bgClass =
    score >= 80
      ? 'bg-green-500/10'
      : score >= 60
        ? 'bg-yellow-500/10'
        : 'bg-red-500/10'

  return (
    <div className={`rounded-2xl p-6 text-center ${bgClass}`}>
      <div className={`text-7xl font-black tabular-nums ${colorClass}`}>{score}</div>
      <p className="mt-2 text-sm font-medium">{summary}</p>
    </div>
  )
}

function SubCard({
  title,
  score,
  comment,
  detail,
}: {
  title: string
  score: number | null
  comment: string
  detail?: string
}) {
  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-60">{title}</span>
        {score !== null && (
          <span className="text-lg font-bold">{score}<span className="text-muted-foreground text-xs">/10</span></span>
        )}
      </div>
      {detail && <p className="text-muted-foreground mt-1 text-xs">{detail}</p>}
      <p className="mt-2 text-xs leading-relaxed">{comment}</p>
    </div>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className="text-xl font-bold tabular-nums">{value}</div>
      <div className="text-muted-foreground mt-0.5 text-xs">{label}</div>
    </div>
  )
}
