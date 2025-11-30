# Plan Implementacji Areny PvP

## 1. Struktura Komponentów

### ArenaScreen.tsx
- **Główny komponent areny**
- Lista graczy dostępnych do walki
- Filtry: poziom, profesja, aktywność
- Przycisk "Odśwież listę"
- Karty graczy z podstawowymi informacjami

### PlayerProfileModal.tsx
- **Modal z profilem gracza**
- Wyświetla:
  - Avatar i podstawowe info (nazwa, poziom, profesja)
  - Statystyki (obliczone z ekwipunkiem)
  - Ekwipunek (podgląd itemów)
  - Historia walk (opcjonalnie)
- Przyciski:
  - "Zaatakuj" - rozpoczyna walkę
  - "Zamknij"

## 2. Funkcje w GameContext

### loadArenaPlayers()
```typescript
loadArenaPlayers: (filters?: { minLevel?: number, maxLevel?: number, profession?: Profession }) => Promise<{ suggested: Character[], others: Character[] }>
```
- Pobiera graczy z bazy danych
- **Proponowani gracze:** ±5 poziomów od gracza (priorytet)
- **Reszta graczy:** pozostali gracze
- Wyklucza własną postać
- Zwraca obiekt z `suggested` i `others` (Character z pełnymi danymi)

### loadPlayerProfile(characterId: string)
```typescript
loadPlayerProfile: (characterId: string) => Promise<Character | null>
```
- Pobiera pełne dane gracza (equipment, inventory, stats)
- Oblicza statystyki z ekwipunkiem
- Zwraca Character lub null jeśli nie znaleziono

### startPvPCombat(targetCharacterId: string)
```typescript
startPvPCombat: (targetCharacterId: string) => void
```
- Konwertuje Character na Monster dla CombatScreen
- Ustawia activeMonsterType na 'ARENA'
- Przekierowuje do CombatScreen

## 3. Konwersja Character → Monster (dla walki)

### createPvPMonster(character: Character): Monster
- Konwertuje gracza na "monstera" do walki
- Używa obliczonych statystyk gracza
- Ustawia odpowiednie typy i nazwy

## 4. UI/UX Design

### Lista Graczy
- Karty z:
  - Avatar (z getAvatarSrc)
  - Nazwa, poziom, profesja
  - Ikona poziomu
  - Przycisk "Profil" i "Zaatakuj"
- Filtry:
  - Zakres poziomów
  - Profesja
  - Sortowanie (poziom, aktywność)

### Modal Profilu
- Layout podobny do InventoryScreen
- Lewa strona: Avatar + podstawowe statystyki
- Prawa strona: Ekwipunek (tylko do podglądu)
- Przycisk "Zaatakuj" na dole

## 5. Logika Walki PvP

### Różnice od PvE:
- Brak nagród EXP/Gold (lub minimalne)
- Możliwość nagród rankingowych
- Historia walk PvP
- System rankingowy (opcjonalnie)

### CombatScreen
- Już obsługuje activeMonsterType === 'ARENA'
- Po wygranej: powrót do Areny
- Po przegranej: powrót do Areny

## 6. Baza Danych

### Ewentualne rozszerzenia:
- Tabela `pvp_matches` (historia walk)
- Tabela `arena_rankings` (ranking PvP)
- Kolumna `last_active` w characters (dla filtrowania aktywnych)

## 7. Implementacja Krok po Kroku

1. **Dodanie funkcji w GameContext:**
   - loadArenaPlayers()
   - loadPlayerProfile()
   - startPvPCombat()
   - createPvPMonster() (helper)

2. **Stworzenie ArenaScreen.tsx:**
   - Lista graczy
   - Filtry
   - Karty graczy

3. **Stworzenie PlayerProfileModal.tsx:**
   - Modal z profilem
   - Przyciski akcji

4. **Integracja z CombatScreen:**
   - Upewnić się, że walka PvP działa poprawnie
   - Obsługa powrotu do Areny

5. **Testy:**
   - Pobieranie graczy
   - Wyświetlanie profilu
   - Rozpoczynanie walki

