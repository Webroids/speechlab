import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, RotateCcw } from 'lucide-react'

import { createServerClient } from '@/lib/supabase/server'
import { formatDistanceToNow, formatDuration } from '@/lib/format'
import type { Feedback } from '@/lib/ai/feedback-schema'
import { FRAMEWORKS } from '@/lib/frameworks'
import type { Metrics, Transcript } from '@/types/db'
import { getRecentScores } from '@/actions/list-recordings'
import { DeleteRecordingButton } from '@/components/delete-recording-button'
import { NoteTagsEditor } from '@/components/notes-tags-editor'
import { ScoreSparkline } from '@/components/score-sparkline'
import { TranscriptPlayer } from '@/components/transcript-player'
import { Button } from '@/components/ui/button'

import { FeedbackPolling } from './feedback-polling'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const [{ data: rec }, recentScores] = await Promise.all([
    supabase
      .from('recordings')
      .select('*, transcripts(*), metrics(*), feedback(*), tags(*), notes(*)')
      .eq('id', id)
      .single(),
    getRecentScores(10),
  ])

  if (!rec) notFound()

  const transcript = rec.transcripts as unknown as Transcript | null
  const metrics = rec.metrics as unknown as Metrics | null
  const rawFeedback = rec.feedback as unknown
  const feedbackRow = (Array.isArray(rawFeedback) ? rawFeedback[0] : rawFeedback) as { data: Feedback; overall_score: number | null; summary: string | null } | null
  const rawTags = rec.tags as unknown as { id: string; label: string }[]
  const tags = Array.isArray(rawTags) ? rawTags : []
  const rawNotes = rec.notes as unknown
  const noteRow = (Array.isArray(rawNotes) ? rawNotes[0] : rawNotes) as { text: string | null } | null
  const noteText = noteRow?.text ?? ''

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

  const rawData = feedbackRow?.data as (Feedback & { error?: string }) | undefined
  const feedback = rawData?.overall_score != null ? rawData as Feedback : null
  const isError = rec.status === 'error'

  return (
    <main className="container mx-auto max-w-2xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/library"
          className="text-muted-foreground hover:text-foreground mt-1 shrink-0 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl leading-snug font-semibold">{rec.topic_text}</h1>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(rec.created_at))} · {formatDuration(rec.duration_actual)}
            </p>
            <DeleteRecordingButton recordingId={id} />
          </div>
        </div>
      </div>

      {/* Audio player + karaoke transcript */}
      <AudioPlayerSection recordingId={id} filePath={rec.file_path} words={transcript?.words as { word: string; start: number; end: number }[] | undefined} />

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

          <ScoreSparkline scores={recentScores} currentScore={feedback.overall_score} />

          {/* Quick CTAs — visible early without scrolling */}
          {(() => {
            const repeatParams = new URLSearchParams({ topic: rec.topic_text, duration: String(rec.duration_target) })
            if (rec.framework_hint) repeatParams.set('framework', rec.framework_hint)
            return (
              <div className="flex gap-3">
                <Link href={`/record?${repeatParams.toString()}`} className="flex-1">
                  <Button size="sm" className="w-full gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Nochmal üben
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="sm" variant="outline">Neues Thema</Button>
                </Link>
              </div>
            )
          })()}

          {/* Sub-score cards */}
          <div className="grid grid-cols-2 gap-4">
            <SubCard
              title="Struktur"
              score={feedback.structure?.score ?? null}
              comment={feedback.structure?.comment ?? ''}
              detail={feedback.structure?.framework_detected ? `Framework: ${feedback.structure.framework_detected}` : undefined}
            />
            <SubCard
              title="Klarheit"
              score={feedback.clarity?.score ?? null}
              comment={feedback.clarity?.comment ?? ''}
            />
            <SubCard
              title="Delivery"
              score={null}
              comment={feedback.delivery?.comment ?? ''}
              detail={feedback.delivery ? `${feedback.delivery.wpm_assessment} · ${feedback.delivery.filler_assessment}` : undefined}
            />
            <SubCard
              title="Engagement"
              score={feedback.engagement?.score ?? null}
              comment={feedback.engagement?.comment ?? ''}
              detail={feedback.engagement?.hook_quality ? `Hook: ${feedback.engagement.hook_quality}` : undefined}
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
            {(() => {
              const fwId = FRAMEWORKS.find(
                (f) => f.name.toLowerCase() === feedback.framework_suggestion.name.toLowerCase()
              )?.id
              if (!fwId) return null
              const params = new URLSearchParams({ topic: rec.topic_text, duration: String(rec.duration_target), framework: fwId })
              return (
                <Link href={`/record?${params.toString()}`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Mit diesem Framework üben →
                  </Button>
                </Link>
              )
            })()}
          </section>

          {/* Next drill */}
          <section className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-r p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide opacity-60">
              Nächste Übung
            </h2>
            <p className="mt-1 text-sm font-medium">{feedback.next_drill}</p>
            {(() => {
              const drillParams = new URLSearchParams({ topic: feedback.next_drill, duration: String(rec.duration_target) })
              return (
                <Link href={`/record?${drillParams.toString()}`} className="mt-4 block">
                  <Button size="sm" className="w-full">
                    Jetzt üben →
                  </Button>
                </Link>
              )
            })()}
          </section>
        </>
      )}

      {/* Tags + Notes */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">
          Notizen & Tags
        </h2>
        <NoteTagsEditor
          recordingId={id}
          initialNote={noteText}
          initialTags={tags}
        />
      </section>

      {/* Practice again CTAs */}
      <div className="flex gap-3">
        {(() => {
          const repeatParams = new URLSearchParams({
            topic: rec.topic_text,
            duration: String(rec.duration_target),
          })
          if (rec.framework_hint) repeatParams.set('framework', rec.framework_hint)
          return (
            <Link href={`/record?${repeatParams.toString()}`} className="flex-1">
              <Button size="lg" className="w-full gap-2">
                <RotateCcw className="h-4 w-4" />
                Nochmal üben
              </Button>
            </Link>
          )
        })()}
        <Link href="/">
          <Button size="lg" variant="outline">
            Neues Thema
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      {metrics && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">
            Metriken
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MetricTile
              label="WPM"
              value={String(metrics.wpm ?? '—')}
              status={metrics.wpm == null ? 'neutral' : metrics.wpm >= 130 && metrics.wpm <= 160 ? 'good' : metrics.wpm >= 100 && metrics.wpm <= 200 ? 'ok' : 'bad'}
              hint="Ziel: 130–160"
            />
            <MetricTile
              label="Füllwörter"
              value={String(metrics.filler_count ?? 0)}
              status={(metrics.filler_count ?? 0) <= 3 ? 'good' : (metrics.filler_count ?? 0) <= 7 ? 'ok' : 'bad'}
              hint="Ziel: ≤3"
            />
            <MetricTile
              label="Abschwächungen"
              value={String(metrics.hedging_count ?? 0)}
              status={(metrics.hedging_count ?? 0) <= 2 ? 'good' : (metrics.hedging_count ?? 0) <= 5 ? 'ok' : 'bad'}
              hint="Ziel: ≤2"
            />
            <MetricTile
              label="Lange Pausen"
              value={String(metrics.long_pauses ?? 0)}
              status={(metrics.long_pauses ?? 0) <= 1 ? 'good' : (metrics.long_pauses ?? 0) <= 4 ? 'ok' : 'bad'}
              hint="Ziel: ≤1"
            />
            <MetricTile
              label="Wort-Latenz"
              value={`${metrics.first_word_latency ?? 0}s`}
              status={(metrics.first_word_latency ?? 0) <= 2 ? 'good' : (metrics.first_word_latency ?? 0) <= 4 ? 'ok' : 'bad'}
              hint="Ziel: ≤2s"
            />
            <MetricTile label="Wörter" value={String(metrics.word_count ?? 0)} />
          </div>
        </section>
      )}
    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

