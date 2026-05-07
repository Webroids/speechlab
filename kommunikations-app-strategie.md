# Kommunikations-App – Strategie

**Persönliches Trainings-Tool für Sprechfähigkeit, Klarheit und Frameworks**
Version 1.0 · für C-Pictures / Webroids

---

## 1. Executive Summary

Eine persönliche Web-App, die in einer einzigen, schnellen Loop funktioniert:

> **Thema generieren → Aufnehmen → Transkribieren → AI-Feedback → wieder anschauen.**

Daneben gibt es eine kuratierte Bibliothek von **Kommunikations-Frameworks** (1-2-3, PREP, STAR, PEEL u.a.), eine **History** aller Aufnahmen mit Trend-Analyse und einen **Drill-Modus**, in dem du gezielt ein Framework übst.

Da es ein persönliches Tool bleibt, fällt jeder Aufwand für Auth, Multi-User, Billing, App Store Approval und Public Launch weg. Das gewonnene Budget fließt komplett in **Aufnahme-UX, Feedback-Qualität und Re-Watch-Erlebnis**.

---

## 2. Plattform-Empfehlung: **Next.js 15 PWA**

Du hattest mich um eine Empfehlung gebeten. Klare Antwort: **Web App (Next.js 15) als installierbare PWA.**

### Warum nicht iOS Native (Swift)

- Du müsstest eine ganz neue Toolchain lernen.
- App Store Review für ein persönliches Tool ist Overhead ohne Nutzen.
- Kein wirklicher Vorteil: alles, was du brauchst (Mic, Kamera, Storage), funktioniert im Browser.

### Warum nicht React Native

- Doppelte Komplexität (Native Module + JS) für Features, die Web nativ kann.
- Build-Pipeline (Xcode, Provisioning) ist Overhead für eine Single-User App.

### Warum Next.js 15 PWA gewinnt

- Du arbeitest schon aktiv mit Next.js 15 (Webroids Analytics App) → **Null Stack-Lernkurve**.
- `MediaRecorder API` kann nativ Audio + Video aufnehmen (`webm/opus`, `webm/vp9`).
- Auf iOS via "Zum Home-Bildschirm" als App-Icon installierbar, Vollbild, ohne URL-Leiste.
- Web-Audio-API erlaubt zusätzliche Analysen (Wellenform, RMS für Lautstärke, später ggf. Pitch).
- Du kannst direkt vom Mac aus deployen (Vercel) und auf iPhone weiternutzen → **gleiche Datenbasis auf allen Geräten**.
- Spätere Iteration zu nativ ist möglich, falls je nötig (Capacitor wraps die PWA).

### Trade-offs ehrlich

- iOS Safari hat einige `MediaRecorder`-Quirks (Codec-Support, manchmal `.mp4` statt `.webm`). Lösung: feature-detect + Fallback, Server-side Conversion via `ffmpeg` falls nötig.
- Hintergrund-Aufnahme bei gesperrtem Bildschirm ist eingeschränkt → für deinen Use Case irrelevant (du sitzt aktiv vor dem Gerät).

---

## 3. Tech Stack

| Layer                   | Empfehlung                                                             | Begründung                                          |
| ----------------------- | ---------------------------------------------------------------------- | --------------------------------------------------- |
| **Framework**           | Next.js 15 (App Router, Server Actions)                                | Bekannt, schnell                                    |
| **Sprache**             | TypeScript                                                             | Standard                                            |
| **Styling**             | Tailwind + shadcn/ui                                                   | Schnelle, saubere UI                                |
| **Auth**                | Supabase Auth (single user) oder bewusst keine                         | Persönlich → minimal                                |
| **DB**                  | Supabase Postgres                                                      | Metadaten, Transkripte, Feedback                    |
| **File Storage**        | Supabase Storage (S3-kompatibel)                                       | Audio/Video Files                                   |
| **Transkription**       | OpenAI Whisper API (`whisper-1`)                                       | Bester Preis/Qualität für Deutsch, ~$0.006/min      |
| **AI-Feedback**         | Anthropic Claude (Sonnet 4.6 für Standard, Opus 4.7 für Tiefenanalyse) | Du nutzt es schon, deutsche Tonalität ausgezeichnet |
| **Recording**           | Browser `MediaRecorder` + Web Audio API                                | Native, keine Library nötig                         |
| **Audio-Konvertierung** | `@ffmpeg/ffmpeg` (WASM) oder server-side ffmpeg                        | Falls Whisper das Format nicht akzeptiert           |
| **Deployment**          | Vercel                                                                 | One-click, du kennst es                             |
| **Caching/Analytics**   | Vercel Analytics + PostHog (optional)                                  | Für persönliches Tracking                           |

