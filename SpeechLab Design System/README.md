# SpeechLab Design System

> **Voicelabs** is the internal design-system codename. CSS variables are prefixed `--vl-*`. The product is shipped as **SpeechLab** by **Webroids**.

A warm, minimalistic, slightly playful design system for **SpeechLab** — a German-language personal communication training PWA. Users record themselves speaking on a topic, get an AI-powered transcript with filler-word detection, structured coaching feedback, and progress tracking over time.

The system is built around three ideas:
1. **Cream over white.** A warm `#F4EFE8` background and `#1C1814` ink — never pure black, never pure white. Reads soft and editorial.
2. **Serif italics as emphasis.** Body text is Inter; the brand voice — greetings, topic prompts, score numbers — runs in *Instrument Serif*, often with the last word or two in italic.
3. **Mono caps labels.** Every section is announced by a 10px mono ALL-CAPS label: `TODAY'S DRILL`, `RECENT`, `STREAK`. They are the system's spine.

---

## Sources

The system is reconstructed from one production codebase:

| Source | URL |
|---|---|
| **SpeechLab app** (Next.js 16, Tailwind v4, shadcn/ui) | https://github.com/Webroids/speechlab |

If you have read access, the most-useful files to consult directly:

- `styles/globals.css` — source-of-truth design tokens (oklch palette, radius scale, hairline opacities)
- `app/(practice)/page.tsx` + `home-client.tsx` — Home screen patterns: greeting, hero card, streak tiles, pill scrollers
- `app/(practice)/feedback/[id]/page.tsx` — arc-gauge feedback layout, sub-score rings, metric tiles
- `app/(practice)/record/recording-client.tsx` — the always-dark Record screen
- `app/frameworks/page.tsx` — coloured glyph + tagline framework cards
- `app/trends/page.tsx` — line-chart layout with reference bands
- `components/vl-arc-gauge.tsx`, `components/vl-ring.tsx` — signature score-display primitives
- `components/voice-timeline.tsx` — pitch/energy visualisation
- `lib/frameworks.ts`, `lib/topics.ts` — actual content; great for understanding tone

Browse the repo if you can — code is the most accurate source.

---

## Index

```
.
├── README.md                ← you are here
├── SKILL.md                 ← Agent SKill manifest (use this if loading as a skill)
├── colors_and_type.css      ← single source of CSS tokens + semantic type
├── fonts/
│   ├── InstrumentSerif-Regular.ttf       (user-supplied)
│   └── Geist-Italic-VariableFont_wght.ttf (user-supplied)
├── assets/
│   ├── speechlab-logo.svg       ← coral rounded square with Mic2 glyph
│   └── speechlab-wordmark.svg   ← logo + SPEECHLAB mono caps lockup
├── preview/                 ← cards that populate the Design System tab
│   ├── colors-*.html            (palette, accents, score ramp, dark mode)
│   ├── type-*.html              (display, scale, labels, numerals)
│   ├── spacing-*.html           (radius, card recipe, hairlines)
│   ├── components-*.html        (pills, buttons, rings, gauges, nav, screens)
│   └── brand-*.html             (logo, iconography)
└── ui_kits/
    └── speechlab_pwa/       ← React recreation of the mobile app
        ├── README.md
        ├── index.html       ← clickable Home → Setup → Record → Feedback flow
        ├── tokens.css
        ├── data.js
        ├── primitives.jsx   (VLRing, VLArcGauge, Pill, Button, Icon…)
        ├── home.jsx         (HomeScreen + SetupScreen)
        ├── record.jsx
        ├── feedback.jsx
        ├── screens.jsx      (Library, Frameworks, Trends)
        └── app.jsx          (router + bottom nav)
```

---

## CONTENT FUNDAMENTALS

**Language**: German throughout. The brand voice is **du** (informal), never *Sie*. English appears only in product-internal labels that have become signage: `STREAK`, `AVG SCORE`, `RECENT`, `WPM`, `TODAY'S DRILL`. Section-labels mix German and English freely — `BIBLIOTHEK`, `FORTSCHRITT`, `FRAMEWORKS`, `METRIKEN` next to `RECENT`.

**Tone**: Direct, honest, no coaching clichés. Warm but no-nonsense. **No motivation-poster talk.** Concrete and specific *always*. Compare:

| ❌ Filler tone | ✅ SpeechLab tone |
|---|---|
| "You've got this — keep crushing it!" | „Ein kurzer Drill hält den Streak am Leben." |
| "Great job, amazing recording!" | „Stark gestartet — Pointe verblasst." |
| "Try to be more confident" | „Stelle eine echte Frage — und höre wirklich zu." |
| "Practice makes perfect" | „Starte heute wieder und bau deinen Streak auf." |

