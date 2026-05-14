import type { WhisperWord } from '@/types/db'

import { fillerWords } from './filler-words'
import { hedgingWords } from './hedging-words'

export interface ComputedMetrics {
  wpm: number
  word_count: number
  filler_count: number
  filler_ratio: number
  hedging_count: number
  hedging_ratio: number
  long_pauses: number
  first_word_latency: number
}

function normalise(text: string): string {
  return text.toLowerCase().trim()
}

function countPhrases(words: WhisperWord[], phrases: string[]): number {
  // Join all words into a single string to detect multi-word phrases
  const fullText = words.map((w) => normalise(w.word)).join(' ')
  let count = 0
  for (const phrase of phrases) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    const matches = fullText.match(regex)
    count += matches?.length ?? 0
  }
  return count
}

export function computeMetrics(words: WhisperWord[], durationSec: number): ComputedMetrics {
  const word_count = words.length

  // Use actual speech span from Whisper timestamps rather than full recording
  // duration -- avoids absurd WPM on short recordings with silence at start/end.
  // Enforce a 5 s minimum so a 1-second test clip doesn't yield 4000+ WPM.
  const firstWord = words[0]
  const lastWord = words[words.length - 1]
  const speechSpan =
    firstWord && lastWord && lastWord.end > firstWord.start
      ? lastWord.end - firstWord.start
      : durationSec
  const effectiveDuration = Math.max(speechSpan, 5)
  const wpm = word_count > 0 ? Math.round((word_count / effectiveDuration) * 60) : 0

  const filler_count = countPhrases(words, fillerWords)
  const filler_ratio = word_count > 0 ? filler_count / word_count : 0

  const hedging_count = countPhrases(words, hedgingWords)
  const hedging_ratio = word_count > 0 ? hedging_count / word_count : 0

  // Count gaps > 800ms between consecutive words
  let long_pauses = 0
  for (let i = 1; i < words.length; i++) {
    const prev = words[i - 1]
    const curr = words[i]
    if (prev && curr) {
      const gap = curr.start - prev.end
      if (gap > 0.8) long_pauses++
    }
  }

  const first_word_latency = words[0]?.start ?? 0

  return {
    wpm,
    word_count,
    filler_count,
    filler_ratio: Math.round(filler_ratio * 10000) / 10000,
    hedging_count,
    hedging_ratio: Math.round(hedging_ratio * 10000) / 10000,
    long_pauses,
    first_word_latency: Math.round(first_word_latency * 100) / 100,
  }
}
