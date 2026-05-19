-- Add user_id to recordings (nullable so existing rows are unaffected)
ALTER TABLE recordings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS recordings_user_id_idx ON recordings (user_id);

-- Enable RLS on all user-data tables
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics     ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback    ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes       ENABLE ROW LEVEL SECURITY;

-- recordings: owner access only (nullable user_id = legacy unowned rows, visible to all)
CREATE POLICY "recordings_owner" ON recordings
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "recordings_insert_own" ON recordings
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Child tables: access via parent recording ownership
CREATE POLICY "transcripts_via_recording" ON transcripts
  USING (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "metrics_via_recording" ON metrics
  USING (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "feedback_via_recording" ON feedback
  USING (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "tags_via_recording" ON tags
  USING (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "tags_insert_via_recording" ON tags
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "tags_delete_via_recording" ON tags
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "notes_via_recording" ON notes
  USING (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

CREATE POLICY "notes_insert_via_recording" ON notes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM recordings r
    WHERE r.id = recording_id
      AND (r.user_id IS NULL OR r.user_id = auth.uid())
  ));

-- Allow service role to bypass RLS for background processing (already default in Supabase)
-- process-recording.ts uses service-role key which bypasses RLS automatically
