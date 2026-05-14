'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ArrowLeft, Check, Dices, Mic } from 'lucide-react'

import {
  CATEGORY_LABELS,
  type Topic,
  type TopicCategory,
  type TopicDifficulty,
  getAllTopics,
  getRandomTopic,
} from '@/lib/topics'
import type { Framework } from '@/lib/frameworks'

// ── Constants ────────────────────────────────────────────────────────────────

const CAT_STYLE: Record<string, { color: string; bg: string; accent: string; label: string }> = {
  business_pitch:        { color: 'var(--vl-coral)',    bg: 'var(--vl-coral-bg)',    accent: 'var(--vl-coral)',    label: 'Pitch' },
  persoenlich_reflexion: { color: 'var(--vl-rose)',     bg: 'var(--vl-rose-bg)',     accent: 'var(--vl-rose)',     label: 'Reflexion' },
  smalltalk:             { color: 'var(--vl-mint)',     bg: 'var(--vl-mint-bg)',     accent: 'var(--vl-mint)',     label: 'Smalltalk' },
  erklaerung_teachback:  { color: 'var(--vl-ocean)',    bg: 'var(--vl-ocean-bg)',    accent: 'var(--vl-ocean)',    label: 'Erklärung' },
  streit_position:       { color: 'var(--vl-lavender)', bg: 'var(--vl-lavender-bg)', accent: 'var(--vl-lavender)', label: 'Debatte' },
  storytelling:          { color: 'var(--vl-amber)',    bg: 'var(--vl-amber-bg)',    accent: 'var(--vl-amber)',    label: 'Story' },
}

const CAT_RECOMMENDED: Partial<Record<string, string>> = {
  business_pitch:       'PREP',
  storytelling:         'STAR',
  streit_position:      'problem-cause-solution',
  erklaerung_teachback: 'PEEL',
}

const DURATION_OPTIONS = [
  { value: 30,  label: '30 Sek.', desc: 'Schnelle Antwort' },
  { value: 60,  label: '1 Min.',  desc: 'Standard-Drill' },
  { value: 120, label: '2 Min.',  desc: 'Kompakte Story' },
  { value: 180, label: '3 Min.',  desc: 'Längere Argumentation' },
  { value: 300, label: '5 Min.',  desc: 'Mini-Vortrag' },
]

const DIFFICULTY_OPTIONS: { label: string; value: TopicDifficulty | 'all' }[] = [
  { label: 'Alle',   value: 'all' },
  { label: 'Leicht', value: 'easy' },
  { label: 'Mittel', value: 'medium' },
  { label: 'Schwer', value: 'hard' },
]

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialCategory?: string
  initialFramework?: string
  initialTopicText?: string
  frameworks: Framework[]
}

// ── Component ────────────────────────────────────────────────────────────────

