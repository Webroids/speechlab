'use server'

import { generateFeedback } from '@/lib/ai/claude'
import { transcribe } from '@/lib/ai/whisper'
import { computeMetrics } from '@/lib/analysis/metrics'
import { createServerClient } from '@/lib/supabase/server'
import type { WhisperSegment, WhisperWord } from '@/types/db'

export async function processRecording(recordingId: string): Promise<void> {
  const supabase = createServerClient()

  async function setStatus(status: string) {
    await supabase.from('recordings').update({ status }).eq('id', recordingId)
  }

  try {
    // 1. Load recording row
    const { data: rec, error: recErr } = await supabase
      .from('recordings')
      .select('*')
      .eq('id', recordingId)
      .single()

    if (recErr || !rec) throw new Error(`Recording not found: ${recErr?.message}`)

    // 2. Transcribe
    await setStatus('transcribing')

    const { data: fileData, error: fileErr } = await supabase.storage
      .from('recordings')
      .download(rec.file_path)

    if (fileErr || !fileData) throw new Error(`Storage download failed: ${fileErr?.message}`)

    const arrayBuffer = await fileData.arrayBuffer()
    const mimeType = rec.file_path.endsWith('.mp4') ? 'audio/mp4' : 'audio/webm'

    const whisperResult = await transcribe(arrayBuffer, mimeType)

    await supabase.from('transcripts').upsert({
      recording_id: recordingId,
      text: whisperResult.text,
      words: whisperResult.words as unknown as WhisperWord[],
      segments: whisperResult.segments as unknown as WhisperSegment[],
    })

    // 3. Compute metrics
    await setStatus('analyzing')

    const computed = computeMetrics(whisperResult.words, rec.duration_actual)

    await supabase.from('metrics').upsert({
      recording_id: recordingId,
      ...computed,
    })

    // 4. Generate Claude feedback
    let feedbackData: Awaited<ReturnType<typeof generateFeedback>> | null = null
    let feedbackError: string | null = null

    try {
      feedbackData = await generateFeedback({
        topic: rec.topic_text,
        transcript: whisperResult.text,
        metrics: computed,
        durationSec: rec.duration_actual,
        frameworkHint: rec.framework_hint,
        mode: rec.recording_mode === 'presentation' ? 'presentation' : 'conversation',
      })
    } catch (err) {
      feedbackError = err instanceof Error ? err.message : String(err)
    }

    if (feedbackData) {
      await supabase.from('feedback').upsert({
        recording_id: recordingId,
        overall_score: feedbackData.overall_score,
        summary: feedbackData.one_sentence_summary,
        data: feedbackData as unknown as Record<string, unknown>,
        model: 'claude-sonnet-4-6',
      })
      await supabase
        .from('recordings')
        .update({ status: 'done', processed_at: new Date().toISOString() })
        .eq('id', recordingId)
    } else {
      // Save error info so feedback screen can display it
      await supabase.from('feedback').upsert({
        recording_id: recordingId,
        overall_score: null,
        summary: null,
        data: { error: feedbackError },
        model: 'claude-sonnet-4-6',
      })
      await supabase
        .from('recordings')
        .update({ status: 'error', processed_at: new Date().toISOString() })
        .eq('id', recordingId)
    }
  } catch (err) {
    console.error(`processRecording error [${recordingId}]:`, err)
    await supabase
      .from('recordings')
      .update({ status: 'error' })
      .eq('id', recordingId)
  }
}

export async function getRecordingStatus(recordingId: string): Promise<{
  status: string
  overallScore: number | null
} | null> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('recordings')
    .select('status, feedback(overall_score)')
    .eq('id', recordingId)
    .single()

  if (!data) return null

  const rawFb = data.feedback as unknown
  const feedback = (Array.isArray(rawFb) ? rawFb[0] : rawFb) as { overall_score: number | null } | null
  return {
    status: data.status,
    overallScore: feedback?.overall_score ?? null,
  }
}
