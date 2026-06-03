# Webroids SpeechLab

Persönliches Kommunikations-Trainings-Tool: Thema generieren → aufnehmen → Transkript + AI-Feedback → wieder anschauen.

## Stack

- Next.js 16, App Router, Server Actions, TypeScript strict
- Tailwind CSS v4 + shadcn/ui
- Supabase (Postgres + Storage)
- OpenAI Whisper (`whisper-1`) für Transkription
- Anthropic Claude (`claude-sonnet-4-6`) für Feedback
- pnpm

## Setup

### 1. Dependencies

```bash
pnpm install
```

### 2. Umgebungsvariablen

```bash
cp .env.local.example .env.local
```

Dann `.env.local` befüllen:

| Variable | Woher |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role |
| `OPENAI_API_KEY` | platform.openai.com |
| `ANTHROPIC_API_KEY` | console.anthropic.com |

### 3. Supabase-Datenbank aufsetzen

Im Supabase SQL-Editor ausführen:

```bash
# Datei: supabase/migrations/0001_initial.sql
```

### 4. Storage Bucket erstellen

Im Supabase Dashboard → Storage → New Bucket:
- **Name**: `recordings`
- **Public**: ❌ (private)
- Keine weiteren Einstellungen

### 5. Entwicklung starten

```bash
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Projektstruktur

```
app/
├── (practice)/page.tsx         # Home: Topic + Aufnahme starten
├── (practice)/record/page.tsx  # Recording Screen
├── (practice)/feedback/[id]/   # Feedback Screen
└── library/page.tsx            # Alle Aufnahmen

lib/
├── supabase/server.ts          # Service-Role-Client (Server only)
├── supabase/client.ts          # Browser-Client
├── ai/whisper.ts               # Whisper-Wrapper
├── ai/claude.ts                # Claude-Wrapper
├── ai/prompts.ts               # System-Prompt
├── ai/feedback-schema.ts       # Zod-Validierung für Claude-Output
├── analysis/metrics.ts         # WPM, Filler, Hedging, Pausen
├── analysis/filler-words.ts
├── analysis/hedging-words.ts
└── topics.ts                   # 50 kuratierte DE-Themen

actions/
├── upload-recording.ts         # Blob → Storage → DB
└── process-recording.ts        # Whisper → Metrics → Claude → DB

types/db.ts                     # Manuell getippte Supabase-Types
```

## Phasen

- **Phase 1** (aktuell): Core Loop — Audio aufnehmen, transkribieren, Feedback anzeigen
- **Phase 2**: Video, Karaoke-Sync, Framework-Hint
- **Phase 3**: Frameworks-Bibliothek, Trends-Charts
- **Phase 4**: Drill-Modus, AI-Themen, PDF-Export
