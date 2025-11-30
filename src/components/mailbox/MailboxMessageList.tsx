import React from 'react';
import { useMailbox } from '../../context/MailboxContext';
import { MailboxMessage } from '../../types';
import { Mail, Send, Coins, Package, CheckCircle } from 'lucide-react';

interface MailboxMessageListProps {
  onSelectMessage: (message: MailboxMessage) => void;
  onCompose: () => void;
}

export const MailboxMessageList: React.FC<MailboxMessageListProps> = ({
  onSelectMessage,
  onCompose
}) => {
  const {
    receivedMessages,
    sentMessages,
    selectedMessage,
    unreadCount,
    unclaimedCount
  } = useMailbox();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Teraz';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}g`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pl-PL');
  };

  const renderMessage = (message: MailboxMessage, isSent: boolean = false) => {
    const isSelected = selectedMessage?.id === message.id;

    return (
      <div
        key={message.id}
        onClick={() => onSelectMessage(message)}
        className={`p-3 mb-2 rounded-lg cursor-pointer transition-all border ${
          isSelected
            ? 'bg-amber-500/20 border-amber-500/50'
            : message.is_read || isSent
            ? 'bg-slate-800/50 hover:bg-slate-800/70 border-white/5'
            : 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">
              {isSent ? `Do: ${message.receiver_name}` : message.sender_name}
            </div>
            <div className="text-xs text-slate-400">
              {formatDate(message.created_at)}
            </div>
          </div>
          {!message.is_read && !isSent && (
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
          )}
        </div>

        {/* Message Text Preview */}
        {message.message_text && (
          <div className="text-xs text-slate-300 truncate mb-2">
            {message.message_text}
          </div>
        )}

        {/* Attachments */}
        <div className="flex items-center gap-2">
          {message.gold_amount > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <Coins className="w-3 h-3" />
              {message.gold_amount.toLocaleString()}g
            </div>
          )}
          {message.item && (
            <div className="flex items-center gap-1 text-xs text-green-400">
              <Package className="w-3 h-3" />
              Przedmiot
            </div>
          )}
          {!message.is_claimed && !isSent && (message.gold_amount > 0 || message.item) && (
            <div className="ml-auto text-xs text-green-400 font-bold">
              Odbierz
            </div>
          )}
          {message.is_claimed && !isSent && (message.gold_amount > 0 || message.item) && (
            <div className="ml-auto">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#161b22] rounded-lg border border-white/10 h-full flex flex-col">

      {/* Header with Stats */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Wiadomości</h3>
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-3">
          {unreadCount > 0 && (
            <div className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-500/30">
              {unreadCount} nieprzeczytanych
            </div>
          )}
          {unclaimedCount > 0 && (
            <div className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/30">
              {unclaimedCount} do odebrania
            </div>
          )}
        </div>

        {/* Compose Button */}
        <button
          onClick={onCompose}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Napisz wiadomość
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {/* Received Messages */}
        {receivedMessages.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">
              Otrzymane ({receivedMessages.length})
            </div>
            {receivedMessages.map(message => renderMessage(message, false))}
          </div>
        )}

        {/* Sent Messages */}
        {sentMessages.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">
              Wysłane ({sentMessages.length})
            </div>
            {sentMessages.map(message => renderMessage(message, true))}
          </div>
        )}

        {/* Empty State */}
        {receivedMessages.length === 0 && sentMessages.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div className="text-sm">Brak wiadomości</div>
          </div>
        )}
      </div>
    </div>
  );
};