export function SetupClient({ initialCategory = 'all', initialFramework = '', initialTopicText = '', frameworks }: Props) {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [source, setSource] = useState<'random' | 'custom'>('random')
  const [customTopic, setCustomTopic] = useState('')
  const [category, setCategory] = useState<TopicCategory | 'all'>(
    initialCategory !== 'all' && initialCategory in CATEGORY_LABELS
      ? (initialCategory as TopicCategory)
      : 'all'
  )
  const [difficulty, setDifficulty] = useState<TopicDifficulty | 'all'>('all')
  const [topic, setTopic] = useState<Topic | null>(null)
  const [framework, setFramework] = useState(initialFramework)
  const [duration, setDuration] = useState(60)

  const mountedRef = useRef(false)

  const reroll = useCallback(() => {
    setTopic(
      getRandomTopic({
        category: category !== 'all' ? category : undefined,
        difficulty: difficulty !== 'all' ? difficulty : undefined,
      })
    )
  }, [category, difficulty])

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      if (initialTopicText) {
        const found = getAllTopics().find((t) => t.text === initialTopicText) ?? null
        if (found) {
          setTopic(found)
          return
        }
      }
    }
    reroll()
  }, [reroll, initialTopicText])

  const activeTopic = source === 'custom' ? customTopic.trim() : (topic?.text ?? '')
  const canAdvanceStep1 = activeTopic.length > 2
  const resolvedCat = source === 'custom' ? null : (topic?.category ?? null)
  const recommendedId = resolvedCat ? (CAT_RECOMMENDED[resolvedCat] ?? null) : null
  const recommendedFw = recommendedId ? frameworks.find((f) => f.id === recommendedId) ?? null : null

  function goBack() {
    if (step === 1) router.push('/')
    else setStep((s) => (s - 1) as 1 | 2 | 3)
  }

  function startRecording() {
    const params = new URLSearchParams({ topic: activeTopic, duration: String(duration) })
    if (framework) params.set('framework', framework)
    if (resolvedCat) params.set('category', resolvedCat)
    router.push(`/record?${params.toString()}`)
  }

  // ── Step labels ─────────────────────────────────────────────────────────
  const stepLabels = ['Thema wählen', 'Framework', 'Dauer & Start']
  const stepTitle = step === 1
    ? <>Worüber sprichst <em style={{ color: 'var(--muted-foreground)' }}>du heute?</em></>
    : step === 2
      ? <>Welches Framework willst <em style={{ color: 'var(--muted-foreground)' }}>du üben?</em></>
      : <>Wie lange willst <em style={{ color: 'var(--muted-foreground)' }}>du sprechen?</em></>

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-32">
      {/* ── Stepper ──────────────────────────────────────────── */}
      <div className="flex gap-1.5 pt-8">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ background: n <= step ? 'var(--vl-coral)' : 'var(--muted)' }}
          />
        ))}
      </div>

      {/* ── Shell header ─────────────────────────────────────── */}
      <div className="mt-6 flex items-start gap-3">
        <button
          type="button"
          onClick={goBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 active:scale-95 dark:hover:bg-white/10"
          style={{ color: 'var(--muted-foreground)', border: '1px solid var(--vl-hairline)' }}
          aria-label="Zurück"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="label-caps mb-1">SCHRITT {step} VON 3 · {stepLabels[step - 1]}</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {stepTitle}
          </h1>
        </div>
      </div>

      {/* ── Step content ─────────────────────────────────────── */}
      <div className="mt-8">
        {step === 1 && (
          <Step1
            source={source}
            setSource={setSource}
            customTopic={customTopic}
            setCustomTopic={setCustomTopic}
            category={category}
            setCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            topic={topic}
            reroll={reroll}
          />
        )}
        {step === 2 && (
          <Step2
            frameworks={frameworks}
            recommended={recommendedFw}
            selected={framework}
            setSelected={setFramework}
          />
        )}
        {step === 3 && (
          <Step3
            duration={duration}
            setDuration={setDuration}
            activeTopic={activeTopic}
            resolvedCat={resolvedCat}
            framework={frameworks.find((f) => f.id === framework) ?? null}
          />
        )}
      </div>

      {/* ── Sticky CTA ───────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-5"
        style={{
          background: 'linear-gradient(to top, var(--background) 70%, transparent)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1.5rem)',
          paddingTop: '2rem',
        }}
      >
        <div className="mx-auto max-w-lg">
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
              disabled={step === 1 && !canAdvanceStep1}
              className="flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              Weiter
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
              style={{ background: 'var(--vl-coral)', color: 'oklch(0.967 0.012 75)' }}
            >
              <Mic className="h-4 w-4" />
              Aufnahme starten
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 1: Topic ─────────────────────────────────────────────────────────────

function Step1({
  source, setSource,
  customTopic, setCustomTopic,
  category, setCategory,
  difficulty, setDifficulty,
  topic, reroll,
}: {
  source: 'random' | 'custom'
  setSource: (s: 'random' | 'custom') => void
  customTopic: string
  setCustomTopic: (v: string) => void
  category: TopicCategory | 'all'
  setCategory: (c: TopicCategory | 'all') => void
  difficulty: TopicDifficulty | 'all'
  setDifficulty: (d: TopicDifficulty | 'all') => void
  topic: Topic | null
  reroll: () => void
}) {
  const catStyle = topic ? (CAT_STYLE[topic.category] ?? null) : null

  return (
    <div className="space-y-5">
      {/* Source toggle */}
      <div
        className="flex rounded-xl p-1"
        style={{ background: 'var(--secondary)', border: '1px solid var(--vl-hairline)' }}
      >
        {(['random', 'custom'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSource(s)}
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150"
            style={{
              background: source === s ? 'var(--card)' : 'transparent',
              color: source === s ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: source === s ? 'var(--vl-inset)' : 'none',
            }}
          >
            {s === 'random' ? 'Zufällig' : 'Eigenes Thema'}
          </button>
        ))}
      </div>

      {source === 'random' ? (
        <>
          {/* Category filter */}
          <div>
            <label className="label-caps mb-2.5 block">Kategorie</label>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
              <button
                type="button"
                onClick={() => setCategory('all')}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                style={{
                  background: category === 'all' ? 'var(--foreground)' : 'var(--card)',
                  color: category === 'all' ? 'var(--background)' : 'var(--muted-foreground)',
                  border: category === 'all' ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                }}
              >
                Alle
              </button>
              {(Object.keys(CATEGORY_LABELS) as TopicCategory[]).map((cat) => {
                const active = category === cat
                const cs = CAT_STYLE[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 active:scale-[0.97]"
                    style={{
                      background: active ? 'var(--foreground)' : 'var(--card)',
                      color: active ? 'var(--background)' : 'var(--muted-foreground)',
                      border: active ? '1px solid transparent' : '1px solid var(--vl-hairline)',
                    }}
                  >
                    {!active && cs && (
                      <span
                        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: cs.color }}
                      />
                    )}
                    {cs?.label ?? CATEGORY_LABELS[cat]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty filter */}
          <div>
            <label className="label-caps mb-2.5 block">Schwierigkeit</label>
            <div className="flex gap-1.5">
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = difficulty === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDifficulty(opt.value)}
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

          {/* Topic preview card */}
          {topic && (
            <div
              className="relative overflow-hidden rounded-2xl p-4"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--vl-hairline)',
                boxShadow: 'var(--vl-inset)',
              }}
            >
              {catStyle && (
                <div
                  className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-10"
                  style={{ background: catStyle.color, filter: 'blur(24px)' }}
                />
              )}
              {catStyle && (
                <div className="mb-2.5 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: catStyle.color }} />
                  <span className="label-caps" style={{ color: catStyle.accent }}>{catStyle.label}</span>
                </div>
              )}
              <p
                className="font-display leading-snug"
                style={{ fontSize: '1.1875rem', letterSpacing: '-0.015em' }}
              >
                {topic.text}
              </p>
              <button
                type="button"
                onClick={reroll}
                className="mt-3 flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 active:scale-[0.97]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <Dices className="h-3.5 w-3.5" />
                Neues Thema würfeln
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <textarea
            rows={5}
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Dein Thema…"
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none placeholder:opacity-40 transition-shadow duration-150"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--vl-hairline)',
              color: 'var(--foreground)',
              minHeight: '130px',
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--vl-coral)')}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            autoFocus
          />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Konkrete Themen funktionieren besser als allgemeine Fragen.
          </p>
        </>
      )}
    </div>
  )
}

