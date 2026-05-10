'use server'

import Anthropic from '@anthropic-ai/sdk'

import type { Topic, TopicCategory, TopicDifficulty } from '@/lib/topics'

export interface GeneratedTopic {
  id: string
  text: string
  category: TopicCategory
  difficulty: TopicDifficulty
}

const CATEGORIES: TopicCategory[] = [
  'business_pitch',
  'persoenlich_reflexion',
  'smalltalk',
  'erklaerung_teachback',
  'streit_position',
  'storytelling',
]

const DIFFICULTIES: TopicDifficulty[] = ['easy', 'medium', 'hard']

export async function generateTopics(prompt: string): Promise<GeneratedTopic[]> {
  if (!prompt.trim()) throw new Error('Prompt darf nicht leer sein')

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  const systemPrompt = `Du bist ein Experte fuer Sprech-Uebungen. Generiere 3 praezise, praxisnahe Sprechangaben auf Deutsch.

Jede Angabe muss:
- Eine konkrete Situation oder Aufgabe beschreiben (1-2 Saetze)
- Direkt und handlungsorientiert formuliert sein
- Auf den Kontext des Nutzers eingehen

Antworte NUR mit einem JSON-Array (kein Markdown, keine Erklaerung):
[
  {
    "text": "Angabe als vollstaendiger Satz",
    "category": "eine von: business_pitch | persoenlich_reflexion | smalltalk | erklaerung_teachback | streit_position | storytelling",
    "difficulty": "eine von: easy | medium | hard"
  }
]`

  const userPrompt = `Kontext / Wunsch des Nutzers: "${prompt}"

Generiere 3 passende Sprechangaben.`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 600,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract JSON array
  const match = raw.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Ungueltige Antwort vom Modell')

  const parsed = JSON.parse(match[0]) as { text: string; category: string; difficulty: string }[]

  return parsed.map((t, i) => ({
    id: `gen-${Date.now()}-${i}`,
    text: t.text ?? '',
    category: (CATEGORIES.includes(t.category as TopicCategory) ? t.category : 'business_pitch') as TopicCategory,
    difficulty: (DIFFICULTIES.includes(t.difficulty as TopicDifficulty) ? t.difficulty : 'medium') as TopicDifficulty,
  }))
}
