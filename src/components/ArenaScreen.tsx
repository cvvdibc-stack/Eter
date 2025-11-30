import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Character } from '../types';
import { getAvatarSrc } from '../utils/assets';
import { Sword, RefreshCw, User, Shield } from 'lucide-react';
import { PlayerProfileModal } from './PlayerProfileModal';

export const ArenaScreen: React.FC = () => {
  const { character, loadArenaPlayers, startPvPCombat } = useGame();
  const [suggested, setSuggested] = useState<Character[]>([]);
  const [others, setOthers] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Character | null>(null);

  const fetchPlayers = async () => {
    if (!character) return;
    setLoading(true);
    try {
      const result = await loadArenaPlayers();
      setSuggested(result.suggested);
      setOthers(result.others);
    } catch (error) {
      console.error('Error fetching arena players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [character]);

  if (!character) return null;

  const handleAttack = (target: Character) => {
    startPvPCombat(target);
  };

  const handleViewProfile = (target: Character) => {
    setSelectedPlayer(target);
  };

  const renderPlayerCard = (player: Character, isSuggested: boolean = false) => {
    const levelDiff = Math.abs(player.level - character.level);
    
    return (
      <div
        key={player.id}
        className={`bg-[#161b22] border rounded-lg p-4 hover:border-amber-500/50 transition-all ${
          isSuggested ? 'border-amber-500/30 bg-amber-950/10' : 'border-white/10'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={getAvatarSrc(player.profession)}
              alt={player.name}
              className="w-16 h-16 rounded-lg border-2 border-white/10 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {isSuggested && (
              <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#161b22]">
                ✓
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-100">{player.name}</h3>
              {isSuggested && (
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                  Proponowany
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="uppercase font-semibold">{player.profession}</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono">Poziom {player.level}</span>
              {levelDiff > 0 && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className={levelDiff <= 5 ? 'text-green-400' : 'text-yellow-400'}>
                    {levelDiff > character.level ? '+' : '-'}{levelDiff}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleViewProfile(player)}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <User size={16} />
              Profil
            </button>
            <button
              onClick={() => handleAttack(player)}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium font-bold"
            >
              <Sword size={16} />
              Zaatakuj
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="bg-[#161b22] border border-white/10 rounded-xl shadow-lg mb-6 p-6 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/30">
              <Shield className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Arena PvP</h2>
              <p className="text-xs text-slate-500">Wybierz przeciwnika do walki</p>
            </div>
          </div>
          <button
            onClick={fetchPlayers}
            disabled={loading}
            className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Odśwież
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Ładowanie graczy...</div>
        ) : (
          <>
            {/* Suggested Players */}
            {suggested.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <span className="bg-amber-500/20 px-3 py-1 rounded border border-amber-500/30">
                      Proponowani Gracze
                    </span>
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggested.map(player => renderPlayerCard(player, true))}
                </div>
              </div>
            )}

            {/* Other Players */}
            {others.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 mt-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
                  <h3 className="text-lg font-bold text-slate-400 flex items-center gap-2">
                    <span className="bg-slate-700/50 px-3 py-1 rounded border border-slate-600/30">
                      Pozostali Gracze
                    </span>
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {others.map(player => renderPlayerCard(player, false))}
                </div>
              </div>
            )}

            {suggested.length === 0 && others.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Shield size={48} className="mx-auto mb-4 opacity-50" />
                <p>Brak dostępnych graczy do walki</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile Modal */}
      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onAttack={() => {
            handleAttack(selectedPlayer);
            setSelectedPlayer(null);
          }}
        />
      )}
    </div>
  );
};

