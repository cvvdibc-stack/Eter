# Rozmiary kontenerów na grafiki - Wyprawy i Lochy

## 📐 WYPROWY (ExpeditionScreen)

### Karta pojedynczego potwora:
- **Całkowita wysokość karty**: `450px` (`h-[450px]`)
- **Szerokość**: Responsywna (grid)
  - Mobile: 1 kolumna (100% szerokości)
  - Tablet (sm): 2 kolumny (50% szerokości)
  - Desktop (lg): 4 kolumny (25% szerokości)
- **Gap między kartami**: `24px` (`gap-6`)

### Struktura karty (od góry do dołu):
1. **Header** (nazwa potwora):
   - Wysokość: ~`48px` (padding `p-3` = 12px + tekst)
   - Padding: `12px` (`p-3`)
   - Tło: `bg-[#0b0d10]`

2. **Stats Overlay** (złoto/XP - tylko jeśli odblokowane):
   - Wysokość: ~`32px` (padding `p-1.5` = 6px + tekst)
   - Padding: `6px` (`p-1.5`)

3. **Image Area** (obszar grafiki - FLEX-1):
   - Wysokość: **~320-340px** (reszta dostępnej przestrzeni w 450px)
   - Szerokość: 100% kontenera
   - `object-cover` - grafika wypełnia cały obszar
   - `transform group-hover:scale-110` - powiększenie przy hover

4. **Action Buttons** (przyciski Atak/Szybka):
   - Wysokość: ~`80px` (padding `p-3` = 12px + przyciski)
   - Padding: `12px` (`p-3`)
   - Grid: 2 kolumny (`grid-cols-2`)

5. **Bonuses Footer** (ikony bonusów):
   - Wysokość: ~`60px` (padding `p-3` = 12px + ikony)
   - Padding: `12px` (`p-3`)

### **ROZMIAR GRAFIKI (Image Area)**:
- **Szerokość**: 100% kontenera (responsive)
- **Wysokość**: ~320-340px (flex-1 w kontenerze 450px)
- **Format zalecany**: 
  - **16:9** lub **4:3** (dla lepszego wypełnienia)
  - **Minimalna rozdzielczość**: 800x600px (dla retina)
  - **Optymalna rozdzielczość**: 1200x900px lub 1600x900px

---

## 🏰 LOCHY (DungeonScreen)

### Widok LIST (lista lochów):
- **Całkowita wysokość karty**: `450px` (`h-[450px]`)
- **Szerokość**: Responsywna (grid)
  - Mobile: 1 kolumna
  - Tablet (sm): 2 kolumny
  - Desktop (lg): 4 kolumny
- **Gap między kartami**: `24px` (`gap-6`)

### Struktura karty LIST (od góry do dołu):
1. **Header** (nazwa lochu):
   - Wysokość: ~`48px`
   - Padding: `12px` (`p-3`)

2. **Image Area** (obszar grafiki - FLEX-1):
   - Wysokość: **~262px** (450px - 48px header - 140px description)
   - Szerokość: 100%
   - Tło gradientowe + ikona Skull (placeholder)

3. **Description Area**:
   - Wysokość: `140px` (`h-[140px]`)
   - Padding: `16px` (`p-4`)
   - Zawiera opis + przycisk "Eksploruj"

### Widok EXPLORE (pokoje w lochu):
- **Całkowita wysokość karty**: `450px` (`h-[450px]`)
- **Szerokość**: Responsywna (grid)
  - Mobile: 1 kolumna
  - Tablet (sm): 2 kolumny
  - Desktop (lg): 4 kolumny
- **Gap między kartami**: `24px` (`gap-6`)

### Struktura karty EXPLORE (od góry do dołu):
1. **Header** (Pokój X):
   - Wysokość: ~`48px`
   - Padding: `12px` (`p-3`)

2. **Image Area** (obszar grafiki potwora - FLEX-1):
   - Wysokość: **~322px** (450px - 48px header - 80px buttons)
   - Szerokość: 100%
   - `object-cover` - grafika wypełnia cały obszar
   - `scale-110` dla aktywnego pokoju

3. **Action Buttons**:
   - Wysokość: `80px` (`min-h-[80px]`)
   - Padding: `12px` (`p-3`)
   - Grid: 2 kolumny

### **ROZMIAR GRAFIKI (Image Area)**:
- **Szerokość**: 100% kontenera (responsive)
- **Wysokość**: 
  - LIST: ~262px
  - EXPLORE: ~322px
- **Format zalecany**: 
  - **16:9** lub **4:3**
  - **Minimalna rozdzielczość**: 800x600px
  - **Optymalna rozdzielczość**: 1200x900px lub 1600x900px

---

## 📊 PODSUMOWANIE

### Wyprawy (Expedition):
- **Kontener**: 450px wysokości
- **Obszar grafiki**: ~320-340px wysokości × 100% szerokości
- **Format**: 16:9 lub 4:3
- **Rozdzielczość**: min 800×600px, optymalnie 1200×900px lub 1600×900px

### Lochy - LIST:
- **Kontener**: 450px wysokości
- **Obszar grafiki**: ~262px wysokości × 100% szerokości
- **Format**: 16:9 lub 4:3
- **Rozdzielczość**: min 800×600px, optymalnie 1200×900px

### Lochy - EXPLORE (pokoje):
- **Kontener**: 450px wysokości
- **Obszar grafiki**: ~322px wysokości × 100% szerokości
- **Format**: 16:9 lub 4:3
- **Rozdzielczość**: min 800×600px, optymalnie 1200×900px lub 1600×900px

### Uwagi techniczne:
- Wszystkie grafiki używają `object-cover` - obraz jest przycinany, aby wypełnić kontener
- Grafiki są responsywne i skalują się z szerokością ekranu
- Na hover (wyprawy) grafika powiększa się o 10% (`scale-110`)
- Grafiki powinny mieć dobre centrum kompozycji, bo mogą być przycinane


