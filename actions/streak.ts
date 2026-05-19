'use server'

import { createSessionClient } from '@/lib/supabase/session'

export interface StreakData {
  currentStreak: number
  totalSessions: number
  todayDone: boolean
  weeklyCount: number
}

export async function getStreak(): Promise<StreakData> {
  const supabase = await createSessionClient()

  const { data } = await supabase
    .from('recordings')
    .select('created_at')
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(200)

  if (!data || data.length === 0) {
    return { currentStreak: 0, totalSessions: data?.length ?? 0, todayDone: false, weeklyCount: 0 }
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

  // Count sessions in the current Mon–Sun week
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const weeklyCount = data.filter((r) => new Date(r.created_at) >= monday).length

  return { currentStreak: streak, totalSessions: data.length, todayDone, weeklyCount }
}
