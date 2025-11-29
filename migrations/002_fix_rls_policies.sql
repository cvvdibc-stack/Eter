-- Migracja 002: Naprawa uprawnien RLS (Row Level Security)
-- Uruchom to w Supabase SQL Editor

-- 1. Upewnienie sie, ze RLS jest wlaczone
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_logs ENABLE ROW LEVEL SECURITY;

-- 2. Wyczyszczenie starych polityk (dla pewnosci, zeby nie bylo konfliktow)
DROP POLICY IF EXISTS "Users can view own characters" ON characters;
DROP POLICY IF EXISTS "Users can update own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert own characters" ON characters;

DROP POLICY IF EXISTS "Users can view own logs" ON combat_logs;
DROP POLICY IF EXISTS "Users can insert own logs" ON combat_logs;

-- 3. Nowe, poprawne polityki dla CHARACTERS
-- Pozwalaja widziec, edytowac i tworzyc wlasne postacie
CREATE POLICY "Users can view own characters" 
ON characters FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own characters" 
ON characters FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters" 
ON characters FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Nowe, poprawne polityki dla COMBAT_LOGS
-- Pozwalaja dodawac historie walki i ja przegladac
CREATE POLICY "Users can view own logs" 
ON combat_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" 
ON combat_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Odswiezenie cache uprawnien
NOTIFY pgrst, 'reload schema';

