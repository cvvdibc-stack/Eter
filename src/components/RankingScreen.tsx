import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Sword, Skull, Archive, Coins, Crown, Shield, User } from 'lucide-react';
import { Profession, Character, Item, ItemStats } from '../types';
import { getAvatarSrc } from '../utils/assets';
import { ItemTooltip } from './ItemTooltip';

// --- Types ---
type RankingCategory = 'LEVEL' | 'BOSS' | 'ECONOMY';

interface RankingEntry {
    id: string;
    name: string;
    profession: Profession;
    level: number;
    value: number; // Main sorting value (Level, Power Score, Kills, Items, Gold)
    subValue?: string | number; // Extra info (Exp, DPS, Time, %)
    rank: number;
    weapon?: Item | null; // For tooltip
    avatar?: string;
}

// --- Helper: Calculate Power Score ---
const calculatePowerScore = (char: Character): number => {
    const stats = char.baseStats; // Note: Should use derived total stats ideally, but using base + items approximation for now
    
    // Simplified Power Score Formula
    let score = 0;
    
    // 1. Attributes
    score += (stats.strength + stats.dexterity + stats.intelligence + stats.vitality) * 2;
    
    // 2. HP
    score += Math.floor(char.currentHp / 5); // Approximation using currentHp (should use maxHp)
    
    // 3. Equipment Value & Quality
    if (char.equipment) {
        Object.values(char.equipment).forEach((item: any) => {
            if (item) {
                score += item.value / 10; // Gold value proxy
                
                // Rarity Bonus
                if (item.rarity === 'unique') score += 50;
                if (item.rarity === 'heroic') score += 150;
                if (item.rarity === 'legendary') score += 500;
                if (item.rarity === 'mythic') score += 1500;
            }
        });
    }

    return Math.floor(score);
};

// --- MOCK DATA GENERATOR ---
const generateMockRankings = (category: RankingCategory, playerChar: Character): RankingEntry[] => {
    const list: RankingEntry[] = [];
    const names = ["Azog", "Kaelthas", "Jaina", "Thrall", "Arthas", "Sylvanas", "Illidan", "Tyrande", "Malfurion", "Rexxar"];
    
    // 1. Player Entry (Always #1 for Demo)
    let val = 0;
    let sub: any = 0;
    
    if (category === 'LEVEL') { val = playerChar.level; sub = `${playerChar.exp} XP`; }
    if (category === 'BOSS') { val = Object.values(playerChar.kill_stats || {}).reduce((a,b) => a+b, 0); sub = "Zabójstw"; }
    if (category === 'ECONOMY') { val = playerChar.gold; sub = "Złota"; }

    list.push({
        id: playerChar.id,
        name: playerChar.name,
        profession: playerChar.profession,
        level: playerChar.level,
        value: val,
        subValue: sub,
        rank: 1,
        weapon: playerChar.equipment?.weapon || null
    });

    // 2. Mock Entries (Ranks 2-6)
    for (let i = 0; i < 5; i++) {
        const profs: Profession[] = ['warrior', 'mage', 'assassin', 'cleric'];
        const p = profs[Math.floor(Math.random() * profs.length)];
        
        let mVal = 0;
        let mSub: any = "";

        switch (category) {
            case 'LEVEL':
                mVal = Math.max(1, playerChar.level - Math.floor(Math.random() * 3) - 1);
                mSub = `0 XP`;
                break;
            case 'BOSS':
                mVal = Math.max(0, val - Math.floor(Math.random() * 10) - 1);
                mSub = "Zabójstw";
                break;
            case 'ECONOMY':
                mVal = Math.max(0, playerChar.gold - Math.floor(Math.random() * 500) - 100);
                mSub = "Złota";
                break;
        }

        list.push({
            id: `mock-${i}`,
            name: names[i % names.length],
            profession: p,
            level: Math.max(1, playerChar.level - Math.floor(Math.random() * 5)),
            value: mVal,
            subValue: mSub,
            rank: i + 2,
            weapon: null
        });
    }

    return list;
};

