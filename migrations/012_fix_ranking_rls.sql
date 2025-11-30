BEGIN;

-- Ensure RLS is enabled
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for ranking" ON characters;
DROP POLICY IF EXISTS "Users can view all characters for ranking" ON characters;

-- Policy: Anyone can read specific columns for ranking (authenticated or anon if you want public ranking)
CREATE POLICY "Users can view all characters for ranking"
ON characters
FOR SELECT
USING (true); -- Allows reading all rows

COMMIT;