**Geschätzte laufende Kosten** (bei z.B. 10 Aufnahmen à 1 min pro Tag):

- Whisper: ~$0.06/Tag = $1.80/Monat
- Claude Sonnet (Feedback): ~$0.30/Tag = $9/Monat (großzügig)
- Supabase Free Tier: $0
- Vercel Hobby: $0
- **Gesamt: ~$10/Monat**

---

## 4. Feature-Architektur

### 4.1 Core Loop (Practice)

Die wichtigste Funktion. Muss reibungslos sein.

1. **Home-Screen** mit einem dominierenden Button: "Neue Aufnahme starten"
2. **Topic-Generator**:
   - Würfel-Button → zufälliges Thema aus Bibliothek
   - Reroll, falls dir das Thema nicht passt
   - Optional: Kategorie-Filter (Business, Persönlich, Pitch, Storytelling, Smalltalk, Streit, Erklärung)
   - Optional: Schwierigkeit (Easy/Medium/Hard)
   - "Eigenes Thema eingeben" als Override
3. **Setup**:
   - **Dauer-Slider**: 30s · 1min · 2min · 3min · 5min · Custom
   - **Modus-Toggle**: Audio-only oder Video
   - **Framework-Hint** (optional): "Versuche heute mal PREP" → wird im Feedback bewertet
4. **Recording**:
   - Großer Topic-Header bleibt sichtbar
   - Countdown-Timer (Letzten 10s pulsiert sanft)
   - Bei Video: Live-Preview, Mirror-Toggle
   - Pause/Resume, Cancel, Stop
   - Auto-Stop bei Erreichen der Zielzeit
5. **Processing** (10-30s):
   - "Transkribiere…" → "Analysiere…"
   - Während Wartezeit: Tipp des Tages, Quote, Mini-Stats aus letzter Session
6. **Feedback-Screen** (Hauptdeliverable):
   - Topic + Datum + Dauer
   - Player (Audio/Video) mit synchronisiertem Transcript (Karaoke-Style: aktuelles Wort highlighted)
   - **Score-Cards** (siehe Abschnitt 6)
   - **Konkrete Verbesserungsvorschläge**: 1–3 Action Items
   - **Framework-Match**: "Du hast unbewusst PREP genutzt" oder "Hier hätte 1-2-3 geholfen — so:"
   - Save (Default), Discard, Tag hinzufügen, Notiz schreiben

### 4.2 Library (History)

- Liste aller Aufnahmen, sortier-/filterbar (Datum, Topic, Score, Tag)
- Quick-Preview: Topic + Score + erste Sekunden des Transkripts
- **Trends-Dashboard**:
  - WPM (Words per Minute) über Zeit
  - Filler-Word-Häufigkeit über Zeit
  - Klarheit-Score über Zeit
  - Häufigste Filler-Wörter (deine persönliche Top-5)
- **"Best Of"**-Bookmark: deine besten Aufnahmen für Wiederholungs-Inspiration
- **Compare**-Modus: zwei Aufnahmen nebeneinander (z.B. erstes vs. aktuelles "Pitch Webroids")

### 4.3 Resources (Frameworks)

Eine kuratierte, schön gestaltete Sammlung von Kommunikations-Frameworks. Jedes als eigene Karte/Detailseite mit:

