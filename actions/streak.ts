'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface StreakData {
  currentStreak: number
  totalSessions: number
  todayDone: boolean
}

export async function getStreak(): Promise<StreakData> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('recordings')
    .select('created_at')
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(200)

  if (!data || data.length === 0) {
    return { currentStreak: 0, totalSessions: data?.length ?? 0, todayDone: false }
  }

  // Bucket recordings by calendar date (local YYYY-MM-DD)
  const dates = new Set(data.map((r) => r.created_at.slice(0, 10)))
  const today = new Date().toISOString().slice(0, 10)
  const todayDone = dates.has(today)

  // Walk backwards from today counting consecutive days
  let streak = 0
  const cursor = new Date()
  // If today has no session yet, start streak count from yesterday
  if (!todayDone) cursor.setDate(cursor.getDate() - 1)

  while (true) {
    const d = cursor.toISOString().slice(0, 10)
    if (!dates.has(d)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return { currentStreak: streak, totalSessions: data.length, todayDone }
}
