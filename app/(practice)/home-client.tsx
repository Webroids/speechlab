'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
import { FRAMEWORKS } from '@/lib/frameworks'

const CAT_STYLE: Record<string, { color: string; label: string }> = {
  business_pitch:        { color: 'var(--vl-coral)',    label: 'Pitch' },
  persoenlich_reflexion: { color: 'var(--vl-rose)',     label: 'Reflexion' },
  smalltalk:             { color: 'var(--vl-mint)',     label: 'Smalltalk' },
  erklaerung_teachback:  { color: 'var(--vl-ocean)',    label: 'Erklärung' },
  streit_position:       { color: 'var(--vl-lavender)', label: 'Debatte' },
  storytelling:          { color: 'var(--vl-amber)',    label: 'Story' },
}

const CAT_TIPS: Record<string, string> = {
  business_pitch:        'Starte mit einer klaren These. Stütz sie mit einem konkreten Beispiel.',
  storytelling:          'Setze die Szene, benenne den Konflikt, lande die Pointe.',
  smalltalk:             'Stelle eine echte Frage — und höre wirklich zu.',
  erklaerung_teachback:  'Erkläre so einfach, dass ein 12-Jähriger es versteht.',
  streit_position:       'Beziehe klar Stellung und räume einen Einwand ein.',
  persoenlich_reflexion: 'Sei konkret: eine Situation, ein Gefühl, eine Erkenntnis.',
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

const CATEGORY_OPTIONS: { label: string; value: TopicCategory | 'all' }[] = [
  { label: 'Alle', value: 'all' },
  ...(Object.keys(CATEGORY_LABELS) as TopicCategory[]).map((cat) => ({
    label: CATEGORY_LABELS[cat],
    value: cat,
  })),
]

interface HomeClientProps {
  initialFramework?: string
  children?: React.ReactNode
}

export function HomeClient({ initialFramework = '', children }: HomeClientProps) {
  const router = useRouter()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [customTopic, setCustomTopic] = useState('')
  const [duration, setDuration] = useState(60)
  const [category, setCategory] = useState<TopicCategory | 'all'>('all')
  const [difficulty, setDifficulty] = useState<TopicDifficulty | 'all'>('all')
  const [frameworkHint, setFrameworkHint] = useState(initialFramework)
  const catScrollRef = useRef<HTMLDivElement>(null)

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

  const description = framework
    ? `Übe das ${framework.name}-Framework. ${framework.tagline}`
    : topic
      ? (CAT_TIPS[topic.category] ?? 'Sprich klar und strukturiert.')
      : ''

  const durLabel = DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? '1 min'

  function startRecording(mode: 'audio' | 'video' = 'audio') {
    const params = new URLSearchParams({ topic: activeTopic, duration: String(duration) })
    if (frameworkHint) params.set('framework', frameworkHint)
    const cat = customTopic.trim() ? '' : (topic?.category ?? '')
    if (cat) params.set('category', cat)
    if (mode === 'video') params.set('mode', 'video')
    router.push(`/record?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* ── Topic card ──────────────────────────────────────── */}
      <div
        className="relative rounded-2xl p-5"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--vl-hairline)',
          boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--vl-coral)' }} />
          <span className="label-caps" style={{ color: 'var(--vl-coral)' }}>TODAY&apos;S DRILL</span>
        </div>

        {topic ? (
          <>
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

            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {catStyle && !customTopic.trim() && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: catStyle.color, color: 'var(--background)', letterSpacing: '-0.01em' }}
                >
                  {catStyle.label}
                </span>
              )}
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ background: 'var(--vl-lemon)', color: 'var(--foreground)', letterSpacing: '-0.01em' }}
              >
                {durLabel}
              </span>
              {framework && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: 'var(--vl-lavender)', color: 'oklch(0.967 0.012 75)', letterSpacing: '-0.01em' }}
                >
                  {framework.name}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-6 w-1/2 animate-pulse rounded" />
          </div>
        )}

        <button
          type="button"
          onClick={reroll}
          aria-label="Neues Thema"
          className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-black/5 active:scale-95 dark:hover:bg-white/10"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Dices className="h-4 w-4" />
        </button>
      </div>

      {/* ── Server slot (streak tiles etc.) ─────────────────── */}
      {children}

      {/* ── Configuration ───────────────────────────────────── */}
      <div className="space-y-5 pt-1">

        {/* Custom topic */}
        <div>
          <label className="label-caps mb-2 block">Eigenes Thema</label>
          <textarea
            rows={2}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Optional — überschreibt das zufällige Thema"
            className="w-full resize-none rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              color: 'var(--foreground)',
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
        </div>

        {/* Category — pill scroll */}
        <div>
          <label className="label-caps mb-2.5 block">Kategorie</label>
          <div
            ref={catScrollRef}
            className="flex gap-1.5 overflow-x-auto pb-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORY_OPTIONS.map((opt) => {
              const active = category === opt.value
              const dotColor = opt.value === 'all' ? 'var(--muted-foreground)' : (CAT_STYLE[opt.value]?.color ?? 'var(--vl-amber)')
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategory(opt.value as TopicCategory | 'all')}
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: active ? 'var(--foreground)' : 'var(--card)',
                    color: active ? 'var(--background)' : 'var(--muted-foreground)',
                    border: active ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                  }}
                >
                  {opt.value !== 'all' && (
                    <span
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full transition-opacity"
                      style={{ background: active ? 'var(--background)' : dotColor, opacity: active ? 0.6 : 1 }}
                    />
                  )}
                  {opt.value === 'all' ? 'Alle' : CAT_STYLE[opt.value]?.label ?? opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Duration + Difficulty side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-caps mb-2.5 block">Dauer</label>
            <div className="flex gap-1">
              {DURATION_OPTIONS.map((opt) => {
                const active = duration === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDuration(opt.value)}
                    className="flex-1 rounded-xl py-2 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: active ? 'var(--foreground)' : 'var(--card)',
                      color: active ? 'var(--background)' : 'var(--muted-foreground)',
                      border: active ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="label-caps mb-2.5 block">Schwierigkeit</label>
            <div className="flex gap-1">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = difficulty === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDifficulty(opt.value as TopicDifficulty | 'all')}
                    className="flex-1 rounded-xl py-2 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: active ? 'var(--foreground)' : 'var(--card)',
                      color: active ? 'var(--background)' : 'var(--muted-foreground)',
                      border: active ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Framework — pill grid */}
        <div>
          <label className="label-caps mb-2.5 block">Framework</label>
          <div className="flex flex-wrap gap-1.5">
            {/* No framework option */}
            <button
              type="button"
              onClick={() => setFrameworkHint('')}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
              style={{
                background: !frameworkHint ? 'var(--foreground)' : 'var(--card)',
                color: !frameworkHint ? 'var(--background)' : 'var(--muted-foreground)',
                border: !frameworkHint ? '1px solid transparent' : '1px solid var(--vl-hairline)',
              }}
            >
              Keins
            </button>
            {FRAMEWORKS.map((fw) => {
              const active = frameworkHint === fw.id
              return (
                <button
                  key={fw.id}
                  type="button"
                  onClick={() => setFrameworkHint(active ? '' : fw.id)}
                  title={fw.tagline}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: active ? 'var(--vl-lavender)' : 'var(--card)',
                    color: active ? 'oklch(0.967 0.012 75)' : 'var(--muted-foreground)',
                    border: active ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                  }}
                >
                  {fw.name}
                </button>
              )
            })}
          </div>
          {framework && (
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {framework.tagline}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => startRecording('audio')}
            data-shortcut="record"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            <Mic className="h-4 w-4" />
            Aufnahme starten
          </button>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => startRecording('video')}
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-150 hover:opacity-80 active:scale-[0.98]"
                style={{ background: 'var(--card)', border: '1px solid var(--vl-hairline)', color: 'var(--foreground)' }}
                aria-label="Video-Modus starten"
              >
                <Video className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mit Video aufnehmen — Körpersprache-Analyse</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
