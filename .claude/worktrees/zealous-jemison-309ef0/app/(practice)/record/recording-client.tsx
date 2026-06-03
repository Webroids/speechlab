'use client' // needs useSearchParams, useRouter, upload state

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { ArrowLeft, Loader2 } from 'lucide-react'

import { uploadRecording } from '@/actions/upload-recording'
import { AudioRecorder } from '@/components/recorder/audio-recorder'

type UploadState = 'idle' | 'uploading' | 'error'

export function RecordingClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const topic = searchParams.get('topic') ?? 'Freies Thema'
  const duration = parseInt(searchParams.get('duration') ?? '60', 10)

  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Keyboard shortcuts: Space = pause/resume, Esc = cancel
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Escape') {
        document.querySelector<HTMLButtonElement>('[aria-label="Abbrechen"]')?.click()
      }
      if (e.key === ' ') {
        e.preventDefault()
        const pauseBtn = document.querySelector<HTMLButtonElement>('[aria-label="Pausieren"], [aria-label="Fortsetzen"]')
        pauseBtn?.click()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  async function handleComplete(blob: Blob, durationSec: number) {
    setUploadState('uploading')
    setErrorMsg('')

    const formData = new FormData()
    formData.append('blob', blob)
    formData.append('topic_text', topic)
    formData.append('duration_target', String(duration))
    formData.append('duration_actual', String(durationSec))

    try {
      const { id } = await uploadRecording(formData)
      router.push(`/feedback/${id}`)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
      setUploadState('error')
    }
  }

  function handleCancel() {
    router.push('/')
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mt-1 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl leading-snug font-semibold">{topic}</h1>
      </div>

      {/* Recorder or upload state */}
      <div className="flex flex-1 flex-col items-center justify-center">
        {uploadState === 'uploading' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="text-primary h-12 w-12 animate-spin" />
            <p className="text-lg font-medium">Lade hoch…</p>
            <p className="text-muted-foreground text-sm">Bitte warten, die Aufnahme wird verarbeitet.</p>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-destructive font-medium">Fehler: {errorMsg}</p>
            <button
              className="text-primary text-sm underline"
              onClick={() => setUploadState('idle')}
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {uploadState === 'idle' && (
          <AudioRecorder
            targetDurationSec={duration}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
