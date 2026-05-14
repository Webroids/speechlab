'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Mic, Pause, Play, Square, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type VoiceSample } from './audio-recorder'

type RecorderState = 'idle' | 'countdown' | 'recording' | 'paused' | 'stopped'

interface VideoRecorderProps {
  targetDurationSec: number
  onComplete: (blob: Blob, durationSec: number, voiceSamples: VoiceSample[]) => void
  onCancel: () => void
  onRecordingStateChange?: (isActive: boolean) => void
}

function detectSupportedMimeType(): string {
  const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4']
  for (const mime of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) return mime
  }
  return ''
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Reuse pitch + RMS from audio-recorder logic
const SAMPLE_INTERVAL_MS = 150
const SILENCE_THRESHOLD = 0.01

function detectPitchHz(buf: Float32Array, sampleRate: number): number {
  const minPeriod = Math.floor(sampleRate / 400)
  const maxPeriod = Math.floor(sampleRate / 80)
  const n = Math.min(buf.length - maxPeriod, 512)
  if (n <= 0) return 0
  let bestCorr = -Infinity, bestPeriod = -1
  for (let period = minPeriod; period <= maxPeriod; period++) {
    let corr = 0
    for (let i = 0; i < n; i++) corr += (buf[i] ?? 0) * (buf[i + period] ?? 0)
    if (corr > bestCorr) { bestCorr = corr; bestPeriod = period }
  }
  return bestPeriod > 0 ? sampleRate / bestPeriod : 0
}

function computeRMS(buf: Float32Array): number {
  let sum = 0
  for (let i = 0; i < buf.length; i++) sum += (buf[i] ?? 0) ** 2
  return Math.sqrt(sum / buf.length)
}

