import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Skull, Lock, Sword, Coins, Sparkles, Package, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { BonusType } from '../types';
import { getMonsterSrc } from '../utils/assets';

export const ExpeditionScreen: React.FC = () => {
  const { startCombat, startQuickCombat, unlockedMonsters, character, monsters, globalToast } = useGame();
  const [page, setPage] = useState(0);

  // Initial page calculation based on progression or saved state
  useEffect(() => {
      const savedPage = localStorage.getItem('last_expedition_page');
      if (savedPage !== null) {
          setPage(parseInt(savedPage, 10));
          return;
      }

      if (unlockedMonsters.length > 0 && monsters.length > 0) {
          const lastUnlockedId = unlockedMonsters[unlockedMonsters.length - 1];
          const lastUnlockedIndex = monsters.findIndex(m => m.id === lastUnlockedId);
          if (lastUnlockedIndex !== -1) {
              const initialPage = Math.floor(lastUnlockedIndex / 4);
              setPage(initialPage);
              localStorage.setItem('last_expedition_page', initialPage.toString());
          }
      }
  }, [unlockedMonsters, monsters]);

  if (!character || monsters.length === 0) return <div>Loading expeditions...</div>;

  const expeditionMonsters = monsters.filter(m => !m.id.startsWith('boss_'));

  const maxPage = Math.ceil(expeditionMonsters.length / 4) - 1;
  const startIndex = page * 4;
  const currentMonsters = expeditionMonsters.slice(startIndex, startIndex + 4);

  const updatePage = (newPage: number) => {
      const p = Math.max(0, Math.min(maxPage, newPage));
      setPage(p);
      localStorage.setItem('last_expedition_page', p.toString());
  };

  const nextPage = () => updatePage(page + 1);
  const prevPage = () => updatePage(page - 1);

  const renderBonus = (icon: React.ReactNode, label: string, color: string, type: BonusType, unlockedBonuses: BonusType[]) => {
      const unlocked = unlockedBonuses.includes(type);
      return (
        <div className={`flex flex-col items-center group cursor-help relative transition-all ${unlocked ? 'scale-110' : 'opacity-70'}`}>
            <div className={`w-8 h-8 rounded bg-[#0b0d10] border flex items-center justify-center ${color} 
                ${unlocked ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'border-[#2a2e38]'}
            `}>
                {icon}
            </div>
            <span className={`text-[9px] mt-1 font-bold ${unlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                {unlocked ? 'AKTYWNE' : '3%'}
            </span>
            
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-32 bg-black border border-slate-700 p-2 rounded pointer-events-none text-center">
                <p className="text-[10px] text-white font-bold">{label}</p>
                {unlocked && <p className="text-[9px] text-green-400 mt-1">Odblokowano na stałe!</p>}
            </div>
        </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 h-full flex flex-col pt-10 relative">
      
      <div className="flex items-center justify-between mb-8">
        <button 
            onClick={prevPage} 
            disabled={page === 0}
            className={`p-2 rounded-full border border-slate-700 ${page === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-amber-500'}`}
        >
            <ChevronLeft size={32} />
        </button>

        <div className="text-center">
            <h2 className="text-3xl font-bold text-amber-600 font-serif tracking-[0.2em] mb-2 uppercase">Wybierz Cel</h2>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-800 to-transparent mx-auto"></div>
            <div className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Strona {page + 1} / {maxPage + 1}</div>
        </div>

        <button 
            onClick={nextPage} 
            disabled={page === maxPage}
            className={`p-2 rounded-full border border-slate-700 ${page === maxPage ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-amber-500'}`}
        >
            <ChevronRight size={32} />
        </button>
      </div>

      {/* Global Toast Notification */}
      {globalToast && (
          <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 border
              ${globalToast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 
                globalToast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 
                'bg-slate-800/90 border-slate-500 text-slate-200'}
          `}>
              <div className={`rounded-full p-1 ${
                  globalToast.type === 'error' ? 'bg-red-500' : 
                  globalToast.type === 'success' ? 'bg-green-500' : 
                  'bg-slate-500'
              }`}>
                  {globalToast.type === 'success' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="19"></line><line x1="12" y1="5" x2="12" y2="15"></line></svg>
                  )}
              </div>
              <span className="font-bold tracking-wide text-sm">{globalToast.message}</span>
          </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentMonsters.map((monster) => {
          const isUnlocked = unlockedMonsters.includes(monster.id) || monster.id === 'monster_1';
          const isTooHard = monster.level > character.level + 5;
          const currentBonuses = character.unlocked_bonuses?.[monster.id] || [];
          const hasAnyBonus = currentBonuses.length > 0;

          return (
            <div 
              key={monster.id}
              className={`bg-[#161b22] border-2 rounded-xl flex flex-col h-[450px] shadow-lg relative overflow-hidden
                ${isUnlocked 
                  ? 'border-[#2a2e38] hover:border-amber-600/50 transition-all hover:-translate-y-1' 
                  : 'border-[#1f242d] grayscale'
                }
                ${hasAnyBonus ? 'border-yellow-900/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : ''}
              `}
            >
              {hasAnyBonus && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1.5 rounded-full shadow-lg z-30 animate-in zoom-in">
                      <Star size={14} fill="black" />
                  </div>
              )}

              {/* Header */}
              <div className="bg-[#0b0d10] p-3 text-center border-b border-white/5 rounded-t-xl relative z-20">
                  <h3 className={`text-lg font-bold font-serif tracking-wider truncate ${isUnlocked ? 'text-amber-500' : 'text-slate-600'}`}>
                      {monster.name}
                  </h3>
              </div>

               {/* Stats Range Overlay */}
               {isUnlocked && (
                   <div className="bg-black/40 p-1.5 flex justify-between text-[10px] font-mono text-slate-400 border-b border-white/5 relative z-20">
                        <div className="flex items-center gap-1">
                            <Coins size={10} className="text-yellow-500" />
                            <span className="text-yellow-500">{monster.goldMin}-{monster.goldMax}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Sparkles size={10} className="text-blue-400" />
                            <span className="text-blue-400">{monster.expReward} XP</span>
                        </div>
                   </div>
               )}

              {/* Image Area */}
              <div className="relative flex-1 bg-black/40 border-b border-white/5 group cursor-pointer overflow-hidden"
                   onClick={() => isUnlocked && startCombat(monster.id, 'EXPEDITION')}>
                  
                  {/* Monster Image */}
                  {isUnlocked ? (
                      <img 
                        src={getMonsterSrc(monster.id)}
                        alt={monster.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                  ) : (
                      <div className="w-full h-full bg-black/80 flex items-center justify-center">
                           <Lock size={48} className="text-slate-700 z-10" />
                      </div>
                  )}
                  
                  {/* Fallback */}
                  <div className="hidden w-full h-full flex items-center justify-center bg-slate-900">
                       <Skull size={80} className="text-slate-700 group-hover:text-amber-900/50 drop-shadow-2xl" />
                  </div>
                  
                  {/* Level Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 flex items-end justify-center">
                      <span className={`px-3 py-1 bg-black/60 rounded border border-white/10 text-xs font-bold uppercase tracking-wider ${isTooHard ? 'text-red-500' : 'text-green-400'}`}>
                          Poziom {monster.level}
                      </span>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#13161c] grid grid-cols-2 gap-2 relative z-20">
                  {isUnlocked ? (
                      <>
                        <button 
                            onClick={() => startCombat(monster.id, 'EXPEDITION')}
                            className="py-2 bg-gradient-to-b from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded border-t border-amber-500 shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-1 transform active:scale-95 transition-all"
                        >
                            <Sword size={14} /> Atak
                        </button>
                        <button 
                            onClick={() => startQuickCombat(monster.id)}
                            className="py-2 bg-[#1a1d24] hover:bg-[#2a2e38] text-slate-300 font-bold rounded border border-slate-600 text-xs uppercase tracking-widest flex items-center justify-center gap-1 transform active:scale-95 transition-all"
                        >
                            <Zap size={14} className="text-yellow-500" /> Szybka
                        </button>
                      </>
                  ) : (
                      <div className="col-span-2 py-2 bg-[#1a1d24] text-slate-600 font-bold rounded text-center text-xs uppercase border border-white/5 cursor-not-allowed">
                          Zablokowane
                      </div>
                  )}
              </div>

              {/* Bonuses Footer */}
              <div className="mt-auto bg-[#0f1115] p-3 border-t border-white/5 rounded-b-xl relative z-20">
                  <div className="flex justify-around gap-2">
                      {renderBonus(<Coins size={16} />, "+20% Złota", "text-yellow-500", 'GOLD', currentBonuses)}
                      {renderBonus(<Sparkles size={16} />, "+15% EXP", "text-blue-400", 'EXP', currentBonuses)}
                      {renderBonus(<Package size={16} />, "+12% Drop", "text-purple-400", 'DROP', currentBonuses)}
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
