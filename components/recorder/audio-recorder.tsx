'use client' // needs MediaRecorder API + browser timers

import { useCallback, useEffect, useRef, useState } from 'react'

import { Mic, Pause, Play, Square, X } from 'lucide-react'

import { cn } from '@/lib/utils'

// ── Live waveform ─────────────────────────────────────────────────────────────

const BAR_COUNT = 28

function LiveWaveform({ analyser, active }: { analyser: AnalyserNode | null; active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(0.05))
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!analyser || !active) {
      setBars(Array(BAR_COUNT).fill(0.05))
      return
    }

    // Capture as non-null local for closure
    const node = analyser
    const data = new Uint8Array(node.frequencyBinCount)

    function tick() {
      node.getByteFrequencyData(data)
      // Sample BAR_COUNT evenly-spaced bins from the lower 60% (speech range)
      const usable = Math.floor(data.length * 0.6)
      const step = Math.max(1, Math.floor(usable / BAR_COUNT))
      const next = Array.from({ length: BAR_COUNT }, (_, i) => {
        const val = data[i * step] ?? 0
        return Math.max(0.05, val / 255)
      })
      setBars(next)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [analyser, active])

  const coral = 'oklch(0.70 0.20 35)'
  const ink = 'oklch(0.967 0.012 75)'

  return (
    <div className="flex h-12 w-full items-end justify-center gap-[2px]">
      {bars.map((v, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            height: `${Math.round(v * 100)}%`,
            minHeight: 3,
            background: active ? coral : ink,
            opacity: active ? 0.9 : 0.18,
            transition: 'height 80ms ease, background 0.3s',
          }}
        />
      ))}
    </div>
  )
}

type RecorderState = 'idle' | 'countdown' | 'recording' | 'paused' | 'stopped'

interface AudioRecorderProps {
  targetDurationSec: number
  onComplete: (blob: Blob, durationSec: number) => void
  onCancel: () => void
  onRecordingStateChange?: (isActive: boolean) => void
}

function detectSupportedMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ]
  for (const mime of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
      return mime
    }
  }
  return ''
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioRecorder({ targetDurationSec, onComplete, onCancel, onRecordingStateChange }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [permissionError, setPermissionError] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedElapsedRef = useRef<number>(0)
  const elapsedAtStop = useRef<number>(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    startTimeRef.current = Date.now() - pausedElapsedRef.current * 1000
    intervalRef.current = setInterval(() => {
      const newElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(newElapsed)
    }, 250)
  }, [stopTimer])

  const stopRecording = useCallback(
    (cancelled = false) => {
      elapsedAtStop.current = elapsed
      stopTimer()
      const mr = mediaRecorderRef.current
      if (mr && mr.state !== 'inactive') {
        if (cancelled) {
          mr.ondataavailable = null
          mr.onstop = null
        }
        mr.stop()
      }
      streamRef.current?.getTracks().forEach((t) => t.stop())
      analyserRef.current = null
      audioCtxRef.current?.close().catch(() => {})
      audioCtxRef.current = null
      onRecordingStateChange?.(false)
      if (cancelled) {
        chunksRef.current = []
        setState('idle')
        onCancel()
      }
    },
    [stopTimer, onCancel, onRecordingStateChange],
  )

  // Auto-stop when target reached
  useEffect(() => {
    if (elapsed >= targetDurationSec && state === 'recording') {
      stopRecording(false)
    }
  }, [elapsed, targetDurationSec, state, stopRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      analyserRef.current = null
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [stopTimer])

  async function startWithCountdown() {
    setPermissionError(false)
    chunksRef.current = []
    pausedElapsedRef.current = 0
    setElapsed(0)

    // Request mic permission before countdown so user sees it once
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setPermissionError(true)
      return
    }
    streamRef.current = stream

    // Wire up AnalyserNode for live waveform
    try {
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      ctx.createMediaStreamSource(stream).connect(analyser)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
    } catch {
      // non-critical: waveform just won't animate
    }

    // 3-2-1 countdown
    setState('countdown')
    setCountdown(3)
    await new Promise<void>((resolve) => {
      let n = 3
      const tick = setInterval(() => {
        n -= 1
        if (n <= 0) {
          clearInterval(tick)
          resolve()
        } else {
          setCountdown(n)
        }
      }, 1000)
    })

    const mimeType = detectSupportedMimeType()
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    mediaRecorderRef.current = mr

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType || 'audio/webm',
      })
      const duration = Math.max(1, elapsedAtStop.current)
      onComplete(blob, duration)
    }

    mr.start(3000)
    setState('recording')
    onRecordingStateChange?.(true)
    startTimer()
  }

  function pauseResume() {
    const mr = mediaRecorderRef.current
    if (!mr) return

    if (state === 'recording') {
      mr.pause()
      pausedElapsedRef.current = elapsed
      stopTimer()
      setState('paused')
    } else if (state === 'paused') {
      mr.resume()
      setState('recording')
      startTimer()
    }
  }

  const remaining = Math.max(0, targetDurationSec - elapsed)
  const progress = Math.min(1, elapsed / targetDurationSec)
  const nearEnd = remaining <= 10 && state === 'recording'
  const isCountdown = state === 'countdown'

  // VL dark surface tokens -- recorder is always on dark background
  const ink = 'oklch(0.967 0.012 75)'
  const muted = 'oklch(0.560 0.018 60)'
  const coral = 'oklch(0.70 0.20 35)'
  const panel = 'oklch(0.967 0.012 75 / 8%)'
  const progressColor = nearEnd ? 'oklch(0.65 0.22 25)' : coral
  const circumference = 2 * Math.PI * 62

  if (permissionError) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="text-5xl">🎙️</div>
        <p className="font-medium" style={{ color: coral }}>Mikrofon-Zugriff verweigert</p>
        <p className="text-sm" style={{ color: muted }}>
          Bitte erlaube den Mikrofon-Zugriff in deinen Browser-Einstellungen und lade die Seite neu.
        </p>
        <button
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium"
          style={{ border: `1px solid ${panel}`, color: ink }}
        >
          Zurück
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* Countdown overlay */}
      {isCountdown && (
        <div className="flex flex-col items-center gap-4">
          {/* Radial glow */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute rounded-full"
              style={{
                width: 260, height: 260,
                background: `radial-gradient(circle, oklch(0.72 0.13 35 / 0.15), transparent 70%)`,
              }}
            />
            <span
              className="font-display relative tabular-nums"
              style={{ fontSize: 140, lineHeight: 1, letterSpacing: '-0.05em', color: ink }}
            >
              {countdown}
            </span>
          </div>
          <span
            className="font-display"
            style={{ fontSize: '1.25rem', fontStyle: 'italic', color: muted, letterSpacing: '-0.01em' }}
          >
            Gleich geht&apos;s los…
          </span>
        </div>
      )}

      {!isCountdown && (
        <>
          {/* Circular progress ring + mic button */}
          <div className="relative flex items-center justify-center">
            <svg className="absolute" width={160} height={160} viewBox="0 0 160 160">
              {/* Track */}
              <circle
                cx={80} cy={80} r={70}
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                className="opacity-10"
                style={{ color: ink }}
              />
              {/* Progress */}
              <circle
                cx={80} cy={80} r={70}
                fill="none"
                stroke={progressColor}
                strokeWidth={4}
                strokeDasharray={circumference * (80 / 62) /* scale for r=70 */}
                strokeDashoffset={(2 * Math.PI * 70) * (1 - progress)}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s' }}
              />
            </svg>

            <button
              onClick={state === 'idle' ? startWithCountdown : undefined}
              className={cn(
                'relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300',
                state === 'idle' && 'hover:scale-105 cursor-pointer',
                nearEnd && 'animate-pulse',
              )}
              style={{
                background: state === 'idle'
                  ? coral
                  : state === 'recording'
                    ? 'oklch(0.65 0.22 25 / 15%)'
                    : panel,
                color: state === 'recording' ? 'oklch(0.65 0.22 25)' : ink,
              }}
              aria-label={state === 'idle' ? 'Aufnahme starten' : undefined}
            >
              <Mic className="h-10 w-10" />
              {state === 'recording' && (
                <span
                  className="absolute right-3 top-3 h-2.5 w-2.5 animate-pulse rounded-full"
                  style={{ background: coral }}
                />
              )}
            </button>
          </div>

          {/* Live waveform */}
          <LiveWaveform analyser={analyserRef.current} active={state === 'recording'} />

          {/* Timer */}
          <div className="text-center">
            <div
              className="font-display tabular-nums"
              style={{
                fontSize: '3.5rem',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: nearEnd ? 'oklch(0.65 0.22 25)' : ink,
              }}
            >
              {formatTime(elapsed)}
            </div>
            <div className="mt-2 text-sm" style={{ color: muted }}>
              {state === 'idle' && 'Tippe auf das Mikrofon'}
              {state === 'recording' && `Noch ${formatTime(remaining)}`}
              {state === 'paused' && 'Pausiert'}
            </div>
          </div>

          {/* Controls */}
          {state !== 'idle' && (
            <div className="flex gap-3">
              {/* Cancel */}
              <button
                onClick={() => stopRecording(true)}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-opacity hover:opacity-70"
                style={{ background: panel, color: muted }}
                aria-label="Abbrechen"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Pause / Resume */}
              <button
                onClick={pauseResume}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-opacity hover:opacity-70"
                style={{ background: panel, color: ink }}
                aria-label={state === 'paused' ? 'Fortsetzen' : 'Pausieren'}
              >
                {state === 'paused' ? (
                  <Play className="h-5 w-5" />
                ) : (
                  <Pause className="h-5 w-5" />
                )}
              </button>

              {/* Stop & save */}
              <button
                onClick={() => stopRecording(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full transition-opacity hover:opacity-90"
                style={{ background: ink, color: 'oklch(0.102 0.008 55)' }}
                aria-label="Stoppen und speichern"
              >
                <Square className="h-5 w-5 fill-current" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