- **Name + Tagline**
- **Wann nutzen?**
- **Struktur** (visuell)
- **Beispiel** (kurzes Mini-Skript)
- **Häufige Fehler**
- **CTA**: "Jetzt mit diesem Framework üben" → startet Recording mit Framework-Hint

Empfohlener Initial-Bestand (siehe Abschnitt 7).

### 4.4 Drill-Modus (optional, hochwertig)

- "5-Tage-Challenge: PREP meistern"
- Jeden Tag 1 Aufnahme zu einem zugeteilten Thema, Pflicht-Framework
- Feedback bewertet explizit, ob das Framework korrekt angewendet wurde
- Streak-Tracker

### 4.5 Bewusst weggelassen

- Login/Multi-User (persönliches Tool)
- Sharing/Social Features
- Live-Coaching während der Aufnahme (zu komplex, lenkt ab — ist auch der Konsens unter Speech-Coaches: Real-Time Feedback unterbricht den Flow)
- Detaillierte Pitch-/Pausenanalyse via Audio-Signal-DSP (overengineering für v1; aus Transkript + Whisper-Timestamps reicht der Großteil)

---

## 5. AI-Pipeline

```
[Recording.webm]
      │
      ▼
[Server Action: /api/process]
      │
      ├── (optional) ffmpeg: webm → mp3
      │
      ├──► Whisper API
      │     - language: "de"
      │     - response_format: "verbose_json"
      │     - timestamp_granularities: ["word"]
      │     ↓
      │   transcript_text + word_timestamps + segments
      │
      ├── Server-side Compute:
      │     - WPM (Wörter / Dauer × 60)
      │     - Pause-Detection (Wortlücken > 800ms = lange Pause)
      │     - Filler-Word-Count (deutsche Liste)
      │     - Hedging-Word-Count
      │
      ▼
[Claude Sonnet 4.6: Feedback Generation]
      │  System: "Du bist ein Kommunikationscoach…"
      │  User: { topic, transcript, metrics, optional_framework_hint }
      │  Output: structured JSON
      │
      ▼
[Save: Recording + Transcript + Metrics + Feedback]
      │
      ▼
[Render Feedback Screen]
```

### 5.1 Whisper-Setup

- Modell: `whisper-1` (aktuell stabil, Deutsch ausgezeichnet)
- `language: "de"` setzen → bessere Genauigkeit als Auto-Detect
- `response_format: "verbose_json"` mit `word`-Timestamps → für Karaoke-Sync und Pause-Detection
- Maximale Datei: 25 MB (Whisper-Limit). 5min Audio webm ≈ 5 MB → safe.

### 5.2 Server-side Metrics (vor Claude)

Diese pre-computen, damit Claude nicht zählen muss (zuverlässiger + günstiger):

| Metrik                 | Berechnung               | Zielwert                                                      |
| ---------------------- | ------------------------ | ------------------------------------------------------------- |
| **WPM**                | `wörter / sekunden × 60` | Deutsch: 130–160 ist natürlich; <110 wirkt zäh, >180 hektisch |
| **Filler-Ratio**       | `filler / total × 100`   | <2% = stark, >5% = störend                                    |
| **Hedging-Ratio**      | `hedging / total × 100`  | <3% = selbstbewusst                                           |
| **Lange Pausen**       | Wortlücken > 800ms       | 1–3 strategische Pausen pro Minute = gut                      |
| **Erste-Worte-Latenz** | Sekunden bis erstes Wort | <2s = entschlossen                                            |

**Deutsche Filler-Liste** (Erstbestand, erweiterbar):
`ähm, äh, also, halt, irgendwie, sozusagen, quasi, weißt du, ne?, oder so, eigentlich, ja, also ja, mhm, naja`

**Hedging-Liste** (relativiert Aussagen, schwächt Statements):
`vielleicht, eventuell, möglicherweise, ich denke, ich glaube, ein bisschen, irgendwie, so was wie, ich würde sagen, kann sein`

### 5.3 Claude Feedback-Prompt (Skelett)

