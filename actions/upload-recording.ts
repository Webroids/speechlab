'use server'

import { after } from 'next/server'

import { createServerClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/session'
import { processRecording } from './process-recording'

interface UploadResult {
  id: string
}

export async function uploadRecording(formData: FormData): Promise<UploadResult> {
  const blob = formData.get('blob')
  const topicText = formData.get('topic_text')
  const topicCategory = formData.get('topic_category')
  const durationTarget = formData.get('duration_target')
  const durationActual = formData.get('duration_actual')
  const frameworkHint = formData.get('framework_hint')
  const voiceSamplesRaw = formData.get('voice_samples')
  const bodySamplesRaw = formData.get('body_samples')
  const recordingType = formData.get('recording_type')
  const recordingModeRaw = formData.get('recording_mode')

  if (!(blob instanceof Blob) || typeof topicText !== 'string' || !durationTarget || !durationActual) {
    throw new Error('Invalid form data')
  }

  const user = await getUser()
  if (!user) throw new Error('Unauthorized')

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
      topic_category: typeof topicCategory === 'string' && topicCategory ? topicCategory : null,
      voice_samples: typeof voiceSamplesRaw === 'string' && voiceSamplesRaw ? JSON.parse(voiceSamplesRaw) : null,
      body_samples: typeof bodySamplesRaw === 'string' && bodySamplesRaw ? JSON.parse(bodySamplesRaw) : null,
      type: (recordingType === 'video' ? 'video' : 'audio') as 'audio' | 'video',
      duration_target: parseInt(String(durationTarget), 10),
      duration_actual: parseInt(String(durationActual), 10),
      file_path: filePath,
      status: 'recorded',
      framework_hint: typeof frameworkHint === 'string' && frameworkHint ? frameworkHint : null,
      recording_mode: (recordingModeRaw === 'conversation' || recordingModeRaw === 'presentation') ? recordingModeRaw : null,
      user_id: user.id,
    })
    .select('id')
    .single()

  if (dbError || !recording) throw new Error(`DB insert failed: ${dbError?.message}`)

  // 3. Process after response is sent — after() is guaranteed to run post-response
  after(async () => {
    await processRecording(recording.id)
  })

  return { id: recording.id }
}
