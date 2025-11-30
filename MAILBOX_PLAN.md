# Plan Implementacji Skrzynki Pocztowej

## 1. Analiza Problemu z Poprzednią Wersją

### Problemy:
- ❌ Ustawianie `overflow: hidden` na `document.body` powodowało miganie i nieklikalność zakładek
- ❌ Portal renderowany nieprawidłowo - konflikt z zarządzaniem overflow
- ❌ Brak właściwego cleanup przy zamknięciu modala
- ❌ Modal nie był izolowany od reszty aplikacji

### Rozwiązanie:
- ✅ Modal renderowany przez Portal, ale bez modyfikacji `body.overflow`
- ✅ Użycie `fixed` positioning z odpowiednim z-index
- ✅ Właściwy cleanup przy unmount
- ✅ Izolacja event handlerów (stopPropagation)

---

## 2. Struktura Komponentów

### MailboxScreen.tsx
**Główny ekran skrzynki pocztowej**

#### Layout:
```
┌─────────────────────────────────────────────────────────┐
│  Header: "Skrzynka Pocztowa" + Statystyki + "Napisz"   │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Lista       │  Szczegóły wiadomości                    │
│  wiadomości  │  (lub pusty stan)                        │
│  (sidebar)   │                                           │
│              │                                           │
│  - Otrzymane │  - Treść wiadomości                     │
│  - Wysłane   │  - Załączniki (złoto/przedmiot)         │
│              │  - Przycisk "Odbierz"                    │
│              │  - Przycisk "Usuń"                       │
└──────────────┴──────────────────────────────────────────┘
```

#### Właściwości:
- **Wysokość:** `h-[calc(100vh-140px)]` (zgodnie z innymi ekranami)
- **Layout:** Flexbox z sidebarem (300px) + główny content
- **Scroll:** Tylko wewnętrzne obszary (`overflow-y-auto`), NIE na body
- **Kolory:** Zgodne z designem (`bg-[#161b22]`, `border-white/10`)

#### Struktura:
```tsx
<div className="h-[calc(100vh-140px)] flex bg-[#0b0d10]">
  {/* Left Sidebar - Lista wiadomości */}
  <div className="w-[300px] bg-[#161b22] border-r border-white/10 flex flex-col">
    {/* Header z przyciskiem "Napisz" */}
    {/* Lista otrzymanych */}
    {/* Lista wysłanych */}
  </div>
  
  {/* Right Panel - Szczegóły */}
  <div className="flex-1 flex flex-col">
    {/* Wybrana wiadomość lub pusty stan */}
  </div>
</div>
```

---

### SendMailModal.tsx
**Modal do wysyłania wiadomości**

#### Wzorzec (zgodny z PlayerProfileModal):
```tsx
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-[#161b22] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
    {/* Header */}
    {/* Content (scrollable) */}
    {/* Footer z przyciskami */}
  </div>
</div>
```

#### Kluczowe zasady:
- ✅ **NIE** modyfikować `document.body.style.overflow`
- ✅ Używać `fixed` positioning
- ✅ `z-50` dla modala (wyżej niż normalne elementy, niżej niż tooltips)
- ✅ `max-h-[90vh]` z `overflow-hidden` na kontenerze
- ✅ `overflow-y-auto` tylko na content area
- ✅ `onClick={(e) => e.stopPropagation()}` na modal content
- ✅ `onClick` na backdrop do zamknięcia

#### Struktura:
```tsx
<div 
  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  onClick={(e) => e.target === e.currentTarget && onClose()}
>
  <div 
    className="bg-[#161b22] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Header */}
    <div className="bg-[#0f1115] border-b border-white/10 p-4 flex items-center justify-between">
      <h2>Wyślij wiadomość</h2>
      <button onClick={onClose}>X</button>
    </div>
    
    {/* Content - scrollable */}
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
      {/* Formularz */}
    </div>
    
    {/* Footer */}
    <div className="bg-[#0f1115] border-t border-white/10 p-4 flex justify-end gap-3">
      <button onClick={onClose}>Anuluj</button>
      <button onClick={handleSend}>Wyślij</button>
    </div>
  </div>
</div>
```

---

## 3. Funkcje w GameContext

### Typy (types/index.ts):
```typescript
export interface MailMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_name: string;
  receiver_name: string;
  message_text?: string;
  gold_amount: number;
  item: Item | null;
  is_read: boolean;
  is_claimed: boolean;
  created_at: string;
  expires_at: string;
}
```