```
SYSTEM:
Du bist ein erfahrener deutschsprachiger Kommunikationscoach.
Dein Stil: direkt, ehrlich, konkret, ohne Beschönigung — aber respektvoll.
Du gibst Feedback, das man sofort umsetzen kann.
Wenn etwas gut war, sagst du es kurz. Wenn etwas nicht gut war, sagst du es deutlich
und zeigst, wie es besser geht.
Du gibst niemals generische Phrasen ("guter Job!"). Jede Aussage ist auf das
konkrete Transkript bezogen und mit Zitat belegt.

Kontext:
- Aufnahme-Dauer: {duration}s
- Topic: "{topic}"
- Optional Framework-Hint: {framework_hint or "keiner"}
- Transkript: {transcript_text}
- Metrics: {pre_computed_metrics_json}

Antworte ausschließlich als JSON mit diesem Schema:
{
  "overall_score": 0-100,
  "one_sentence_summary": "string (max 20 Wörter)",
  "structure": { "score": 0-10, "framework_detected": "PREP|1-2-3|...|none",
                 "comment": "string mit Zitat" },
  "clarity": { "score": 0-10, "comment": "string" },
  "delivery": { "wpm_assessment": "...", "filler_assessment": "...",
                "hedging_assessment": "...", "comment": "string" },
  "engagement": { "score": 0-10, "hook_quality": "...", "comment": "string" },
  "top_3_strengths": ["string", "string", "string"],
  "top_3_improvements": [
    {"issue": "string", "example_from_transcript": "string",
     "better_alternative": "string"},
    ...
  ],
  "framework_suggestion": {
    "name": "string",
    "why": "string",
    "how_it_would_have_sounded": "string (umformulierter Anfang)"
  },
  "next_drill": "string (konkrete Übung für nächstes Mal)"
}
```

Wichtig: **Beispiel-aus-Transcript-Zitate erzwingen** — verhindert generisches Bullshit-Feedback.

---

## 6. Feedback-Kriterien (was bewertet wird)

Inspiriert von Yoodli, Orai, Speeko und der Speech-Coaching-Literatur. Vier Achsen, jede mit klaren Sub-Items:

### 6.1 Struktur

- Klarer Anfang / Mitte / Ende?
- Ist die Hauptbotschaft erkennbar in den ersten 10 Sekunden?
- Wurde ein Framework angewendet (bewusst oder unbewusst)?
- Wurde der "Punkt" am Ende noch einmal verankert?

### 6.2 Klarheit

- Ist der zentrale Gedanke nachvollziehbar?
- Sätze zu lang/verschachtelt?
- Konkrete Beispiele oder nur Abstraktes?
- Jargon ohne Erklärung?

### 6.3 Delivery

- WPM angemessen?
- Filler-Wörter (deutsche Liste)
- Hedging (schwächt Aussagen)
- Pausen: strategisch oder Verlegenheit?

### 6.4 Engagement

- Starker Hook am Anfang?
- Geschichten oder nur Aufzählung?
- Variation in Satzlänge / Energie (aus Transkript ableitbar)?
- Würde ein Zuhörer dranbleiben?

### Bei Video zusätzlich (Phase 3+)

- Blick zur Kamera
- Gestik (Hände sichtbar?)
- Mimik / "Resting Face"
- Hintergrund / Setup
  **Hinweis**: Für Körpersprache-Analyse aus Video brauchst du entweder Gemini Multimodal API oder du sendest 5–10 Keyframes an Claude (multimodal). Optional in v2.

---

## 7. Frameworks-Bibliothek (Initial-Inhalt)

Diese 10 deckt die wichtigsten Situationen ab. Quelle u.a. Vinh Giang, Toastmasters, Minto, Monroe.