// ── Step 2: Framework ─────────────────────────────────────────────────────────

function FrameworkRow({
  fw,
  selected,
  onSelect,
  size = 40,
}: {
  fw: Framework
  selected: boolean
  onSelect: () => void
  size?: number
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-3.5 rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98]"
      style={{
        background: selected ? 'oklch(0.70 0.20 35 / 8%)' : 'var(--card)',
        border: selected ? '1.5px solid oklch(0.70 0.20 35 / 35%)' : '1px solid var(--vl-hairline)',
        boxShadow: selected ? 'var(--vl-inset)' : 'none',
      }}
    >
      {/* Glyph badge */}
      <div
        className="flex shrink-0 items-center justify-center rounded-xl font-mono font-bold"
        style={{
          width: size,
          height: size,
          background: fw.bg,
          color: fw.color,
          fontSize: size >= 44 ? '1.25rem' : '1.1rem',
          borderRadius: size >= 44 ? '14px' : '12px',
        }}
      >
        {fw.glyph}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight" style={{ letterSpacing: '-0.01em' }}>{fw.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {fw.tagline}
        </p>
        <p
          className="mt-1 line-clamp-2 text-xs leading-relaxed"
          style={{ color: 'var(--muted-foreground)', opacity: 0.75 }}
        >
          {fw.shortExplanation}
        </p>
      </div>

      {/* Check */}
      {selected && (
        <div
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'var(--vl-coral)', color: 'oklch(0.967 0.012 75)' }}
        >
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </div>
      )}
    </button>
  )
}

