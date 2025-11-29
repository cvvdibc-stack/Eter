# Podsumowanie Projektu: Cienie Eteru

## 1. Główne Mechaniki Gry

### System Postaci
*   **Profesje:** Wojownik, Zabójca, Mag, Kleryk. Każda z unikalnymi statystykami bazowymi i skalowaniem.
*   **Statystyki:** Siła, Zręczność, Inteligencja, Witalność.
*   **Statystyki Pochodne:** HP, Pancerz, Unik, Krytyk, Obrażenia Fiz/Mag, Odporności, Blok, Moc Leczenia.
*   **Nowe Statystyki (v2):** Szybkość Ataku (SA), Inicjatywa, Stabilność, Przebicie Pancerza/Odporności, Obrażenia Krytyczne, Regeneracja HP, Mana Shield i wiele innych.
*   **Progresja:** 
    *   Doświadczenie (EXP) ze skalowaniem wymaganym na poziom (`55 * L^2 + 110 * L`).
    *   System kar/nagród EXP za różnicę poziomów.
    *   Regeneracja HP: Pasywna (2% + bonusy co minutę) oraz aktywna (Medyk, Mikstury).

### System Walki
*   **Turowy:** Klasyczna walka turowa z logami.
*   **Szybka Walka:** Natychmiastowa symulacja walki dla szybszego grindu.
*   **Inicjatywa:** Oparta na Szybkości Ataku (SA).
*   **Mechaniki:** Uniki, Krytyki, Bloki, DoT (Podpalenie, Trucizna).
*   **Historia Walk:** Zapisywanie ostatnich 50 walk w bazie danych.

### Ekonomia
*   **Złoto:** Zdobywane z potworów (wzór zależny od poziomu + RNG) i sprzedaży przedmiotów.
*   **Rubiny:** Waluta premium (startowa ilość, ikona Gem).
*   **Handel:**
    *   **Sklep:** Kupno/Sprzedaż przedmiotów.
    *   **Ceny:** Dynamiczne mnożniki zależne od rzadkości (od x1.0 do x15.0).
    *   **Odświeżanie:** Możliwość resetu oferty za Rubiny.

## 2. System Przedmiotów (Generator Itemów)

### Generowanie (`itemGenerator.ts`)
*   **Proceduralne:** Przedmioty zwykłe, unikatowe i heroiczne są generowane losowo w oparciu o poziom gracza i profesję.
*   **Szablony:** Przedmioty Legendarne i Tytaniczne są pobierane z bazy danych (predefiniowane szablony) dla unikalności.
*   **Rzadkości:**
    *   **Pospolity (Szary):** 2 statystyki, x1.0 ceny.
    *   **Unikat (Zielony):** 3 statystyki, x1.6 ceny.
    *   **Heroiczny (Niebieski):** 4 statystyki, x2.8 ceny.
    *   **Legendarny (Pomarańczowy):** 6 statystyk, x6.0 ceny, unikalne bonusy.
    *   **Mityczny/Tytaniczny (Czerwony):** 8 statystyk, x15.0 ceny, potężne efekty.
*   **Logika:**
    *   Przedmioty zawsze pasują do klasy (np. Mag nie dostanie miecza z Siłą).
    *   Inteligentne dobieranie statystyk (Matryca Klas).
    *   Ograniczenia poziomu (Level Gate) dla dropu wyższych rzadkości.

### Grafika Przedmiotów (`ItemIcon.tsx`)
*   **Generator Grafik (Komponent):** Zamiast statycznych plików PNG, gra wykorzystuje dynamiczny generator oparty na kodzie:
    *   **Tło:** Gradienty kolorystyczne odpowiadające rzadkości.
    *   **Ikona:** Wektorowe ikony (Lucide React) reprezentujące typ przedmiotu (Miecz, Zbroja, Buty itd.).
    *   **Efekty:** Poświata (Glow) i animacje dla przedmiotów Legendarnych i Mitycznych.
*   **Zalety:** Lekkość, natychmiastowe ładowanie, nieskończona ilość kombinacji kolorystycznych, spójny styl UI.

## 3. Świat Gry

### Wyprawy (Expeditions)
*   30 Poziomów potworów.
*   Odblokowywanie progresywne.
*   System Bonusów (Mastery): Szansa na stałe bonusy do Golda/EXP/Dropu z konkretnego potwora.

### Bestiariusz
*   Śledzenie zabitych potworów.
*   Podgląd statystyk, dropów (szanse procentowe) i opisów.
*   Odkrywanie informacji dopiero po pokonaniu wroga.

### Lochy (Dungeons) - *W przygotowaniu/Częściowo zaimplementowane*
*   System kluczy/energii.
*   Unikalni Bossowie.
*   Dedykowany drop Talizmanów.

### Talizmany
*   Dedykowany slot w ekwipunku.
*   Pasywne bonusy.
*   Niepodlegające handlowi (Soulbound).

## 4. Technologia i Baza Danych

*   **Frontend:** React + Vite + TailwindCSS.
*   **Backend:** Supabase (PostgreSQL).
*   **Tabele:**
    *   `characters`: Stan gracza, ekwipunek (JSON), statystyki.
    *   `monsters`: Baza potworów, statystyki, loot tables.
    *   `items`: Szablony przedmiotów legendarnych/tytanicznych.
    *   `combat_logs`: Historia walk.
*   **Bezpieczeństwo:** RLS (Row Level Security) - gracz widzi/edytuje tylko swoje dane.

## 5. Status Generatorów

1.  **Generator Itemów (`src/utils/itemGenerator.ts`):** **GOTOWY**.
    *   Obsługuje wszystkie rzadkości.
    *   Skaluje statystyki z poziomem.
    *   Implementuje nową ekonomię cenową.
    *   Generuje przedmioty "na żywo" dla sklepu i dropu (poza legendami z bazy).

2.  **Generator Grafik (`src/components/ItemIcon.tsx`):** **GOTOWY**.
    *   Działa w oparciu o CSS/SVG.
    *   Wizualnie rozróżnia typy i rzadkości.
    *   Jest zintegrowany z Ekwipunkiem, Sklepem i Dropem.
    *   *Nie wymaga generowania plików graficznych na serwerze.*

## Do zrobienia (Next Steps)
1.  Pełne przetestowanie balansu walki (czy 20% szansy na podpalenie to nie za dużo/za mało).
2.  Rozbudowa mechaniki Lochów (interfejs wyboru pokoi).
3.  Dodanie większej liczby szablonów Legend w bazie danych.
