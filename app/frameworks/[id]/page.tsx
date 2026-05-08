import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AlertTriangle, ArrowLeft, CheckCircle, Mic, XCircle } from 'lucide-react'

import { getFramework } from '@/lib/frameworks'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FrameworkDetailPage({ params }: Props) {
  const { id } = await params
  const fw = getFramework(id)
  if (!fw) notFound()

  return (
    <main className="container mx-auto max-w-2xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href="/frameworks"
          className="text-muted-foreground hover:text-foreground mt-1 shrink-0 transition-colors"
          aria-label="Zurück"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{fw.name}</h1>
          <p className="text-muted-foreground mt-0.5">{fw.tagline}</p>
        </div>
      </div>

      {/* Short explanation */}
      <section className="bg-primary/5 border-primary/20 rounded-xl border p-5">
        <h2 className="text-primary mb-2 text-sm font-semibold uppercase tracking-wide opacity-80">
          Kurz erklärt
        </h2>
        <p className="text-sm leading-relaxed">{fw.shortExplanation}</p>
      </section>

      {/* Structure */}
      <section className="bg-card rounded-xl border p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-60">Struktur</h2>
        <div className="space-y-2">
          {fw.structure.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* When to use / When not */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className="bg-card rounded-xl border p-4">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide opacity-60">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Wann nutzen?
          </h2>
          <p className="text-sm leading-relaxed">{fw.when}</p>
        </section>
        <section className="bg-card rounded-xl border p-4">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide opacity-60">
            <XCircle className="h-4 w-4 text-red-400" />
            Wann nicht?
          </h2>
          <p className="text-sm leading-relaxed">{fw.whenNot}</p>
        </section>
      </div>

      {/* Deep explanation */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">Tiefgehende Erklärung</h2>
        <p className="text-sm leading-relaxed">{fw.deepExplanation}</p>
      </section>

      {/* Examples */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide opacity-60">
          Beispiele — verschiedene Kontexte
        </h2>
        <div className="space-y-4">
          {fw.examples.map((ex, i) => (
            <div key={i} className="bg-card rounded-xl border p-4">
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                {ex.context}
              </p>
              <blockquote
                className="bg-muted/50 rounded-lg p-3 text-sm leading-relaxed italic"
                dangerouslySetInnerHTML={{
                  __html: ex.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Pro Tips */}
      {fw.proTips && fw.proTips.length > 0 && (
        <section className="bg-card rounded-xl border p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">Pro Tipps</h2>
          <ul className="space-y-2.5">
            {fw.proTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary mt-0.5 shrink-0 font-bold">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Common mistakes */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide opacity-60">Häufige Fehler</h2>
        <ul className="space-y-2">
          {fw.mistakes.map((m, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <Link href={`/?framework=${fw.id}`}>
        <Button size="lg" className="w-full gap-2">
          <Mic className="h-5 w-5" />
          Jetzt mit {fw.name} aufnehmen
        </Button>
      </Link>
    </main>
  )
}
