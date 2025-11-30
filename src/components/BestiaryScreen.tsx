import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Skull, Sword, Shield, Info, Search, Lock, Check } from 'lucide-react';

export const BestiaryScreen: React.FC = () => {
  const { killedMonsters, unlockedMonsters, monsters, character } = useGame();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'ALL' | 'EXPEDITION' | 'DUNGEON' | 'EVENT'>('ALL');

    // Filter logic
    const visibleMonsters = (monsters || []).filter(m => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'DUNGEON') return m.id.startsWith('boss_dungeon');
        // Assuming 'EXPEDITION' covers normal mobs and non-dungeon bosses
        if (activeTab === 'EXPEDITION') return !m.id.startsWith('boss_dungeon') && m.type !== 'event'; 
        // Future proofing event tab
        if (activeTab === 'EVENT') return m.type === 'event';
        return true;
    });

  const selectedMonster = visibleMonsters.find(m => m.id === selectedId);
  const killCount = selectedId ? (killedMonsters[selectedId] || 0) : 0;

  if (visibleMonsters.length === 0) {
      return (
          <div className="flex items-center justify-center h-full text-slate-500 italic p-10">
              <div className="text-center">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Bestiariusz jest pusty. Upewnij się, że migracje bazy danych zostały wykonane (006).</p>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 h-[calc(100vh-100px)] flex gap-6">
        
        {/* Left Panel: Monster List */}
        <div className="w-1/3 bg-[#161b22] border border-white/10 rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-[#0b0d10]">
                <h2 className="text-xl font-bold text-amber-600 font-serif uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Search size={20} /> Bestiariusz
                </h2>
                
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-900 p-1 rounded border border-white/10">
                    <button 
                        onClick={() => setActiveTab('ALL')}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors ${activeTab === 'ALL' ? 'bg-amber-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Wszystkie
                    </button>
                    <button 
                        onClick={() => setActiveTab('EXPEDITION')}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors ${activeTab === 'EXPEDITION' ? 'bg-amber-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Wyprawy
                    </button>
                    <button 
                        onClick={() => setActiveTab('DUNGEON')}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-colors ${activeTab === 'DUNGEON' ? 'bg-purple-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Lochy
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                {visibleMonsters.map(monster => {
                    const kills = killedMonsters[monster.id] || 0;
                    const isUnlocked = unlockedMonsters.includes(monster.id);
                    const isKnown = kills > 0 || isUnlocked;
                    
                    return (
                        <div 
                            key={monster.id}
                            onClick={() => isKnown && setSelectedId(monster.id)}
                            className={`p-3 rounded border cursor-pointer flex justify-between items-center transition-colors
                                ${selectedId === monster.id 
                                    ? 'bg-amber-900/20 border-amber-600/50' 
                                    : 'bg-[#0f1115] border-white/5 hover:border-white/10'}
                                ${!isKnown ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                                    ${isKnown ? 'bg-slate-800 border-slate-600' : 'bg-black border-slate-800'}
                                `}>
                                    {isKnown ? <Skull size={20} className="text-slate-400" /> : <span className="text-slate-700">?</span>}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isKnown ? 'text-slate-200' : 'text-slate-600'}`}>
                                        {isKnown ? monster.name : 'Nieznana Bestia'}
                                    </h4>
                                    {isKnown && <span className="text-[10px] text-slate-500 uppercase font-bold">Lvl {monster.level}</span>}
                                </div>
                            </div>
                            {isKnown && (
                                <div className="text-right">
                                    <span className="text-xs font-mono text-red-500 block">{kills} ☠</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Right Panel: Details */}
        <div className="flex-1 bg-[#161b22] border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col overflow-y-auto">
            {selectedMonster ? (
                <>
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Skull size={300} />
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h2 className="text-4xl font-bold text-amber-500 font-serif mb-2">{selectedMonster.name}</h2>
                            <div className="flex gap-3">
                                <span className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-slate-300 border border-white/10">
                                    POZIOM {selectedMonster.level}
                                </span>
                                <span className="px-2 py-1 bg-red-900/30 rounded text-xs font-bold text-red-400 border border-red-900/50 uppercase">
                                    {selectedMonster.type || 'Bestia'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Zabitych</div>
                            <div className="text-4xl font-black text-red-600 font-mono">{killCount}</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
                        <div className="bg-[#0b0d10] p-4 rounded border border-white/5">
                            <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                                <Shield size={14} /> Zdrowie
                            </div>
                            <div className="text-2xl font-mono text-green-500">{selectedMonster.maxHp} HP</div>
                        </div>
                        <div className="bg-[#0b0d10] p-4 rounded border border-white/5">
                             <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                                <Sword size={14} /> Obrażenia
                            </div>
                            <div className="text-2xl font-mono text-red-500">{selectedMonster.damageMin}-{selectedMonster.damageMax}</div>
                        </div>
                         <div className="bg-[#0b0d10] p-4 rounded border border-white/5">
                             <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                                <Shield size={14} /> Pancerz
                            </div>
                            <div className="text-2xl font-mono text-slate-300">{selectedMonster.defense}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8 relative z-10">
                        <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2 border-b border-white/5 pb-1">Opis</h3>
                        <p className="text-slate-400 italic leading-relaxed">
                            {selectedMonster.description || "Przerażająca bestia zamieszkująca mroczne zakątki świata Eteru."}
                        </p>
                    </div>

                    {/* Drops */}
                    <div className="flex-1 relative z-10 mb-8">
                         <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-4 border-b border-white/5 pb-1">
                            Możliwe Dropy {killCount === 0 && <span className="text-xs text-red-500 normal-case float-right">(Zabij, aby poznać)</span>}
                         </h3>
                         
                         {killCount > 0 ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-2 bg-[#0b0d10] rounded border border-white/5">
                                    <span className="text-slate-300 font-bold text-sm">Złoto</span>
                                    <span className="text-yellow-500 font-mono text-sm">
                                        {selectedMonster.goldMin || 0} - {selectedMonster.goldMax || 0}
                                    </span>
                                </div>
                                 <div className="flex justify-between items-center p-2 bg-[#0b0d10] rounded border border-white/5">
                                    <span className="text-slate-300 font-bold text-sm">Doświadczenie</span>
                                    <span className="text-blue-400 font-mono text-sm">{selectedMonster.expReward} EXP</span>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="p-2 border border-slate-700/50 bg-slate-800/20 rounded text-center">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Pospolity</div>
                                        <div className="text-slate-300 font-mono">
                                            {selectedMonster.lootTable?.rarity?.common ?? 0}%
                                        </div>
                                    </div>
                                    <div className="p-2 border border-yellow-900/50 bg-yellow-900/10 rounded text-center">
                                        <div className="text-xs text-yellow-600 uppercase font-bold">Unikat</div>
                                        <div className="text-yellow-400 font-mono">
                                            {selectedMonster.lootTable?.rarity?.unique ?? 0}%
                                        </div>
                                    </div>
                                    <div className="p-2 border border-blue-900/50 bg-blue-900/10 rounded text-center">
                                        <div className="text-xs text-blue-600 uppercase font-bold">Heroiczny</div>
                                        <div className="text-blue-400 font-mono">
                                            {selectedMonster.lootTable?.rarity?.heroic ?? 0}%
                                        </div>
                                    </div>
                                    {/* Legend visible only for lvl 10+ monsters */}
                                    {selectedMonster.level >= 10 ? (
                                        <div className="p-2 border border-orange-900/50 bg-orange-900/10 rounded text-center">
                                            <div className="text-xs text-orange-600 uppercase font-bold">Legenda</div>
                                            <div className="text-orange-400 font-mono">
                                                {selectedMonster.lootTable?.rarity?.legendary ?? 0}%
                                            </div>
                                        </div>
                                    ) : (
                                         <div className="p-2 border border-slate-800 bg-black/20 rounded text-center opacity-50">
                                            <div className="text-xs text-slate-600 uppercase font-bold">Legenda</div>
                                            <div className="text-slate-600 font-mono">-</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                         ) : (
                             <div className="flex items-center justify-center h-32 text-slate-600 italic border border-dashed border-slate-700 rounded">
                                 Dane niedostępne. Pokonaj potwora, aby odkryć jego tajemnice.
                             </div>
                         )}
                    </div>

                    {/* Rare Loot Table */}
                    {selectedMonster.lootTable?.legends && (
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-orange-900/30 pb-1 flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rotate-45"></div> Przedmioty Legendarne
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(selectedMonster.lootTable.legends).map(([cls, itemId]) => {
                                    // Placeholder state - in real app, check if item ID is in character.discoveredItems
                                    const isDiscovered = false; 
                                    
                                    return (
                                        <div key={cls} className={`flex items-center gap-3 p-2 rounded border border-white/5 bg-[#0b0d10] opacity-70 hover:opacity-100 transition-opacity`}>
                                            <div className={`w-12 h-12 rounded border-2 flex items-center justify-center shrink-0
                                                ${isDiscovered 
                                                    ? 'border-orange-500 bg-orange-900/20' 
                                                    : 'border-slate-700 bg-slate-800 grayscale'}
                                            `}>
                                                {/* Generic icon or specific if discovered */}
                                                <div className={`w-8 h-8 bg-orange-500 mask-icon`} style={{ maskImage: 'url(/icons/sword.svg)' }}></div>
                                                {/* Fallback to text if no icon system */}
                                                <span className={`text-xs font-bold ${isDiscovered ? 'text-orange-400' : 'text-slate-600'}`}>?</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-[10px] font-bold uppercase text-slate-500">
                                                    {cls === 'warrior' ? 'Wojownik' : cls === 'mage' ? 'Mag' : cls === 'assassin' ? 'Zabójca' : 'Kleryk'}
                                                </div>
                                                <div className={`text-xs font-bold truncate ${isDiscovered ? 'text-orange-400' : 'text-slate-600'}`}>
                                                    {isDiscovered ? 'Nazwa Przedmiotu' : 'Nieodkryty'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Titanic Loot Table */}
                    {selectedMonster.lootTable?.tytanic && (
                        <div className="relative z-10 mt-6">
                            <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4 border-b border-red-900/30 pb-1 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-600 rotate-45"></div> Przedmioty Tytaniczne
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(selectedMonster.lootTable.tytanic).map(([cls, itemId]) => {
                                    const isDiscovered = false;
                                    return (
                                        <div key={cls} className={`flex items-center gap-3 p-2 rounded border border-white/5 bg-[#0b0d10] opacity-70 hover:opacity-100 transition-opacity`}>
                                            <div className={`w-12 h-12 rounded border-2 flex items-center justify-center shrink-0
                                                ${isDiscovered 
                                                    ? 'border-red-500 bg-red-900/20' 
                                                    : 'border-slate-700 bg-slate-800 grayscale'}
                                            `}>
                                                <span className={`text-xs font-bold ${isDiscovered ? 'text-red-400' : 'text-slate-600'}`}>?</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-[10px] font-bold uppercase text-slate-500">
                                                     {cls === 'warrior' ? 'Wojownik' : cls === 'mage' ? 'Mag' : cls === 'assassin' ? 'Zabójca' : 'Kleryk'}
                                                </div>
                                                <div className={`text-xs font-bold truncate ${isDiscovered ? 'text-red-400' : 'text-slate-600'}`}>
                                                    {isDiscovered ? 'Nazwa Przedmiotu' : 'Nieodkryty'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                    <Info size={48} className="mb-4 opacity-50" />
                    <p>Wybierz potwora z listy, aby zobaczyć szczegóły.</p>
                </div>
            )}
        </div>
    </div>
  );
};
