-- Migracja 001: Dodanie brakujących kolumn dla Talizmanów i Statystyk
-- Uruchom ten skrypt w Supabase SQL Editor, aby naprawić błąd zapisu (400 Bad Request).

-- 1. Talizmany (To powodowało błąd "Could not find 'active_talismans'")
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS active_talismans jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS talismans_inventory jsonb DEFAULT '[]'::jsonb;

-- 2. Statystyki Zabójstw (Wymagane dla Bestiariusza)
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS kill_stats jsonb DEFAULT '{}'::jsonb;

-- 3. Odblokowane Potwory (Wymagane dla zapisu postępu Wypraw)
-- Używamy text[], bo tak jest w kodzie TypeScript
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS unlocked_monsters text[] DEFAULT array['monster_1'];

-- 4. Odświeżenie cache schematu (Dla pewności)
NOTIFY pgrst, 'reload schema';