export function VideoRecorder({ targetDurationSec, onComplete, onCancel, onRecordingStateChange }: VideoRecorderProps) {
  const [state, setState] = useState<RecorderState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [permissionError, setPermissionError] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const previewRef = useRef<HTMLVideoElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedElapsedRef = useRef<number>(0)
  const elapsedAtStop = useRef<number>(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const voiceSamplesRef = useRef<VoiceSample[]>([])
  const voiceSampleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recordingStartTimeRef = useRef<number>(0)

  const stopTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }, [])

  const stopVoiceSampling = useCallback(() => {
    if (voiceSampleIntervalRef.current) { clearInterval(voiceSampleIntervalRef.current); voiceSampleIntervalRef.current = null }
  }, [])

  const startVoiceSampling = useCallback(() => {
    stopVoiceSampling()
    if (!audioCtxRef.current || !analyserRef.current) return
    const analyser = analyserRef.current
    const sampleRate = audioCtxRef.current.sampleRate
    const timeBuf = new Float32Array(analyser.fftSize)
    voiceSampleIntervalRef.current = setInterval(() => {
      analyser.getFloatTimeDomainData(timeBuf)
      const rms = computeRMS(timeBuf)
      const hz = rms > SILENCE_THRESHOLD ? detectPitchHz(timeBuf, sampleRate) : 0
      const t = (Date.now() - recordingStartTimeRef.current) / 1000
      voiceSamplesRef.current.push({ t: Math.round(t * 10) / 10, hz: Math.round(hz), rms: Math.round(rms * 1000) / 1000 })
    }, SAMPLE_INTERVAL_MS)
  }, [stopVoiceSampling])

  const startTimer = useCallback(() => {
    stopTimer()
    startTimeRef.current = Date.now() - pausedElapsedRef.current * 1000
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 250)
  }, [stopTimer])

  const stopRecording = useCallback(
    (cancelled = false) => {
      elapsedAtStop.current = elapsed
      stopTimer()
      stopVoiceSampling()
      const mr = mediaRecorderRef.current
      if (mr && mr.state !== 'inactive') {
        if (cancelled) { mr.ondataavailable = null; mr.onstop = null }
        mr.stop()
      }
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (previewRef.current) { previewRef.current.srcObject = null }
      analyserRef.current = null
      audioCtxRef.current?.close().catch(() => {})
      audioCtxRef.current = null
      onRecordingStateChange?.(false)
      if (cancelled) {
        chunksRef.current = []
        voiceSamplesRef.current = []
        setState('idle')
        onCancel()
      }
    },
    [stopTimer, stopVoiceSampling, onCancel, onRecordingStateChange, elapsed],
  )

  useEffect(() => {
    if (elapsed >= targetDurationSec && state === 'recording') stopRecording(false)
  }, [elapsed, targetDurationSec, state, stopRecording])

  useEffect(() => {
    return () => {
      stopTimer()
      stopVoiceSampling()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      audioCtxRef.current?.close().catch(() => {})
    }
  }, [stopTimer, stopVoiceSampling])

  async function startWithCountdown() {
    setPermissionError(false)
    chunksRef.current = []
    voiceSamplesRef.current = []
    pausedElapsedRef.current = 0
    setElapsed(0)

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
    } catch {
      setPermissionError(true)
      return
    }
    streamRef.current = stream

    // Hook up live preview
    if (previewRef.current) {
      previewRef.current.srcObject = stream
      previewRef.current.play().catch(() => {})
    }

    // AudioContext for voice sampling
    try {
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      ctx.createMediaStreamSource(stream).connect(analyser)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
    } catch { /* non-critical */ }

    setState('countdown')
    setCountdown(3)
    await new Promise<void>((resolve) => {
      let n = 3
      const tick = setInterval(() => {
        n -= 1
        if (n <= 0) { clearInterval(tick); resolve() }
        else setCountdown(n)
      }, 1000)
    })

    const mimeType = detectSupportedMimeType()
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    mediaRecorderRef.current = mr
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' })
      onComplete(blob, Math.max(1, elapsedAtStop.current), voiceSamplesRef.current)
    }

    mr.start(3000)
    recordingStartTimeRef.current = Date.now()
    setState('recording')
    onRecordingStateChange?.(true)
    startTimer()
    startVoiceSampling()
  }

  function pauseResume() {
    const mr = mediaRecorderRef.current
    if (!mr) return
    if (state === 'recording') {
      mr.pause()
      pausedElapsedRef.current = elapsed
      stopTimer()
      stopVoiceSampling()
      setState('paused')
    } else if (state === 'paused') {
      mr.resume()
      setState('recording')
      startTimer()
      startVoiceSampling()
    }
  }

  const remaining = Math.max(0, targetDurationSec - elapsed)
  const progress = Math.min(1, elapsed / targetDurationSec)
  const nearEnd = remaining <= 10 && state === 'recording'
  const isCountdown = state === 'countdown'
  const isRecordingOrPaused = state === 'recording' || state === 'paused'

  const ink   = 'oklch(0.967 0.012 75)'
  const muted = 'oklch(0.560 0.018 60)'
  const coral = 'oklch(0.70 0.20 35)'
  const panel = 'oklch(0.967 0.012 75 / 8%)'
  const circumference = 2 * Math.PI * 70

  if (permissionError) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="text-5xl">📷</div>
        <p className="font-medium" style={{ color: coral }}>Kamera-Zugriff verweigert</p>
        <p className="text-sm" style={{ color: muted }}>
          Bitte erlaube Kamera und Mikrofon in deinen Browser-Einstellungen.
        </p>
        <button onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-medium" style={{ border: `1px solid ${panel}`, color: ink }}>
          Zurück
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Live camera preview */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3', background: 'oklch(0.10 0.008 55)' }}>
        <video
          ref={previewRef}
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{ transform: 'scaleX(-1)' /* mirror */ }}
        />

        {/* Idle overlay */}
        {state === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="text-4xl opacity-30">📷</div>
            <p className="text-xs" style={{ color: muted }}>Tippe unten zum Starten</p>
          </div>
        )}

        {/* Countdown overlay */}
        {isCountdown && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'oklch(0.10 0.008 55 / 60%)' }}>
            <span className="font-display tabular-nums" style={{ fontSize: 100, lineHeight: 1, letterSpacing: '-0.05em', color: ink }}>
              {countdown}
            </span>
          </div>
        )}

        {/* Recording indicator */}
        {state === 'recording' && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'oklch(0.10 0.008 55 / 70%)' }}>
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: coral }} />
            <span className="text-xs font-semibold tabular-nums" style={{ color: ink }}>{formatTime(elapsed)}</span>
          </div>
        )}

        {/* Progress ring overlay — bottom right */}
        {isRecordingOrPaused && (
          <div className="absolute bottom-3 right-3">
            <svg width={44} height={44} viewBox="0 0 44 44">
              <circle cx={22} cy={22} r={18} fill="none" stroke="currentColor" strokeWidth={3} className="opacity-20" style={{ color: ink }} />
              <circle
                cx={22} cy={22} r={18}
                fill="none"
                stroke={nearEnd ? 'oklch(0.65 0.22 25)' : coral}
                strokeWidth={3}
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - progress)}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {state === 'idle' && (
          <button
            onClick={startWithCountdown}
            className="flex h-16 w-16 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{ background: coral, color: 'oklch(0.102 0.008 55)' }}
            aria-label="Aufnahme starten"
          >
            <Mic className="h-7 w-7" />
          </button>
        )}

        {isRecordingOrPaused && (
          <>
            <button
              onClick={() => stopRecording(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: panel, color: muted }}
              aria-label="Abbrechen"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={pauseResume}
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: panel, color: ink }}
              aria-label={state === 'paused' ? 'Fortsetzen' : 'Pausieren'}
            >
              {state === 'paused' ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </button>
            <button
              onClick={() => stopRecording(false)}
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: ink, color: 'oklch(0.102 0.008 55)' }}
              aria-label="Stoppen und speichern"
            >
              <Square className="h-6 w-6 fill-current" />
            </button>
          </>
        )}
      </div>

      {state === 'idle' && (
        <p className="text-sm" style={{ color: muted }}>Kamera + Mikrofon · Video wird analysiert</p>
      )}
      {state === 'paused' && (
        <p className="text-sm" style={{ color: muted }}>Pausiert — {formatTime(remaining)} verbleibend</p>
      )}
    </div>
  )
}
