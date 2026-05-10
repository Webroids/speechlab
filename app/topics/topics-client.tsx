'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Dices, Loader2, Sparkles } from 'lucide-react'

import { generateTopics, type GeneratedTopic } from '@/actions/generate-topics'
import {
  CATEGORY_LABELS,
  type Topic,
  type TopicCategory,
  type TopicDifficulty,
} from '@/lib/topics'

// Category -> VL colour
const CAT_STYLE: Record<TopicCategory, { color: string; label: string }> = {
  business_pitch:        { color: 'var(--vl-coral)',    label: 'Pitch' },
  persoenlich_reflexion: { color: 'var(--vl-rose)',     label: 'Reflexion' },
  smalltalk:             { color: 'var(--vl-mint)',     label: 'Smalltalk' },
  erklaerung_teachback:  { color: 'var(--vl-ocean)',    label: 'Erklärung' },
  streit_position:       { color: 'var(--vl-lavender)', label: 'Debatte' },
  storytelling:          { color: 'var(--vl-amber)',    label: 'Story' },
}

const DIFFICULTY_LABELS: Record<TopicDifficulty, string> = {
  easy:   'Leicht',
  medium: 'Mittel',
  hard:   'Schwer',
}

const DIFFICULTY_COLOR: Record<TopicDifficulty, string> = {
  easy:   'var(--vl-sage)',
  medium: 'var(--vl-amber)',
  hard:   'var(--vl-coral)',
}

const DURATION_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
]

interface Props {
  topics: Topic[]
}

function TopicRow({ topic, onStart }: { topic: Topic | GeneratedTopic; onStart: (text: string, duration: number) => void }) {
  const cat = CAT_STYLE[topic.category]
  const [dur, setDur] = useState(60)

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'var(--card)', border: '1px solid var(--vl-hairline)' }}
    >
      <p className="text-sm font-medium leading-snug">{topic.text}</p>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Pills */}
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: cat.color, color: 'var(--background)' }}
          >
            {cat.label}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: DIFFICULTY_COLOR[topic.difficulty], color: 'var(--background)' }}
          >
            {DIFFICULTY_LABELS[topic.difficulty]}
          </span>
        </div>

        {/* Duration + start */}
        <div className="flex items-center gap-1.5">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDur(opt.value)}
              className="rounded-lg px-2 py-1 text-xs font-medium transition-colors"
              style={{
                background: dur === opt.value ? 'var(--foreground)' : 'var(--muted)',
                color: dur === opt.value ? 'var(--background)' : 'var(--muted-foreground)',
              }}
            >
              {opt.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onStart(topic.text, dur)}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-95 hover:opacity-90"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            aria-label="Aufnahme starten"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export function TopicsClient({ topics }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Filters
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<TopicCategory | 'all'>('all')
  const [activeDifficulty, setActiveDifficulty] = useState<TopicDifficulty | 'all'>('all')

  // AI generation
  const [genPrompt, setGenPrompt] = useState('')
  const [generated, setGenerated] = useState<GeneratedTopic[]>([])
  const [genError, setGenError] = useState('')

  function handleStart(text: string, duration: number) {
    router.push(`/record?${new URLSearchParams({ topic: text, duration: String(duration) }).toString()}`)
  }

  function handleGenerate() {
    if (!genPrompt.trim()) return
    setGenError('')
    startTransition(async () => {
      try {
        const results = await generateTopics(genPrompt)
        setGenerated(results)
      } catch (err) {
        setGenError(err instanceof Error ? err.message : 'Fehler beim Generieren')
      }
    })
  }

  // Filter
  const filtered = topics.filter((t) => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (activeDifficulty !== 'all' && t.difficulty !== activeDifficulty) return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      if (!t.text.toLowerCase().includes(q)) return false
    }
    return true
  })

  // Group by category for display
  const categories = (Object.keys(CATEGORY_LABELS) as TopicCategory[])

  return (
    <div className="space-y-6">
      {/* ── AI Generator ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--vl-hairline)',
          boxShadow: '0 1px 0 oklch(1 0 0 / 60%) inset',
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--vl-coral)' }} />
          <span className="label-caps" style={{ color: 'var(--vl-coral)' }}>THEMA GENERIEREN</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          Beschreibe deinen Kontext — Branche, Situation, Ziel — und erhalte 3 massgeschneiderte Themen.
        </p>
        <textarea
          rows={2}
          value={genPrompt}
          onChange={(e) => setGenPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }}
          placeholder="z.B. &quot;Ich bin Freelance Designer und muss Kunden oft erklaeren, warum gutes Design teurer ist&quot;"
          className="w-full resize-none rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:opacity-50"
          style={{
            background: 'var(--secondary)',
            border: '1px solid var(--vl-hairline)',
            color: 'var(--foreground)',
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isPending || !genPrompt.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isPending ? 'Generiere...' : 'Generieren'}
          </button>
          {generated.length > 0 && (
            <button
              type="button"
              onClick={() => { setGenerated([]); setGenPrompt('') }}
              className="rounded-xl px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
            >
              Löschen
            </button>
          )}
        </div>
        {genError && (
          <p className="text-xs" style={{ color: 'var(--vl-coral)' }}>{genError}</p>
        )}
      </div>

      {/* ── Generated results ────────────────────────────────────── */}
      {generated.length > 0 && (
        <section className="space-y-3">
          <p className="label-caps" style={{ color: 'var(--vl-coral)' }}>GENERIERTE THEMEN</p>
          {generated.map((t) => (
            <TopicRow key={t.id} topic={t} onStart={handleStart} />
          ))}
        </section>
      )}

      {/* ── Search + filters ──────────────────────────────────────── */}
      <div className="space-y-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Themen durchsuchen..."
          className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:opacity-50"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--vl-hairline)',
            color: 'var(--foreground)',
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        />

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            style={{
              background: activeCategory === 'all' ? 'var(--foreground)' : 'var(--muted)',
              color: activeCategory === 'all' ? 'var(--background)' : 'var(--muted-foreground)',
            }}
          >
            Alle
          </button>
          {categories.map((cat) => {
            const style = CAT_STYLE[cat]
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(isActive ? 'all' : cat)}
                className="rounded-full px-3 py-1 text-xs font-semibold transition-opacity"
                style={{
                  background: isActive ? style.color : 'var(--muted)',
                  color: isActive ? 'var(--background)' : 'var(--muted-foreground)',
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {style.label}
              </button>
            )
          })}
        </div>

        {/* Difficulty pills */}
        <div className="flex gap-1.5">
          {(['all', 'easy', 'medium', 'hard'] as const).map((d) => {
            const isActive = activeDifficulty === d
            const label = d === 'all' ? 'Alle' : DIFFICULTY_LABELS[d]
            const color = d !== 'all' ? DIFFICULTY_COLOR[d] : undefined
            return (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDifficulty(isActive && d !== 'all' ? 'all' : d)}
                className="flex-1 rounded-xl py-1.5 text-xs font-medium transition-colors"
                style={{
                  background: isActive ? (color ?? 'var(--foreground)') : 'var(--card)',
                  color: isActive ? 'var(--background)' : 'var(--muted-foreground)',
                  border: isActive ? 'none' : '1px solid var(--vl-hairline)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          {filtered.length} Themen
        </p>
      </div>

      {/* ── Topic list ───────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Dices className="h-8 w-8 opacity-30" />
          <p className="font-medium">Keine Themen gefunden</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Andere Filter versuchen oder oben ein Thema generieren.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((topic) => (
            <TopicRow key={topic.id} topic={topic} onStart={handleStart} />
          ))}
        </div>
      )}
    </div>
  )
}