### Interfejs GameContextType:
```typescript
interface GameContextType {
  // ... existing
  
  // Mailbox
  mailboxMessages: MailMessage[];
  loadMailbox: () => Promise<void>;
  sendMail: (
    receiverId: string, 
    receiverName: string, 
    messageText?: string, 
    goldAmount?: number, 
    item?: Item
  ) => Promise<boolean>;
  claimMailItem: (mailId: string) => Promise<void>;
  markMailAsRead: (mailId: string) => Promise<void>;
  deleteMail: (mailId: string) => Promise<void>;
}
```

### Implementacja funkcji:

#### loadMailbox()
```typescript
const loadMailbox = async () => {
  if (!character) return;
  
  const { data, error } = await supabase
    .from('mailbox')
    .select('*')
    .or(`receiver_id.eq.${character.id},sender_id.eq.${character.id}`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading mailbox:', error);
    return;
  }
  
  if (data) {
    const messages: MailMessage[] = data.map((m: any) => ({
      id: m.id,
      sender_id: m.sender_id,
      receiver_id: m.receiver_id,
      sender_name: m.sender_name,
      receiver_name: m.receiver_name,
      message_text: m.message_text,
      gold_amount: m.gold_amount || 0,
      item: m.item || null,
      is_read: m.is_read || false,
      is_claimed: m.is_claimed || false,
      created_at: m.created_at,
      expires_at: m.expires_at
    }));
    setMailboxMessages(messages);
  }
};
```

#### sendMail()
- Walidacja: złoto, przedmiot w ekwipunku
- Wstawienie do bazy
- Odejmowanie złota/przedmiotu z ekwipunku
- Odświeżenie listy

#### claimMailItem()
- Sprawdzenie czy już odebrane
- Sprawdzenie miejsca w ekwipunku
- Dodanie złota/przedmiotu
- Oznaczenie jako odebrane

#### markMailAsRead()
- Proste update `is_read = true`

#### deleteMail()
- Usunięcie z bazy
- Odświeżenie listy

---

## 4. Design System

### Kolory:
- **Tło główne:** `bg-[#0b0d10]`
- **Karty:** `bg-[#161b22]`
- **Header/Footer:** `bg-[#0f1115]`
- **Bordery:** `border-white/10`
- **Akcenty:** `text-amber-500`, `bg-amber-600`
- **Nieprzeczytane:** `bg-blue-500/20 border-blue-500/50`
- **Do odebrania:** `text-green-400`

### Typografia:
- **Nagłówki:** `text-xl font-bold text-white`
- **Tekst:** `text-sm text-slate-300`
- **Daty:** `text-xs text-slate-400`
- **Liczby:** `font-mono`

### Ikony (lucide-react):
- `Mail` - ikona skrzynki
- `Send` - wysyłanie
- `Gift` - załączniki
- `Coins` - złoto
- `MessageSquare` - wiadomość
- `Trash2` - usuwanie
- `CheckCircle` - odebrane
- `Plus` - nowa wiadomość
- `X` - zamknij

---

## 5. Funkcjonalność

### MailboxScreen:
1. **Lista wiadomości:**
   - Podział na "Otrzymane" i "Wysłane"
   - Liczniki: nieprzeczytane, do odebrania
   - Karty wiadomości z:
     - Nazwa nadawcy/odbiorcy
     - Data (relatywna: "2 min temu", "1 godz. temu")
     - Podgląd treści (truncate)
     - Ikony załączników (złoto/przedmiot)
     - Wskaźnik nieprzeczytanej (niebieska kropka)

2. **Szczegóły wiadomości:**
   - Pełna treść
   - Załączniki (złoto/przedmiot z tooltipem)
   - Status (odebrane/nie odebrane)
   - Przycisk "Odbierz" (jeśli nie odebrane)
   - Przycisk "Usuń"

3. **Pusty stan:**
   - Ikona Mail
   - Tekst: "Wybierz wiadomość"

### SendMailModal:
1. **Wybór odbiorcy:**
   - Wyszukiwarka graczy
   - Lista proponowanych (z Arena)
   - Wybór z listy

2. **Formularz:**
   - Treść wiadomości (textarea, max 500 znaków)
   - Złoto (opcjonalnie, max 5,000,000)
   - Przedmiot (opcjonalnie, z ekwipunku)
   - Licznik znaków

