-- Naprawa brakującej kolumny odblokowanych potworów (KLUCZOWE dla Wypraw)
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS unlocked_monsters text[] DEFAULT array['monster_1'];

-- Upewnienie się, że kolumny progresu istnieją (Dla Lochów i Bonusów)
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS dungeon_progress jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS unlocked_bonuses jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS kill_stats jsonb DEFAULT '{}'::jsonb;

-- Upewnienie się, że kolumna Ekwipunku i Plecaka istnieje
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS equipment jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS inventory jsonb DEFAULT '[]'::jsonb;

