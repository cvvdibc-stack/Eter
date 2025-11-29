-- 1. Fix 'items' table schema (add missing 'profession' column)
ALTER TABLE items ADD COLUMN IF NOT EXISTS profession TEXT;

-- 2. Bestiary Migration: Ensure 'kill_stats' column exists in 'characters'
ALTER TABLE characters ADD COLUMN IF NOT EXISTS kill_stats JSONB DEFAULT '{}'::jsonb;

-- 3. Security Policies (RLS)

-- Enable RLS on tables
ALTER TABLE monsters ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;

-- Policy for Monsters: Public Read (Everyone can see monsters)
DROP POLICY IF EXISTS "Public Read Monsters" ON monsters;
CREATE POLICY "Public Read Monsters" ON monsters FOR SELECT USING (true);

-- Policy for Items: Public Read (Everyone can see item templates)
DROP POLICY IF EXISTS "Public Read Items" ON items;
CREATE POLICY "Public Read Items" ON items FOR SELECT USING (true);

-- Policy for Characters: Users can update their own character (including Bestiary/kill_stats)
-- Note: Assuming 'characters' already has RLS enabled from previous migrations.
DROP POLICY IF EXISTS "Users can update own character" ON characters;
CREATE POLICY "Users can update own character" ON characters FOR UPDATE USING (auth.uid() = user_id);

-- Policy for Combat Logs: Users can insert and read their own logs
DROP POLICY IF EXISTS "Users can insert combat logs" ON combat_logs;
CREATE POLICY "Users can insert combat logs" ON combat_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own combat logs" ON combat_logs;
CREATE POLICY "Users can read own combat logs" ON combat_logs FOR SELECT USING (auth.uid() = user_id);

