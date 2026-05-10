import { ThemeSwitch } from '@/components/theme-switch'
import { getAllTopics } from '@/lib/topics'

import { TopicsClient } from './topics-client'

export default function TopicsPage() {
  const topics = getAllTopics()

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 pt-8 pb-6 md:pt-10">
        <div className="flex-1">
          <p className="label-caps mb-1">THEMEN</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Alle Themen
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
            {topics.length} Themen
          </span>
          <span className="md:hidden"><ThemeSwitch /></span>
        </div>
      </div>

      <TopicsClient topics={topics} />
    </main>
  )
}