| #   | Framework                       | Struktur                                                 | Wann nutzen                                    |
| --- | ------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| 1   | **1-2-3**                       | 1 Thing · 2 Types · 3 Steps                              | Wenn dich jemand kalt erwischt — "Was ist X?"  |
| 2   | **PREP**                        | Point · Reason · Example · Point                         | Meinungen, Argumente, kurze Statements         |
| 3   | **STAR**                        | Situation · Task · Action · Result                       | Berufliche Beispiele, Interviews, Case Studies |
| 4   | **PEEL**                        | Point · Evidence · Explanation · Link                    | Längere Argumentation, akademisch              |
| 5   | **Past–Present–Future**         | Wo waren wir · Wo sind wir · Wo gehen wir hin            | Status-Updates, Team-Briefings                 |
| 6   | **Problem–Cause–Solution**      | Problem · Ursache · Lösung                               | Troubleshooting, Pitches an Kunden             |
| 7   | **Monroe's Motivated Sequence** | Attention · Need · Satisfaction · Visualization · Action | Verkauf, Überzeugen, Reden mit Call-to-Action  |
| 8   | **Minto Pyramid**               | Antwort zuerst · Argumente · Daten                       | Executive-Kommunikation, Berater-Stil          |
| 9   | **Hook–Story–Offer**            | Aufmerksamkeit · Geschichte · Angebot                    | Pitches, Sales, Reels-Skripte                  |
| 10  | **WAIT** ("Why Am I Talking?")  | Selbst-Check vor dem Sprechen                            | Meetings, Diskussionen — wann besser zuhören   |

Pro Framework: 1 Detail-Seite mit Beispiel, Mini-Übung, "Jetzt damit aufnehmen"-Button.

---

## 8. Themen-Bibliothek (Initial)

Starte mit ~80–100 manuell kuratierten Themen in 6 Kategorien. **Mische bewusst leichte und harte.** In Phase 2 ergänzt Claude on-demand neue Themen.

**Kategorien**:

1. **Business / Pitch** ("Erkläre Webroids in 60 Sekunden", "Verteidige eine Designentscheidung")
2. **Persönlich / Reflexion** ("Was hat dich diese Woche gelernt?", "Größte berufliche Veränderung")
3. **Smalltalk** ("Lieblingsfilm und warum", "Wenn du eine Stadt wärst…")
4. **Erklärung / Teach-back** ("Erkläre einem Laien, wie ein Browser funktioniert")
5. **Streit / Position** ("Verteidige eine kontroverse Meinung", "Pro/Contra Remote Work")
6. **Storytelling** ("Erzähle einen peinlichen Moment", "Beste Kindheitserinnerung")

**Schwierigkeit** als Tag: Easy / Medium / Hard.
**Sprache** als Tag (DE / EN), falls du auch Englisch trainieren willst.

---

## 9. Datenmodell (Supabase)

```sql
-- Topics (kann vorab gesäht oder von Claude generiert werden)
create table topics (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null,
  difficulty text check (difficulty in ('easy','medium','hard')),
  language text default 'de',
  source text default 'curated', -- 'curated' | 'ai_generated'
  created_at timestamptz default now()
);

-- Frameworks (statisch, ggf. als JSON in der App, nicht in DB)
-- ist Content, kein Datenmodell

-- Recordings
create table recordings (
  id uuid primary key default gen_random_uuid(),
  topic_text text not null,             -- denormalisiert (auch wenn Topic gelöscht)
  topic_id uuid references topics(id),  -- optional ref
  framework_hint text,                  -- 'PREP', '1-2-3', etc., null wenn frei
  type text check (type in ('audio','video')) not null,
  duration_target int not null,         -- gewünschte Sekunden
  duration_actual int not null,         -- tatsächliche Sekunden
  file_path text not null,              -- Supabase Storage Pfad
  created_at timestamptz default now(),
  processed_at timestamptz,
  status text default 'recorded'        -- recorded | transcribing | analyzing | done | error
);

create table transcripts (
  recording_id uuid primary key references recordings(id) on delete cascade,
  text text not null,
  words jsonb,                          -- [{word, start, end}]
  segments jsonb
);

create table metrics (
  recording_id uuid primary key references recordings(id) on delete cascade,
  wpm float,
  word_count int,
  filler_count int,
  filler_ratio float,
  hedging_count int,
  hedging_ratio float,
  long_pauses int,
  first_word_latency float
);

create table feedback (
  recording_id uuid primary key references recordings(id) on delete cascade,
  overall_score int,
  summary text,
  data jsonb,                           -- komplettes Claude-JSON
  model text,                           -- 'claude-sonnet-4-6' etc.
  created_at timestamptz default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid references recordings(id) on delete cascade,
  label text
);

create table notes (
  recording_id uuid primary key references recordings(id) on delete cascade,
  text text,
  updated_at timestamptz default now()
);
```

