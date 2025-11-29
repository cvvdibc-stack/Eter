-- 1. Tabela Profiles (użytkownicy) - standard Supabase Auth
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Tabela Characters (Główna tabela postaci)
create table if not exists public.characters (
  id text not null primary key, -- ID generowane w frontendzie (timestamp)
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  profession text not null, -- 'warrior', 'mage', etc.
  level integer default 1,
  exp integer default 0,
  max_exp integer default 100,
  gold integer default 0,
  premium_currency integer default 0,
  energy integer default 50,
  max_energy integer default 50,
  
  -- Statystyki (JSONB dla elastyczności)
  stats jsonb default '{"strength":0, "dexterity":0, "intelligence":0, "vitality":0}'::jsonb,
  
  -- Ekwipunek i Plecak (JSONB - kluczowe dla naszej gry)
  equipment jsonb default '{}'::jsonb, -- Założone przedmioty
  inventory jsonb default '[]'::jsonb, -- Przedmioty w plecaku
  
  -- System Talizmanów (Nowość)
  talismans_inventory jsonb default '[]'::jsonb, -- Posiadane ID talizmanów
  active_talismans jsonb default '[]'::jsonb, -- Założone ID talizmanów (sloty)
  
  -- System Progresji i Bonusów (Nowość)
  unlocked_monsters text[] default array['monster_1'], -- Lista ID odblokowanych potworów
  unlocked_bonuses jsonb default '{}'::jsonb, -- Bonusy (Mistrzostwo): { "monster_1": ["GOLD", "EXP"] }
  dungeon_progress jsonb default '{}'::jsonb, -- Postęp lochów: { "dungeon_1": 2 }
  kill_stats jsonb default '{}'::jsonb, -- Licznik zabójstw: { "monster_1": 15 }
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Tabela Combat Logs (Historia Walk - Nowość)
create table if not exists public.combat_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    character_id text not null, -- Powiązanie z postacią (tekstowe ID)
    enemy_name text not null,
    result text check (result in ('WIN', 'LOSS')),
    exp_gained integer default 0,
    gold_gained integer default 0,
    loot_gained text, -- Nazwa przedmiotu lub null
    type text check (type in ('EXPEDITION', 'DUNGEON', 'ARENA')),
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Tabela Items (Opcjonalna - jeśli chcesz globalną bazę przedmiotów, choć my używamy generatora)
-- W obecnej architekturze itemy są generowane i trzymane w JSONB postaci, 
-- ale ta tabela może służyć jako "szablon" lub rynek.
create table if not exists public.items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null,
  rarity text not null,
  base_stats jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Row Level Security (Bezpieczeństwo)

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Characters
alter table public.characters enable row level security;
create policy "Users can view own characters" on public.characters for select using (auth.uid() = user_id);
create policy "Users can insert own characters" on public.characters for insert with check (auth.uid() = user_id);
create policy "Users can update own characters" on public.characters for update using (auth.uid() = user_id);
create policy "Users can delete own characters" on public.characters for delete using (auth.uid() = user_id);

-- Combat Logs
alter table public.combat_logs enable row level security;
create policy "Users can view own logs" on public.combat_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.combat_logs for insert with check (auth.uid() = user_id);

-- 6. Funkcja pomocnicza do obsługi nowych użytkowników
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger dla nowych userów
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

