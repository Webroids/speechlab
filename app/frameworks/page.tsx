import Link from 'next/link'

import { ArrowLeft, BookOpen } from 'lucide-react'

import { FRAMEWORKS } from '@/lib/frameworks'
import { ThemeSwitch } from '@/components/theme-switch'

export default function FrameworksPage() {
  return (
    <main className="container mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Frameworks-Bibliothek</h1>
          <p className="text-muted-foreground text-sm">{FRAMEWORKS.length} Kommunikations-Frameworks</p>
        </div>
        <span className="md:hidden"><ThemeSwitch /></span>
      </div>

      <div className="space-y-4">
        {FRAMEWORKS.map((fw) => (
          <Link
            key={fw.id}
            href={`/frameworks/${fw.id}`}
            className="bg-card hover:bg-accent block rounded-xl border p-5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-primary h-4 w-4 shrink-0" />
                  <h2 className="font-semibold">{fw.name}</h2>
                </div>
                <p className="text-muted-foreground mt-0.5 text-sm">{fw.tagline}</p>
              </div>
              <div className="text-muted-foreground shrink-0 text-xs">{fw.structure.length} Teile</div>
            </div>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{fw.shortExplanation}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              <span className="font-medium">Wann:</span> {fw.when}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
