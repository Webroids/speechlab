'use server'

import { createServerClient } from '@/lib/supabase/server'
import { processRecording } from './process-recording'

interface UploadResult {
  id: string
}

export async function uploadRecording(formData: FormData): Promise<UploadResult> {
  const blob = formData.get('blob')
  const topicText = formData.get('topic_text')
  const durationTarget = formData.get('duration_target')
  const durationActual = formData.get('duration_actual')
  const frameworkHint = formData.get('framework_hint')

  if (!(blob instanceof Blob) || typeof topicText !== 'string' || !durationTarget || !durationActual) {
    throw new Error('Invalid form data')
  }

  const supabase = createServerClient()

  // 1. Upload to storage
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm'
  const filePath = `${crypto.randomUUID()}.${ext}`

  const arrayBuffer = await blob.arrayBuffer()
  const { error: storageError } = await supabase.storage
    .from('recordings')
    .upload(filePath, arrayBuffer, {
      contentType: blob.type || 'audio/webm',
      upsert: false,
    })

  if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`)

  // 2. Create DB row
  const { data: recording, error: dbError } = await supabase
    .from('recordings')
    .insert({
      topic_text: topicText,
      type: 'audio',
      duration_target: parseInt(String(durationTarget), 10),
      duration_actual: parseInt(String(durationActual), 10),
      file_path: filePath,
      status: 'recorded',
      framework_hint: typeof frameworkHint === 'string' && frameworkHint ? frameworkHint : null,
    })
    .select('id')
    .single()

  if (dbError || !recording) throw new Error(`DB insert failed: ${dbError?.message}`)

  // 3. Fire-and-forget processing (works in both dev and Vercel)
  void processRecording(recording.id).catch((err: unknown) => {
    console.error(`process-recording failed for ${recording.id}:`, err)
  })

  return { id: recording.id }
}
