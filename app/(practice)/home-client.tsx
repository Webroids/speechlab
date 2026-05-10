'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dices, Mic, Video } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  CATEGORY_LABELS,
  type Topic,
  type TopicCategory,
  type TopicDifficulty,
  getRandomTopic,
} from '@/lib/topics'
import { FRAMEWORKS, FRAMEWORK_OPTIONS } from '@/lib/frameworks'

// Category -> VL colour + short label
const CAT_STYLE: Record<string, { color: string; label: string }> = {
  business_pitch:        { color: 'var(--vl-coral)',   label: 'Pitch' },
  persoenlich_reflexion: { color: 'var(--vl-rose)',    label: 'Reflexion' },
  smalltalk:             { color: 'var(--vl-mint)',    label: 'Smalltalk' },
  erklaerung_teachback:  { color: 'var(--vl-ocean)',   label: 'Erklaerung' },
  streit_position:       { color: 'var(--vl-lavender)',label: 'Debatte' },
  storytelling:          { color: 'var(--vl-amber)',   label: 'Story' },
}

// Category-based fallback tips when no framework is selected
const CAT_TIPS: Record<string, string> = {
  business_pitch:        'Starte mit einer klaren These. Stutz sie mit einem konkreten Beispiel.',
  storytelling:          'Setze die Szene, benenne den Konflikt, lande die Pointe.',
  smalltalk:             'Stelle eine echte Frage -- und hore wirklich zu.',
  erklaerung_teachback:  'Erklare so einfach, dass ein 12-Jahriger es versteht.',
  streit_position:       'Beziehe klar Stellung und raume einen Einwand ein.',
  persoenlich_reflexion: 'Sei konkret: eine Situation, ein Gefuhl, eine Erkenntnis.',
}

const DURATION_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 },
]

const DIFFICULTY_OPTIONS: { label: string; value: TopicDifficulty | 'all' }[] = [
  { label: 'Alle', value: 'all' },
  { label: 'Leicht', value: 'easy' },
  { label: 'Mittel', value: 'medium' },
  { label: 'Schwer', value: 'hard' },
]

interface HomeClientProps {
  initialFramework?: string
  children?: React.ReactNode  // streak tiles + other server content rendered between card and controls
}

