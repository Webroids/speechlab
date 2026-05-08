'use server'

import { revalidatePath } from 'next/cache'

import { createServerClient } from '@/lib/supabase/server'

export async function saveNote(recordingId: string, text: string) {
  const supabase = createServerClient()
  await supabase.from('notes').upsert({ recording_id: recordingId, text, updated_at: new Date().toISOString() })
  revalidatePath(`/feedback/${recordingId}`)
}

export async function addTag(recordingId: string, label: string) {
  const trimmed = label.trim()
  if (!trimmed) return
  const supabase = createServerClient()
  await supabase.from('tags').insert({ recording_id: recordingId, label: trimmed })
  revalidatePath(`/feedback/${recordingId}`)
}

export async function removeTag(tagId: string, recordingId: string) {
  const supabase = createServerClient()
  await supabase.from('tags').delete().eq('id', tagId)
  revalidatePath(`/feedback/${recordingId}`)
}
