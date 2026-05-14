'use client'

import { useEffect, useRef, useState } from 'react'

import { fillerWords } from '@/lib/analysis/filler-words'
import { hedgingWords } from '@/lib/analysis/hedging-words'
import { nonWords } from '@/lib/analysis/non-words'

interface Word {
  word: string
  start: number
  end: number
}

interface Props {
  audioSrc: string
  words: Word[]
}

type WordCategory = 'non-word' | 'filler' | 'soft-prefix' | null

function matchesList(clean: string, list: string[]): boolean {
  return list.some((entry) => clean === entry || clean.startsWith(entry + ' '))
}

function classify(word: string): WordCategory {
  const clean = word.toLowerCase().replace(/[^a-zäöüß\s]/g, '').trim()
  if (matchesList(clean, nonWords)) return 'non-word'
  if (matchesList(clean, hedgingWords)) return 'soft-prefix'
  if (matchesList(clean, fillerWords)) return 'filler'
  return null
}

const CATEGORY_STYLES: Record<Exclude<WordCategory, null>, { bg: string; text: string; label: string }> = {
  'non-word': {
    bg: 'bg-orange-400/20',
    text: 'text-orange-700 dark:text-orange-300',
    label: 'Lautfüller (ähm, äh…)',
  },
  filler: {
    bg: 'bg-purple-400/20',
    text: 'text-purple-700 dark:text-purple-300',
    label: 'Füllwörter (also, halt…)',
  },
  'soft-prefix': {
    bg: 'bg-green-400/20',
    text: 'text-green-700 dark:text-green-300',
    label: 'Weichmacher (ich denke, vielleicht…)',
  },
}

export function TranscriptPlayer({ audioSrc, words }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [showMarkers, setShowMarkers] = useState(true)
  const activeRef = useRef<HTMLSpanElement>(null)

  const categorized = words.map((w) => ({ ...w, category: classify(w.word) }))
  const nonWordCount = categorized.filter((w) => w.category === 'non-word').length
  const fillerCount = categorized.filter((w) => w.category === 'filler').length
  const softPrefixCount = categorized.filter((w) => w.category === 'soft-prefix').length
  const totalFlagged = nonWordCount + fillerCount + softPrefixCount

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
          {totalFlagged > 0 && (
            <button
              type="button"
              onClick={() => setShowMarkers((v) => !v)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                showMarkers
                  ? 'border-foreground/20 bg-foreground/8 text-foreground'
                  : 'border-input bg-background text-muted-foreground'
              }`}
            >
              {totalFlagged} markiert {showMarkers ? '✕' : '○'}
            </button>
          )}
        </div>
      </div>

      {/* Karaoke text */}
      <div className="bg-muted/50 max-h-64 overflow-y-auto rounded-lg p-4 text-sm leading-loose">
        {categorized.map((w, i) => {
          const isActive = currentTime >= w.start && currentTime <= w.end
          const isPast = currentTime > w.end
          const cat = showMarkers ? w.category : null
          const style = cat ? CATEGORY_STYLES[cat] : null

          return (
            <span
              key={i}
              ref={isActive ? activeRef : undefined}
              onClick={() => seekTo(w.start)}
              title={style?.label}
              className={`cursor-pointer rounded px-0.5 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : style
                    ? `${style.bg} ${style.text} underline decoration-dotted`
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

      {/* Legend */}
      {totalFlagged > 0 && showMarkers && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {nonWordCount > 0 && (
            <span className="text-xs flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-orange-700 dark:text-orange-300">
                {nonWordCount} Lautfüller
              </span>
            </span>
          )}
          {fillerCount > 0 && (
            <span className="text-xs flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-purple-400" />
              <span className="text-purple-700 dark:text-purple-300">
                {fillerCount} Füllwörter
              </span>
            </span>
          )}
          {softPrefixCount > 0 && (
            <span className="text-xs flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
              <span className="text-green-700 dark:text-green-300">
                {softPrefixCount} Weichmacher
              </span>
            </span>
          )}
          <span className="text-xs text-muted-foreground">· Klick auf Wort zum Springen</span>
        </div>
      )}
    </div>
  )
}
