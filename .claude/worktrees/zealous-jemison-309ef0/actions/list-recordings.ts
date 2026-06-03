'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { FeedbackRow, Recording } from '@/types/db'

export interface RecordingWithScore extends Recording {
  overall_score: number | null
}

export async function listRecent(limit = 5): Promise<RecordingWithScore[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('recordings')
    .select('*, feedback(overall_score)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => {
    const rawFeedback = row.feedback as unknown
    const feedback = (Array.isArray(rawFeedback) ? rawFeedback[0] : rawFeedback) as Pick<FeedbackRow, 'overall_score'> | null
    return {
      ...row,
      overall_score: feedback?.overall_score ?? null,
    }
  })
}

export async function listAll(): Promise<RecordingWithScore[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('recordings')
    .select('*, feedback(overall_score)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => {
    const rawFeedback = row.feedback as unknown
    const feedback = (Array.isArray(rawFeedback) ? rawFeedback[0] : rawFeedback) as Pick<FeedbackRow, 'overall_score'> | null
    return {
      ...row,
      overall_score: feedback?.overall_score ?? null,
    }
  })
}
