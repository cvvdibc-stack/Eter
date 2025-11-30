# Podsumowanie Gry RPG (Dokumentacja Projektu)

## 1. Przegląd Ogólny
Gra to przeglądarkowa gra RPG typu "dungeon crawler" / "idle clicker" (z elementami aktywnymi), osadzona w świecie fantasy. Gracze tworzą postacie, walczą z potworami, zdobywają ekwipunek i rywalizują w rankingach. Gra kładzie duży nacisk na rozwój statystyk, optymalizację ekwipunku (buildy) i progresję przez kolejne poziomy wypraw i lochów.

## 2. Klasy Postaci (Profesje)
W grze dostępne są 4 unikalne klasy, każda z własną specyfiką i "dozwolonymi" statystykami na przedmiotach:

### Wojownik (Warrior)
*   **Rola:** Tank / Physical DPS
*   **Główna statystyka:** Siła (Obrażenia + Pancerz)
*   **Unikalne mechaniki:**
    *   *Block Chance / Value:* Szansa na zablokowanie i redukcję obrażeń.
    *   *First Hit Shield:* Często posiada tarczę na start walki.
*   **Dozwolone statystyki:** Siła, Witalność, Pancerz, Blok.

### Zabójca (Assassin)
*   **Rola:** Burst DPS / Evasion
*   **Główna statystyka:** Zręczność (Obrażenia + Krytyk + Unik + SA)
*   **Unikalne mechaniki:**
    *   *Poison:* Szansa na zatrucie (obrażenia w czasie).
    *   *Blood Fury:* Zwiększenie obrażeń w trakcie walki (mechanika legendarna).
    *   *Highest SA:* Najszybszy bazowy atak.
*   **Dozwolone statystyki:** Zręczność, Krytyk, Unik, Przebicie Pancerza.

### Mag (Mage)
*   **Rola:** Magic DPS / Glass Cannon
*   **Główna statystyka:** Inteligencja (Obrażenia Magiczne + Odporność)
*   **Unikalne mechaniki:**
    *   *Burn:* Podpalenie przeciwnika.
    *   *Mana Shield:* Obrażenia pochłaniane przez manę (statystyka defensywna).
    *   *Overload:* Szansa na podwójne obrażenia (mechanika legendarna).
*   **Dozwolone statystyki:** Inteligencja, Moc Magiczna, Przebicie Magiczne.

### Kleryk (Cleric)
*   **Rola:** Healer / Sustain Tank
*   **Główna statystyka:** Inteligencja (ale skaluje też Pancerz i Leczenie)
*   **Unikalne mechaniki:**
    *   *Healing Power:* Zwiększa efektywność leczenia.
    *   *Sanctified Aura:* Pasywne bonusy lub debuffy dla wroga.
    *   *Sustain:* Wysoka regeneracja i redukcja obrażeń.

## 3. System Walki
Walka odbywa się w systemie turowym lub "Szybkiej Walki" (symulacja).
*   **Inicjatywa (SA - Szybkość Ataku):** Decyduje o tym, kto atakuje częściej. Gracz z 2x większym SA zaatakuje 2 razy zanim wróg wykona ruch.
*   **Obrażenia:**
    *   Fizyczne (redukowane przez Pancerz).
    *   Magiczne (redukowane przez Odporność Magiczną).
    *   Czyste/Nieuchronne (Piercing) - ignorują obronę.
*   **Mechaniki Defensywne:**
    *   Unik (całkowite uniknięcie ciosu).
    *   Blok (redukcja obrażeń o wartość bloku).
    *   Pancerz/Odporność (procentowa redukcja, max 75%).
*   **Leczenie:** Możliwość leczenia po walce za złoto (Skaluje się z poziomem: `Level * 5 gold`).

## 4. Ekonomia i Progresja
*   **Złoto (Gold):** Podstawowa waluta. Zdobywana z potworów i sprzedaży przedmiotów.
    *   *Skalowanie Dropu:* `(Level * 1.2) * 1.2` (dla potworów).
    *   *Wartość Przedmiotów:* `((Level * 10) + Level^2) * Mnożnik Jakości`.
*   **Statystyki za Złoto (Trener):**
    *   Gracz może kupować stałe bonusy do statystyk (Siła/Zręcz/Int/Wit).
    *   **Limit:** `(Level * 10) + 50`. Statystyki powyżej tego limitu są "odcinane" w walce.
    *   **Koszt:** `10 * (ObecnyBonus ^ 2)`.
*   **Doświadczenie (EXP):**
    *   Skalowanie wymagań: `55 * L^2 + 150 * L` (dla Lvl 20+).
    *   Kary/Bonusy za różnicę poziomów (Gracz nie dostaje EXP za słabe moby).
*   **Ranking:** Globalny ranking TOP 100 graczy (sortowany po Levelu, potem EXP).

## 5. Przedmioty i Ekwipunek
*   **Rzadkość:**
    *   *Common (Szary)* - x1.0 statystyk.
    *   *Unique (Niebieski)* - x1.6 statystyk.
    *   *Heroic (Fioletowy)* - x2.8 statystyk.
    *   *Legendary (Pomarańczowy)* - x6.0 statystyk + Specjalne efekty.
    *   *Mythic/Tytanic (Czerwony)* - x15.0 statystyk.
*   **Drop System:**
    *   Wypadanie zależy od poziomu gracza (Legenda od 16 lvl, Tytan od 26 lvl).
    *   **Zasada 80/20:** 80% szans na drop pod klasę gracza, 20% losowy.
    *   **Szablony:** Bossowie i potwory mają przypisane unikalne szablony przedmiotów legendarnych/tytanicznych.
*   **Sklep:**
    *   Generuje tylko przedmioty Common/Unique.
    *   Mnożnik statystyk 0.6x (słabsze niż z wypraw).

## 6. Świat Gry
*   **Wyprawy (Expeditions):**
    *   Główny tryb PvE.
    *   Odblokowywanie potworów progresywnie (`Level Gracza + 2`).
    *   Expedycje nie blokują się przez Lochy.
*   **Lochy (Dungeons):**
    *   Trudniejsze wyzwania z Bossami.
    *   Wymagają kluczy (teoretycznie) lub odpowiedniego poziomu.
    *   Lepszy drop i więcej EXP.
*   **Bestiariusz:**
    *   Kompendium wiedzy o potworach.
    *   Podgląd dropu (Legendy/Tytany) z informacją o odkryciu.

## 7. Interfejs (UI/UX)
*   **Responsywność:** Gra dostosowana do Mobile/Desktop (siatka ekwipunku, ukrywanie paneli).
*   **Quality of Life:**
    *   Szybka Walka.
    *   Auto-uzupełnianie logowania (Remember Me).
    *   Porównywanie przedmiotów (Tooltips).
    *   Szczegółowe statystyki z podziałem na źródła (Base/Items).
