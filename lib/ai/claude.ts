import 'server-only'

import Anthropic from '@anthropic-ai/sdk'

import { FeedbackSchema, type Feedback } from './feedback-schema'
import { getSystemPrompt, buildUserPrompt } from './prompts'
import type { ComputedMetrics } from '@/lib/analysis/metrics'

const MODEL = 'claude-sonnet-4-6'

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenced?.[1]) return fenced[1]
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1)
  return raw
}

export async function generateFeedback(params: {
  topic: string
  transcript: string
  metrics: ComputedMetrics
  durationSec: number
  frameworkHint?: string | null
  mode?: 'conversation' | 'presentation'
}): Promise<Feedback> {
  const { mode = 'conversation' } = params
  // Init inside function so env vars are resolved at call time, not module load
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const userPrompt = buildUserPrompt(params)
  const systemPrompt = getSystemPrompt(mode)

  async function callClaude(extraInstruction?: string): Promise<string> {
    const userContent = extraInstruction
      ? `${userPrompt}\n\n${extraInstruction}`
      : userPrompt

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const content = message.content[0]
    if (content?.type !== 'text') throw new Error('Unexpected response type from Claude')
    return content.text
  }

  // First attempt
  let raw = await callClaude()
  const jsonStr = extractJson(raw)

  const first = FeedbackSchema.safeParse(JSON.parse(jsonStr))
  if (first.success) return first.data

  // Single retry with schema correction hint
  const schemaHint = `Deine vorherige Antwort war kein valides JSON nach dem geforderten Schema.
Fehler: ${first.error.message}
Bitte gib ausschließlich valides JSON zurück, exakt nach dem Schema im ursprünglichen Prompt.`

  raw = await callClaude(schemaHint)
  const jsonStr2 = extractJson(raw)
  const second = FeedbackSchema.safeParse(JSON.parse(jsonStr2))
  if (second.success) return second.data

  throw new Error(`Claude feedback validation failed after retry: ${second.error.message}`)
}
