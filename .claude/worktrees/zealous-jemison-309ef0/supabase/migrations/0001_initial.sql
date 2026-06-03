create extension if not exists "pgcrypto";

create table topics (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null,
  difficulty text check (difficulty in ('easy','medium','hard')) not null default 'medium',
  language text not null default 'de',
  source text not null default 'curated',
  created_at timestamptz not null default now()
);

create table recordings (
  id uuid primary key default gen_random_uuid(),
  topic_text text not null,
  topic_id uuid references topics(id),
  framework_hint text,
  type text check (type in ('audio','video')) not null,
  duration_target int not null,
  duration_actual int not null,
  file_path text not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'recorded'
);

create table transcripts (
  recording_id uuid primary key references recordings(id) on delete cascade,
  text text not null,
  words jsonb,
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
  data jsonb not null,
  model text not null,
  created_at timestamptz not null default now()
);

create table tags (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid references recordings(id) on delete cascade,
  label text not null
);

create table notes (
  recording_id uuid primary key references recordings(id) on delete cascade,
  text text,
  updated_at timestamptz not null default now()
);

-- Storage Bucket muss separat über Supabase Dashboard erstellt werden:
-- Name: 'recordings', Typ: private
