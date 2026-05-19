-- Drop permissive policy that allowed NULL user_id rows to be visible to everyone
DROP POLICY IF EXISTS "recordings_owner" ON recordings;
DROP POLICY IF EXISTS "recordings_insert_own" ON recordings;

-- Strict: only own rows, no NULL exception
CREATE POLICY "recordings_owner" ON recordings
  USING (user_id = auth.uid());

CREATE POLICY "recordings_insert_own" ON recordings
  FOR INSERT WITH CHECK (user_id = auth.uid());
