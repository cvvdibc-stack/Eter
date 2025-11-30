# Instrukcja Deploy na Vercel

## Szybki Deploy przez CLI

1. Zainstaluj Vercel CLI:
```bash
npm install -g vercel
```

2. Zaloguj się:
```bash
vercel login
```

3. Wdróż projekt:
```bash
vercel
```

4. Wdróż na produkcję:
```bash
vercel --prod
```

## Automatyczny Deploy przez GitHub

1. Przejdź na https://vercel.com i zaloguj się
2. Kliknij "Add New Project"
3. Połącz swoje repozytorium GitHub
4. Ustawienia:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Dodaj zmienne środowiskowe w Settings → Environment Variables:
   - `VITE_SUPABASE_URL` = (twój URL)
   - `VITE_SUPABASE_ANON_KEY` = (twój klucz)
6. Kliknij "Deploy"

Po konfiguracji każdy push do `main`/`master` automatycznie wdraża aplikację.

## Zmienne Środowiskowe

Upewnij się, że w Vercel są ustawione:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Znajdziesz je w panelu Supabase → Settings → API.

