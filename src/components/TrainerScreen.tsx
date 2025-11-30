import React from 'react';
import { useGame } from '../context/GameContext';
import { calculateMaxTrainableStat } from '../utils/formulas';
import { Dumbbell, Coins } from 'lucide-react';

export const TrainerScreen: React.FC = () => {
    const { character, trainStat } = useGame();
    if (!character) return null;

    const stats = [
        { id: 'strength', label: 'Siła', desc: 'Obrażenia fizyczne, Pancerz' },
        { id: 'dexterity', label: 'Zręczność', desc: 'Unik, Krytyk, SA' },
        { id: 'intelligence', label: 'Inteligencja', desc: 'Magia, Odporność' },
        { id: 'vitality', label: 'Witalność', desc: 'Zdrowie (HP)' }
    ];

    const renderStatCard = (stat: any) => {
        const bonus = (character.boughtStats as any)?.[`${stat.id}_bonus`] || 0;
        const base = (character.baseStats as any)?.[stat.id] || 0;
        
        let cost = Math.floor(10 * Math.pow(bonus, 2));
        if (bonus === 0) cost = 50;

        // Max Stat Calculation using new formula
        const maxStat = calculateMaxTrainableStat(base, character.level);
        
        // The limit applies to the BONUS we can train? 
        // "calculateMaxTrainableStat" usually implies the total stat or the max limit of the stat.
        // Formula: base * 2 + level * 10 + 20.
        // Example: Base 5, Lvl 1. Limit = 10 + 10 + 20 = 40.
        // Current Bonus 0. Total = 5. 
        // Does limit apply to Total (Base + Bonus) or just Bonus?
        // "blokować dalszy trening po przekroczeniu limitu" -> usually implies checking the resulting value.
        // If limit is 40, and I have 5 base, I can train +35 bonus.
        // Let's assume Limit applies to TOTAL stat (Base + Bonus).
        
        // Logic: We are checking if (Base + Bonus) >= MaxStat.
        // But wait, the bonus is what we increase.
        // If the user wants "bonusStats (z trenera)" distinct, maybe the limit is for the bonus itself?
        // Formula "baseStat * 2..." includes baseStat, suggests it scales WITH baseStat.
        // Let's assume limit is for TOTAL (Base + Bonus).
        
        // Actually, looking at previous prompt: "Statystyki powyżej maxymalnej nie powinny działać".
        // Now "blokować dalszy trening".
        // If I train, I increase Bonus. Total = Base + Bonus.
        // So condition: if (Base + Bonus >= MaxStat) -> Block.
        
        const currentTotal = base + bonus;
        const isMaxed = currentTotal >= maxStat;
        
        const canAfford = character.gold >= cost;

        return (
            <div key={stat.id} className="bg-[#161b22] border border-white/10 p-4 rounded-xl flex flex-col gap-3 shadow-lg hover:border-amber-600/30 transition-colors relative">
                {isMaxed && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center rounded-xl">
                        <span className="text-red-500 font-bold text-xl uppercase tracking-widest border-2 border-red-500 px-4 py-1 rounded bg-black/50 shadow-2xl transform -rotate-12">MAX</span>
                        <span className="text-xs text-slate-300 mt-2 font-mono bg-black px-2 rounded">Lvl up to unlock</span>
                    </div>
                )}

                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-amber-500 font-bold text-lg">{stat.label}</h3>
                        <p className="text-xs text-slate-500">{stat.desc}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="bg-amber-900/20 px-2 py-1 rounded border border-amber-900/50 text-amber-200 text-xs font-mono font-bold">
                            +{bonus} <span className="text-slate-500 font-normal">(Baza: {base})</span>
                        </div>
                        <div className="text-[10px] text-slate-600 mt-1 font-mono">Limit: {maxStat}</div>
                    </div>
                </div>
                
                {/* Progress Bar: 0 -> MaxStat (Total) */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-amber-700" style={{ width: `${Math.min(100, (currentTotal / maxStat) * 100)}%` }}></div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                    <button 
                        onClick={() => trainStat(stat.id)}
                        disabled={!canAfford || isMaxed}
                        className={`w-full py-3 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform active:scale-95
                            ${canAfford && !isMaxed
                                ? 'bg-amber-700 hover:bg-amber-600 text-white shadow-lg' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                        `}
                    >
                        <span>{isMaxed ? 'LIMIT' : 'Trenuj'}</span>
                        {!isMaxed && (
                            <span className={`flex items-center gap-1 font-mono normal-case ${canAfford ? 'text-yellow-300' : ''}`}>
                                <Coins size={12} /> {cost}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6 animate-in fade-in zoom-in duration-300 pt-10">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-[#1a1d24] p-8 rounded-xl border-l-4 border-amber-600 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                
                <div className="bg-black p-6 rounded-full border-2 border-amber-600/30 shrink-0 relative z-10 shadow-xl">
                    <Dumbbell size={64} className="text-amber-600" />
                </div>
                
                <div className="text-center md:text-left relative z-10 flex-1">
                    <h2 className="text-4xl font-bold text-slate-100 font-serif tracking-wide">Mistrz Treningu</h2>
                    <p className="text-slate-400 mt-2 text-lg italic">"Siła nie bierze się znikąd. Płacisz potem i złotem."</p>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg border border-white/10 relative z-10 min-w-[180px] text-center md:text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Twoje Złoto</div>
                    <div className="text-3xl font-mono font-bold text-yellow-500 flex items-center justify-center md:justify-end gap-2 drop-shadow-md">
                        {character.gold.toLocaleString()} <Coins size={28} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(renderStatCard)}
            </div>
        </div>
    );
};

