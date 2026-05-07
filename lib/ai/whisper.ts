import 'server-only'

import OpenAI from 'openai'

import type { WhisperSegment, WhisperWord } from '@/types/db'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface WhisperResult {
  text: string
  words: WhisperWord[]
  segments: WhisperSegment[]
}

export async function transcribe(audioBuffer: ArrayBuffer, mimeType: string): Promise<WhisperResult> {
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
  const file = new File([audioBuffer], `recording.${ext}`, { type: mimeType })

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file,
    language: 'de',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  })

  // verbose_json includes words and segments
  const raw = response as unknown as {
    text: string
    words?: Array<{ word: string; start: number; end: number }>
    segments?: Array<{ id: number; start: number; end: number; text: string }>
  }

  const words: WhisperWord[] = (raw.words ?? []).map((w) => ({
    word: w.word,
    start: w.start,
    end: w.end,
  }))

  const segments: WhisperSegment[] = (raw.segments ?? []).map((s) => ({
    id: s.id,
    start: s.start,
    end: s.end,
    text: s.text,
  }))

  return { text: raw.text, words, segments }
}
