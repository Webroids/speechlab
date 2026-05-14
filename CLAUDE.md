# CLAUDE.md

## Project Overview

SpeechLab — personal communication training tool for Webroids.
Flow: pick topic → record audio/video → Whisper transcription → AI feedback → review.
Production MVP. German UI, Swiss/German user base.

## Tech Stack

- **Runtime**: Node ≥20, TypeScript 5.8 strict
- **Framework**: Next.js 16 (App Router, Server Actions, React 19, React Compiler)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives) + VL design tokens
- **Database**: Supabase (Postgres + Storage bucket `recordings`)
- **AI**: OpenAI Whisper (`whisper-1`) for transcription · Anthropic Claude (`claude-sonnet-4-6`) for feedback · claude-haiku-4-5 for topic generation
- **Body analysis**: `@mediapipe/tasks-vision` (browser-side, loaded from CDN WASM)
- **Package manager**: pnpm (enforced via `only-allow`)
- **Deployment**: Docker / Vercel-compatible (standalone output)

## Project Structure

```
app/
  (practice)/         # Core user flow (no auth guard)
    page.tsx          # Home: topic picker + streak tiles
    record/           # Recording screen (audio or video mode)
    feedback/[id]/    # Results: transcript, voice timeline, body language, AI feedback
  (auth)/             # Login / register
  library/            # All recordings with filters
  topics/             # Browse + AI-generate topics
  frameworks/         # Speaking frameworks library
  trends/             # Progress charts
actions/              # Server Actions (upload, process, streak, list, notes)
components/
  recorder/           # AudioRecorder, VideoRecorder, body-analyzer (MediaPipe)
  ui/                 # shadcn/ui primitives
lib/
  ai/                 # Whisper wrapper, Claude wrapper, Zod feedback schema
  analysis/           # WPM, filler words, hedging, pause detection
  supabase/           # server.ts (service-role, server-only) · client.ts (browser)
  topics.ts           # 50 curated DE topics
  frameworks.ts       # Speaking frameworks data
types/db.ts           # Manually typed Supabase schema (no codegen)
supabase/migrations/  # SQL migration files (run manually in Supabase SQL editor)
```

## Essential Commands

```bash
pnpm install          # install deps
pnpm dev              # dev server (port 3000) with pino-pretty logs
pnpm build            # production build
pnpm check-types      # tsc --noEmit
pnpm lint             # eslint
pnpm lint-and-format-fix  # eslint --fix + prettier --write
pnpm test             # vitest run (unit tests)
pnpm test:e2e         # playwright
```

Single test: `pnpm test -- --reporter=verbose path/to/file.test.ts`

DB migrations: paste SQL from `supabase/migrations/*.sql` into Supabase SQL editor manually. No CLI migration runner configured.

## Architecture Notes

**Supabase client split**: `lib/supabase/server.ts` uses service-role key (server-only import guard). `lib/supabase/client.ts` for browser. Never use service-role client in client components.

**Types**: `types/db.ts` is hand-written (no Supabase CLI codegen). Update it manually when schema changes.

**Recording flow**: `upload-recording.ts` stores blob → triggers `process-recording.ts` (fire-and-forget) which runs Whisper → metrics → Claude → DB status updates. Feedback page polls until `status=done`.

**Video mode**: After recording, `analyzeBodyLanguage()` runs MediaPipe client-side (seeks through video blob frame-by-frame on a canvas), then result is included in the upload formData as `body_samples` JSON.

**Design system**: VL tokens in `app/globals.css` (oklch palette). Dark recording screen uses hardcoded dark token constants (`const D = { ink, muted, coral, panel, hairline }`). Light screens use `var(--vl-*)` CSS vars.

**`next.config.ts`**: `ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — TypeScript errors won't fail builds. Run `pnpm check-types` explicitly.

## Development Rules

1. **DO**: Use `pnpm` — never `npm` or `yarn`. Enforced by preinstall hook.
2. **DO**: Run `pnpm check-types` before marking any task complete. Build won't catch TS errors.
3. **DO**: Add new DB columns via a new `supabase/migrations/NNNN_*.sql` file AND update `types/db.ts` manually.
4. **DO**: Use `var(--vl-coral)` etc. for design tokens in light-mode components. Use hardcoded oklch constants for the dark recording screen.
5. **DON'T**: Import `lib/supabase/server.ts` in client components — it has `server-only` guard.
6. **DON'T**: Use `openai` client in browser code — Whisper calls are server-side only (`lib/ai/whisper.ts`).
7. **DON'T**: Edit `node_modules`, `.next/`, or auto-generated files.
8. **DON'T**: Commit `.env.local` — required vars are `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`.
