'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { FeedbackRow, Recording } from '@/types/db'

export interface RecordingWithScore extends Recording {
  overall_score: number | null
  framework_hint: string | null
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
    const raw = row.feedback as unknown
    const feedback = (Array.isArray(raw) ? raw[0] : raw) as Pick<FeedbackRow, 'overall_score'> | null
    return {
      ...row,
      overall_score: feedback?.overall_score ?? null,
    }
  })
}

export async function getRecentScores(limit = 10): Promise<{ date: string; score: number }[]> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('recordings')
    .select('created_at, feedback(overall_score)')
    .eq('status', 'done')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (!data) return []

  return data
    .map((row) => {
      const raw = row.feedback as unknown
      const fb = (Array.isArray(raw) ? raw[0] : raw) as Pick<FeedbackRow, 'overall_score'> | null
      return { date: row.created_at.slice(5, 10), score: fb?.overall_score ?? null }
    })
    .filter((r): r is { date: string; score: number } => r.score !== null)
}

export interface SubScoreTrend {
  date: string
  structure: number | null
  clarity: number | null
  engagement: number | null
}

export async function getSubScoreTrends(limit = 10): Promise<SubScoreTrend[]> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('recordings')
    .select('created_at, feedback(data)')
    .eq('status', 'done')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (!data) return []

  return data.map((row) => {
    const raw = row.feedback as unknown
    const fb = (Array.isArray(raw) ? raw[0] : raw) as { data?: Record<string, unknown> } | null
    const d = fb?.data as Record<string, Record<string, number> | undefined> | undefined
    return {
      date: row.created_at.slice(5, 10),
      structure: d?.structure?.score ?? null,
      clarity: d?.clarity?.score ?? null,
      engagement: d?.engagement?.score ?? null,
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
    const raw = row.feedback as unknown
    const feedback = (Array.isArray(raw) ? raw[0] : raw) as Pick<FeedbackRow, 'overall_score'> | null
    return {
      ...row,
      overall_score: feedback?.overall_score ?? null,
    }
  })
}