3. **Walidacja:**
   - Odbiorca wymagany
   - Co najmniej: tekst LUB złoto LUB przedmiot
   - Sprawdzenie złota w ekwipunku
   - Sprawdzenie przedmiotu w ekwipunku

---

## 6. Integracja z Resztą Aplikacji

### App.tsx:
```typescript
case 'MAILBOX':
  return <MailboxScreen />;
```

### GameLayout.tsx:
```typescript
<MenuButton 
  icon={Mail} 
  label="Skrzynka Pocztowa" 
  targetView="MAILBOX" 
  active={view === 'MAILBOX'} 
/>
```

### PlayerProfileModal.tsx & RankingScreen.tsx:
- Przycisk "Wyślij wiadomość" otwiera `SendMailModal` z pre-wypełnionym odbiorcą
- Modal renderowany przez Portal (bez modyfikacji body)

---

## 7. Migracja Bazy Danych

### migrations/015_mailbox.sql:
```sql
-- Tabela mailbox (jeśli nie istnieje)
CREATE TABLE IF NOT EXISTS mailbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  message_text TEXT,
  gold_amount INTEGER DEFAULT 0,
  item JSONB,
  is_read BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  
  CONSTRAINT valid_attachment CHECK (
    (message_text IS NOT NULL) OR 
    (gold_amount > 0) OR 
    (item IS NOT NULL)
  )
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_mailbox_receiver ON mailbox(receiver_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_sender ON mailbox(sender_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_created ON mailbox(created_at DESC);

-- RLS Policies
ALTER TABLE mailbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mail"
  ON mailbox FOR SELECT
  USING (auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text);

CREATE POLICY "Users can send mail"
  ON mailbox FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id::text);

CREATE POLICY "Users can update received mail"
  ON mailbox FOR UPDATE
  USING (auth.uid()::text = receiver_id::text);

CREATE POLICY "Users can delete their mail"
  ON mailbox FOR DELETE
  USING (auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text);
```

---

## 8. Checklist Implementacji

### Faza 1: Podstawowa struktura
- [ ] Utworzyć `MailboxScreen.tsx` z layoutem
- [ ] Utworzyć `SendMailModal.tsx` z modalem
- [ ] Dodać typy do `types/index.ts`
- [ ] Dodać funkcje do `GameContext.tsx`
- [ ] Dodać migrację bazy danych

### Faza 2: Funkcjonalność
- [ ] Implementacja `loadMailbox()`
- [ ] Implementacja `sendMail()`
- [ ] Implementacja `claimMailItem()`
- [ ] Implementacja `markMailAsRead()`
- [ ] Implementacja `deleteMail()`

### Faza 3: UI/UX
- [ ] Lista wiadomości z filtrowaniem
- [ ] Szczegóły wiadomości
- [ ] Formularz wysyłania
- [ ] Tooltips dla przedmiotów
- [ ] Walidacja formularza

### Faza 4: Integracja
- [ ] Dodać do `App.tsx`
- [ ] Dodać do `GameLayout.tsx`
- [ ] Integracja z `PlayerProfileModal`
- [ ] Integracja z `RankingScreen`

### Faza 5: Testy i optymalizacja
- [ ] Test wysyłania/odbierania
- [ ] Test scrollowania (bez problemów z overflow)
- [ ] Test modali (bez migania zakładek)
- [ ] Test responsywności

---

## 9. Najważniejsze Zasady

### ✅ DO:
- Używać `fixed` positioning dla modali
- Izolować scroll do wewnętrznych kontenerów
- Używać `stopPropagation` na event handlerach
- Renderować modale przez Portal (opcjonalnie, dla z-index)
- Zachować spójność designu z resztą aplikacji

### ❌ NIE:
- **NIE** modyfikować `document.body.style.overflow`
- **NIE** używać globalnych stylów wpływających na resztę aplikacji
- **NIE** renderować modali bezpośrednio w komponencie (użyj Portal lub conditional render)
- **NIE** zapominać o cleanup przy unmount

---

## 10. Przykładowy Kod - SendMailModal (bez overflow na body)

```tsx
export const SendMailModal: React.FC<SendMailModalProps> = ({ receiver, onClose }) => {
  // ... state
  
  // ❌ NIE robić tego:
  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  //   return () => { document.body.style.overflow = ''; };
  // }, []);
  
  // ✅ Zamiast tego - użyć fixed positioning i backdrop
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#161b22] border border-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
      </div>
    </div>
  );
};
```

---

**Koniec planu. Gotowy do implementacji!**

