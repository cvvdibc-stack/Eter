# Projekt Gry RPG (Cienie Eteru) - Dokumentacja Projektowa

## 1. Struktura Konta i Postaci
**Proces Rejestracji:**
- Email, Hasło, Nick (unikalny globalnie).
- Weryfikacja emaila (anty-bot).
- Konto może posiadać do 5 postaci.

**Postać:**
- Nick (unikalny w świecie).
- Profesja (wybierana przy tworzeniu).
- Poziom (1-100+).
- Doświadczenie (krzywa wykładnicza: `100 * level^1.5`).
- Statystyki Bazowe + Rozdane Punkty.

## 2. Profesje
### Wojownik (Warrior)
- **Rola:** Tank / Fizyczny DPS.
- **Statystyki:** Siła (Dmg/Armor), Witalność (HP).
- **Bronie:** Miecze, Topory, Tarcze.
- **Pasywka:** "Żelazna Skóra" (+10% Pancerza).

### Zabójca (Assassin)
- **Rola:** Burst DPS / Uniki.
- **Statystyki:** Zręczność (Dmg/Crit/Dodge).
- **Bronie:** Sztylety, Łuki.
- **Pasywka:** "Instynkt" (+5% Crit).

### Mag (Mage)
- **Rola:** Magic DPS / AoE.
- **Statystyki:** Inteligencja (Magic Dmg).
- **Bronie:** Kostury, Różdżki.
- **Pasywka:** "Eter" (+10% Mag Dmg).

### Kleryk (Cleric)
- **Rola:** Support / Paladin.
- **Statystyki:** Inteligencja + Witalność.
- **Bronie:** Buławy, Księgi.
- **Pasywka:** "Regeneracja" (5% HP/turę).

## 3. Wzory Statystyk
- **HP:** `Vitality * 10 + Level * 10`
- **Armor:** `Strength * 2 + Dexterity * 0.5`
- **Redukcja Obrażeń:** `Armor / (Armor + 200)` (Diminishing returns, soft cap 75%)
- **Uniki (%):** `(Dexterity / (Dexterity + 100)) * 50`
- **Krytyk (%):** `(Dexterity / (Dexterity + 80)) * 60`
- **Obrażenia:** `(WeaponMin + WeaponMax)/2 + PrimaryStat * 1.5`

## 4. Mechanika Walki
Turowa (Turn-based):
1. Inicjatywa (losowa lub statystyka Szybkość).
2. Atakujący wykonuje rzut na trafienie (`HitChance = 95 - EnemyDodge`).
3. Jeśli trafienie -> rzut na Krytyk (`CritChance`).
4. Obliczenie DMG -> Redukcja przez Pancerz/Resist.
5. Odjęcie HP.
6. Sprawdzenie efektów (krwawienie, ogłuszenie).
7. Zmiana tury.

## 5. Ekspedycje i PvE
- **Mapy:** Las Cieni, Pustkowia, Zapomniane Ruiny.
- **System Energii:** Każda walka kosztuje 1-5 Energii. Energia odnawia się w czasie (1 pkt / 5 min).
- **Loot:** Szansa na drop po każdej walce. Bossowie mają 100% na unikat+.

## 6. System Przedmiotów
**Rzadkości:**
- **Pospolity (Szary):** Brak bonusów.
- **Unikat (Zielony):** 1-2 dodatkowe statystyki.
- **Heroiczny (Niebieski):** 3-4 statystyki, wyższe widełki.
- **Legendarny (Pomarańczowy):** Unikalne efekty (np. wampiryzm).
- **Mityczny (Czerwony):** Najpotężniejsze, drop tylko z Rajdów.

## 7. Ekonomia
- **Złoto:** Waluta podstawowa (drop, sprzedaż itemów).
- **Rubiny (Premium):** Przyspieszanie, skiny, sloty w plecaku. (NO Pay-to-Win w statystykach).
- **Rynek:** Gracze mogą wystawiać przedmioty za Złoto (podatek 5%).

## 8. Backend (Supabase/SQL)

### Tabela `users`
- id (uuid)
- email
- created_at

### Tabela `characters`
- id (uuid)
- user_id (fk)
- name (varchar)
- profession (enum)
- level (int)
- exp (int)
- gold (int)
- stats (jsonb) - { str, dex, int, vit }
- equipment (jsonb) - { weapon_id, armor_id... }

### Tabela `items`
- id (uuid)
- owner_id (fk -> characters)
- template_id (fk -> item_templates)
- stats (jsonb) - wylosowane statystyki
- rarity (enum)
- upgrade_level (int)

## 10. Proponowane Klimaty
1. **Cienie Eteru (Mroczne Fantasy):** Wybrany. Walka o przetrwanie w świecie opanowanym przez Pustkę.
2. **Neon Ronin (Cyberpunk):** Korporacje vs Uliczni Samuraje. Implanty zamiast zbroi.
3. **Valhalla Rising (Nordycki):** Wikingowie, runy, walka o przychylność bogów.

## 12. Plan Prototypu (7 Dni)
- **Dzień 1:** Setup projektu, Types, Context (Zrobione).
- **Dzień 2:** UI Hub, Kreator Postaci (Zrobione).
- **Dzień 3:** Logika Walki, Formuły Matematyczne (Zrobione).
- **Dzień 4:** System Ekwipunku i Generowanie Lootu (Zrobione MVP).
- **Dzień 5:** Ekspedycje (Wybór map, różni przeciwnicy).
- **Dzień 6:** Sklep i Ekonomia (Kupno/Sprzedaż).
- **Dzień 7:** Balans, Polerowanie UI, Deploy.

---
*Dokument wygenerowany przez AI Assistant dla projektu gry.*