**Greetings rotate by time of day:** *„Guten Morgen,"* / *„Guten Tag,"* / *„Guten Abend,"* — always with the comma. Beneath the greeting, a softer italic line in muted ink: *„Deine Stimme."*

**Italic for emphasis.** A signature pattern: the last 1–2 words of a serif headline run in `<em>`. E.g. *„Pitch eine Zusammenarbeit an einen Kunden, der sagt: «Wir haben schon eine* Agentur*.»"*

**No emoji in chrome.** Emoji appear ONLY in empty-state moments (`🎙️` for "no recordings yet", `📈` for "no data", `🧠` during analysis). Never in buttons, never in labels, never decorative.

**Unicode glyphs ARE used** as iconography for frameworks — see ICONOGRAPHY below.

**Microcopy examples** (lifted verbatim from the app — feel free to use these as anchors):

- Buttons: „Aufnahme starten", „Nochmal üben", „Neues Thema", „Schnell üben", „Jetzt üben →"
- Empty: „Noch keine Aufnahmen. Starte deine erste Aufnahme auf der Startseite."
- Status: „transkribiert…", „analysiert…", „Analysiere Körpersprache…"
- Coaching tips: „Setze die Szene, benenne den Konflikt, lande die Pointe." / „Erkläre so einfach, dass ein 12-Jähriger es versteht."
- Confirm dialog: „Aufnahme läuft noch — wirklich abbrechen?"
- Targets: „Ziel: 130–160", „Ziel: ≤3", „Zielbereich: 130–160 WPM"

**Pointer/arrow chars**: `→` and `←` are used freely in body copy (CTAs, "→ Better alternative", "Jetzt üben →"). The em-dash `—` is used for parenthetical asides constantly; this is core to the voice.

---

## VISUAL FOUNDATIONS

### Palette
A warm-cream light mode and a near-black dark mode share one accent: **coral**. The chart accents (sage, lavender, amber, ocean, rose, mint, lemon) double as **category colours** for content — `business_pitch` is coral, `storytelling` is amber, `streit_position` is lavender, etc. They are *not* arbitrary decoration; each accent is bound to a content category.

| Token | OKLCH | Role |
|---|---|---|
| `--background` | `0.967 0.012 75` | Cream page |
| `--foreground` | `0.140 0.015 55` | Ink |
| `--card` | `0.984 0.007 75` | Card surface (slightly lighter than page) |
| `--muted-foreground` | `0.490 0.022 60` | Secondary text |
| `--vl-coral` | `0.70 0.20 35` | Primary accent, "Pitch", scores <60 |
| `--vl-sage` | `0.70 0.16 145` | Success, scores ≥80, positive deltas |
| `--vl-amber` | `0.80 0.18 80` | "Story", warning, scores 60–79 |
| `--vl-lavender` | `0.65 0.22 295` | "Debatte", frameworks |
| `--vl-ocean` | `0.65 0.18 235` | "Erklärung" |
| `--vl-rose` | `0.70 0.20 10` | "Reflexion" |
| `--vl-mint` | `0.78 0.16 165` | "Smalltalk" |
| `--vl-lemon` | `0.85 0.18 95` | Neutral pill (duration tags) |

**Score colour ramp** (used by `VLRing`): ≥80 sage, ≥60 amber, <60 coral.

### Type
- **Display**: Instrument Serif 400, with **italic 400** for emphasis. This is the brand voice.
- **Sans**: Inter (400/500/600/700). All body, all UI affordances.
- **Mono**: JetBrains Mono. **Reserved for the 10px ALL-CAPS section labels** and the filler-word chips in the trends view. Letter-spacing `0.12em`.

Headline pattern: serif first line, italic second-line accent in `--muted-foreground`. Tabular numerals on every stat: `font-feature-settings: 'tnum'`.

### Backgrounds & imagery
- **No gradients on page surfaces** — the page is solid cream.
- **One gradient exists**: the arc-gauge score sweep, lemon → amber → coral → rose → lavender. It is the most colourful element in the entire app and only appears at the top of the Feedback screen.
- **No photography** in the product. Empty states use single oversized emoji (`🎙️`, `📈`) centred on cream.
- **No texture, no grain.**

### Borders, hairlines, shadows
- All separators are **hairlines** at 8% ink opacity (`--vl-hairline`). Stronger variants exist at 14% for blockquote rules.
- **Inset highlight, not drop shadow.** Cards use `box-shadow: 0 1px 0 oklch(1 0 0 / 60%) inset` — a 1px white inner top edge. Drop shadows are reserved for ONE element: the floating mic button (`0 6px 20px oklch(0.140 0.015 55 / 25%)`).
- **Border-radius scale**: 8 / 12 / **16 (default)** / **24 (cards)** / pill. Cards use 24px (`rounded-2xl`). Buttons use 12–16px. Pills are fully rounded.

