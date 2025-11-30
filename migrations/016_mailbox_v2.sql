-- Nowa tabela mailbox (wersja 2.0)
CREATE TABLE IF NOT EXISTS mailbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  message_text TEXT,
  gold_amount INTEGER DEFAULT 0 CHECK (gold_amount >= 0),
  item JSONB,
  is_read BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),

  -- Walidacja: wiadomość musi zawierać tekst LUB złoto LUB przedmiot
  CONSTRAINT valid_message_content CHECK (
    (message_text IS NOT NULL AND length(trim(message_text)) > 0) OR
    (gold_amount > 0) OR
    (item IS NOT NULL)
  )
);

-- Indeksy dla wydajności
CREATE INDEX IF NOT EXISTS idx_mailbox_receiver_created ON mailbox(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mailbox_sender_created ON mailbox(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mailbox_receiver_unread ON mailbox(receiver_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_mailbox_receiver_unclaimed ON mailbox(receiver_id, is_claimed) WHERE is_claimed = false;
CREATE INDEX IF NOT EXISTS idx_mailbox_expires ON mailbox(expires_at);

-- Funkcja do automatycznego usuwania starych wiadomości
CREATE OR REPLACE FUNCTION cleanup_expired_mail()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM mailbox WHERE expires_at < NOW();
END;
$$;

-- Trigger do cleanup (uruchamiany codziennie)
-- Można skonfigurować w cron job lub pg_cron

-- RLS Policies - bezpieczeństwo na poziomie wierszy
ALTER TABLE mailbox ENABLE ROW LEVEL SECURITY;

-- Polityka: użytkownik może czytać swoje wiadomości (jako nadawca lub odbiorca)
CREATE POLICY "users_can_read_own_mail"
  ON mailbox FOR SELECT
  USING (auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text);

-- Polityka: użytkownik może wysyłać wiadomości (tylko jako nadawca)
CREATE POLICY "users_can_send_mail"
  ON mailbox FOR INSERT
  WITH CHECK (auth.uid()::text = sender_id::text);

-- Polityka: użytkownik może aktualizować wiadomości, które otrzymał
CREATE POLICY "users_can_update_received_mail"
  ON mailbox FOR UPDATE
  USING (auth.uid()::text = receiver_id::text);

-- Polityka: użytkownik może usuwać swoje wiadomości
CREATE POLICY "users_can_delete_own_mail"
  ON mailbox FOR DELETE
  USING (auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text);

-- Dodajemy indeks dla RLS
CREATE INDEX IF NOT EXISTS idx_mailbox_sender_receiver ON mailbox(sender_id, receiver_id);
