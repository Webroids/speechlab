import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft, RotateCcw } from 'lucide-react'

import { createServerClient } from '@/lib/supabase/server'
import { formatDistanceToNow, formatDuration } from '@/lib/format'
import type { Feedback } from '@/lib/ai/feedback-schema'
import { FRAMEWORKS } from '@/lib/frameworks'
import type { Metrics, Transcript } from '@/types/db'
import { getRecentScores, getSubScoreTrends } from '@/actions/list-recordings'
import { BodyLanguageCard } from '@/components/body-language-card'
import { DeleteRecordingButton } from '@/components/delete-recording-button'
import { MiniSparkline } from '@/components/mini-sparkline'
import { NoteTagsEditor } from '@/components/notes-tags-editor'
import { ScoreSparkline } from '@/components/score-sparkline'
import { TranscriptPlayer } from '@/components/transcript-player'
import { VLArcGauge } from '@/components/vl-arc-gauge'
import { VLRing } from '@/components/vl-ring'
import { VoiceTimeline } from '@/components/voice-timeline'
import type { BodyAnalysisResult } from '@/components/recorder/body-analyzer'

import { FeedbackPolling } from './feedback-polling'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const [{ data: rec }, recentScores, subTrends] = await Promise.all([
    supabase
      .from('recordings')
      .select('*, transcripts(*), metrics(*), feedback(*), tags(*), notes(*)')
      .eq('id', id)
      .single(),
    getRecentScores(10),
    getSubScoreTrends(10),
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

  if (rec.status !== 'done' && rec.status !== 'error') {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-8">
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

  const repeatParams = new URLSearchParams({
    topic: rec.topic_text,
    duration: String(rec.duration_target),
  })
  if (rec.framework_hint) repeatParams.set('framework', rec.framework_hint)

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-5 py-8 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/library"
          className="mt-1 shrink-0 transition-opacity hover:opacity-60"
          style={{ color: 'var(--muted-foreground)' }}
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1
            className="font-display leading-snug"
            style={{ fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', letterSpacing: '-0.015em' }}
          >
            {rec.topic_text}
          </h1>
          <div className="mt-1.5 flex items-center gap-3">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {formatDistanceToNow(new Date(rec.created_at))} · {formatDuration(rec.duration_actual)}
            </p>
            <DeleteRecordingButton recordingId={id} />
          </div>
        </div>
      </div>

      {isError && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: 'oklch(0.65 0.22 25 / 10%)', color: 'oklch(0.65 0.22 25)' }}
        >
          Verarbeitung fehlgeschlagen. Du kannst die Aufnahme trotzdem anhören, aber kein Feedback ist verfügbar.
        </div>
      )}

      {feedback && (
        <>
          {/* Arc gauge -- overall score */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              boxShadow: 'var(--vl-inset)',
            }}
          >
            <VLArcGauge score={feedback.overall_score} width={260} stroke={14} gradientId={`arc-${id}`} />
            <p className="mt-4 text-sm leading-relaxed max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
              {feedback.one_sentence_summary}
            </p>
          </div>

          {/* CTAs -- immediately after score for fast action */}
          <div className="flex gap-3">
            <Link href={`/record?${repeatParams.toString()}`} className="flex-1">
              <button
                className="flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Nochmal üben
              </button>
            </Link>
            <Link href="/">
              <button
                className="flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition-opacity hover:opacity-80 active:scale-[0.98]"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--vl-hairline)',
                  color: 'var(--foreground)',
                }}
              >
                Neues Thema
              </button>
            </Link>
          </div>

          {/* Section break */}
          <div className="vl-section-break">
            <span className="label-caps">Was du gut gemacht hast</span>
          </div>

          {/* Strengths */}
          <ul className="space-y-2.5">
            {feedback.top_3_strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--vl-sage)', color: 'var(--background)' }}
                >
                  ✓
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>

          {/* Section break */}
          <div className="vl-section-break">
            <span className="label-caps">Wo du wachsen kannst</span>
          </div>

          {/* Improvements */}
          <ul className="space-y-3">
            {feedback.top_3_improvements.map((item, i) => (
              <li
                key={i}
                className="rounded-2xl p-4 text-sm space-y-2"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--vl-hairline)',
                }}
              >
                <p className="font-medium">{item.issue}</p>
                <blockquote
                  className="text-xs leading-relaxed italic pl-3"
                  style={{
                    borderLeft: '2px solid var(--vl-hairline-strong)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  „{item.example_from_transcript}"
                </blockquote>
                <p className="text-xs font-medium" style={{ color: 'var(--vl-coral)' }}>
                  → {item.better_alternative}
                </p>
              </li>
            ))}
          </ul>

          {/* Next drill */}
          <section
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'oklch(0.70 0.20 35 / 8%)',
              border: '1px solid oklch(0.70 0.20 35 / 20%)',
            }}
          >
            <p className="label-caps" style={{ color: 'var(--vl-coral)' }}>NÄCHSTE ÜBUNG</p>
            <p className="text-sm font-medium leading-snug">{feedback.next_drill}</p>
            {(() => {
              const drillParams = new URLSearchParams({ topic: feedback.next_drill, duration: String(rec.duration_target) })
              return (
                <Link
                  href={`/record?${drillParams.toString()}`}
                  className="flex items-center justify-center w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--vl-coral)', color: 'var(--background)' }}
                >
                  Jetzt üben →
                </Link>
              )
            })()}
          </section>

          {/* Section break */}
          <div className="vl-section-break">
            <span className="label-caps">Dimensionen</span>
          </div>

          {/* Sub-score rings grid */}
          <div className="grid grid-cols-2 gap-4">
            <SubCard
              title="Struktur"
              score={feedback.structure?.score ?? null}
              comment={feedback.structure?.comment ?? ''}
              detail={feedback.structure?.framework_detected ? `Framework: ${feedback.structure.framework_detected}` : undefined}
              trend={subTrends.map((t) => t.structure)}
            />
            <SubCard
              title="Klarheit"
              score={feedback.clarity?.score ?? null}
              comment={feedback.clarity?.comment ?? ''}
              trend={subTrends.map((t) => t.clarity)}
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
              trend={subTrends.map((t) => t.engagement)}
            />
          </div>

          {/* Framework suggestion */}
          <section
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
            }}
          >
            <p className="label-caps">FRAMEWORK-VORSCHLAG</p>
            <p
              className="font-display"
              style={{ fontSize: '1.375rem', letterSpacing: '-0.015em' }}
            >
              {feedback.framework_suggestion.name}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {feedback.framework_suggestion.why}
            </p>
            <blockquote
              className="text-sm italic pl-3 leading-relaxed"
              style={{
                borderLeft: '2px solid var(--vl-hairline-strong)',
                color: 'var(--muted-foreground)',
              }}
            >
              „{feedback.framework_suggestion.how_it_would_have_sounded}"
            </blockquote>
            {(() => {
              const fwId = FRAMEWORKS.find(
                (f) => f.name.toLowerCase() === feedback.framework_suggestion.name.toLowerCase()
              )?.id
              if (!fwId) return null
              const p = new URLSearchParams({ topic: rec.topic_text, duration: String(rec.duration_target), framework: fwId })
              return (
                <Link
                  href={`/record?${p.toString()}`}
                  className="flex items-center justify-center w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 mt-1"
                  style={{
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                  }}
                >
                  Mit diesem Framework üben →
                </Link>
              )
            })()}
          </section>
        </>
      )}

      {/* Section break */}
      <div className="vl-section-break">
        <span className="label-caps">Wiedergabe</span>
      </div>

      {/* Audio player */}
      <AudioPlayerSection recordingId={id} filePath={rec.file_path} words={transcript?.words as { word: string; start: number; end: number }[] | undefined} />

      {/* Voice timeline -- pitch + energy captured during recording */}
      {rec.voice_samples && (
        <VoiceTimeline
          samples={rec.voice_samples as { t: number; hz: number; rms: number }[]}
          durationSec={rec.duration_actual}
        />
      )}

      {/* Body language card -- video recordings only */}
      {rec.body_samples && (
        <BodyLanguageCard result={rec.body_samples as unknown as BodyAnalysisResult} />
      )}

      {/* Tags + Notes */}
      <section>
        <p className="label-caps mb-3">NOTIZEN & TAGS</p>
        <NoteTagsEditor
          recordingId={id}
          initialNote={noteText}
          initialTags={tags}
        />
      </section>

      {/* Metrics */}
      {metrics && (
        <section>
          <p className="label-caps mb-4">METRIKEN</p>
          <div className="grid grid-cols-3 gap-3">
            <MetricTile
              label="WPM"
              value={String(metrics.wpm ?? '--')}
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

      {/* Score trajectory */}
      <ScoreSparkline scores={recentScores} currentScore={feedback?.overall_score} />
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

function SubCard({
  title,
  score,
  comment,
  detail,
  trend,
}: {
  title: string
  score: number | null
  comment: string
  detail?: string
  trend?: (number | null)[]
}) {
  // Convert 0–10 score to 0–100 for the ring
  const ringScore = score !== null ? Math.round(score * 10) : 0
  const hasTrend = trend && trend.filter((v) => v !== null).length >= 2

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--vl-hairline)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="label-caps">{title}</span>
        <div className="flex items-center gap-2">
          {hasTrend && (
            <MiniSparkline values={trend!} color="var(--vl-coral)" width={40} height={20} max={10} />
          )}
          {score !== null && (
            <VLRing score={ringScore} size={40} stroke={3} />
          )}
        </div>
      </div>
      {detail && (
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{detail}</p>
      )}
      <p className="text-xs leading-relaxed">{comment}</p>
    </div>
  )
}

function MetricTile({
  label,
  value,
  status = 'neutral',
  hint,
}: {
  label: string
  value: string
  status?: 'good' | 'ok' | 'bad' | 'neutral'
  hint?: string
}) {
  const dotColor =
    status === 'good' ? 'var(--vl-sage)' :
    status === 'ok' ? 'var(--vl-amber)' :
    status === 'bad' ? 'var(--vl-coral)' :
    'transparent'

  const valueColor =
    status === 'good' ? 'var(--vl-sage)' :
    status === 'ok' ? 'var(--vl-amber)' :
    status === 'bad' ? 'var(--vl-coral)' :
    'var(--foreground)'

  return (
    <div
      className="rounded-2xl p-3 text-center"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--vl-hairline)',
      }}
    >
      <div
        className="font-display tabular-nums"
        style={{ fontSize: '1.375rem', lineHeight: 1, letterSpacing: '-0.02em', color: valueColor }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
      {hint && (
        <div className="mt-1.5 flex items-center justify-center gap-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: dotColor }}
          />
          <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{hint}</span>
        </div>
      )}
    </div>
  )
}
