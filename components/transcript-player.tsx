'use client'

import { useEffect, useRef, useState } from 'react'

import { fillerWords } from '@/lib/analysis/filler-words'

interface Word {
  word: string
  start: number
  end: number
}

interface Props {
  audioSrc: string
  words: Word[]
}

function isFiller(word: string): boolean {
  const clean = word.toLowerCase().replace(/[^a-zäöü\s]/g, '').trim()
  return fillerWords.some((fw) => clean === fw || clean.startsWith(fw + ' '))
}

export function TranscriptPlayer({ audioSrc, words }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [showFillers, setShowFillers] = useState(true)
  const activeRef = useRef<HTMLSpanElement>(null)

  const fillerCount = words.filter((w) => isFiller(w.word)).length

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    audio.addEventListener('timeupdate', onTime)
    return () => audio.removeEventListener('timeupdate', onTime)
  }, [])

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentTime])

  function seekTo(time: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      audioRef.current.play()
    }
  }

  return (
    <div className="space-y-3">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} controls src={audioSrc} className="w-full" />

      {/* Transcript header */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Transkript
        </span>
        <div className="flex items-center gap-3">
          {fillerCount > 0 && (
            <button
              type="button"
              onClick={() => setShowFillers((v) => !v)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                showFillers
                  ? 'border-orange-400/40 bg-orange-400/15 text-orange-600 dark:text-orange-400'
                  : 'border-input bg-background text-muted-foreground'
              }`}
            >
              {fillerCount} Füllwörter {showFillers ? 'markiert' : 'verbergen'}
            </button>
          )}
        </div>
      </div>

      {/* Karaoke text */}
      <div className="bg-muted/50 max-h-64 overflow-y-auto rounded-lg p-4 text-sm leading-loose">
        {words.map((w, i) => {
          const isActive = currentTime >= w.start && currentTime <= w.end
          const isPast = currentTime > w.end
          const filler = showFillers && isFiller(w.word)

          return (
            <span
              key={i}
              ref={isActive ? activeRef : undefined}
              onClick={() => seekTo(w.start)}
              title={filler ? 'Füllwort' : undefined}
              className={`cursor-pointer rounded px-0.5 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : filler
                    ? 'bg-orange-400/20 text-orange-700 underline decoration-dotted dark:text-orange-300'
                    : isPast
                      ? 'text-foreground/60'
                      : 'text-foreground hover:bg-muted'
              }`}
            >
              {w.word}{' '}
            </span>
          )
        })}
      </div>

      {fillerCount > 0 && showFillers && (
        <p className="text-muted-foreground text-xs">
          🟠 Füllwörter sind <span className="text-orange-600 dark:text-orange-400">orange markiert</span>. Klick auf ein Wort zum Springen.
        </p>
      )}
    </div>
  )
}