---

## 10. UX-Prinzipien

1. **Reibungslosigkeit > Features.** Vom Tap "Aufnehmen" bis zum tatsächlichen Sprechen sollten **<5 Sekunden** liegen. Sonst nutzt du das Tool nicht.
2. **Niemals Aufnahmen verlieren.** Auch wenn Whisper/Claude failen, das File bleibt. Re-process später möglich.
3. **Feedback als Lehr-Erlebnis, nicht als Score-Sheet.** Konkrete Zitate + bessere Alternativen, nicht nur Zahlen.
4. **Re-Watch muss freudvoll sein.** Karaoke-Sync zwischen Audio und Transkript, klickbar, springbar.
5. **Mobile-First.** Du wirst das hauptsächlich am iPhone nutzen, nicht am Desktop.
6. **Dark Mode default**, da Aufnahme oft abends.
7. **Keine Push-Notifications** außer du explizit aktivierst (Streak-Reminder optional).

---

## 11. MVP-Roadmap (Phasen)

**Annahme: Solo-Build, abendliche Slots, ~6–10h pro Phase. Komplettzeit ~3–5 Wochen.**

### Phase 1: Core Loop (1 Woche)

**Ziel: Aufnehmen → Transkript → Feedback → Anschauen funktioniert end-to-end für Audio.**

- [ ] Next.js 15 Projekt-Setup, Supabase verkabeln
- [ ] Statische Topic-Liste (50 Themen, JSON)
- [ ] Topic-Generator UI (Würfel + Reroll + Custom-Override)
- [ ] Dauer-Slider + Audio-Recording (`MediaRecorder`)
- [ ] Upload → Supabase Storage
- [ ] Server Action: Whisper-Call → Transkript speichern
- [ ] Server Action: Pre-Compute Metrics
- [ ] Server Action: Claude-Call → Feedback-JSON
- [ ] Feedback-Screen mit Player + Transcript (ohne Karaoke-Sync) + Score-Cards
- [ ] History-Liste (chronologisch, ohne Filter)

**Lieferzustand**: Du kannst die App täglich nutzen.

### Phase 2: Qualität & Video (1 Woche)

- [ ] Video-Recording inkl. Live-Preview
- [ ] Karaoke-Transcript-Sync (Wort-Highlighting beim Abspielen)
- [ ] Verbesserter Claude-Prompt mit Framework-Detection
- [ ] Framework-Hint vor Aufnahme wählbar
- [ ] Tags + Notes
- [ ] iOS-Quirks fixen (Codec-Fallbacks)

### Phase 3: Resources & Insights (1 Woche)

- [ ] Frameworks-Bibliothek (10 Frameworks als statische Inhalte, schöne UI)
- [ ] Trends-Dashboard (Charts: WPM, Filler über Zeit)
- [ ] Deine Top-5 Filler-Wörter
- [ ] "Best Of"-Bookmark
- [ ] Compare-View (2 Aufnahmen nebeneinander)

### Phase 4: Drill-Modus & AI-Themen (optional, 1 Woche)

- [ ] Multi-Day-Challenges ("5-Tage PREP")
- [ ] AI generiert auf Wunsch frische Themen
- [ ] Streak-Tracker
- [ ] Export einer Aufnahme als PDF (Topic + Transcript + Feedback)

---

## 12. Risiken & Gegenmaßnahmen

