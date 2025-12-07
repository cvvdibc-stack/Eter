# Eter Landing Page

Landing page dla gry Eter zbudowana w Next.js 14 z pełnym systemem CMS, forum, SEO i integracją z główną grą.

## Funkcjonalności

- ✅ Hero Section z licznikiem graczy online
- ✅ Opis gry i podgląd screenshotów
- ✅ Ranking TOP 10 graczy
- ✅ News Feed i Changelog
- ✅ Roadmap postępu prac
- ✅ System Forum (tematy, posty, polubienia)
- ✅ Panel gracza (zarządzanie postaciami)
- ✅ Strona statusu serwera
- ✅ Panel administracyjny (CMS)
- ✅ Strony SEO (poradniki, wiki)
- ✅ Strony prawne (regulamin, RODO, etc.)

## Setup

1. Zainstaluj zależności:
```bash
npm install
```

2. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env.local
```

Wypełnij:
- `NEXT_PUBLIC_SUPABASE_URL` - URL twojego Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key z Supabase
- `NEXT_PUBLIC_GAME_URL` - URL głównej aplikacji gry
- `REVALIDATE_SECRET` - Secret dla webhooków ISR

3. Uruchom migrację bazy danych:
```sql
-- Wykonaj plik migrations/017_create_landing_page_tables.sql w Supabase
```

4. Uruchom serwer deweloperski:
```bash
npm run dev
```

5. Otwórz [http://localhost:3000](http://localhost:3000)

## Struktura

```
landingpage/
├── app/                    # Next.js App Router
│   ├── admin/              # Panel administracyjny
│   ├── forum/              # Forum
│   ├── profile/            # Panel gracza
│   ├── guide/               # Poradniki (SEO)
│   ├── status/              # Status serwera
│   └── changelog/           # Changelog
├── components/              # Komponenty React
│   ├── auth/               # Modale logowania/rejestracji
│   ├── admin/              # Komponenty admina
│   ├── forum/              # Komponenty forum
│   └── profile/            # Komponenty profilu
├── lib/                     # Biblioteki pomocnicze
│   ├── supabase.ts         # Klient Supabase
│   ├── queries.ts          # Zapytania do bazy
│   └── admin.ts            # Funkcje admina
└── types/                   # Definicje TypeScript
```

## ISR/SSR/SSG

- **SSR**: `/profile`, `/admin/*`, `/forum/[topicId]`
- **ISR**: `/` (60s), `/status` (30s), `/ranking` (120s), `/changelog` (on-demand)
- **SSG**: `/guide/*`, `/terms`, `/privacy`, `/rules`, `/rodo`

## Deployment

Projekt jest gotowy do deploy na Vercel:

1. Połącz repozytorium z Vercel
2. Ustaw zmienne środowiskowe
3. Skonfiguruj webhooki w Supabase dla ISR revalidation

## Panel Administracyjny

Aby uzyskać dostęp do panelu admina:

1. Zaloguj się jako użytkownik w Supabase
2. Dodaj użytkownika do tabeli `admin_users`:
```sql
INSERT INTO admin_users (user_id, role) 
VALUES ('your-user-id', 'admin');
```

3. Zaloguj się na `/admin/login`

## Licencja

Projekt prywatny - Eter Game