function Step2({
  frameworks,
  recommended,
  selected,
  setSelected,
}: {
  frameworks: Framework[]
  recommended: Framework | null
  selected: string
  setSelected: (id: string) => void
}) {
  const others = frameworks.filter((f) => f.id !== recommended?.id)

  return (
    <div className="space-y-3">
      {/* Recommended */}
      {recommended && (
        <>
          <p className="label-caps mb-1" style={{ color: 'var(--vl-coral)' }}>EMPFOHLEN</p>
          <FrameworkRow
            fw={recommended}
            selected={selected === recommended.id}
            onSelect={() => setSelected(selected === recommended.id ? '' : recommended.id)}
            size={44}
          />
        </>
      )}

      {/* No framework option */}
      <button
        type="button"
        onClick={() => setSelected('')}
        className="flex w-full items-center gap-3.5 rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98]"
        style={{
          background: selected === '' ? 'oklch(0.70 0.20 35 / 8%)' : 'var(--card)',
          border: selected === '' ? '1.5px solid oklch(0.70 0.20 35 / 35%)' : '1px solid var(--vl-hairline)',
        }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-bold"
          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
        >
          ∅
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Kein Framework</p>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>Frei sprechen</p>
        </div>
        {selected === '' && (
          <div
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--vl-coral)', color: 'oklch(0.967 0.012 75)' }}
          >
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </div>
        )}
      </button>

      {/* All other frameworks */}
      {recommended && <p className="label-caps pt-1">ALLE FRAMEWORKS</p>}
      {others.map((fw) => (
        <FrameworkRow
          key={fw.id}
          fw={fw}
          selected={selected === fw.id}
          onSelect={() => setSelected(selected === fw.id ? '' : fw.id)}
        />
      ))}
    </div>
  )
}

// ── Step 3: Duration + Summary ────────────────────────────────────────────────

function Step3({
  duration,
  setDuration,
  activeTopic,
  resolvedCat,
  framework,
}: {
  duration: number
  setDuration: (d: number) => void
  activeTopic: string
  resolvedCat: string | null
  framework: Framework | null
}) {
  const catStyle = resolvedCat ? (CAT_STYLE[resolvedCat] ?? null) : null
  const durLabel = DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? '1 Min.'

  return (
    <div className="space-y-5">
      {/* Duration options — vertical list */}
      <div className="space-y-2">
        {DURATION_OPTIONS.map((opt) => {
          const active = duration === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDuration(opt.value)}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-150 active:scale-[0.98]"
              style={{
                background: active ? 'var(--foreground)' : 'var(--card)',
                color: active ? 'var(--background)' : 'var(--foreground)',
                border: active ? '1.5px solid transparent' : '1px solid var(--vl-hairline)',
              }}
            >
              <span
                className="font-display tabular-nums"
                style={{ fontSize: '1.125rem', letterSpacing: '-0.02em', minWidth: '4rem' }}
              >
                {opt.label}
              </span>
              <span className="text-sm" style={{ color: active ? 'oklch(0.967 0.012 75 / 60%)' : 'var(--muted-foreground)' }}>
                {opt.desc}
              </span>
            </button>
          )
        })}
      </div>

      {/* Summary card */}
      {activeTopic && (
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--vl-hairline)',
            boxShadow: 'var(--vl-inset)',
          }}
        >
          <p className="label-caps">ZUSAMMENFASSUNG</p>
          <p
            className="font-display leading-snug"
            style={{ fontSize: '1rem', letterSpacing: '-0.015em' }}
          >
            {activeTopic}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {catStyle && (
              <span className="vl-pill" style={{ background: catStyle.bg, color: catStyle.accent }}>
                {catStyle.label}
              </span>
            )}
            <span className="vl-pill" style={{ background: 'var(--vl-amber-bg)', color: 'var(--vl-amber)' }}>
              {durLabel}
            </span>
            {framework && (
              <span className="vl-pill" style={{ background: framework.bg, color: framework.color }}>
                {framework.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
