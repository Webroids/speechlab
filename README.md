# SpeechLab

Personal communication training tool. Pick a topic, record yourself speaking, get AI-powered feedback on every dimension of your delivery — then track your progress over time.

---

## What It Does

### Core Loop

1. **Choose a topic** — from 50+ curated German topics across 6 categories (Pitch, Story, Debatte, Erklärung, Smalltalk, Reflexion), or let the app pick one
2. **Configure the session** — pick duration (30s–5min), optionally select a speaking framework (PREP, STAR, Monroe, etc.)
3. **Record** — audio-only or video mode, live waveform visualisation, countdown timer
4. **AI processing** — Whisper transcribes, metrics engine analyses the text, Claude generates structured feedback
5. **Review feedback** — score (0–100), per-dimension breakdown, strength/improvement highlights, voice timeline, next drill suggestion
6. **Track progress** — streak counter, weekly goal, score trends over time

### Two Recording Modes

| Mode | Max Duration | AI Tuning |
|---|---|---|
| **Gespräch / Übung** | 5 min | WPM target 130–160, tight filler tolerance |
| **Präsentation / Pitch** | 20 min | WPM target 110–140, looser tolerance for deliberate pauses |

### Upload Mode

Upload an existing audio or video file (`/upload`). Same processing pipeline — transcription, metrics, Claude feedback. Supports MP3, M4A, WAV, MP4, MOV, WebM. Max 24 MB.

### Feedback Dimensions

Every recording is scored across:

- **Struktur** (0–10) — framework usage, red thread, transitions. Detects PREP, STAR, 1-2-3, PEEL, Monroe, Minto, Hook-Story-Offer
- **Klarheit** (0–10) — sentence complexity, vocabulary, directness
- **Delivery** — WPM, filler words (ähm/äh/mhm), hedging words (ich denke/vielleicht), long pauses
- **Engagement** (0–10) — hook quality in first 10 seconds, storytelling elements
- **Overall score** (0–100) — composite

Each dimension includes a direct quote from the transcript and a concrete suggestion.

### Speaking Frameworks Library

Browse 10+ frameworks (`/frameworks`) with full explanations: when to use them, step-by-step structure, example openers. Frameworks integrate into recording setup — selecting one adds context to the Claude prompt.

### Progress & Trends

- **Streak** — consecutive days with at least one completed session
- **Weekly goal** — 5 sessions/week, visual progress bar
- **Score chart** — last 20 recordings plotted over time
- **Sub-score trends** — Struktur / Klarheit / Engagement charted independently (`/trends`)
- **Top filler words** — aggregate across all recordings

### Body Language Analysis (Video Mode)

MediaPipe runs in-browser (no server round-trip) after video recording ends. Analyses each frame for eye contact, posture, head stability, and gesture activity. Results stored as `body_samples` JSON per recording and shown on the feedback page.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16, App Router, Server Actions, React 19, React Compiler |
| Language | TypeScript 5.8 strict |
| Styling | Tailwind CSS v4, shadcn/ui (Radix), custom VL design tokens (oklch palette) |
| Database | Supabase (Postgres + Storage bucket `recordings`) |
| Auth | Supabase Auth — magic link (PKCE flow via `@supabase/ssr`) |
| Transcription | OpenAI Whisper (`whisper-1`) |
| AI Feedback | Anthropic Claude (`claude-sonnet-4-6`) |
| Topic Generation | Claude Haiku (`claude-haiku-4-5`) |
| Body Analysis | `@mediapipe/tasks-vision` — browser-side, WASM via CDN |
| Package manager | pnpm (enforced via `only-allow`) |
| Deployment | Docker / Vercel-compatible (standalone output) |

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role |
| `OPENAI_API_KEY` | platform.openai.com |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (used in magic link emails) |

### 3. Supabase — run migrations

Paste each file into the Supabase SQL editor in order:

```
supabase/migrations/0001_initial.sql           core tables
supabase/migrations/0002_video_body_samples.sql
supabase/migrations/0003_voice_samples.sql
supabase/migrations/0004_recording_mode.sql
supabase/migrations/0005_auth_user_id.sql      auth + RLS
supabase/migrations/0006_rls_strict.sql        strict per-user policies
```

### 4. Supabase — Storage bucket

Dashboard → Storage → New Bucket:
- **Name**: `recordings`
- **Public**: off (private)

### 5. Supabase — Auth configuration

Dashboard → Authentication → URL Configuration:
- **Site URL**: your production URL
- **Redirect URLs**: `https://yourdomain.com/**`

Dashboard → Authentication → SMTP:
- Use a custom SMTP provider (Resend recommended) — Supabase free SMTP is rate-limited to 3 emails/hour

### 6. Start dev server

```bash
pnpm dev
```

Opens at `http://localhost:3000`.

---

## Project Structure

