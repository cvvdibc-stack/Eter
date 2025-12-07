import React, { useState, useEffect, useRef } from 'react';
import { useMailbox } from '../../context/MailboxContext';
import { useGame } from '../../context/GameContext';
import { Character } from '../../types';
import { X, Send, Coins, Package, MessageSquare, User, Search } from 'lucide-react';
import { ItemIcon } from '../ItemIcon';
import { ItemTooltip } from '../ItemTooltip';
import { getAvatarSrc } from '../../utils/assets';
import { getProfessionName } from '../../utils/professionUtils';

interface MailboxComposeModalProps {
  onClose: () => void;
}

export const MailboxComposeModal: React.FC<MailboxComposeModalProps> = ({ onClose }) => {
  const { character, loadArenaPlayers } = useGame();
  const { sendMessage } = useMailbox();

  const [messageText, setMessageText] = useState('');
  const [goldAmount, setGoldAmount] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedReceiver, setSelectedReceiver] = useState<Character | null>(null);
  const [allPlayers, setAllPlayers] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedItemRef = useRef<HTMLDivElement>(null);
  const itemRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Load players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const result = await loadArenaPlayers();
        const all = [...result.suggested, ...result.others];
        setAllPlayers(all.filter(p => p.id !== character?.id));
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };

    loadPlayers();
  }, [loadArenaPlayers, character]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const filteredPlayers = allPlayers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableItems = character?.inventory.filter(item => item !== null) || [];

  const selectedItem = availableItems.find(item => item && item.id === selectedItemId) || null;

  const handleSend = async () => {
    if (!selectedReceiver) {
      // Show toast error
      return;
    }

    if (!messageText.trim() && !goldAmount && !selectedItemId) {
      // Show toast error
      return;
    }

    const gold = goldAmount ? parseInt(goldAmount, 10) : 0;

    setIsSending(true);
    try {
      const success = await sendMessage(
        selectedReceiver.id,
        selectedReceiver.name,
        messageText.trim() || undefined,
        gold > 0 ? gold : undefined,
        selectedItemId || undefined
      );

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const isValid = selectedReceiver && (messageText.trim() || goldAmount || selectedItemId) && !isSending;

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
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Wyślij wiadomość</h2>
              {selectedReceiver && (
                <div className="text-sm text-slate-400">Do: {selectedReceiver.name}</div>
              )}
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

          {/* Receiver Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Odbiorca
            </label>

            {!selectedReceiver ? (
              <div className="bg-[#0f1115] border border-white/10 rounded-lg p-4">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj gracza..."
                    className="w-full bg-[#161b22] border border-white/10 rounded p-2 pl-10 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                  {filteredPlayers.length === 0 ? (
                    <div className="text-xs text-slate-500 text-center py-4">
                      Brak graczy
                    </div>
                  ) : (
                    filteredPlayers.map((player) => (
                      <div
                        key={player.id}
                        onClick={() => setSelectedReceiver(player)}
                        className="flex items-center gap-3 p-2 bg-[#161b22] hover:bg-slate-800/50 rounded cursor-pointer transition-colors"
                      >
                        <img
                          src={getAvatarSrc(player.profession)}
                          alt={player.name}
                          className="w-8 h-8 rounded border border-white/10"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-white">{player.name}</div>
                          <div className="text-xs text-slate-400">
                            {getProfessionName(player.profession)} • Lvl {player.level}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#0f1115] border border-amber-500/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarSrc(selectedReceiver.profession)}
                    alt={selectedReceiver.name}
                    className="w-10 h-10 rounded border border-white/10"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{selectedReceiver.name}</div>
                    <div className="text-xs text-slate-400">
                      {selectedReceiver.profession} • Lvl {selectedReceiver.level}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReceiver(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Zmień
                </button>
              </div>
            )}
          </div>

          {/* Message Text */}
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Treść wiadomości
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Napisz wiadomość..."
              className="w-full bg-[#0f1115] border border-white/10 rounded p-3 text-white resize-none focus:border-amber-500 focus:outline-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-slate-500 mt-1 text-right">
              {messageText.length}/500
            </div>
          </div>

          {/* Gold */}
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
              <Coins className="w-4 h-4 inline mr-2" />
              Złoto (opcjonalnie)
            </label>
            <div className="relative">
              <input
                type="text"
                value={goldAmount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') return setGoldAmount('');
                  const num = parseInt(val, 10);
                  if (!isNaN(num) && num <= 5000000) {
                    setGoldAmount(val);
                  }
                }}
                placeholder="0"
                className="w-full bg-[#0f1115] border border-white/10 rounded p-3 pl-10 text-amber-500 font-mono font-bold focus:border-amber-500 focus:outline-none"
              />
              <Coins className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
            </div>
            {character && goldAmount && (
              <div className="text-xs text-slate-400 mt-1">
                Masz: {character.gold.toLocaleString()}g
              </div>
            )}
          </div>

          {/* Item */}
          <div>
            <label className="block text-sm font-bold text-slate-400 uppercase mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Przedmiot (opcjonalnie)
            </label>

            {selectedItem ? (
              <div className="bg-[#0f1115] border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-bold">Wybrany przedmiot</div>
                  <button
                    onClick={() => setSelectedItemId('')}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Usuń
                  </button>
                </div>
                <div
                  ref={selectedItemRef}
                  className="relative inline-block"
                >
                  <ItemIcon item={selectedItem} />
                  {selectedItemRef.current && (
                    <ItemTooltip
                      item={selectedItem}
                      playerLevel={character?.level || 1}
                      rect={selectedItemRef.current.getBoundingClientRect()}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#0f1115] border border-white/10 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-3">
                  Wybierz przedmiot z ekwipunku:
                </div>
                {availableItems.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">
                    Brak przedmiotów w ekwipunku
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {availableItems.map((item) => (
                      <div
                        key={item.id}
                        ref={(el) => {
                          if (el) itemRefsMap.current.set(item.id, el);
                          else itemRefsMap.current.delete(item.id);
                        }}
                        onClick={() => setSelectedItemId(item.id)}
                        className="relative cursor-pointer hover:scale-110 transition-transform"
                      >
                        <ItemIcon item={item} />
                        {itemRefsMap.current.get(item.id) && (
                          <ItemTooltip
                            item={item}
                            playerLevel={character?.level || 1}
                            rect={itemRefsMap.current.get(item.id)!.getBoundingClientRect()}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0f1115] border-t border-white/10 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={handleSend}
            disabled={!isValid}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'Wysyłanie...' : 'Wyślij'}
          </button>
        </div>
      </div>
    </div>
  );
};
