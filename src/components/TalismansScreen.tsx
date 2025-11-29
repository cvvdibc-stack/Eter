import React from 'react';
import { useGame } from '../context/GameContext';
import { TALISMANS } from '../data/talismans';
import { Lock, Gem, ArrowRight, ShieldCheck, Circle, MinusCircle, XCircle } from 'lucide-react';

export const TalismansScreen: React.FC = () => {
  const { character, equipTalisman, unequipTalisman } = useGame();

  if (!character) return null;

  const activeTalismans = character.activeTalismans || ["", "", ""];
  const ownedTalismans = character.talismansInventory || [];
  
  // Slots config
  const slots = [
      { id: 0, level: 10 },
      { id: 1, level: 20 },
      { id: 2, level: 30 }
  ];

  const getRarityColor = (rarity: string) => {
      switch(rarity) {
          case 'common': return 'text-slate-400 border-slate-600 bg-slate-900/50';
          case 'unique': return 'text-yellow-400 border-yellow-700 bg-yellow-900/20';
          case 'heroic': return 'text-blue-400 border-blue-700 bg-blue-900/20';
          case 'legendary': return 'text-orange-500 border-orange-700 bg-orange-900/20';
          case 'mythic': return 'text-red-600 border-red-700 bg-red-900/30';
          default: return 'text-slate-400 border-slate-600';
      }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-[calc(100vh-100px)] flex gap-8">
        
        {/* Left Panel: Slots */}
        <div className="w-1/3 flex flex-col gap-6">
            <div className="bg-[#161b22] border border-white/10 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-teal-500 font-serif mb-6 flex items-center gap-2 uppercase tracking-wider">
                    <Gem size={24} /> Aktywne Talizmany
                </h2>
                
                <div className="space-y-4">
                    {slots.map((slot) => {
                        const isUnlocked = character.level >= slot.level;
                        const activeId = activeTalismans[slot.id];
                        const talisman = activeId ? TALISMANS[activeId] : null;

                        return (
                            <div key={slot.id} className={`relative p-4 rounded-lg border-2 transition-all
                                ${isUnlocked 
                                    ? talisman 
                                        ? getRarityColor(talisman.rarity) 
                                        : 'border-dashed border-slate-700 bg-black/20' 
                                    : 'border-transparent bg-black/40 opacity-50'
                                }`}
                            >
                                {isUnlocked ? (
                                    talisman ? (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10">
                                                    <Gem size={20} className={getRarityColor(talisman.rarity).split(' ')[0]} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{talisman.name}</div>
                                                    <div className="text-xs opacity-70">{talisman.effectDescription}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => unequipTalisman(slot.id)}
                                                className="text-slate-500 hover:text-red-500 p-2 transition-colors"
                                                title="Zdejmij"
                                            >
                                                <XCircle size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 text-slate-600 h-10">
                                            <Circle size={16} /> Pusty slot
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-slate-600">
                                        <Lock size={16} />
                                        <span className="text-xs uppercase font-bold tracking-widest">Dostępne od lvl {slot.level}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="bg-[#161b22] border border-white/10 p-4 rounded-xl text-sm text-slate-400 italic">
                Talizmany to potężne artefakty wzmacniające twoją duszę. Możesz je zdobyć pokonując najgroźniejszych bossów w lochach.
            </div>
        </div>

        {/* Right Panel: Inventory */}
        <div className="flex-1 bg-[#161b22] border border-white/10 rounded-xl flex flex-col overflow-hidden shadow-lg">
             <div className="p-6 border-b border-white/10 bg-[#0b0d10] flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-200 font-serif uppercase tracking-wider">
                    Twoja Kolekcja ({ownedTalismans.length})
                </h2>
                {/* Filters could go here */}
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 content-start">
                {ownedTalismans.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-slate-600 py-20">
                        <Gem size={48} className="mb-4 opacity-20" />
                        <p>Nie posiadasz żadnych talizmanów.</p>
                        <p className="text-sm mt-2">Odwiedź lochy, aby je zdobyć!</p>
                    </div>
                ) : (
                    ownedTalismans.map((tId, idx) => {
                        const t = TALISMANS[tId];
                        if (!t) return null; // Should not happen
                        
                        // Check if equipped
                        const isEquipped = activeTalismans.includes(tId);
                        // Find first empty slot index
                        const emptySlotIndex = slots.findIndex(s => character.level >= s.level && !activeTalismans[s.id]);
                        const canEquip = !isEquipped && emptySlotIndex !== -1;

                        return (
                            <div key={`${tId}-${idx}`} className={`p-4 rounded-lg border flex justify-between items-center transition-all group hover:bg-white/5 ${getRarityColor(t.rarity)}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black/40 rounded flex items-center justify-center shadow-inner">
                                         <Gem size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-base">{t.name}</div>
                                        <div className="text-xs font-mono mt-1 opacity-90">{t.effectDescription}</div>
                                    </div>
                                </div>

                                <div>
                                    {isEquipped ? (
                                        <span className="text-xs font-bold uppercase bg-black/30 px-2 py-1 rounded text-green-500 border border-green-900/30">
                                            Założony
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => canEquip && equipTalisman(tId, emptySlotIndex)}
                                            disabled={!canEquip}
                                            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2
                                                ${canEquip 
                                                    ? 'bg-slate-800 hover:bg-teal-900 text-white border border-slate-600 hover:border-teal-500' 
                                                    : 'bg-black/20 text-slate-600 cursor-not-allowed border border-transparent'}
                                            `}
                                        >
                                            {canEquip ? 'Załóż' : (activeTalismans.length >= 3 || emptySlotIndex === -1) ? 'Brak slotów' : '---'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    </div>
  );
};

