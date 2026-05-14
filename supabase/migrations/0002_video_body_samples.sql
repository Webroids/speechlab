-- Add body_samples column for MediaPipe body language analysis results
ALTER TABLE recordings ADD COLUMN IF NOT EXISTS body_samples jsonb;

-- topic_category was added in a hotfix; ensure it exists
ALTER TABLE recordings ADD COLUMN IF NOT EXISTS topic_category text;
