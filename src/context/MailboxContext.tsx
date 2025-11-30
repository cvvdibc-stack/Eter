import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MailboxMessage, Character } from '../types';
import { useGame } from './GameContext';
import { supabase } from '../lib/supabase';

interface MailboxContextType {
  // State
  messages: MailboxMessage[];
  loading: boolean;
  selectedMessage: MailboxMessage | null;
  showCompose: boolean;

  // Actions
  loadMessages: () => Promise<void>;
  selectMessage: (message: MailboxMessage | null) => void;
  sendMessage: (receiverId: string, receiverName: string, messageText?: string, goldAmount?: number, itemId?: string) => Promise<boolean>;
  claimAttachment: (messageId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  openCompose: () => void;
  closeCompose: () => void;

  // Computed values
  unreadCount: number;
  unclaimedCount: number;
  receivedMessages: MailboxMessage[];
  sentMessages: MailboxMessage[];
}

const MailboxContext = createContext<MailboxContextType | undefined>(undefined);

export const useMailbox = () => {
  const context = useContext(MailboxContext);
  if (!context) {
    throw new Error('useMailbox must be used within MailboxProvider');
  }
  return context;
};

interface MailboxProviderProps {
  children: ReactNode;
}

export const MailboxProvider: React.FC<MailboxProviderProps> = ({ children }) => {
  const { character, showToast } = useGame();
  const [messages, setMessages] = useState<MailboxMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MailboxMessage | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  // Load messages on mount and when character changes
  useEffect(() => {
    if (character) {
      loadMessages();
    }
  }, [character]);

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

      const formattedMessages: MailboxMessage[] = data.map((m: any) => ({
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

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading mailbox messages:', error);
      showToast('Błąd ładowania wiadomości', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectMessage = (message: MailboxMessage | null) => {
    setSelectedMessage(message);
  };

  const sendMessage = async (
    receiverId: string,
    receiverName: string,
    messageText?: string,
    goldAmount?: number,
    itemId?: string
  ): Promise<boolean> => {
    if (!character) return false;

    // Validation
    if (!messageText?.trim() && !goldAmount && !itemId) {
      showToast('Wiadomość musi zawierać tekst, złoto lub przedmiot!', 'error');
      return false;
    }

    if (goldAmount && goldAmount > 0 && character.gold < goldAmount) {
      showToast('Nie masz wystarczająco złota!', 'error');
      return false;
    }

    if (goldAmount && goldAmount > 5000000) {
      showToast('Maksymalna kwota to 5,000,000 złota!', 'error');
      return false;
    }

    // Find item in inventory if itemId provided
    let item = null;
    if (itemId) {
      const itemIndex = character.inventory.findIndex(i => i && i.id === itemId);
      if (itemIndex === -1) {
        showToast('Przedmiot nie znajduje się w ekwipunku!', 'error');
        return false;
      }
      item = character.inventory[itemIndex];
    }

    try {
      const { error } = await supabase
        .from('mailbox')
        .insert({
          sender_id: character.id,
          receiver_id: receiverId,
          sender_name: character.name,
          receiver_name: receiverName,
          message_text: messageText?.trim() || null,
          gold_amount: goldAmount || 0,
          item: item || null
        });

      if (error) throw error;

      showToast('Wiadomość wysłana!', 'success');
      await loadMessages(); // Refresh messages
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Błąd podczas wysyłania wiadomości!', 'error');
      return false;
    }
  };

  const claimAttachment = async (messageId: string) => {
    if (!character) return;

    const message = messages.find(m => m.id === messageId);
    if (!message || message.is_claimed) return;

    // Check inventory space for item
    const emptySlots = character.inventory.filter(slot => slot === null).length;
    const needsSlot = message.item ? 1 : 0;

    if (needsSlot > 0 && emptySlots < needsSlot) {
      showToast('⚠️ Plecak pełny! Nie możesz odebrać przedmiotu.', 'error');
      return;
    }

    try {
      // Update database
      const { error } = await supabase
        .from('mailbox')
        .update({ is_claimed: true })
        .eq('id', messageId);

      if (error) throw error;

      showToast('Odebrano!', 'success');
      await loadMessages(); // Refresh messages
    } catch (error) {
      console.error('Error claiming attachment:', error);
      showToast('Błąd podczas odbierania!', 'error');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('mailbox')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      await loadMessages(); // Refresh messages
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('mailbox')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      showToast('Wiadomość usunięta', 'success');
      await loadMessages(); // Refresh messages

      // Clear selection if deleted message was selected
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('Błąd podczas usuwania wiadomości!', 'error');
    }
  };

  const openCompose = () => setShowCompose(true);
  const closeCompose = () => setShowCompose(false);

  // Computed values
  const receivedMessages = messages.filter(m => m.receiver_id === character?.id);
  const sentMessages = messages.filter(m => m.sender_id === character?.id);
  const unreadCount = receivedMessages.filter(m => !m.is_read).length;
  const unclaimedCount = receivedMessages.filter(m => !m.is_claimed && (m.gold_amount > 0 || m.item)).length;

  const value: MailboxContextType = {
    // State
    messages,
    loading,
    selectedMessage,
    showCompose,

    // Actions
    loadMessages,
    selectMessage,
    sendMessage,
    claimAttachment,
    markAsRead,
    deleteMessage,
    openCompose,
    closeCompose,

    // Computed values
    unreadCount,
    unclaimedCount,
    receivedMessages,
    sentMessages
  };

  return (
    <MailboxContext.Provider value={value}>
      {children}
    </MailboxContext.Provider>
  );
};
