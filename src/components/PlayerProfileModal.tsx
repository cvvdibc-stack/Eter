import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Character } from '../types';
import { calculateDerivedStats } from '../utils/formulas';
import { getAvatarSrc } from '../utils/assets';
import { ItemIcon } from './ItemIcon';
import { ItemTooltip } from './ItemTooltip';
import { X, Sword, Shield, User } from 'lucide-react';
import { ItemType } from '../types';

interface PlayerProfileModalProps {
  player: Character;
  onClose: () => void;
  onAttack: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, onClose, onAttack }) => {
  const { loadPlayerProfile } = useGame();
  const [fullPlayer, setFullPlayer] = useState<Character | null>(player);
  const [hoveredItem, setHoveredItem] = useState<{ item: any, rect: DOMRect } | null>(null);

  useEffect(() => {
    const fetchFullProfile = async () => {
      const profile = await loadPlayerProfile(player.id);
      if (profile) {
        setFullPlayer(profile);
      }
    };
    fetchFullProfile();
  }, [player.id, loadPlayerProfile]);

  if (!fullPlayer) return null;

  const equipmentList = fullPlayer.equipment
    ? Object.values(fullPlayer.equipment).filter((i): i is any => i !== null)
    : [];

  const stats = calculateDerivedStats(
    fullPlayer.baseStats,
    fullPlayer.level,
    fullPlayer.profession,
    equipmentList,
    fullPlayer.activeTalismans || [],
    fullPlayer.boughtStats
  );

  const renderEquipSlot = (type: ItemType) => {
    const item = fullPlayer.equipment?.[type];
    return (
      <div 
        onMouseEnter={(e) => item && handleItemHover(e, item)}
        onMouseLeave={handleItemLeave}
        className="w-16 h-16 bg-[#1a1d24] border-2 border-[#2a2e38] rounded shadow-inner flex items-center justify-center hover:border-amber-500/50 transition-all cursor-pointer relative group"
      >
        {item ? (
          <div className="w-full h-full p-0.5 flex items-center justify-center relative">
            <ItemIcon item={item} size={56} showRarityBorder={false} />
          </div>
        ) : (
          <div className="opacity-20">
            {type === 'weapon' && <Sword size={24} />}
            {type === 'helmet' && <Shield size={24} />}
            {type === 'armor' && <Shield size={24} />}
            {type === 'boots' && <Shield size={24} />}
            {(type === 'ring' || type === 'amulet') && <div className="w-4 h-4 rounded-full border-2 border-current"></div>}
            {type === 'shield' && <Shield size={24} />}
            {type === 'gloves' && <Shield size={24} />}
          </div>
        )}
      </div>
    );
  };

  const handleItemHover = (e: React.MouseEvent, item: any) => {
    if (!item) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({ item, rect });
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-white/10 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0f1115] border-b border-white/10 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={getAvatarSrc(fullPlayer.profession)}
              alt={fullPlayer.name}
              className="w-16 h-16 rounded-lg border-2 border-white/10 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{fullPlayer.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                <span className="uppercase font-semibold">{fullPlayer.profession}</span>
                <span className="text-slate-500">•</span>
                <span className="font-mono">Poziom {fullPlayer.level}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Stats */}
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-amber-500" />
                Statystyki
              </h3>
              
              <div className="bg-[#0f1115] rounded-lg p-4 space-y-4">
                {/* Primary Stats */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 mb-2 tracking-wider">Podstawowe</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Siła</span>
                      <span className="font-mono font-bold text-slate-200">{stats.strength}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Zręczność</span>
                      <span className="font-mono font-bold text-slate-200">{stats.dexterity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Inteligencja</span>
                      <span className="font-mono font-bold text-slate-200">{stats.intelligence}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Witalność</span>
                      <span className="font-mono font-bold text-slate-200">{stats.vitality}</span>
                    </div>
                  </div>
                </div>

                {/* Combat Stats */}
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-500 mb-2 tracking-wider">Walka</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">HP</span>
                      <span className="font-mono font-bold text-slate-200">{stats.maxHp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Obrażenia Fiz.</span>
                      <span className="font-mono font-bold text-slate-200">{stats.physDmgMin}-{stats.physDmgMax}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Obrażenia Mag.</span>
                      <span className="font-mono font-bold text-slate-200">{stats.magDmgMin}-{stats.magDmgMax}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Pancerz</span>
                      <span className="font-mono font-bold text-slate-200">{stats.armor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Szansa Krytyczna</span>
                      <span className="font-mono font-bold text-slate-200">{stats.critChance.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Unik</span>
                      <span className="font-mono font-bold text-slate-200">{stats.dodgeChance.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Szybkość Ataku</span>
                      <span className="font-mono font-bold text-slate-200">{stats.attackSpeed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Equipment */}
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Sword size={20} className="text-blue-500" />
                Ekwipunek
              </h3>
              
              <div className="bg-[#161b22] border-2 border-white/10 rounded-xl p-4 shadow-lg relative bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]">
                <div className="absolute inset-0 bg-amber-900/5 pointer-events-none"></div>
                <h3 className="text-xs text-center text-amber-700 uppercase font-bold mb-4 tracking-widest relative z-10">Ekwipunek</h3>
                
                <div className="grid grid-cols-3 gap-4 w-fit mx-auto relative z-10 mt-4">
                  <div className="col-start-2">{renderEquipSlot('helmet')}</div>
                  <div className="col-start-1 row-start-2">{renderEquipSlot('ring')}</div>
                  <div className="col-start-2 row-start-2">{renderEquipSlot('amulet')}</div>
                  <div className="col-start-3 row-start-2">{renderEquipSlot('gloves')}</div>
                  <div className="col-start-1 row-start-3">{renderEquipSlot('weapon')}</div>
                  <div className="col-start-2 row-start-3 relative flex justify-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none -z-10">👤</div>
                    {renderEquipSlot('armor')}
                  </div>
                  <div className="col-start-3 row-start-3">{renderEquipSlot('shield')}</div>
                  <div className="col-start-2 row-start-4">{renderEquipSlot('boots')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0f1115] border-t border-white/10 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            Zamknij
          </button>
          <button
            onClick={onAttack}
            className="px-6 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 font-bold"
          >
            <Sword size={18} />
            Zaatakuj
          </button>
        </div>
      </div>

      {/* Item Tooltip */}
      {hoveredItem && (
        <ItemTooltip
          item={hoveredItem.item}
          playerLevel={fullPlayer.level}
          rect={hoveredItem.rect}
        />
      )}
    </div>
  );
};

