---
name: speechlab-design
description: Use this skill to generate well-branded interfaces and assets for SpeechLab by Webroids (a German communication-training PWA), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the **README.md** file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What's here

- `README.md` — full brand context: content tone, visual foundations, iconography
- `SKILL.md` — this file
- `colors_and_type.css` — single source of design tokens (oklch palette, type, radius, hairline)
- `fonts/` — Instrument Serif Regular (TTF) + Geist Italic VariableFont (TTF)
- `assets/` — logos and brand glyphs
- `preview/` — annotated design-system cards (colors, type, spacing, components, brand)
- `ui_kits/speechlab_pwa/` — React recreation of the mobile app with six clickable screens

## Quick rules

- German UI, **du** form. Direct, no coaching clichés.
- Background is **cream** (`oklch(0.967 0.012 75)`), foreground **ink** (`oklch(0.140 0.015 55)`). Never pure white or pure black.
- Primary accent is **coral** (`var(--vl-coral)`). Plus six content-category accents (sage, lavender, amber, ocean, rose, mint).
- Headlines: **Instrument Serif** 400, italic for the last 1–2 words.
- Body: **Inter** 400/500/600/700.
- Section labels: **JetBrains Mono** 10px, `0.12em`, ALL CAPS, muted-foreground.
- Cards: 24px radius, hairline border (8% ink), 1px white inset highlight. **No drop shadow** except on the floating mic FAB.
- Icons: lucide-react, stroke 1.75. Unicode glyphs (◆ ★ ⊕ ◐) for framework marks.
- Score colour ramp: ≥80 sage, ≥60 amber, &lt;60 coral.
- The Record screen is **always dark** regardless of theme — use `--vl-dark-*` tokens.
- No emoji in chrome. Emoji ONLY in empty states.

## Source repo

The full production codebase: https://github.com/Webroids/speechlab — read `styles/globals.css`, `app/(practice)/*`, and `components/vl-*.tsx` for the most accurate reference.
