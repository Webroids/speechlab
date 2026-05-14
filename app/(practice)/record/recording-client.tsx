'use client' // needs useSearchParams, useRouter, upload state

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Loader2, X } from 'lucide-react'

import { uploadRecording } from '@/actions/upload-recording'
import { AudioRecorder, type VoiceSample } from '@/components/recorder/audio-recorder'
import { analyzeBodyLanguage } from '@/components/recorder/body-analyzer'
import { VideoRecorder } from '@/components/recorder/video-recorder'
import { getFramework } from '@/lib/frameworks'

// Dark surface tokens (recording screen is always dark regardless of theme)
const D = {
  ink:     'oklch(0.967 0.012 75)',   // cream = dark-mode "foreground"
  muted:   'oklch(0.560 0.018 60)',   // darkMuted
  coral:   'oklch(0.70 0.20 35)',
  panel:   'oklch(0.140 0.012 55)',   // darkPanel
  hairline:'oklch(0.967 0.012 75 / 8%)',
}

type UploadState = 'idle' | 'uploading' | 'analyzing' | 'error'

export function RecordingClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const topic = searchParams.get('topic') ?? 'Freies Thema'
  const duration = parseInt(searchParams.get('duration') ?? '60', 10)
  const frameworkHint = searchParams.get('framework') ?? ''
  const topicCategory = searchParams.get('category') ?? ''
  const mode = searchParams.get('mode') ?? 'audio'   // 'audio' | 'video'
  const framework = frameworkHint ? getFramework(frameworkHint) : null

  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const isActiveRef = useRef(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (isActiveRef.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

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

  async function handleComplete(blob: Blob, durationSec: number, voiceSamples: VoiceSample[]) {
    const formData = new FormData()
    formData.append('blob', blob)
    formData.append('topic_text', topic)
    formData.append('duration_target', String(duration))
    formData.append('duration_actual', String(durationSec))
    formData.append('recording_type', mode)
    if (frameworkHint) formData.append('framework_hint', frameworkHint)
    if (topicCategory) formData.append('topic_category', topicCategory)
    if (voiceSamples.length > 0) formData.append('voice_samples', JSON.stringify(voiceSamples))

    // For video: run body language analysis before upload
    if (mode === 'video') {
      setUploadState('analyzing')
      setAnalyzeProgress(0)
      try {
        const bodyResult = await analyzeBodyLanguage(blob, (pct) => setAnalyzeProgress(pct))
        formData.append('body_samples', JSON.stringify(bodyResult))
      } catch (err) {
        console.warn('Body analysis failed (non-critical):', err)
        // non-critical — continue without body data
      }
    }

    setUploadState('uploading')
    setErrorMsg('')

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
      const ok = window.confirm('Aufnahme läuft noch -- wirklich abbrechen?')
      if (!ok) return
    }
    router.push('/')
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 pr-4">
          <p
            className="label-caps mb-2"
            style={{ color: D.muted }}
          >
            DEIN THEMA
          </p>
          <h1
            className="font-display leading-snug"
            style={{
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              letterSpacing: '-0.015em',
              color: D.ink,
            }}
          >
            {topic}
          </h1>
        </div>
        <button
          onClick={handleBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-60"
          style={{ background: D.hairline, color: D.muted }}
          aria-label="Zurück"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Framework cheat sheet */}
      {framework && (
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: D.panel,
            border: `1px solid ${D.hairline}`,
          }}
        >
          <p className="label-caps" style={{ color: D.coral }}>
            {framework.name} · CHEAT SHEET
          </p>
          <ol className="space-y-2">
            {framework.structure.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-bold text-[10px]"
                  style={{ background: D.coral, color: 'oklch(0.102 0.008 55)' }}
                >
                  {i + 1}
                </span>
                <span style={{ color: D.muted }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Recorder or upload state */}
      <div className="flex flex-1 flex-col items-center justify-center">
        {uploadState === 'analyzing' && (
          <div className="flex flex-col items-center gap-5 text-center w-full max-w-xs">
            <div className="text-3xl">🧠</div>
            <p className="text-lg font-medium" style={{ color: D.ink }}>Analysiere Körpersprache…</p>
            <p className="text-sm" style={{ color: D.muted }}>
              MediaPipe erkennt Gesicht, Mimik und Gestik
            </p>
            {/* Progress bar */}
            <div className="w-full rounded-full h-1.5" style={{ background: D.hairline }}>
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${analyzeProgress}%`, background: D.coral }}
              />
            </div>
            <p className="text-xs tabular-nums" style={{ color: D.muted }}>{analyzeProgress}%</p>
          </div>
        )}

        {uploadState === 'uploading' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2
              className="h-12 w-12 animate-spin"
              style={{ color: D.coral }}
            />
            <p className="text-lg font-medium" style={{ color: D.ink }}>Lade hoch…</p>
            <p className="text-sm" style={{ color: D.muted }}>
              Bitte warten, die Aufnahme wird verarbeitet.
            </p>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="font-medium" style={{ color: D.coral }}>Fehler: {errorMsg}</p>
            <button
              className="text-sm underline"
              style={{ color: D.muted }}
              onClick={() => setUploadState('idle')}
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {uploadState === 'idle' && mode === 'video' && (
          <VideoRecorder
            targetDurationSec={duration}
            onComplete={handleComplete}
            onCancel={handleCancel}
            onRecordingStateChange={(active) => { isActiveRef.current = active }}
          />
        )}

        {uploadState === 'idle' && mode !== 'video' && (
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
