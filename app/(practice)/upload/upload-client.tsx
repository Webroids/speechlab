'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ArrowLeft, Check, FileAudio, FileVideo, Loader2, Upload } from 'lucide-react'

import { uploadRecording } from '@/actions/upload-recording'

type RecordingMode = 'conversation' | 'presentation'

const MAX_FILE_BYTES = 24 * 1024 * 1024 // 24 MB

function getFileDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const el = file.type.startsWith('video')
      ? document.createElement('video')
      : document.createElement('audio')
    el.preload = 'metadata'
    el.src = url
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(el.duration)
    }
    el.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Dauer konnte nicht gelesen werden'))
    }
  })
}

function formatDuration(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return '—'
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return m > 0 ? `${m}:${String(s).padStart(2, '0')} Min.` : `${s}s`
}

const MODES: { id: RecordingMode; label: string; desc: string; limit: string }[] = [
  {
    id: 'conversation',
    label: 'Gespräch / Übung',
    desc: 'Kurze Antwort, Q&A oder Übing',
    limit: 'bis 5 Minuten',
  },
  {
    id: 'presentation',
    label: 'Präsentation / Pitch',
    desc: 'Vortrag, Pitch oder Rede',
    limit: 'bis 20 Minuten',
  },
]

export function UploadClient() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [durationError, setDurationError] = useState<string | null>(null)
  const [topic, setTopic] = useState('')
  const [mode, setMode] = useState<RecordingMode>('conversation')
  const [sizeError, setSizeError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  async function handleFile(f: File) {
    setSizeError(null)
    setDurationError(null)
    setDuration(null)

    if (f.size > MAX_FILE_BYTES) {
      setSizeError('Datei zu groß (max. 24 MB). Komprimiere die Aufnahme zuerst.')
      return
    }

    setFile(f)

    try {
      const d = await getFileDuration(f)
      setDuration(d)
    } catch {
      setDurationError('Dauer konnte nicht automatisch erkannt werden.')
    }
  }

  const onInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) await handleFile(f)
  }, [])

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) await handleFile(f)
  }, [])

  const isVideo = file?.type.startsWith('video') ?? false
  const maxSec = mode === 'conversation' ? 5 * 60 : 20 * 60
  const durationWarning =
    duration !== null && duration > maxSec
      ? mode === 'conversation'
        ? 'Länger als 5 Minuten — erwäge den Modus "Präsentation / Pitch".'
        : 'Länger als 20 Minuten — Whisper-Limit könnte überschritten werden.'
      : null

  const canSubmit = file !== null && !sizeError && topic.trim().length >= 3 && !uploading

  async function handleSubmit() {
    if (!file || !canSubmit) return
    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('blob', file)
      formData.append('topic_text', topic.trim())
      const dur = Math.round(duration ?? 60)
      formData.append('duration_target', String(dur))
      formData.append('duration_actual', String(dur))
      formData.append('recording_type', isVideo ? 'video' : 'audio')
      formData.append('recording_mode', mode)

      const { id } = await uploadRecording(formData)
      router.push(`/feedback/${id}`)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 active:scale-95 dark:hover:bg-white/10"
          style={{ color: 'var(--muted-foreground)', border: '1px solid var(--vl-hairline)' }}
          aria-label="Zurück"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="label-caps mb-0.5">AUFNAHME HOCHLADEN</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Bestehende Aufnahme{' '}
            <em style={{ color: 'var(--muted-foreground)' }}>analysieren.</em>
          </h1>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* ── File picker ── */}
        <section>
          <label className="label-caps mb-2.5 block">Datei</label>

          {/* Drop zone */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center transition-all duration-150"
            style={{
              background: dragging ? 'var(--vl-coral-bg)' : file ? 'var(--card)' : 'var(--secondary)',
              border: dragging
                ? '1.5px dashed var(--vl-coral)'
                : file
                  ? '1px solid var(--vl-hairline)'
                  : '1.5px dashed var(--vl-hairline)',
              boxShadow: file ? 'var(--vl-inset)' : 'none',
            }}
          >
            {file ? (
              <>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--vl-coral-bg)' }}
                >
                  {isVideo
                    ? <FileVideo className="h-6 w-6" style={{ color: 'var(--vl-coral)' }} strokeWidth={1.75} />
                    : <FileAudio className="h-6 w-6" style={{ color: 'var(--vl-coral)' }} strokeWidth={1.75} />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ letterSpacing: '-0.01em' }}>
                    {file.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
                    <span className="vl-pill" style={{ background: 'var(--vl-coral-bg)', color: 'var(--vl-coral)' }}>
                      {isVideo ? 'Video' : 'Audio'}
                    </span>
                    {duration !== null && (
                      <span className="vl-pill" style={{ background: 'var(--vl-amber-bg)', color: 'var(--vl-amber)' }}>
                        {formatDuration(duration)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Andere Datei wählen
                </p>
              </>
            ) : (
              <>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--muted)' }}
                >
                  <Upload className="h-5 w-5" style={{ color: 'var(--muted-foreground)' }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-medium">Datei hierher ziehen</p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    oder tippen zum Auswählen · Audio & Video · max. 24 MB
                  </p>
                </div>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*"
            className="sr-only"
            onChange={onInputChange}
          />

          {sizeError && (
            <p className="mt-2 text-xs font-medium" style={{ color: 'var(--vl-coral)' }}>
              {sizeError}
            </p>
          )}
          {durationError && (
            <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {durationError}
            </p>
          )}
          {durationWarning && (
            <p className="mt-2 text-xs" style={{ color: 'var(--vl-amber)' }}>
              {durationWarning}
            </p>
          )}
        </section>

        {/* ── Topic ── */}
        <section>
          <label className="label-caps mb-2.5 block" htmlFor="upload-topic">
            Thema
          </label>
          <textarea
            id="upload-topic"
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Worüber handelt die Aufnahme?"
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              color: 'var(--foreground)',
              minHeight: '88px',
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Je konkreter das Thema, desto hilfreicher das Feedback.
          </p>
        </section>

        {/* ── Mode selection ── */}
        <section>
          <label className="label-caps mb-2.5 block">Aufnahmeart</label>
          <div className="space-y-2.5">
            {MODES.map((m) => {
              const active = mode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98]"
                  style={{
                    background: active ? 'var(--foreground)' : 'var(--card)',
                    color: active ? 'var(--background)' : 'var(--foreground)',
                    border: active ? '1.5px solid transparent' : '1px solid var(--vl-hairline)',
                    boxShadow: active ? 'none' : 'var(--vl-inset)',
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold" style={{ letterSpacing: '-0.01em' }}>
                      {m.label}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: active ? 'oklch(0.967 0.012 75 / 60%)' : 'var(--muted-foreground)' }}
                    >
                      {m.desc} · {m.limit}
                    </p>
                  </div>
                  {active && (
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'var(--vl-coral)', color: 'oklch(0.967 0.012 75)' }}
                    >
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>
      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-5"
        style={{
          background: 'linear-gradient(to top, var(--background) 70%, transparent)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1.5rem)',
          paddingTop: '2rem',
        }}
      >
        <div className="mx-auto max-w-lg space-y-2">
          {uploadError && (
            <p className="text-center text-xs font-medium" style={{ color: 'var(--vl-coral)' }}>
              {uploadError}
            </p>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Datei wird hochgeladen…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Analyse starten
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