| Risiko                                           | Maßnahme                                                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| iOS Safari `MediaRecorder` Codec-Probleme        | Feature-Detect, Fallback auf `mp4`, server-side `ffmpeg`                                                     |
| Whisper transkribiert Schweizerdeutsch schlecht  | Sprache explizit `"de"` setzen, ggf. Glossar-Prompting; bei Bedarf später Whisper Large v3 (selbst gehostet) |
| Claude generiert generisches Feedback            | Strikt strukturiertes JSON-Schema **und** Zitate aus Transkript erzwingen                                    |
| Aufnahmen werden zu groß (lange Sessions, Video) | Bitrate-Cap setzen (Audio 64kbps Opus, Video 1Mbps VP9), Dauer-Limit hart bei 10min                          |
| Du nutzt es nach 2 Wochen nicht mehr             | Streak-Mechanik einbauen, kurzes Tagesziel ("1×1min/Tag")                                                    |
| API-Kosten explodieren                           | Hard Limit: max 30 Aufnahmen/Tag, dann Toast-Warnung                                                         |
| File-Verlust bei Browser-Crash mid-recording     | Chunks alle 5s ins IndexedDB schreiben, Resume-Logik                                                         |

---

## 13. Empfohlene nächste Entscheidungen

Bevor Phase 1 startet, klärst du am besten:

1. **Sprachen-Scope**: Nur Deutsch zum Start, oder Deutsch + Englisch parallel? (Empfehlung: nur DE für MVP, EN später)
2. **Audio-Codec-Akzeptanz**: Reichen dir webm-Aufnahmen, oder willst du sie später in Davinci Resolve schneiden? (Falls ja: server-side mp4-Konvertierung einbauen, du kennst ffmpeg ja schon aus den Wedding-Workflows)
3. **Feedback-Tonalität**: Eher streng-direkt ("das war schwach, weil…") oder warm-konstruktiv? (Empfehlung: streng-direkt — du willst echtes Feedback, kein Coaching-Theater. Das spiegelt auch deinen sonstigen Workflow-Stil.)
4. **Framework-Detection-Strenge**: Soll Claude streng nur "echtes" PREP erkennen, oder auch "PREP-light"? (Empfehlung: streng + zusätzliche Kategorie "ansatzweise")
5. **Hosting**: Vercel + Supabase okay, oder willst du es in der Webroids Next.js-Codebase als Subroute? (Empfehlung: separates Projekt, sonst überfrachtest du das Analytics-App-Repo)

---

## 14. Inspirations-Benchmark

Tools, die ähnliche Probleme lösen — nicht zum Kopieren, zum Lernen:

- **Yoodli** — Standard für Filler-Word-Tracking; ihr Transcript+Feedback-Layout ist Referenz
- **Orai** — Mobile-Lessons-UX ist sauber; Mikrolernen pro Tag
- **Speeko** — iOS-Native, Voice-Coach-Content; Apple "App of the Day"
- **Poised** — Live-Feedback während Calls (für dich nicht relevant, aber gut zu kennen)

Du baust eine **fokussiertere, ehrlichere, persönlichere Version** für genau einen User: dich.

---

## 15. Was du als Erstes tust

**Heute** (1h):

- Repo aufsetzen: `npx create-next-app webroids-speechlab --typescript --tailwind --app`
- Supabase-Projekt erstellen, Schema aus Abschnitt 9 ausführen
- ANTHROPIC_API_KEY und OPENAI_API_KEY in `.env.local`

**Wochenende 1** (~6h):

- Topic-Liste (50 Themen) als JSON committen
- Recording-Screen mit `MediaRecorder` (nur Audio, kein Video noch)
- Whisper-Endpoint
- Erste Aufnahme transkribiert sehen → kleines Erfolgserlebnis

**Wochenende 2** (~6h):

- Claude-Feedback-Endpoint mit JSON-Schema
- Feedback-Screen, der das JSON rendert
- History-Liste

Damit hast du in 2 Wochen ein nutzbares persönliches Tool.

---