export function HomeClient({ initialFramework = '', children }: HomeClientProps) {
  const router = useRouter()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [duration, setDuration] = useState(60)
  const [category, setCategory] = useState<TopicCategory | 'all'>('all')
  const [difficulty, setDifficulty] = useState<TopicDifficulty | 'all'>('all')
  const [frameworkHint, setFrameworkHint] = useState(initialFramework)

  const reroll = useCallback(() => {
    setCustomTopic('')
    setTopic(
      getRandomTopic({
        category: category !== 'all' ? category : undefined,
        difficulty: difficulty !== 'all' ? difficulty : undefined,
      }),
    )
  }, [category, difficulty])

  useEffect(() => { reroll() }, [reroll])

  const activeTopic = customTopic.trim() || topic?.text || ''
  const catStyle = topic ? (CAT_STYLE[topic.category] ?? { color: 'var(--vl-amber)', label: 'Thema' }) : null
  const framework = frameworkHint ? FRAMEWORKS.find((f) => f.id === frameworkHint) : null

  // Description: framework tagline or category tip
  const description = framework
    ? `Ube das ${framework.name}-Framework. ${framework.tagline}`
    : topic
      ? (CAT_TIPS[topic.category] ?? 'Sprich klar und strukturiert.')
      : ''

  // Duration label
  const durLabel = DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? '1 min'

  function startRecording() {
    const params = new URLSearchParams({ topic: activeTopic, duration: String(duration) })
    if (frameworkHint) params.set('framework', frameworkHint)
    // Pass category so recording-client can store it in the DB
    const cat = customTopic.trim() ? '' : (topic?.category ?? '')
    if (cat) params.set('category', cat)
    router.push(`/record?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* ── Hero drill card ─────────────────────────────── */}
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--vl-hairline)',
          boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
        }}
      >
        {/* TODAY'S DRILL label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--vl-coral)' }} />
          <span className="label-caps" style={{ color: 'var(--vl-coral)' }}>TODAY&apos;S DRILL</span>
        </div>

        {topic ? (
          <>
            {/* Topic text -- last 2 words italic */}
            <p
              className="font-display leading-snug"
              style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.625rem)', letterSpacing: '-0.015em' }}
            >
              {customTopic.trim() ? (
                customTopic.trim()
              ) : (() => {
                const words = topic.text.split(' ')
                const cut = Math.max(words.length - 2, 1)
                return (
                  <>
                    {words.slice(0, cut).join(' ')}{' '}
                    <em>{words.slice(cut).join(' ')}</em>
                  </>
                )
              })()}
            </p>

            {/* Description */}
            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {description}
            </p>

            {/* Pills + arrow button */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Category pill */}
                {catStyle && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: catStyle.color, color: 'var(--background)', letterSpacing: '-0.01em' }}
                  >
                    {catStyle.label}
                  </span>
                )}
                {/* Duration pill */}
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: 'var(--vl-lemon)', color: 'var(--foreground)', letterSpacing: '-0.01em' }}
                >
                  {durLabel}
                </span>
                {/* Framework pill */}
                {framework && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: 'var(--vl-lavender)', color: 'oklch(0.967 0.012 75)', letterSpacing: '-0.01em' }}
                  >
                    {framework.name}
                  </span>
                )}
              </div>

              {/* Start arrow */}
              <button
                type="button"
                onClick={startRecording}
                data-shortcut="record"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95 hover:opacity-90"
                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                aria-label="Aufnahme starten"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 7h8M7 3l4 4-4 4" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-6 w-1/2 animate-pulse rounded" />
          </div>
        )}

        {/* Reroll */}
        <button
          type="button"
          onClick={reroll}
          aria-label="Neues Thema"
          className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Dices className="h-4 w-4" />
        </button>
      </div>

      {/* ── Slot for server content (streak tiles etc.) ── */}
      {children}

      {/* ── Controls section ─────────────────────────── */}
      <div className="space-y-5 pt-2">
        {/* Custom topic */}
        <div>
          <label className="label-caps mb-2 block">Eigenes Thema (optional)</label>
          <textarea
            rows={2}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Schreib dein eigenes Thema..."
            className="w-full resize-none rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:opacity-50"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              color: 'var(--foreground)',
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-caps mb-2 block">Kategorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TopicCategory | 'all')}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--card)', border: '1px solid var(--vl-hairline)', color: 'var(--foreground)' }}
            >
              <option value="all">Alle</option>
              {(Object.keys(CATEGORY_LABELS) as TopicCategory[]).map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-caps mb-2 block">Schwierigkeit</label>
            <div className="flex gap-1.5">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = difficulty === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDifficulty(opt.value as TopicDifficulty | 'all')}
                    className="flex-1 rounded-xl py-2 text-xs font-medium transition-colors"
                    style={{
                      background: active ? 'var(--foreground)' : 'var(--card)',
                      color: active ? 'var(--background)' : 'var(--muted-foreground)',
                      border: active ? 'none' : '1px solid var(--vl-hairline)',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="label-caps mb-2 block">Dauer</label>
          <div className="flex gap-2">
            {DURATION_OPTIONS.map((opt) => {
              const active = duration === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDuration(opt.value)}
                  className="flex-1 rounded-xl py-2 text-xs font-medium transition-colors"
                  style={{
                    background: active ? 'var(--foreground)' : 'var(--card)',
                    color: active ? 'var(--background)' : 'var(--muted-foreground)',
                    border: active ? 'none' : '1px solid var(--vl-hairline)',
                  }}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Framework */}
        <div>
          <label className="label-caps mb-2 block">Framework (optional)</label>
          <select
            value={frameworkHint}
            onChange={(e) => setFrameworkHint(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{ background: 'var(--card)', border: '1px solid var(--vl-hairline)', color: 'var(--foreground)' }}
          >
            {FRAMEWORK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Start + video */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={startRecording}
            data-shortcut="record"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            <Mic className="h-4 w-4" />
            Aufnahme starten
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium opacity-40"
                style={{ background: 'var(--card)', border: '1px solid var(--vl-hairline)', color: 'var(--foreground)' }}
                aria-label="Video-Modus (kommt in Phase 2)"
              >
                <Video className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Video-Modus kommt in Phase 2</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
