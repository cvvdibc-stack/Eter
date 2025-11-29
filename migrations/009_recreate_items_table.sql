-- Migration 009: Recreate items table
-- The existing items table has a structure suited for inventory (character_id, etc.)
-- We need to replace it with a structure for Item Templates.

BEGIN;

-- 1. Drop existing items table (and dependent objects like policies)
DROP TABLE IF EXISTS items CASCADE;

-- 2. Create items table for Templates
CREATE TABLE items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    rarity TEXT NOT NULL,
    profession TEXT,
    level_req INTEGER NOT NULL DEFAULT 1,
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 4. Add Policy for Public Read
CREATE POLICY "Public Read Items" ON items FOR SELECT USING (true);

-- 5. Create Index for performance
CREATE INDEX IF NOT EXISTS idx_items_stats ON items USING GIN (stats);

COMMIT;

