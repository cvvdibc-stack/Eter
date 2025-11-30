BEGIN;

-- 1. Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
    character_id UUID PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
    strength_bonus INTEGER DEFAULT 0,
    dexterity_bonus INTEGER DEFAULT 0,
    vitality_bonus INTEGER DEFAULT 0,
    intelligence_bonus INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on player_stats
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Policies for player_stats
CREATE POLICY "Users can read own stats" ON player_stats
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM characters WHERE id = player_stats.character_id));

CREATE POLICY "Users can update own stats" ON player_stats
    FOR UPDATE USING (auth.uid() = (SELECT user_id FROM characters WHERE id = player_stats.character_id));

CREATE POLICY "Users can insert own stats" ON player_stats
    FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM characters WHERE id = player_stats.character_id));


-- 2. Add class_req to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS class_req TEXT;

-- 3. Insert Template Items (Legendary & Tytanic for each class)
-- These IDs will be referenced in loot tables

-- WARRIOR
INSERT INTO items (id, name, type, rarity, profession, level_req, class_req, stats, image) VALUES
('leg_warrior_1', 'Ostrze Smoczego Ognia', 'weapon', 'legendary', 'warrior', 25, 'warrior', '{"damageMin": 40, "damageMax": 60, "strength": 20, "vitality": 15, "critChance": 5, "burnChance": 15}'::jsonb, 'default'),
('tytan_warrior_1', 'Tytaniczny Pancerz Niebios', 'armor', 'mythic', 'warrior', 35, 'warrior', '{"armor": 150, "vitality": 40, "strength": 25, "reducedDamage": 10, "unbreakable": 1}'::jsonb, 'default');

-- ASSASSIN
INSERT INTO items (id, name, type, rarity, profession, level_req, class_req, stats, image) VALUES
('leg_assassin_1', 'Cień Zabójcy', 'weapon', 'legendary', 'assassin', 25, 'assassin', '{"damageMin": 35, "damageMax": 50, "dexterity": 25, "critChance": 10, "poisonChance": 20}'::jsonb, 'default'),
('tytan_assassin_1', 'Szata Nocy', 'armor', 'mythic', 'assassin', 35, 'assassin', '{"armor": 80, "dexterity": 45, "vitality": 20, "dodgeChance": 15, "etherealVeil": 10}'::jsonb, 'default');

-- MAGE
INSERT INTO items (id, name, type, rarity, profession, level_req, class_req, stats, image) VALUES
('leg_mage_1', 'Kostur Eteru', 'weapon', 'legendary', 'mage', 25, 'mage', '{"magicDamage": 55, "intelligence": 25, "vitality": 10, "manaShield": 10}'::jsonb, 'default'),
('tytan_mage_1', 'Szata Arcymaga', 'armor', 'mythic', 'mage', 35, 'mage', '{"armor": 60, "intelligence": 50, "vitality": 15, "magicResist": 20, "overload": 10}'::jsonb, 'default');

-- CLERIC
INSERT INTO items (id, name, type, rarity, profession, level_req, class_req, stats, image) VALUES
('leg_cleric_1', 'Młot Sprawiedliwości', 'weapon', 'legendary', 'cleric', 25, 'cleric', '{"damageMin": 35, "damageMax": 55, "intelligence": 15, "strength": 15, "healingPower": 20}'::jsonb, 'default'),
('tytan_cleric_1', 'Pancerz Światłości', 'armor', 'mythic', 'cleric', 35, 'cleric', '{"armor": 120, "vitality": 35, "intelligence": 20, "sanctifiedAura": 1, "hpRegen": 5}'::jsonb, 'default');

COMMIT;

