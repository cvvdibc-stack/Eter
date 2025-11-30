# Nowy Plan Implementacji Skrzynki Pocztowej

## 🎯 Główne Problemy Poprzedniej Wersji

### ❌ Problemy:
- **Modyfikacja `document.body.style.overflow`** - powodowała miganie zakładek
- **Portal renderujący nieprawidłowo** - konflikt z zarządzaniem overflow
- **Brak izolacji** - modal wpływał na całą aplikację
- **Złożona logika cleanup** - prowadziła do błędów

### ✅ Nowe Rozwiązanie:
- **Brak modyfikacji `document.body.style`**
- **Modal jako niezależny komponent** z `fixed` positioning
- **Izolacja scrollowania** - tylko wewnątrz kontenerów modala
- **Prosta logika** - minimalny cleanup

---

## 🏗️ Nowa Architektura

### MailboxScreen.tsx
**Nowy, bezpieczny komponent**

#### Struktura:
```tsx
<div className="h-[calc(100vh-140px)] bg-[#0b0d10] p-6">
  <div className="max-w-6xl mx-auto flex gap-6 h-full">

    {/* Left Panel - Lista wiadomości */}
    <div className="w-80 bg-[#161b22] rounded-lg border border-white/10 p-4 flex flex-col">
      <MailboxMessageList
        messages={messages}
        selectedId={selectedMessage?.id}
        onSelect={handleSelectMessage}
        unreadCount={unreadCount}
        unclaimedCount={unclaimedCount}
        onCompose={() => setShowCompose(true)}
      />
    </div>

    {/* Right Panel - Szczegóły */}
    <div className="flex-1 bg-[#161b22] rounded-lg border border-white/10 p-6">
      {selectedMessage ? (
        <MailboxMessageDetails
          message={selectedMessage}
          onClaim={() => handleClaim(selectedMessage)}
          onDelete={() => handleDelete(selectedMessage)}
          onClose={() => setSelectedMessage(null)}
        />
      ) : (
        <MailboxEmptyState />
      )}
    </div>
  </div>

  {/* Compose Modal - całkowicie niezależny */}
  {showCompose && (
    <MailboxComposeModal
      onSend={handleSendMessage}
      onClose={() => setShowCompose(false)}
    />
  )}
</div>
```

#### Kluczowe Zasady:
1. **Brak modyfikacji globalnego stanu**
2. **Wszystkie komponenty są stateless**
3. **Eventy są izolowane**
4. **Scroll tylko wewnątrz paneli**

---

### MailboxComposeModal.tsx
**Bezpieczny modal wysyłania**

#### Kluczowe cechy:
- **Nie modyfikuje `document.body.style`**
- **Używa `fixed` positioning** z backdrop
- **Izolowane eventy** - `stopPropagation`
- **Scroll tylko wewnątrz modala**

```tsx
export const MailboxComposeModal: React.FC<MailboxComposeModalProps> = ({
  onSend,
  onClose
}) => {
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
        {/* Header */}
        <div className="bg-[#0f1115] border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Wyślij wiadomość</h2>
          <button onClick={onClose}>X</button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Form content */}
        </div>

        {/* Footer */}
        <div className="bg-[#0f1115] border-t border-white/10 p-4 flex justify-end gap-3">
          <button onClick={onClose}>Anuluj</button>
          <button onClick={handleSend}>Wyślij</button>
        </div>
      </div>
    </div>
  );
};
```

---

## 📊 Struktura Komponentów

### Komponenty Podrzędne:

#### MailboxMessageList
```tsx
interface MailboxMessageListProps {
  messages: MailboxMessage[];
  selectedId?: string;
  onSelect: (message: MailboxMessage) => void;
  unreadCount: number;
  unclaimedCount: number;
  onCompose: () => void;
}
```

#### MailboxMessageDetails
```tsx
interface MailboxMessageDetailsProps {
  message: MailboxMessage;
  onClaim: () => void;
  onDelete: () => void;
  onClose: () => void;
}
```

#### MailboxEmptyState
- Prosty komponent z ikoną i tekstem

#### MailboxComposeForm
- Formularz z walidacją
- Lista graczy do wyboru
- Załączniki (złoto/przedmiot)

---

## 🔧 Funkcjonalność

### MailboxProvider (Context)
**Lokalny kontekst dla skrzynki pocztowej**

```tsx
const MailboxContext = createContext<MailboxContextType | undefined>(undefined);

export const MailboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { character, showToast } = useGame();
  const [messages, setMessages] = useState<MailboxMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Funkcje ładowania, wysyłania, etc.

  return (
    <MailboxContext.Provider value={{
      messages,
      loading,
      loadMessages,
      sendMessage,
      claimAttachment,
      deleteMessage
    }}>
      {children}
    </MailboxContext.Provider>
  );
};
```

### Kluczowe Funkcje:

#### loadMessages()
```typescript
const loadMessages = async () => {
  if (!character) return;

  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('mailbox')
      .select('*')
      .or(`receiver_id.eq.${character.id},sender_id.eq.${character.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const messages: MailboxMessage[] = data.map(m => ({
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

    setMessages(messages);
  } catch (error) {
    console.error('Error loading messages:', error);
    showToast('Błąd ładowania wiadomości', 'error');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 Design System

### Kolory:
- **Tło główne:** `bg-[#0b0d10]`
- **Panele:** `bg-[#161b22]`
- **Header/Footer:** `bg-[#0f1115]`
- **Akcenty:** `text-amber-500`, `border-amber-500/30`
- **Nieprzeczytane:** `bg-blue-500/20 border-blue-500/50`
- **Do odebrania:** `bg-green-500/20 border-green-500/30`

### Ikony (lucide-react):
- `Mail` - skrzynka pocztowa
- `Send` - wysyłanie
- `Package` - załączniki
- `Coins` - złoto
- `Gift` - przedmiot
- `Trash2` - usuwanie
- `CheckCircle` - odebrane
- `Plus` - nowa wiadomość

### Responsywność:
- **Desktop:** Podział na panele obok siebie
- **Mobile:** Stackowanie paneli pionowo
- **Tablet:** Dostosowanie szerokości paneli

---

## 🔄 Integracja z Resztą Aplikacji

### App.tsx:
```tsx
case 'MAILBOX':
  return (
    <MailboxProvider>
      <MailboxScreen />
    </MailboxProvider>
  );
```

### GameLayout.tsx:
```tsx
<MenuButton
  icon={Mail}
  label="Skrzynka Pocztowa"
  targetView="MAILBOX"
  active={view === 'MAILBOX'}
/>
```

### PlayerProfileModal & RankingScreen:
```tsx
<button
  onClick={() => setShowCompose(true)}
  className="px-6 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-bold"
>
  <Mail size={18} />
  Wyślij wiadomość
</button>
```

---

## 📋 Lista Zadań Implementacji

### Faza 1: Infrastruktura
- [ ] Utworzyć typy `MailboxMessage` w types/index.ts
- [ ] Utworzyć migrację `016_mailbox_v2.sql`
- [ ] Utworzyć `MailboxProvider` i `MailboxContext`
- [ ] Dodać funkcje do GameContext (jeśli potrzebne)

### Faza 2: Komponenty Bazowe
- [ ] `MailboxScreen` - główny layout
- [ ] `MailboxMessageList` - lista wiadomości
- [ ] `MailboxMessageDetails` - szczegóły wiadomości
- [ ] `MailboxEmptyState` - pusty stan

### Faza 3: Modal Wysyłania
- [ ] `MailboxComposeModal` - modal wysyłania
- [ ] `MailboxComposeForm` - formularz
- [ ] Walidacja formularza
- [ ] Obsługa załączników

### Faza 4: Funkcjonalność
- [ ] Ładowanie wiadomości
- [ ] Wysyłanie wiadomości
- [ ] Odbieranie załączników
- [ ] Oznaczanie jako przeczytane
- [ ] Usuwanie wiadomości

### Faza 5: Integracja
- [ ] Dodać do App.tsx i GameLayout.tsx
- [ ] Integracja z PlayerProfileModal
- [ ] Integracja z RankingScreen
- [ ] Responsywność

### Faza 6: Testy
- [ ] Test wysyłania/odbierania
- [ ] Test modali (bez problemów z zakładkami)
- [ ] Test responsywności
- [ ] Performance

---

## ⚠️ Bezpieczeństwo i Wydajność

### Zasady Bezpieczeństwa:
1. **Brak modyfikacji globalnego DOM** - szczególnie `document.body`
2. **Izolacja komponentów** - każdy modal jest niezależny
3. **Event bubbling** - `stopPropagation` na wszystkich modalach
4. **Memory leaks** - właściwy cleanup useEffect

### Optymalizacja Wydajności:
1. **Lazy loading** - wiadomości ładowane tylko gdy potrzebne
2. **Virtual scrolling** - dla dużej liczby wiadomości
3. **Memoization** - React.memo dla komponentów
4. **Debounced search** - dla wyszukiwania graczy

---

## 🎯 Kluczowe Zalety Nowego Systemu

### ✅ Plusy:
- **Bezpieczny** - nie wpływa na inne części aplikacji
- **Izolowany** - każdy modal jest niezależny
- **Responsywny** - działa na wszystkich urządzeniach
- **Łatwy w utrzymaniu** - prosta struktura komponentów
- **Szybki** - minimalne re-renderowanie

### ❌ Unikane Problemy:
- **Brak migania zakładek** - fixed positioning zamiast overflow
- **Brak problemów z scrollowaniem** - tylko wewnętrzne
- **Brak konfliktów z-index** - właściwe poziomy z-index
- **Brak błędów cleanup** - minimalna logika

---

**Gotowy do implementacji! Zaczynamy od infrastruktury.**
