import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { calculateDerivedStats } from '../utils/formulas';
import { Shield, Sword, PlusCircle, X } from 'lucide-react';
import { ItemType, Item } from '../types';
import { getAvatarSrc } from '../utils/assets';
import { ItemTooltip } from './ItemTooltip';
import { ItemIcon } from './ItemIcon';

const StatRow: React.FC<{ label: string, value: string | number, rawValue?: number, cap?: number, base?: number, items?: number, desc?: string }> = ({ label, value, rawValue, cap, base, items, desc }) => {
    const isCapped = rawValue !== undefined && cap !== undefined && rawValue >= cap;
    
    return (
    <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors group relative">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
            <span className={`font-mono text-sm font-bold ${isCapped ? 'text-amber-500' : 'text-slate-200'}`}>
                {value}
            </span>
            {isCapped && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">MAX</span>}
        </div>
        
        {/* Enhanced Tooltip */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-64 bg-black/95 p-3 text-xs text-slate-300 rounded-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
            <div className="font-bold text-white mb-2 border-b border-white/10 pb-1 uppercase tracking-wider">{label}</div>
            {desc && <div className="text-slate-400 italic mb-3">{desc}</div>}
            
            {base !== undefined && (
                <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                    <span className="text-slate-500">Podstawy:</span>
                    <span className="text-right font-mono text-white">{base}</span>
                    
                    <span className="text-slate-500">Z itemów:</span>
                    <span className="text-right font-mono text-blue-400">+{items}</span>
                    
                    <span className="text-slate-500">Posiadane:</span>
                    <span className="text-right font-mono text-yellow-500">{rawValue}</span>
                    
                    <span className="text-slate-500">Limit (Lvl {Math.floor(((cap || 50) - 50)/10)}):</span>
                    <span className="text-right font-mono text-red-500">{cap}</span>
                </div>
            )}
            {isCapped && (
                <div className="mt-2 text-[10px] text-red-400 border-t border-red-900/30 pt-1">
                    Osiągnięto limit poziomu! Nadmiarowe punkty nie działają.
                </div>
            )}
        </div>
    </div>
)};

const StatsCategory: React.FC<{ title: string, color: string, children: React.ReactNode }> = ({ title, color, children }) => (
    <div className="mb-4">
        <h4 className={`text-xs uppercase font-bold tracking-widest mb-2 ${color} border-b border-white/10 pb-1`}>{title}</h4>
        <div className="space-y-0.5">
            {children}
        </div>
    </div>
);

export const InventoryScreen: React.FC = () => {
  const { character, equipItem, unequipItem, moveItem, showToast } = useGame();
  const [imgError, setImgError] = useState(false);
  
  // Updated State Type for Comparison
  const [hoveredItem, setHoveredItem] = useState<{ item: Item, rect: DOMRect, equippedComparison?: Item | null } | null>(null);
  
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [showStats, setShowStats] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('text/plain', index.toString());
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromIndexStr = e.dataTransfer.getData('text/plain');
      if (!fromIndexStr) return;
      
      const fromIndex = parseInt(fromIndexStr, 10);
      if (isNaN(fromIndex)) return;

      moveItem(fromIndex, toIndex);
  };

  if (!character) return null;

  const equipmentList = character.equipment 
    ? Object.values(character.equipment).filter((i): i is Item => i !== null)
    : [];

  const stats = calculateDerivedStats(
    character.baseStats, 
    character.level, 
    character.profession, 
    equipmentList,
    character.activeTalismans || [],
    character.boughtStats
  );

  const isMagicClass = character.profession === 'mage' || character.profession === 'cleric';

  const renderStatBar = (label: string, value: number, max: number = 100, colorClass: string = 'bg-amber-600', statKey?: string) => {
     // Calculate tooltip data if statKey is provided
     let tooltip = null;
     if (statKey && character.boughtStats && character.baseStats) {
         const base = character.baseStats[statKey as keyof typeof character.baseStats] + (character.boughtStats[`${statKey}_bonus` as keyof typeof character.boughtStats] || 0);
         // @ts-ignore
         const uncapped = stats[`uncapped${statKey.charAt(0).toUpperCase() + statKey.slice(1)}`];
         const fromItems = uncapped - base;
         const isCapped = uncapped >= max;
         
         tooltip = (
            <div className="absolute left-full top-0 ml-2 w-48 bg-black/95 p-3 text-xs text-slate-300 rounded-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-[60] shadow-xl">
                <div className="font-bold text-white mb-2 border-b border-white/10 pb-1 uppercase tracking-wider">{label}</div>
                <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                    <span className="text-slate-500">Podstawy:</span>
                    <span className="text-right font-mono text-white">{base}</span>
                    
                    <span className="text-slate-500">Z itemów:</span>
                    <span className="text-right font-mono text-blue-400">+{fromItems}</span>
                    
                    <span className="text-slate-500">Posiadane:</span>
                    <span className="text-right font-mono text-yellow-500">{uncapped}</span>
                    
                    <span className="text-slate-500">Limit:</span>
                    <span className="text-right font-mono text-red-500">{max}</span>
                </div>
                {isCapped && (
                    <div className="mt-2 text-[10px] text-red-400 border-t border-red-900/30 pt-1">
                        MAX (Limit Poziomu)
                    </div>
                )}
            </div>
         );
     }

     return (
     <div className="mb-3 group relative">
        <div className="flex justify-between text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">
            <span>{label}</span>
            <span className={value >= max ? 'text-amber-500' : ''}>{value}</span>
        </div>
        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div className={`h-full ${colorClass}`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }}></div>
        </div>
        {tooltip}
     </div>
  )};

  const renderEquipSlot = (type: ItemType) => {
    const item = character.equipment?.[type];
    return (
      <div 
        onClick={() => item && unequipItem(type)}
        onMouseEnter={(e) => item && setHoveredItem({ item, rect: e.currentTarget.getBoundingClientRect(), equippedComparison: null })}
        onMouseLeave={() => setHoveredItem(null)}
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
           </div>
        )}
      </div>
    );
  };

  const expPercent = character.maxExp > 0 
    ? Math.floor((character.exp / character.maxExp) * 100) 
    : 0;

  const hpPercent = stats.maxHp > 0
    ? Math.floor((character.currentHp / stats.maxHp) * 100)
    : 0;

  const inventorySlice = Array.from({ length: 24 }).map((_, i) => {
      const actualIndex = activeTab * 24 + i;
      return character.inventory[actualIndex] || null;
  });

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-8 h-[calc(100vh-140px)] overflow-hidden p-4 lg:p-6 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: Avatar & Stats */}
      <div className="w-full lg:w-[340px] flex flex-col gap-4 h-full">
        
        {/* Avatar */}
        <div className="w-full h-[320px] bg-[#161b22] border-2 border-amber-900/30 rounded-xl overflow-hidden relative shadow-2xl shrink-0 group">
            {!imgError ? (
                <img 
                    src={getAvatarSrc(character.profession)}
                    alt={character.profession}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <span className="text-6xl">👤</span>
                </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-4 px-4 flex flex-col items-center pointer-events-none">
                <h2 className="text-2xl font-bold text-white font-serif tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{character.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-amber-500 uppercase font-bold tracking-[0.2em] drop-shadow-md">{character.profession}</span>
                    <span className="text-slate-500 text-[10px]">•</span>
                    <span className="text-xs text-slate-300 font-mono drop-shadow-md">Lvl {character.level}</span>
                </div>
            </div>
        </div>

        {/* Stats Panel */}
        <div className="flex-1 bg-[#161b22] border-2 border-white/10 p-4 rounded-xl shadow-lg flex flex-col gap-2 overflow-visible z-20">
            <div>
                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                    <h3 className="text-xs text-slate-500 uppercase font-bold">Statystyki</h3>
                    <button 
                        onClick={() => setShowStats(true)}
                        className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1 uppercase font-bold tracking-wider bg-amber-900/20 px-2 py-0.5 rounded border border-amber-900/50 hover:bg-amber-900/40 transition-colors"
                    >
                        <PlusCircle size={12} /> Więcej
                    </button>
                </div>
                
                {/* HP BAR */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">
                        <span>Zdrowie</span>
                        <span className="text-green-400 font-mono">{character.currentHp} / {stats.maxHp}</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative group">
                        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500" style={{ width: `${hpPercent}%` }}></div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold bg-black/80 text-white">
                            +{parseFloat((2 + (stats.hpRegen || 0)).toFixed(1))}% HP / min
                        </div>
                    </div>
                </div>

                {/* EXP BAR */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">
                        <span>Postęp</span>
                        <span>{expPercent}%</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative group">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${expPercent}%` }}></div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold bg-black/80 text-white">
                            {character.exp} / {character.maxExp} EXP
                        </div>
                    </div>
                </div>

                {renderStatBar('Siła', stats.strength, stats.statCap, 'bg-red-700', 'strength')}
                {renderStatBar('Zręczność', stats.dexterity, stats.statCap, 'bg-green-700', 'dexterity')}
                {renderStatBar('Inteligencja', stats.intelligence, stats.statCap, 'bg-blue-700', 'intelligence')}
                {renderStatBar('Witalność', stats.vitality, stats.statCap, 'bg-amber-700', 'vitality')}
            </div>

            <div className="mt-auto space-y-1.5 text-sm text-slate-300 border-t border-white/5 pt-3">
                <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Obrażenia</span>
                    <span className={`font-mono font-bold ${isMagicClass ? 'text-purple-400' : 'text-amber-500'}`}>
                        {isMagicClass 
                            ? `${stats.magDmgMin}-${stats.magDmgMax}` 
                            : `${stats.physDmgMin}-${stats.physDmgMax}`}
                    </span>
                </div>
                <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Pancerz</span>
                    <span className="font-mono text-slate-200">{stats.armor} ({Math.floor(stats.physResist * 100)}%)</span>
                </div>
                <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Szybkość Ataku</span>
                    <span className="font-mono text-cyan-400 font-bold">{stats.attackSpeed}</span>
                </div>
                <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Unik</span>
                    <span className="font-mono text-slate-200">{stats.dodgeChance}%</span>
                </div>
                <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Krytyk</span>
                    <span className="font-mono text-slate-200">{stats.critChance}%</span>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Equipment & Backpack */}
      <div className="w-full lg:w-[420px] flex flex-col gap-4 h-full">
        {/* Equipment */}
        <div className="bg-[#161b22] border-2 border-white/10 rounded-xl p-4 shadow-lg relative bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] shrink-0 h-[420px]">
            <div className="absolute inset-0 bg-amber-900/5 pointer-events-none"></div>
            <h3 className="text-xs text-center text-amber-700 uppercase font-bold mb-4 tracking-widest">Ekwipunek</h3>
            
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

        {/* Backpack */}
        <div className="flex-1 bg-[#161b22] border-2 border-white/10 rounded-xl p-3 shadow-lg flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-3 px-1">
                 <h3 className="text-xs text-slate-500 uppercase font-bold">
                     Plecak ({character.inventory.length}/48)
                 </h3>
                 <div className="flex gap-2">
                     <button 
                        onClick={() => setActiveTab(0)}
                        className={`text-[10px] px-2 py-0.5 rounded border ${activeTab === 0 ? 'bg-amber-900/50 border-amber-500 text-amber-200' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                     >I</button>
                     <button 
                        onClick={() => setActiveTab(1)}
                        className={`text-[10px] px-2 py-0.5 rounded border ${activeTab === 1 ? 'bg-amber-900/50 border-amber-500 text-amber-200' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                     >II</button>
                 </div>
            </div>
            
            <div className="flex-1 bg-[#0f1115] border border-[#2a2e38] p-2 grid grid-cols-4 sm:grid-cols-6 gap-2 overflow-y-auto content-start">
                 {inventorySlice.map((item, i) => {
                    const actualIndex = activeTab * 24 + i;
                    const isUnusable = item && (item.levelReq > character.level || (item.classReq && item.classReq !== character.profession));

                    return (
                        <div 
                            key={actualIndex}
                            onClick={() => {
                                if (!item) return;
                                if (item.classReq && item.classReq !== character.profession) {
                                    showToast(`Twoja profesja nie może założyć tego przedmiotu! (Wymagany: ${item.classReq})`, 'error');
                                    return;
                                }
                                equipItem(item, actualIndex);
                            }}
                            onMouseEnter={(e) => item && setHoveredItem({ 
                                item, 
                                rect: e.currentTarget.getBoundingClientRect(), 
                                equippedComparison: character.equipment[item.type] 
                            })}
                            onMouseLeave={() => setHoveredItem(null)}
                            draggable={!!item}
                            onDragStart={(e) => item && handleDragStart(e, actualIndex)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, actualIndex)}
                            className={`w-14 h-14 border-2 rounded flex items-center justify-center relative group cursor-pointer transition-colors
                                ${item 
                                    ? (isUnusable 
                                        ? 'bg-red-900/20 border-red-900/50 hover:border-red-500 opacity-75 grayscale-[0.5]' 
                                        : 'bg-[#1a1d24] border-slate-700 hover:border-amber-500')
                                    : 'bg-[#0b0d10] border-white/5'}`}
                        >
                             {item && (
                                <div className="p-0.5 pointer-events-none">
                                    <ItemIcon item={item} size={46} />
                                </div>
                             )}
                             {isUnusable && <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none text-red-500 font-bold text-xl">✕</div>}
                        </div>
                    );
                 })}
            </div>
        </div>
      </div>

      {/* Tooltip Layer */}
      {hoveredItem && (
          <ItemTooltip 
              item={hoveredItem.item} 
              equippedItem={hoveredItem.equippedComparison}
              playerLevel={character.level}
              playerClass={character.profession}
              rect={hoveredItem.rect} 
          />
      )}

      {/* Detailed Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#161b22] border-2 border-amber-900/50 rounded-xl w-full max-w-2xl h-[85vh] overflow-hidden flex flex-col shadow-2xl relative">
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center shrink-0">
                        <h2 className="text-xl font-bold text-amber-500 font-serif tracking-wide">Szczegółowe Statystyki</h2>
                        <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-white transition-colors p-2">
                            <X size={24} />
                        </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="space-y-6">
                            <StatsCategory title="Główne Bonusy (Core)" color="text-blue-400">
                                <StatRow 
                                    label="Siła" 
                                    value={stats.strength} 
                                    rawValue={stats.uncappedStrength}
                                    cap={stats.statCap}
                                    base={character.baseStats.strength + (character.boughtStats?.strength_bonus || 0)}
                                    items={stats.uncappedStrength - (character.baseStats.strength + (character.boughtStats?.strength_bonus || 0))}
                                    desc="Zwiększa obrażenia fizyczne i pancerz." 
                                />
                                <StatRow 
                                    label="Zręczność" 
                                    value={stats.dexterity} 
                                    rawValue={stats.uncappedDexterity}
                                    cap={stats.statCap}
                                    base={character.baseStats.dexterity + (character.boughtStats?.dexterity_bonus || 0)}
                                    items={stats.uncappedDexterity - (character.baseStats.dexterity + (character.boughtStats?.dexterity_bonus || 0))}
                                    desc="Zwiększa Unik, Krytyk i SA." 
                                />
                                <StatRow 
                                    label="Inteligencja" 
                                    value={stats.intelligence} 
                                    rawValue={stats.uncappedIntelligence}
                                    cap={stats.statCap}
                                    base={character.baseStats.intelligence + (character.boughtStats?.intelligence_bonus || 0)}
                                    items={stats.uncappedIntelligence - (character.baseStats.intelligence + (character.boughtStats?.intelligence_bonus || 0))}
                                    desc="Zwiększa obrażenia magiczne i odporność." 
                                />
                                <StatRow 
                                    label="Witalność" 
                                    value={stats.vitality} 
                                    rawValue={stats.uncappedVitality}
                                    cap={stats.statCap}
                                    base={character.baseStats.vitality + (character.boughtStats?.vitality_bonus || 0)}
                                    items={stats.uncappedVitality - (character.baseStats.vitality + (character.boughtStats?.vitality_bonus || 0))}
                                    desc="Zwiększa Max HP." 
                                />
                            </StatsCategory>

                            <StatsCategory title="Ofensywne (Combat)" color="text-red-400">
                                <StatRow label="Obrażenia Fizyczne" value={`${stats.physDmgMin}-${stats.physDmgMax}`} />
                                <StatRow label="Obrażenia Magiczne" value={`${stats.magDmgMin}-${stats.magDmgMax}`} />
                                <StatRow label="Szansa na Krytyk" value={`${stats.critChance}%`} />
                                <StatRow label="Moc Krytyka" value={`${stats.critDamage}%`} desc="Mnożnik obrażeń przy trafieniu krytycznym." />
                                <StatRow label="Przebicie Pancerza" value={`${stats.armorPen}%`} desc="Ignoruje % pancerza przeciwnika." />
                                <StatRow label="Przebicie Magiczne" value={`${stats.magicPen}%`} desc="Ignoruje % odporności magicznej." />
                                <StatRow label="Szybkość Ataku (SA)" value={stats.attackSpeed} desc="Decyduje o inicjatywie w walce." />
                                <StatRow label="Inicjatywa" value={`${stats.initiative}%`} desc="Szansa na rozpoczęcie walki." />
                                <StatRow label="Stabilność" value={`${stats.stability}%`} desc="Zmniejsza rozrzut obrażeń." />
                            </StatsCategory>
                        </div>

                        <div className="space-y-6">
                            <StatsCategory title="Defensywne" color="text-green-400">
                                    <StatRow label="Pancerz" value={stats.armor} />
                                    <StatRow label="Redukcja Fizyczna" value={`${Math.floor(stats.physResist * 100)}%`} />
                                    <StatRow label="Redukcja Magiczna" value={`${Math.floor(stats.magResist * 100)}%`} />
                                    <StatRow label="Unik" value={`${stats.dodgeChance}%`} />
                                    <StatRow label="Blok" value={`${stats.blockChance}%`} desc="Szansa na zablokowanie ciosu." />
                                    <StatRow label="Wartość Bloku" value={stats.blockValue} desc="Redukcja obrażeń przy bloku." />
                                    <StatRow label="Redukcja Obrażeń" value={`${stats.reducedDamage}%`} desc="Redukuje wszystkie otrzymywane obrażenia." />
                                    <StatRow label="Regeneracja HP" value={`${parseFloat((2 + (stats.hpRegen || 0)).toFixed(1))}%`} desc="Bazowe 2% + bonusy z przedmiotów." />
                            </StatsCategory>
                            
                            <StatsCategory title="Użyteczne (Utility)" color="text-yellow-400">
                                    <StatRow label="Bonus Złota" value={`+${stats.bonusGold}%`} />
                                    <StatRow label="Bonus EXP" value={`+${stats.bonusExp}%`} />
                                    <StatRow label="Szansa na Drop" value={`+${stats.dropChance}%`} />
                                    <StatRow label="Moc Leczenia" value={`+${stats.healingPower}`} />
                            </StatsCategory>
                            
                            {(stats.damageVsUndead > 0 || stats.damageVsBeast > 0 || stats.damageVsDemon > 0) && (
                                <StatsCategory title="Specjalne" color="text-purple-400">
                                    {stats.damageVsUndead > 0 && <StatRow label="vs Nieumarli" value={`+${stats.damageVsUndead}%`} />}
                                    {stats.damageVsBeast > 0 && <StatRow label="vs Bestie" value={`+${stats.damageVsBeast}%`} />}
                                    {stats.damageVsDemon > 0 && <StatRow label="vs Demony" value={`+${stats.damageVsDemon}%`} />}
                                </StatsCategory>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
