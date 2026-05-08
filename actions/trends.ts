'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface TrendPoint {
  date: string
  wpm: number | null
  filler_ratio: number | null
  overall_score: number | null
}

export interface TopFiller {
  word: string
  count: number
}

export async function getTrends(): Promise<TrendPoint[]> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('recordings')
    .select('created_at, metrics(wpm, filler_ratio), feedback(overall_score)')
    .eq('status', 'done')
    .order('created_at', { ascending: true })
    .limit(50)

  if (!data) return []

  return data.map((row) => {
    const rawMetrics = row.metrics as unknown
    const metrics = (Array.isArray(rawMetrics) ? rawMetrics[0] : rawMetrics) as { wpm: number | null; filler_ratio: number | null } | null
    const rawFb = row.feedback as unknown
    const fb = (Array.isArray(rawFb) ? rawFb[0] : rawFb) as { overall_score: number | null } | null

    const d = new Date(row.created_at)
    const date = `${d.getDate()}.${d.getMonth() + 1}`

    return {
      date,
      wpm: metrics?.wpm ? Math.round(metrics.wpm) : null,
      filler_ratio: metrics?.filler_ratio ? Math.round(metrics.filler_ratio * 100) / 100 : null,
      overall_score: fb?.overall_score ?? null,
    }
  })
}

export async function getTopFillers(): Promise<TopFiller[]> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('transcripts')
    .select('words')
    .limit(100)

  if (!data) return []

  const counts: Record<string, number> = {}
  const fillerWords = ['ähm', 'äh', 'also', 'halt', 'irgendwie', 'sozusagen', 'quasi', 'ne', 'eigentlich', 'ja', 'mhm', 'naja']

  for (const row of data) {
    const words = row.words as { word: string }[] | null
    if (!words) continue
    for (const w of words) {
      const lower = w.word.toLowerCase().replace(/[^a-zäöü]/g, '')
      if (fillerWords.includes(lower)) {
        counts[lower] = (counts[lower] ?? 0) + 1
      }
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }))
}
