-- Create monsters table
CREATE TABLE IF NOT EXISTS monsters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    is_boss BOOLEAN DEFAULT FALSE,
    type TEXT NOT NULL,
    description TEXT,
    image TEXT,
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    rewards JSONB NOT NULL DEFAULT '{}'::jsonb,
    loot_table JSONB NOT NULL DEFAULT '{}'::jsonb,
    mechanics JSONB DEFAULT '[]'::jsonb
);

-- Create items table (templates for legends/mythics)
CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    rarity TEXT NOT NULL,
    profession TEXT, -- 'warrior', 'mage', etc. or NULL for all
    level_req INTEGER NOT NULL DEFAULT 1,
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    image TEXT
);

-- Add inventory_version to characters for migration/reset purposes
ALTER TABLE characters ADD COLUMN IF NOT EXISTS inventory_version INTEGER DEFAULT 0;

-- Create GIN indexes for JSONB columns for faster querying
CREATE INDEX IF NOT EXISTS idx_monsters_stats ON monsters USING GIN (stats);
CREATE INDEX IF NOT EXISTS idx_monsters_loot_table ON monsters USING GIN (loot_table);
CREATE INDEX IF NOT EXISTS idx_items_stats ON items USING GIN (stats);

-- Reset player inventories and gold (The Great Reset)
-- We set inventory_version to 1 to indicate they are on the new system
UPDATE characters 
SET 
    inventory = '[]'::jsonb, 
    equipment = '{
        "weapon": null,
        "helmet": null,
        "armor": null,
        "boots": null,
        "gloves": null,
        "amulet": null,
        "ring": null,
        "shield": null,
        "talisman": null
    }'::jsonb,
    gold = 0,
    inventory_version = 1;

