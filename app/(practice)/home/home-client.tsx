'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dices, Mic } from 'lucide-react'

import { type Topic, getRandomTopic } from '@/lib/topics'

const CAT_STYLE: Record<string, { color: string; bg: string; accent: string; label: string }> = {
  business_pitch:        { color: 'var(--vl-coral)',    bg: 'var(--vl-coral-bg)',    accent: 'var(--vl-coral)',    label: 'Pitch' },
  persoenlich_reflexion: { color: 'var(--vl-rose)',     bg: 'var(--vl-rose-bg)',     accent: 'var(--vl-rose)',     label: 'Reflexion' },
  smalltalk:             { color: 'var(--vl-mint)',     bg: 'var(--vl-mint-bg)',     accent: 'var(--vl-mint)',     label: 'Smalltalk' },
  erklaerung_teachback:  { color: 'var(--vl-ocean)',    bg: 'var(--vl-ocean-bg)',    accent: 'var(--vl-ocean)',    label: 'Erklärung' },
  streit_position:       { color: 'var(--vl-lavender)', bg: 'var(--vl-lavender-bg)', accent: 'var(--vl-lavender)', label: 'Debatte' },
  storytelling:          { color: 'var(--vl-amber)',    bg: 'var(--vl-amber-bg)',    accent: 'var(--vl-amber)',    label: 'Story' },
}

const CAT_TIPS: Record<string, string> = {
  business_pitch:        'Starte mit einer klaren These. Stütz sie mit einem konkreten Beispiel.',
  storytelling:          'Setze die Szene, benenne den Konflikt, lande die Pointe.',
  smalltalk:             'Stelle eine echte Frage — und höre wirklich zu.',
  erklaerung_teachback:  'Erkläre so einfach, dass ein 12-Jähriger es versteht.',
  streit_position:       'Beziehe klar Stellung und räume einen Einwand ein.',
  persoenlich_reflexion: 'Sei konkret: eine Situation, ein Gefühl, eine Erkenntnis.',
}

export function HomeClient({ children }: { children?: React.ReactNode }) {
  const router = useRouter()
  const [topic, setTopic] = useState<Topic | null>(null)

  const reroll = useCallback(() => {
    setTopic(getRandomTopic())
  }, [])

  useEffect(() => { reroll() }, [reroll])

  const catStyle = topic ? (CAT_STYLE[topic.category] ?? { color: 'var(--vl-amber)', bg: 'var(--vl-amber-bg)', accent: 'var(--vl-amber)', label: 'Thema' }) : null

  function goToSetup() {
    const params = new URLSearchParams()
    if (topic?.text) params.set('topic', topic.text)
    if (topic?.category) params.set('category', topic.category)
    router.push(`/setup?${params.toString()}`)
  }

  return (
    <div className="space-y-5">
      {/* ── Today's Drill card ──────────────────────────────── */}
      <div
        className="relative rounded-2xl p-5 overflow-hidden"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--vl-hairline)',
          boxShadow: 'var(--vl-inset)',
        }}
      >
        {/* Category ambient glow */}
        {catStyle && (
          <div
            className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-10"
            style={{ background: catStyle.color, filter: 'blur(32px)' }}
          />
        )}

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
              {(() => {
                const words = topic.text.split(' ')
                const cut = Math.max(words.length - 2, 1)
                return (
                  <>
                    {words.slice(0, cut).join(' ')}{' '}
                    <em style={{ color: 'var(--muted-foreground)' }}>{words.slice(cut).join(' ')}</em>
                  </>
                )
              })()}
            </p>

            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              {CAT_TIPS[topic.category] ?? 'Sprich klar und strukturiert.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {catStyle && (
                <span className="vl-pill" style={{ background: catStyle.bg, color: catStyle.accent }}>
                  {catStyle.label}
                </span>
              )}
              <span className="vl-pill" style={{ background: 'var(--vl-amber-bg)', color: 'var(--vl-amber)' }}>
                {topic.difficulty === 'easy' ? 'Leicht' : topic.difficulty === 'hard' ? 'Schwer' : 'Mittel'}
              </span>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-5 w-1/2 animate-pulse rounded" />
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

      {/* ── Primary CTA ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={goToSetup}
        data-shortcut="record"
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'var(--foreground)', color: 'var(--background)' }}
      >
        <Mic className="h-4 w-4" />
        Aufnahme starten
      </button>

      {/* ── Server slot (streak tiles, weekly goal) ──────────── */}
      {children}
    </div>
  )
}
