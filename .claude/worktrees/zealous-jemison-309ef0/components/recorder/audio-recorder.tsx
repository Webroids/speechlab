'use client' // needs MediaRecorder API + browser timers

import { useCallback, useEffect, useRef, useState } from 'react'

import { Mic, Pause, Play, Square, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped'

interface AudioRecorderProps {
  targetDurationSec: number
  onComplete: (blob: Blob, durationSec: number) => void
  onCancel: () => void
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

export function AudioRecorder({ targetDurationSec, onComplete, onCancel }: AudioRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [permissionError, setPermissionError] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedElapsedRef = useRef<number>(0)
  const elapsedAtStop = useRef<number>(0)

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
      if (cancelled) {
        chunksRef.current = []
        setState('idle')
        onCancel()
      }
    },
    [stopTimer, onCancel],
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
    }
  }, [stopTimer])

  async function startRecording() {
    setPermissionError(false)
    chunksRef.current = []
    pausedElapsedRef.current = 0
    setElapsed(0)

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setPermissionError(true)
      return
    }
    streamRef.current = stream

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
      // elapsed captured via closure at stop time; fallback to paused snapshot
      const duration = Math.max(1, elapsedAtStop.current)
      onComplete(blob, duration)
    }

    mr.start(3000) // chunk every 3s for IndexedDB crash-recovery readiness
    setState('recording')
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

  if (permissionError) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="text-destructive text-5xl">🎙️</div>
        <p className="text-destructive font-medium">Mikrofon-Zugriff verweigert</p>
        <p className="text-muted-foreground text-sm">
          Bitte erlaube den Mikrofon-Zugriff in deinen Browser-Einstellungen und lade die Seite
          neu.
        </p>
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Zurück
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Circular progress + mic button */}
      <div className="relative flex items-center justify-center">
        <svg
          className="absolute"
          width={140}
          height={140}
          viewBox="0 0 140 140"
        >
          <circle
            cx={70}
            cy={70}
            r={62}
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            className="text-muted/30"
          />
          <circle
            cx={70}
            cy={70}
            r={62}
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            strokeDasharray={`${2 * Math.PI * 62}`}
            strokeDashoffset={`${2 * Math.PI * 62 * (1 - progress)}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            className={cn(
              'transition-all duration-500',
              nearEnd ? 'text-destructive' : 'text-primary',
            )}
          />
        </svg>

        <button
          onClick={state === 'idle' ? startRecording : undefined}
          className={cn(
            'relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300',
            state === 'idle' &&
              'bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90 cursor-pointer',
            state === 'recording' &&
              'bg-destructive/10 text-destructive cursor-default',
            state === 'paused' && 'bg-muted text-muted-foreground cursor-default',
            nearEnd && 'animate-pulse',
          )}
          aria-label={state === 'idle' ? 'Aufnahme starten' : undefined}
        >
          <Mic className="h-10 w-10" />
          {state === 'recording' && (
            <span className="bg-destructive absolute right-2 top-2 h-3 w-3 animate-pulse rounded-full" />
          )}
        </button>
      </div>

      {/* Timer display */}
      <div className="text-center">
        <div
          className={cn(
            'font-mono text-5xl font-bold tabular-nums transition-colors',
            nearEnd && 'text-destructive animate-pulse',
          )}
        >
          {formatTime(elapsed)}
        </div>
        <div className="text-muted-foreground mt-1 text-sm">
          {state === 'idle' && 'Bereit'}
          {state === 'recording' && `Noch ${formatTime(remaining)}`}
          {state === 'paused' && 'Pausiert'}
        </div>
      </div>

      {/* Controls */}
      {state !== 'idle' && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => stopRecording(true)}
            className="h-12 w-12"
            aria-label="Abbrechen"
          >
            <X className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={pauseResume}
            className="h-12 w-12"
            aria-label={state === 'paused' ? 'Fortsetzen' : 'Pausieren'}
          >
            {state === 'paused' ? (
              <Play className="h-5 w-5" />
            ) : (
              <Pause className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={() => stopRecording(false)}
            className="h-12 w-12"
            aria-label="Stoppen und speichern"
          >
            <Square className="h-5 w-5 fill-current" />
          </Button>
        </div>
      )}

      {state === 'idle' && (
        <p className="text-muted-foreground text-sm">Tippe auf das Mikrofon zum Starten</p>
      )}
    </div>
  )
}