async function AudioPlayerSection({
  filePath,
  words,
}: {
  recordingId: string
  filePath: string
  words?: { word: string; start: number; end: number }[]
}) {
  const supabase = createServerClient()
  const { data: signed } = await supabase.storage
    .from('recordings')
    .createSignedUrl(filePath, 3600)
  const { data: pub } = supabase.storage.from('recordings').getPublicUrl(filePath)
  const url = signed?.signedUrl ?? pub?.publicUrl
  if (!url) return null

  return (
    <section>
      {words && words.length > 0 ? (
        <TranscriptPlayer audioSrc={url} words={words} />
      ) : (
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <audio controls src={url} className="w-full" />
      )}
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

function MetricTile({ label, value, status = 'neutral', hint }: { label: string; value: string; status?: 'good' | 'ok' | 'bad' | 'neutral'; hint?: string }) {
  const valueColor =
    status === 'good' ? 'text-green-600 dark:text-green-400' :
    status === 'ok' ? 'text-yellow-600 dark:text-yellow-400' :
    status === 'bad' ? 'text-red-600 dark:text-red-400' :
    ''
  const dotColor =
    status === 'good' ? 'bg-green-500' :
    status === 'ok' ? 'bg-yellow-500' :
    status === 'bad' ? 'bg-red-500' :
    'bg-transparent'

  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className={`text-xl font-bold tabular-nums ${valueColor}`}>{value}</div>
      <div className="text-muted-foreground mt-0.5 text-xs">{label}</div>
      {hint && (
        <div className="mt-1 flex items-center justify-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          <span className="text-muted-foreground text-[10px]">{hint}</span>
        </div>
      )}
    </div>
  )
}
