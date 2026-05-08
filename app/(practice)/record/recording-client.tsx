'use client' // needs useSearchParams, useRouter, upload state

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { ArrowLeft, Loader2 } from 'lucide-react'

import { uploadRecording } from '@/actions/upload-recording'
import { AudioRecorder } from '@/components/recorder/audio-recorder'
import { getFramework } from '@/lib/frameworks'

type UploadState = 'idle' | 'uploading' | 'error'

export function RecordingClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const topic = searchParams.get('topic') ?? 'Freies Thema'
  const duration = parseInt(searchParams.get('duration') ?? '60', 10)
  const frameworkHint = searchParams.get('framework') ?? ''
  const framework = frameworkHint ? getFramework(frameworkHint) : null

  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const isActiveRef = useRef(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Block browser unload while recording is active
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (isActiveRef.current) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

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
    if (frameworkHint) formData.append('framework_hint', frameworkHint)

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

  function handleBack() {
    if (isActiveRef.current) {
      const ok = window.confirm('Aufnahme läuft noch — wirklich abbrechen?')
      if (!ok) return
    }
    router.push('/')
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground mt-1 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl leading-snug font-semibold">{topic}</h1>
      </div>

      {/* Framework cheat sheet */}
      {framework && (
        <div className="bg-card rounded-xl border p-4">
          <p className="text-primary mb-2 text-xs font-semibold uppercase tracking-wide">
            Framework: {framework.name}
          </p>
          <ol className="space-y-1">
            {framework.structure.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="bg-primary/15 text-primary flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-bold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

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
            onRecordingStateChange={(active) => { isActiveRef.current = active }}
          />
        )}
      </div>
    </div>
  )
}
