-- Create pvp_battles table for tracking active PvP battles
-- Note: characters.id is UUID in actual database
CREATE TABLE IF NOT EXISTS pvp_battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attacker_id UUID NOT NULL, -- Character ID (UUID to match characters.id)
    defender_id UUID NOT NULL, -- Character ID (UUID to match characters.id)
    attacker_name TEXT NOT NULL,
    defender_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    winner_id UUID, -- NULL if not finished
    battle_logs JSONB DEFAULT '[]'::jsonb, -- Array of combat turns
    attacker_hp INTEGER NOT NULL,
    defender_hp INTEGER NOT NULL,
    attacker_max_hp INTEGER NOT NULL,
    defender_max_hp INTEGER NOT NULL,
    turn_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pvp_battles_defender ON pvp_battles(defender_id, status);
CREATE INDEX IF NOT EXISTS idx_pvp_battles_attacker ON pvp_battles(attacker_id, status);

-- Enable RLS
ALTER TABLE pvp_battles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can see battles where they are attacker or defender
CREATE POLICY "Users can view own battles" ON pvp_battles
    FOR SELECT
    USING (
        auth.uid() = (SELECT user_id FROM characters WHERE id = pvp_battles.attacker_id)
        OR auth.uid() = (SELECT user_id FROM characters WHERE id = pvp_battles.defender_id)
    );

-- Policy: Users can insert battles where they are attacker
CREATE POLICY "Users can create battles as attacker" ON pvp_battles
    FOR INSERT
    WITH CHECK (
        auth.uid() = (SELECT user_id FROM characters WHERE id = pvp_battles.attacker_id)
    );

-- Policy: Users can update battles where they are attacker or defender
CREATE POLICY "Users can update own battles" ON pvp_battles
    FOR UPDATE
    USING (
        auth.uid() = (SELECT user_id FROM characters WHERE id = pvp_battles.attacker_id)
        OR auth.uid() = (SELECT user_id FROM characters WHERE id = pvp_battles.defender_id)
    );

-- Enable Realtime for pvp_battles
ALTER PUBLICATION supabase_realtime ADD TABLE pvp_battles;

