import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Skull, Coins, User } from 'lucide-react';
import { Profession, Item } from '../types';
import { getAvatarSrc } from '../utils/assets';
import { ItemTooltip } from './ItemTooltip';

// --- Types ---
type RankingCategory = 'LEVEL' | 'BOSS' | 'ECONOMY';

interface RankingEntry {
    id: string;
    name: string;
    profession: Profession;
    level: number;
    value: number; // Main sorting value
    subValue?: string | number;
    rank: number;
    weapon?: Item | null; // For tooltip
    avatar?: string;
}

// --- COMPONENT ---
export const RankingScreen: React.FC = () => {
    const { character, loadRanking } = useGame();
    const [activeTab, setActiveTab] = useState<RankingCategory>('LEVEL');
    const [data, setData] = useState<RankingEntry[]>([]);
    const [hoveredItem, setHoveredItem] = useState<{ item: Item, rect: DOMRect } | null>(null);

    useEffect(() => {
        const fetchRanking = async () => {
            const result = await loadRanking();
            
            // Sort based on active tab (Client side sort of top 100 levels)
            // Ideally should query DB with sort, but context only provides one loadRanking currently.
            let sorted = [...result];
            
            if (activeTab === 'ECONOMY') {
                sorted.sort((a, b) => b.gold - a.gold);
            } else if (activeTab === 'LEVEL') {
                // Already sorted by DB usually
            }
            
            const formatted: RankingEntry[] = sorted.map((r, idx) => {
                let val = r.level;
                let sub: any = `${r.exp} XP`;
                
                if (activeTab === 'ECONOMY') {
                    val = r.gold;
                    sub = "Złota";
                }
                
                return {
                    id: r.id,
                    name: r.name,
                    profession: r.profession,
                    level: r.level,
                    value: val,
                    subValue: sub,
                    rank: idx + 1,
                    weapon: null // Weapon info not fetched
                };
            });
            
            setData(formatted);
        };

        fetchRanking();
        const interval = setInterval(fetchRanking, 60000); // 60s Refresh
        return () => clearInterval(interval);
    }, [activeTab, loadRanking]);

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
                            <p className="text-xs text-slate-500">Odświeżanie co 60s</p>
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
