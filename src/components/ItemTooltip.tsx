import React from 'react';
import { Item, ItemType } from '../types';

const getTypeName = (type: ItemType) => {
    const names: Record<string, string> = {
        weapon: 'Broń', helmet: 'Hełm', armor: 'Zbroja', boots: 'Buty',
        gloves: 'Rękawice', amulet: 'Amulet', ring: 'Pierścień', shield: 'Tarcza', talisman: 'Talizman'
    };
    return names[type] || type;
};

const getRarityName = (rarity: string) => {
    const names: Record<string, string> = {
        common: 'Zwykły', unique: 'Unikat', heroic: 'Heroiczny', 
        legendary: 'Legendarny', mythic: 'Mityczny', talisman: 'Specjalny'
    };
    return names[rarity] || rarity;
};

const getRarityColor = (rarity: string) => {
    switch(rarity) {
        case 'common': return 'text-slate-300';
        case 'unique': return 'text-green-400';
        case 'heroic': return 'text-blue-400';
        case 'legendary': return 'text-orange-400';
        case 'mythic': return 'text-red-500';
        default: return 'text-slate-300';
    }
};

export const ItemTooltip: React.FC<{ item: Item, equippedItem?: Item | null, playerLevel: number, playerClass?: string, rect: DOMRect }> = ({ item, equippedItem, playerLevel, playerClass, rect }) => {
    const isComparison = !!equippedItem && equippedItem.id !== item.id && equippedItem.type === item.type; // Only compare same type
    
    const cardWidth = 256;
    const tooltipWidth = isComparison ? (cardWidth * 2 + 8) : cardWidth;
    const gap = 8;
    
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    let top = rect.top - gap;
    let transform = 'translate(0, -100%)'; // Default: above

    // Flip if too close to top
    if (top < 350) {
        top = rect.bottom + gap;
        transform = 'translate(0, 0)';
    }

    // Clamp horizontal
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;

    const renderCard = (itm: Item, label?: string) => (
        <div className={`w-64 bg-[#0f1115] border p-0 rounded shadow-2xl overflow-hidden flex flex-col h-full ${label ? 'border-amber-500/50' : 'border-slate-600'}`}>
            {label && (
                <div className="bg-amber-900/20 text-amber-500 text-[10px] font-bold text-center py-1 border-b border-amber-500/30 uppercase tracking-widest">
                    {label}
                </div>
            )}
            
            {/* Header */}
            <div className="bg-black/50 p-2 border-b border-slate-700">
                <h4 className={`font-bold text-base ${getRarityColor(itm.rarity)} leading-tight`}>{itm.name}</h4>
                <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                    <span>{getTypeName(itm.type)}</span>
                    <span>{getRarityName(itm.rarity)}</span>
                </div>
            </div>
            
            {/* Stats */}
            <div className="p-3 space-y-1 flex-1">
                {itm.stats?.damageMin ? (
                    <div className="flex justify-between text-sm text-slate-200 font-bold border-b border-slate-800 pb-1 mb-1">
                        <span>Obrażenia</span>
                        <span className="font-mono text-amber-500">{itm.stats.damageMin}-{itm.stats.damageMax}</span>
                    </div>
                ) : null}
                {itm.stats?.magicDamage ? (
                    <div className="flex justify-between text-sm text-purple-300 font-bold border-b border-slate-800 pb-1 mb-1">
                        <span>Moc Magiczna</span>
                        <span className="font-mono">+{itm.stats.magicDamage}</span>
                    </div>
                ) : null}
                {itm.stats?.armor ? <div className="flex justify-between text-xs text-slate-300"><span>Pancerz</span><span>+{itm.stats.armor}</span></div> : null}
                
                {itm.stats?.strength ? <div className="flex justify-between text-xs text-red-200"><span>Siła</span><span>+{itm.stats.strength}</span></div> : null}
                {itm.stats?.dexterity ? <div className="flex justify-between text-xs text-green-200"><span>Zręczność</span><span>+{itm.stats.dexterity}</span></div> : null}
                {itm.stats?.intelligence ? <div className="flex justify-between text-xs text-blue-200"><span>Inteligencja</span><span>+{itm.stats.intelligence}</span></div> : null}
                {itm.stats?.vitality ? <div className="flex justify-between text-xs text-amber-200"><span>Witalność</span><span>+{itm.stats.vitality}</span></div> : null}
                
                {itm.stats?.hp ? <div className="flex justify-between text-xs text-slate-400"><span>Zdrowie</span><span>+{itm.stats.hp}</span></div> : null}
                
                {itm.stats?.critChance ? <div className="flex justify-between text-xs text-yellow-300 font-bold"><span>Krytyk</span><span>+{itm.stats.critChance}%</span></div> : null}
                {itm.stats?.dodgeChance ? <div className="flex justify-between text-xs text-green-300 font-bold"><span>Unik</span><span>+{itm.stats.dodgeChance}%</span></div> : null}
                {itm.stats?.magicResist ? <div className="flex justify-between text-xs text-blue-300"><span>Odp. Magiczna</span><span>+{itm.stats.magicResist}%</span></div> : null}
                {itm.stats?.healingPower ? <div className="flex justify-between text-xs text-pink-300"><span>Leczenie</span><span>+{itm.stats.healingPower}</span></div> : null}
                {itm.stats?.blockChance ? <div className="flex justify-between text-xs text-slate-300"><span>Blok</span><span>+{itm.stats.blockChance}%</span></div> : null}

                {/* New Combat Stats */}
                {itm.stats?.attackSpeed ? <div className="flex justify-between text-xs text-cyan-300 font-bold"><span>Szybkość Ataku</span><span>+{itm.stats.attackSpeed}</span></div> : null}
                {itm.stats?.initiative ? <div className="flex justify-between text-xs text-yellow-200"><span>Inicjatywa</span><span>+{itm.stats.initiative}%</span></div> : null}
                {itm.stats?.stability ? <div className="flex justify-between text-xs text-slate-300"><span>Stabilność</span><span>+{itm.stats.stability}%</span></div> : null}
                {itm.stats?.poisonChance ? <div className="flex justify-between text-xs text-green-400 font-bold"><span>Trucizna</span><span>{itm.stats.poisonChance}%</span></div> : null}
                {itm.stats?.burnChance ? <div className="flex justify-between text-xs text-orange-400 font-bold"><span>Podpalenie</span><span>{itm.stats.burnChance}%</span></div> : null}
                
                {/* Even more stats from new update */}
                {itm.stats?.critDamage ? <div className="flex justify-between text-xs text-red-400"><span>Moc Krytyka</span><span>+{itm.stats.critDamage}%</span></div> : null}
                {itm.stats?.armorPen ? <div className="flex justify-between text-xs text-slate-400"><span>Przebicie P.</span><span>+{itm.stats.armorPen}%</span></div> : null}
                {itm.stats?.hpRegen ? <div className="flex justify-between text-xs text-green-300"><span>Regen HP</span><span>+{itm.stats.hpRegen}%</span></div> : null}
                {itm.stats?.bonusGold ? <div className="flex justify-between text-xs text-yellow-500"><span>Złoto</span><span>+{itm.stats.bonusGold}%</span></div> : null}
            </div>

            {/* Mythic Prestige Section */}
            {itm.slainBy && (
                <div className="bg-gradient-to-r from-red-950/50 to-purple-950/50 p-2 border-y border-red-500/30">
                    <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider text-center mb-1">
                        ⚔️ Legenda Eteru ⚔️
                    </div>
                    <div className="text-[9px] text-slate-300 text-center leading-relaxed">
                        <div className="text-amber-400 font-bold">{itm.slainBy.bossName}</div>
                        <div className="text-slate-400">został pokonany dnia</div>
                        <div className="text-blue-300">{new Date(itm.slainBy.date).toLocaleDateString('pl-PL')}</div>
                        <div className="text-slate-400">przez</div>
                        <div className="text-green-400 font-bold">{itm.slainBy.playerName}</div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="bg-black/30 p-2 border-t border-slate-700 flex flex-col gap-1">
                <div className="flex justify-between text-amber-500 font-bold text-xs">
                    <span>Cena:</span>
                    <span>{itm.value} złota</span>
                </div>
                <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Wymagany poziom:</span>
                    <span className={playerLevel >= itm.levelReq ? 'text-green-500' : 'text-red-500'}>{itm.levelReq}</span>
                </div>
                {itm.classReq && (
                    <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500">Wymagana klasa:</span>
                        <span className={!playerClass || playerClass === itm.classReq ? 'text-green-500' : 'text-red-500 uppercase font-bold'}>{itm.classReq}</span>
                    </div>
                )}
                {!label && <div className="text-[9px] text-slate-600 text-center mt-1 italic">Kliknij, aby użyć/przenieść</div>}
            </div>
        </div>
    );

    return (
        <div 
            className="fixed z-[9999] pointer-events-none flex gap-2 items-start"
            style={{ top, left, transform, width: tooltipWidth }}
        >
            {isComparison && renderCard(equippedItem!, "Obecnie założony")}
            {renderCard(item, isComparison ? "W plecaku" : undefined)}
        </div>
    );
};
