ALTER TABLE recordings
  ADD COLUMN IF NOT EXISTS recording_mode text
  CHECK (recording_mode IN ('conversation', 'presentation'));
