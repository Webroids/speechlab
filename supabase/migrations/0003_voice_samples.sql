-- Add voice_samples column for pitch/energy timeline data captured during recording
ALTER TABLE recordings ADD COLUMN IF NOT EXISTS voice_samples jsonb;
