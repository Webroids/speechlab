import type { ComputedMetrics } from '@/lib/analysis/metrics'

export const SYSTEM_PROMPT = `Du bist ein erfahrener deutschsprachiger Kommunikationscoach.
Dein Stil: direkt, ehrlich, konkret, ohne Beschönigung — aber respektvoll.
Du sprichst den Nutzer mit "du" an, nicht förmlich.
Du gibst Feedback, das man sofort umsetzen kann.
Wenn etwas gut war, sagst du es kurz. Wenn etwas nicht gut war, sagst du es deutlich und zeigst, wie es besser geht.
Du gibst niemals generische Phrasen wie "guter Job!", "super Ansatz" oder ähnliche Coaching-Floskeln.
Jede Aussage ist auf das konkrete Transkript bezogen und mit einem wörtlichen Zitat belegt.
Antworte ausschließlich als gültiges JSON-Objekt. Kein Markdown, kein Text vor oder nach dem JSON.`

export function buildUserPrompt(params: {
  topic: string
  transcript: string
  metrics: ComputedMetrics
  durationSec: number
  frameworkHint?: string | null
}): string {
  const { topic, transcript, metrics, durationSec, frameworkHint } = params

  return `Aufnahme-Dauer: ${durationSec}s
Topic: "${topic}"
Framework-Hint: ${frameworkHint ?? 'keiner'}

Transkript:
${transcript}

Vorberechnete Metriken:
${JSON.stringify(metrics, null, 2)}

Erstelle Feedback nach folgendem JSON-Schema (gib NUR das JSON zurück):
{
  "overall_score": <0-100>,
  "one_sentence_summary": "<max 20 Wörter>",
  "structure": {
    "score": <0-10>,
    "framework_detected": "<PREP|1-2-3|STAR|PEEL|Past-Present-Future|Problem-Cause-Solution|Monroe|Minto|Hook-Story-Offer|none|ansatzweise>",
    "comment": "<mit direktem Zitat aus Transkript>"
  },
  "clarity": {
    "score": <0-10>,
    "comment": "<mit direktem Zitat>"
  },
  "delivery": {
    "wpm_assessment": "<Bewertung der Sprechgeschwindigkeit basierend auf ${metrics.wpm} WPM>",
    "filler_assessment": "<Bewertung aller drei Wort-Kategorien: Lautfüller (ähm/äh/mhm – ${metrics.filler_count} gemessen; diese unterbrechen den Redefluss am stärksten), Füllwörter (also/halt/sozusagen – ${metrics.filler_count} gemessen; zeigen fehlende Vorbereitung) und Weichmacher (ich denke/vielleicht/ein bisschen – ${metrics.hedging_count} gemessen; schwächen die Aussagekraft). Gehe auf alle drei ein, die relevant sind.>",
    "hedging_assessment": "<Spezifische Bewertung der Weichmacher: ${metrics.hedging_count} gezählt. Weichmacher reduzieren Autorität und Überzeugungskraft. Nenne konkrete Beispiele aus dem Transkript.>",
    "comment": "<konkret, mit Beispiel. Priorisiere: erst Lautfüller, dann Füllwörter, dann Weichmacher>"
  },
  "engagement": {
    "score": <0-10>,
    "hook_quality": "<Bewertung der ersten 10 Sekunden>",
    "comment": "<mit direktem Zitat>"
  },
  "top_3_strengths": ["<stärke mit Beleg>", "<stärke>", "<stärke>"],
  "top_3_improvements": [
    {
      "issue": "<konkretes Problem>",
      "example_from_transcript": "<wörtliches Zitat aus dem Transkript>",
      "better_alternative": "<wie es besser klingen würde>"
    }
  ],
  "framework_suggestion": {
    "name": "<Framework-Name>",
    "why": "<warum dieses Framework für dieses Thema gepasst hätte>",
    "how_it_would_have_sounded": "<umformulierter Einstieg mit dem Framework>"
  },
  "next_drill": "<konkrete Übung für das nächste Mal>"
}`
}
