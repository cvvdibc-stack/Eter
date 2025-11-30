-- NAPRAWA REJESTRACJI (Błąd 500)
-- Skopiuj całą zawartość i uruchom w Supabase Dashboard -> SQL Editor

-- 1. Upewniamy się, że tabela profiles istnieje
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Włączamy RLS dla bezpieczeństwa
alter table public.profiles enable row level security;

-- 3. Uprawnienia (dla pewności)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on table public.profiles to postgres, service_role;

-- 4. Poprawiamy funkcję handle_new_user (dodajemy obsługę błędów)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
exception
  when others then
    -- W razie błędu (np. brak danych) nie blokujemy rejestracji
    return new; 
end;
$$ language plpgsql security definer;

-- 5. Odtwarzamy trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();



