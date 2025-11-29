-- Migration 008: Fix ID types to TEXT
-- This is necessary because previous schema versions might have used UUIDs for 'id',
-- but our seed data uses semantic string IDs (e.g., 'monster_1', 'leg_sword_1').

BEGIN;

-- 1. Modify 'items' table
-- Change id to TEXT to support semantic IDs
ALTER TABLE items ALTER COLUMN id TYPE TEXT;

-- 2. Modify 'monsters' table (just in case it's also UUID)
ALTER TABLE monsters ALTER COLUMN id TYPE TEXT;

-- 3. Ensure 'combat_logs' table exists (it was referenced in policies)
CREATE TABLE IF NOT EXISTS combat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    character_id TEXT,
    enemy_name TEXT,
    result TEXT,
    exp_gained INTEGER,
    gold_gained INTEGER,
    loot_gained TEXT,
    type TEXT,
    logs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

COMMIT;