```
app/
├── layout.tsx                    Root layout — fonts, providers, SideNav, BottomNav
├── (auth)/
│   ├── layout.tsx                Redirects logged-in users away from auth pages
│   └── login/page.tsx            Split-screen login/register (magic link)
├── (practice)/
│   ├── page.tsx                  Home — greeting, drill card, streak tiles, recent recordings
│   ├── home-client.tsx           Client shell — topic picker, drill card animation
│   ├── setup/                    Session config — topic, duration, framework, mode
│   ├── record/                   Recording screen — AudioRecorder or VideoRecorder
│   ├── feedback/[id]/            Feedback screen — score ring, timeline, body language, AI output
│   ├── account/                  Profile — display name edit, sign out
│   └── upload/                   Upload existing file for analysis
├── library/                      All recordings with filters
├── topics/                       Browse + AI-generate topics
├── frameworks/                   Speaking frameworks reference
├── trends/                       Progress charts
└── auth/confirm/                 PKCE callback — exchanges code for session cookie

actions/
├── upload-recording.ts           Stores blob to Storage, inserts DB row, triggers processing
├── process-recording.ts          Whisper → metrics → Claude → DB updates (fire-and-forget)
├── list-recordings.ts            listRecent, listAll, getRecentScores, getSubScoreTrends
├── streak.ts                     Current streak, weekly count, todayDone flag
├── trends.ts                     getTrends (WPM/score over time), getTopFillers
├── notes-tags.ts                 Add/remove tags, save notes per recording
├── delete-recording.ts           Delete recording + Storage file
└── generate-topics.ts            AI topic generation via Claude Haiku

components/
├── recorder/
│   ├── audio-recorder.tsx        MediaRecorder wrapper, waveform, countdown
│   ├── video-recorder.tsx        Camera + mic, live preview
│   └── body-analyzer.tsx         MediaPipe pose/face analysis post-recording
├── bottom-nav.tsx                Mobile fixed nav (hidden on record/login/account)
├── side-nav.tsx                  Desktop sidebar (hidden on record/login)
├── vl-ring.tsx                   Animated score ring (SVG, oklch stroke)
├── voice-timeline.tsx            Per-word timeline with filler/hedging highlights
├── score-sparkline.tsx           Mini score trend chart
└── body-language-card.tsx        Body language summary card

lib/
├── supabase/
│   ├── server.ts                 Service-role client (server-only, bypasses RLS)
│   ├── client.ts                 Browser anon client
│   └── session.ts                SSR session client (respects RLS) + getUser()
├── ai/
│   ├── whisper.ts                Whisper API wrapper
│   ├── claude.ts                 Claude wrapper — sends prompt, parses JSON response
│   ├── prompts.ts                System prompt + buildUserPrompt() with metrics injection
│   └── feedback-schema.ts        Zod schema for Claude JSON output validation
├── analysis/
│   ├── metrics.ts                WPM, filler count/ratio, hedging count, pause detection
│   ├── filler-words.ts           German filler word list (ähm, äh, also, halt, …)
│   └── hedging-words.ts          German hedging phrase list (ich denke, vielleicht, …)
├── topics.ts                     50 curated DE topics across 6 categories
└── frameworks.ts                 Speaking frameworks data

types/db.ts                       Hand-typed Supabase schema (no codegen)
supabase/migrations/              SQL migration files — run manually in Supabase SQL editor
```

---

## Data Flow

### Recording → Feedback

```
User records audio/video in browser
  ↓
upload-recording.ts (Server Action)
  → uploads blob to Supabase Storage  recordings/{userId}/{id}
  → inserts row into recordings table  status: 'recorded'
  → fires process-recording.ts as background task (no await)
  ↓
process-recording.ts
  → status: 'transcribing'
  → calls Whisper API → stores transcript + word-level timestamps
  → status: 'analyzing'
  → runs metrics engine on word timestamps (WPM, fillers, hedging, pauses)
  → calls Claude with transcript + metrics → validates JSON with Zod
  → stores feedback row + metrics row
  → status: 'done'
  ↓
Feedback page polls recordings.status every 2s until 'done'
  → renders score ring, voice timeline, body language card, AI feedback sections
```

### Auth Flow

```
User enters email → sendMagicLinkAction()
  → supabase.auth.signInWithOtp({ shouldCreateUser: true })
  → Supabase sends magic link email
  ↓
User clicks link → /auth/confirm?code=...
  → supabase.auth.exchangeCodeForSession(code)   PKCE exchange
  → session cookie set via @supabase/ssr
  → redirect to /
  ↓
middleware.ts runs on every request
  → no session → redirect to /login
  → session on /login → redirect to /
```

---

## Database Schema

```
recordings        one row per session
  id, user_id, topic_text, topic_id, topic_category
  type (audio|video), recording_mode (conversation|presentation)
  duration_target, duration_actual, file_path
  voice_samples (JSON), body_samples (JSON)
  framework_hint, status, created_at, processed_at

transcripts       one per recording
  recording_id, text, words (JSON: [{word, start, end}]), segments

metrics           one per recording
  recording_id, wpm, word_count
  filler_count, filler_ratio
  hedging_count, hedging_ratio
  long_pauses, first_word_latency

feedback          one per recording
  recording_id, overall_score, summary, data (full JSON), model, created_at

tags              many per recording
  id, recording_id, label

notes             one per recording
  recording_id, text, updated_at
```

RLS is enabled on all tables. Every query is scoped to `auth.uid()` — users can only read and write their own data. The service-role client (`lib/supabase/server.ts`) bypasses RLS and is used only in `process-recording.ts` (background processing has no user session context).

---

## Commands

```bash
pnpm dev                    # dev server with pino-pretty logs (port 3000)
pnpm build                  # production build
pnpm check-types            # tsc --noEmit — always run this, build ignores TS errors
pnpm lint                   # eslint
pnpm lint-and-format-fix    # eslint --fix + prettier --write
pnpm test                   # vitest unit tests
pnpm test:e2e               # playwright e2e
```

---

## Key Constraints

- **Whisper file limit**: 25 MB hard limit from OpenAI. Upload form enforces 24 MB client-side.
- **Magic link rate limit**: Supabase free SMTP = 3 emails/hour. Production requires custom SMTP.
- **MediaPipe WASM**: Loaded from CDN at runtime, not bundled. Requires internet on first load.
- **Service-role client** bypasses RLS — never import `lib/supabase/server.ts` in client components.
- **`next.config.ts`**: `ignoreBuildErrors: true` — TypeScript errors won't fail the build. Run `pnpm check-types` explicitly.
- **DB migrations**: No CLI runner configured. Paste SQL into Supabase SQL editor manually.