### Spacing
Tailwind defaults — `gap-1.5` (6px) between pills, `gap-3` (12px) between cards in a stack, `space-y-6` between sections. Pages use `px-5 max-w-2xl` mobile, `md:pt-10 pb-28` (room for the bottom nav).

### Layout
- **Mobile-first**, max 2xl content width even on desktop (the product is a PWA).
- **Side nav at md+**, **bottom nav with centre-mic FAB on mobile**. Both vanish on `/record`.
- **Section heading + h1 pattern**: a `label-caps` over a serif headline. Optional small counter on the right.

### Animation & states
- **No bouncy spring animations.** Everything is `transition-opacity` / `transition-colors` / `transition-all 150ms`.
- **Hover**: `hover:opacity-80` for links and chrome; `hover:opacity-90` for primary buttons.
- **Active**: `active:scale-[0.97]` for pills/secondary actions, `active:scale-[0.98]` for primary CTAs, `active:scale-95` for the mic FAB. NEVER scale up.
- **Loading**: `animate-spin` on `<Loader2>` from lucide, plus a custom progress bar in coral. Status text pulses (`animate-pulse`) for "transkribiert…".
- **Focus**: 2px coral ring (`box-shadow: 0 0 0 2px var(--vl-coral)` on textareas, `ring-coral/50` elsewhere).

### Transparency & blur
- Bottom-nav uses a vertical fade-to-background gradient to hint scroll edge: `linear-gradient(to top, var(--background) 60%, transparent)`.
- Coral surfaces at low opacity (8–25%) for the "Nächste Übung" callout and framework pills on the Library screen.
- **No backdrop blur anywhere in the product.**

### The always-dark Record screen
The Record screen is a hard break: it's **always dark** regardless of theme. Hardcoded oklch constants live in `recording-client.tsx`:
```js
const D = { ink, muted, coral, panel, hairline }  // see colors_and_type.css for full values
```
Use these (mirrored as `--vl-dark-*`) instead of theme variables on that screen.

---

## ICONOGRAPHY

**Primary icon system: `lucide-react`.** Strokeweight `1.75` default, `2.25` for active nav, `2` for the mic FAB. Common icons: `Home`, `Library`, `Mic2` (the brand glyph), `BookOpen`, `BarChart2`, `ScrollText`, `Dices`, `Video`, `Loader2`, `ArrowLeft`, `RotateCcw`, `X`, `AlertTriangle`, `CheckCircle`, `XCircle`. Load Lucide from CDN in HTML: `https://unpkg.com/lucide@0.556.0/dist/umd/lucide.min.js`.

**Unicode glyphs as framework marks.** Each speaking framework has a tinted 44×44 tile with a Unicode glyph in its accent colour. This is *the* most distinctive iconographic choice in the system:

| Glyph | Frameworks |
|---|---|
| `◆` | 1-2-3 (coral) |
| `✶` `★` | PREP, STAR (amber) |
| `⊕` | SCQ (lavender) |
| `◇` | FAB (mint) |
| `◐` | Hook-Story-Offer (ocean) |
| `○` | default fallback (rose) |

**Coloured dots as content tags.** A 6×6px filled circle in an accent colour, used as a category indicator in scrolling pill bars and label rows. Tied to category colour, not arbitrary.

**Emoji**: only in empty states and the body-analysis loading frame. Never in UI chrome.

**Brand glyph.** The app icon is a flat coral rounded square with the lucide `Mic2` icon in cream. There is no wordmark logo — `SPEECHLAB` is set in the mono caps label style.

---

## Caveats & substitutions

- **Instrument Serif (regular)**: user-supplied TTF in `fonts/InstrumentSerif-Regular.ttf`. Italic still loaded from Google Fonts CDN — the user did not provide an italic file. Ask for `InstrumentSerif-Italic.ttf` for full offline parity.
- **Geist Italic**: user-supplied TTF in `fonts/Geist-Italic-VariableFont_wght.ttf`. Available to designers as a body-italic option. **Upright Geist was not provided**, so body sans still falls back to **Inter** loaded from Google Fonts. Ask the user for `Geist-VariableFont_wght.ttf` (upright) if a full Geist switchover is intended.
- **Lucide**: loaded from CDN. Real icons, no SVG re-draw.
- **App icon**: drawn here as a coral rounded-square with a `Mic2` glyph — close match to the codebase's `next/og`-generated icon.
- **No real recording audio** in the UI kit — the player and waveform are mocked from static sample data.

If you have additional brand assets (real logo lockup, marketing imagery, slide template), drop them into `assets/` and I'll roll them in.
