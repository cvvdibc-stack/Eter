import React, { useRef } from 'react';
import { useMailbox } from '../../context/MailboxContext';
import { useGame } from '../../context/GameContext';
import { MailboxMessage } from '../../types';
import { X, Gift, Coins, MessageSquare, Trash2, CheckCircle } from 'lucide-react';
import { ItemIcon } from '../ItemIcon';
import { ItemTooltip } from '../ItemTooltip';

interface MailboxMessageDetailsProps {
  message: MailboxMessage;
  onClose: () => void;
}

export const MailboxMessageDetails: React.FC<MailboxMessageDetailsProps> = ({
  message,
  onClose
}) => {
  const { character } = useGame();
  const { claimAttachment, deleteMessage } = useMailbox();
  const itemRef = useRef<HTMLDivElement>(null);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL');
  };

  const handleClaim = async () => {
    await claimAttachment(message.id);
  };

  const handleDelete = async () => {
    await deleteMessage(message.id);
  };

  const isReceived = message.receiver_id === character?.id;

  return (
    <div className="bg-[#161b22] rounded-lg border border-white/10 h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#0f1115] flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">
            {isReceived
              ? `Od: ${message.sender_name}`
              : `Do: ${message.receiver_name}`
            }
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {formatDateTime(message.created_at)}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

        {/* Message Text */}
        {message.message_text && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-400 uppercase">Wiadomość</h3>
            </div>
            <div className="bg-[#0f1115] rounded-lg p-4 text-white whitespace-pre-wrap border border-white/10">
              {message.message_text}
            </div>
          </div>
        )}

        {/* Attachments */}
        {(message.gold_amount > 0 || message.item) && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-400 uppercase">Załączniki</h3>
            </div>

            <div className="space-y-4">

              {/* Gold */}
              {message.gold_amount > 0 && (
                <div className="bg-[#0f1115] rounded-lg p-4 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-amber-500" />
                    <div>
                      <div className="text-white font-bold">
                        {message.gold_amount.toLocaleString()} złota
                      </div>
                      <div className="text-xs text-slate-400">
                        {message.is_claimed ? 'Odebrano' : 'Do odebrania'}
                      </div>
                    </div>
                  </div>
                  {message.is_claimed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              )}

              {/* Item */}
              {message.item && (
                <div className="bg-[#0f1115] rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-bold">Przedmiot</div>
                    {message.is_claimed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  <div
                    ref={itemRef}
                    className="relative inline-block"
                  >
                    <ItemIcon item={message.item} />
                    {itemRef.current && (
                      <ItemTooltip
                        item={message.item}
                        playerLevel={character?.level || 1}
                        rect={itemRef.current.getBoundingClientRect()}
                      />
                    )}
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    {message.item.name}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Claim Button */}
        {isReceived && !message.is_claimed && (message.gold_amount > 0 || message.item) && (
          <div className="pt-4">
            <button
              onClick={handleClaim}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Odbierz załączniki
            </button>
          </div>
        )}

        {/* Claimed Status */}
        {isReceived && message.is_claimed && (message.gold_amount > 0 || message.item) && (
          <div className="pt-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-green-400 font-bold">Odebrano</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-[#0f1115] flex justify-end">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Usuń wiadomość
        </button>
      </div>
    </div>
  );
};
