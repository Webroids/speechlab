'use client' // Topic randomisation, filter state, navigation

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Dices, Mic, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  CATEGORY_LABELS,
  type Topic,
  type TopicCategory,
  type TopicDifficulty,
  getRandomTopic,
} from '@/lib/topics'
import { FRAMEWORK_OPTIONS } from '@/lib/frameworks'

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

export function HomeClient({ initialFramework = '' }: { initialFramework?: string }) {
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

  // Initialize on client only — avoids SSR/client Math.random() mismatch
  useEffect(() => {
    reroll()
  }, [reroll])

  const activeTopic = customTopic.trim() || topic?.text || ''

  function startRecording() {
    const params = new URLSearchParams({
      topic: activeTopic,
      duration: String(duration),
    })
    if (frameworkHint) params.set('framework', frameworkHint)
    router.push(`/record?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      {/* Topic card */}
      <div className="bg-card relative rounded-2xl border p-6">
        {topic ? (
          <>
            <p className="text-foreground text-xl leading-snug font-medium">{activeTopic}</p>
            <div className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
              <span className="bg-muted rounded px-2 py-0.5">{CATEGORY_LABELS[topic.category]}</span>
              <span className="bg-muted rounded px-2 py-0.5 capitalize">{topic.difficulty}</span>
            </div>
          </>
        ) : (
          <div className="bg-muted h-7 w-3/4 animate-pulse rounded" />
        )}
        <button
          type="button"
          onClick={reroll}
          aria-label="Neues Thema würfeln"
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-full p-2 transition-colors"
        >
          <Dices className="h-5 w-5" />
        </button>
      </div>

      {/* Custom topic input */}
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-medium uppercase tracking-wide">
          Eigenes Thema (optional)
        </label>
        <textarea
          rows={2}
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="Schreib dein eigenes Thema…"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-muted-foreground mb-1.5 block text-xs font-medium uppercase tracking-wide">
            Kategorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TopicCategory | 'all')}
            className="border-input bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
          >
            <option value="all">Alle</option>
            {(Object.keys(CATEGORY_LABELS) as TopicCategory[]).map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-muted-foreground mb-1.5 block text-xs font-medium uppercase tracking-wide">
            Schwierigkeit
          </label>
          <div className="flex gap-1.5">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDifficulty(opt.value as TopicDifficulty | 'all')}
                className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                  difficulty === opt.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground hover:bg-accent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Framework hint */}
      <div>
        <label className="text-muted-foreground mb-1.5 block text-xs font-medium uppercase tracking-wide">
          Framework-Hint (optional)
        </label>
        <select
          value={frameworkHint}
          onChange={(e) => setFrameworkHint(e.target.value)}
          className="border-input bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
        >
          {FRAMEWORK_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {frameworkHint && (
          <p className="text-muted-foreground mt-1 text-xs">
            Claude bewertet explizit, ob du {frameworkHint} angewendet hast.
          </p>
        )}
      </div>

      {/* Duration slider */}
      <div>
        <label className="text-muted-foreground mb-3 block text-xs font-medium uppercase tracking-wide">
          Dauer — <span className="text-foreground font-bold">{DURATION_OPTIONS.find((o) => o.value === duration)?.label}</span>
        </label>
        <Slider
          value={duration}
          onChange={setDuration}
          options={DURATION_OPTIONS}
        />
      </div>

      {/* Mode toggle + Start button */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2 text-base"
          onClick={startRecording}
          data-shortcut="record"
        >
          <Mic className="h-5 w-5" />
          Aufnahme starten
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              disabled
              className="gap-2"
              aria-label="Video-Modus (kommt in Phase 2)"
            >
              <Video className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Video-Modus kommt in Phase 2</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