// --- COMPONENT ---
export const RankingScreen: React.FC = () => {
    const { character } = useGame();
    const [activeTab, setActiveTab] = useState<RankingCategory>('LEVEL');
    const [data, setData] = useState<RankingEntry[]>([]);
    const [hoveredItem, setHoveredItem] = useState<{ item: Item, rect: DOMRect } | null>(null);

    useEffect(() => {
        if (character) {
            // In real app, fetch from DB here
            const rankings = generateMockRankings(activeTab, character);
            setData(rankings);
        }
    }, [activeTab, character]);

    if (!character) return null;

    const Top3 = data.slice(0, 3);
    const Rest = data.slice(3);

    const getTabIcon = (cat: RankingCategory) => {
        switch(cat) {
            case 'LEVEL': return User;
            case 'BOSS': return Skull;
            case 'ECONOMY': return Coins;
        }
    };

    const getTabLabel = (cat: RankingCategory) => {
        switch(cat) {
            case 'LEVEL': return 'Poziomy';
            case 'BOSS': return 'Bossowie';
            case 'ECONOMY': return 'Ekonomia';
        }
    };

    const renderTab = (cat: RankingCategory) => {
        const Icon = getTabIcon(cat);
        const isActive = activeTab === cat;
        return (
            <button 
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-wider transition-all relative overflow-hidden
                    ${isActive ? 'text-amber-500 bg-amber-950/30 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                `}
            >
                <Icon size={18} />
                {getTabLabel(cat)}
                {isActive && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />}
            </button>
        );
    };

    const renderChampionCard = (entry: RankingEntry, place: 1 | 2 | 3) => {
        const isFirst = place === 1;
        const scale = isFirst ? 'scale-110 z-10' : 'scale-95 opacity-90 hover:opacity-100 hover:scale-100 transition-all';
        const border = place === 1 ? 'border-amber-500' : (place === 2 ? 'border-slate-300' : 'border-amber-700');
        const titleColor = place === 1 ? 'text-amber-500' : (place === 2 ? 'text-slate-300' : 'text-amber-700');
        const bgGradient = place === 1 ? 'from-amber-950/40' : (place === 2 ? 'from-slate-900/40' : 'from-amber-950/20');
        
        return (
            <div className={`relative w-48 flex flex-col items-center ${scale} transition-transform duration-300`}>
                {/* Outer Glow for #1 */}
                {isFirst && (
                    <div className="absolute -inset-4 bg-amber-500/20 blur-xl rounded-full animate-pulse pointer-events-none"></div>
                )}

                <div className={`relative w-full bg-[#13161c] rounded-xl border-2 ${border} overflow-hidden flex flex-col shadow-2xl`}>
                    {/* Header Background */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} to-transparent pointer-events-none`} />
                    
                    {/* Rank Badge */}
                    <div className="absolute top-2 left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 border border-white/10 backdrop-blur-md font-black text-white shadow-lg">
                        {place}
                    </div>

                    {/* Avatar Section */}
                    <div className="h-32 relative w-full bg-black group">
                        <img 
                            src={getAvatarSrc(entry.profession)} 
                            alt={entry.name} 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#13161c] via-transparent to-transparent" />
                    </div>

                    {/* Info Section */}
                    <div className="p-3 flex flex-col items-center gap-1 relative z-10">
                        <h3 className={`font-bold text-lg ${titleColor} tracking-tight leading-tight text-center`}>{entry.name}</h3>
                        
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 bg-black/40 px-2 py-0.5 rounded uppercase tracking-wider border border-white/5">
                                {entry.profession}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                                Lvl {entry.level}
                            </span>
                        </div>

                        <div className="mt-2 w-full pt-2 border-t border-white/5 text-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Wynik</div>
                            <div className={`font-mono font-bold ${isFirst ? 'text-xl text-white' : 'text-lg text-slate-200'}`}>
                                {entry.value.toLocaleString()} <span className="text-xs font-normal text-slate-500">{activeTab === 'ECONOMY' ? 'g' : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col max-w-5xl mx-auto w-full">
            {/* Header & Tabs */}
            <div className="bg-[#161b22] border border-white/10 rounded-xl shadow-lg mb-6 overflow-hidden shrink-0">
                <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
                            <Trophy className="text-amber-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">Rankingi Globalne</h2>
                            <p className="text-xs text-slate-500">Sezon 1 • Koniec za 24 dni</p>
                        </div>
                    </div>
                    {character.id === 'demo-user' && (
                        <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded text-xs border border-blue-500/30">
                            Tryb Demo
                        </div>
                    )}
                </div>
                <div className="flex justify-center bg-[#0f1115]">
                    {renderTab('LEVEL')}
                    {renderTab('BOSS')}
                    {renderTab('ECONOMY')}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Top 3 Cards */}
                <div className="flex justify-center items-end gap-6 mb-8 px-4 shrink-0 pt-8 min-h-[300px]">
                    {Top3[1] && renderChampionCard(Top3[1], 2)}
                    {Top3[0] && renderChampionCard(Top3[0], 1)}
                    {Top3[2] && renderChampionCard(Top3[2], 3)}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#161b22] border border-white/10 rounded-xl shadow-lg relative">
                     {/* Table Header */}
                     <div className="sticky top-0 bg-[#1f242e] border-b border-white/10 flex px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider z-10">
                         <div className="w-16 text-center">#</div>
                         <div className="flex-1">Gracz</div>
                         <div className="w-32 text-center">Klasa</div>
                         <div className="w-24 text-center">Poziom</div>
                         <div className="w-40 text-right pr-4">Wynik</div>
                     </div>
                     
                     {/* Rows */}
                     <div className="divide-y divide-white/5">
                         {Rest.map((entry) => (
                             <div 
                                key={entry.id} 
                                className={`flex items-center px-4 py-3 hover:bg-white/5 transition-colors group
                                    ${entry.id === character.id ? 'bg-amber-900/10 border-l-2 border-amber-500' : ''}
                                `}
                             >
                                 <div className="w-16 text-center font-mono text-slate-500 font-bold group-hover:text-white">
                                     {entry.rank}
                                 </div>
                                 <div className="flex-1 flex items-center gap-3">
                                     <div className="w-8 h-8 rounded bg-black border border-slate-700 overflow-hidden">
                                         <img src={getAvatarSrc(entry.profession)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                     </div>
                                     <span className={`font-medium ${entry.id === character.id ? 'text-amber-400' : 'text-slate-300'}`}>
                                         {entry.name}
                                     </span>
                                     {entry.id === character.id && <span className="text-[10px] bg-amber-900 text-amber-200 px-1 rounded ml-2">TY</span>}
                                 </div>
                                 <div className="w-32 text-center text-xs uppercase tracking-wide text-slate-500">
                                     {entry.profession}
                                 </div>
                                 <div className="w-24 text-center font-mono text-slate-400">
                                     {entry.level}
                                 </div>
                                 <div className="w-40 text-right pr-4 font-mono font-bold text-slate-200">
                                     {entry.value.toLocaleString()} <span className="text-xs text-slate-500 font-normal">{activeTab === 'ECONOMY' ? 'g' : ''}</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>

            {/* Tooltip Layer */}
            {hoveredItem && (
                <ItemTooltip 
                    item={hoveredItem.item} 
                    playerLevel={character.level} 
                    rect={hoveredItem.rect} 
                />
            )}
        </div>
    );
};
