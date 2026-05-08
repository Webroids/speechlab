'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { createServerClient } from '@/lib/supabase/server'

export async function deleteRecording(recordingId: string): Promise<void> {
  const supabase = createServerClient()

  // Get file path first so we can delete from storage
  const { data: rec } = await supabase
    .from('recordings')
    .select('file_path')
    .eq('id', recordingId)
    .single()

  if (rec?.file_path) {
    await supabase.storage.from('recordings').remove([rec.file_path])
  }

  // Cascade-delete via FK: tags, notes, transcripts, metrics, feedback all reference recording_id
  await supabase.from('recordings').delete().eq('id', recordingId)

  revalidatePath('/library')
  revalidatePath('/')
  redirect('/library')
}
