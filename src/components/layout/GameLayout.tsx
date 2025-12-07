import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Shield, Map, Store, HeartPulse, User, LogOut, Crown, Swords, Skull, Book, Gem, Calendar, Coins, Gavel, Trophy, Dumbbell, Package
} from 'lucide-react';

export const GameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { character, view, changeView, signOut } = useGame();

  if (!character) {
    return <>{children}</>;
  }

  const MenuButton = ({ icon: Icon, label, targetView, active }: any) => (
    <button
      onClick={() => changeView(targetView)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all border-b border-white/5
        ${active 
          ? 'bg-gradient-to-r from-amber-900/50 to-transparent text-amber-400 border-l-4 border-l-amber-500' 
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-l-4 border-l-transparent'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const TopButton = ({ icon: Icon, label, targetView, active, locked }: any) => (
    <button
      onClick={() => !locked && changeView(targetView)}
      disabled={locked}
      className={`flex items-center gap-2 px-6 py-2 rounded-t-lg text-sm font-bold transition-all uppercase tracking-wider border-t border-x border-white/10 relative
        ${active 
          ? 'bg-[#13161c] text-amber-500 border-amber-500/30 z-10' 
          : 'bg-[#0b0d10] text-slate-500 hover:text-slate-300 hover:bg-[#13161c] border-transparent'
        }
        ${locked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
    >
      <Icon size={16} />
      {label}
      {locked && <span className="ml-2 text-[10px] bg-black px-1 rounded text-red-500">Lvl 10</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans flex flex-col">
      {/* TOP STATS BAR */}
      <header className="h-16 bg-[#080a0c] border-b border-white/10 flex items-center px-6 justify-between shadow-lg z-20 relative">
        <div className="flex items-center gap-4">
            <div className="text-amber-600 font-bold text-2xl tracking-tighter font-serif flex items-center gap-2">
                <Shield className="fill-amber-900/20" />
                CIENIE ETERU
            </div>
        </div>

        {/* RESOURCES */}
        <div className="flex items-center gap-8 bg-black/40 px-8 py-2 rounded-full border border-white/5 shadow-inner">
          
          {/* Level Display */}
          <div className="flex items-center gap-3 mr-4">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Poziom</span>
              <span className="text-xl font-mono text-white font-bold text-shadow-lg">{character.level}</span>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="flex items-center gap-3 group cursor-help relative">
            <Coins className="text-yellow-400 drop-shadow-lg" size={20} />
            <span className="font-mono text-lg text-yellow-100 font-bold">{character.gold}</span>
            <span className="text-xs text-slate-500 uppercase ml-1">Złoto</span>
          </div>
          
          <div className="w-px h-6 bg-white/10"></div>

          <div className="flex items-center gap-3">
            <Gem className="text-red-500 drop-shadow-lg" size={20} />
            <span className="font-mono text-lg text-red-100 font-bold">{character.premiumCurrency}</span>
            <span className="text-xs text-slate-500 uppercase ml-1">Rubiny</span>
          </div>
        </div>

        {/* Spacer to balance layout since Level moved to center */}
        <div className="w-32"></div>
      </header>

      {/* NAVIGATION TABS (ACTION BAR) */}
      <div className="bg-[#161b22] border-b border-white/5 px-6 flex items-end gap-2 h-12 sticky top-0 z-10 shadow-md">
        <div className="w-64 flex-shrink-0"></div> {/* Spacer for Sidebar */}
        <TopButton icon={Map} label="Wyprawy" targetView="EXPEDITION" active={view === 'EXPEDITION' || view === 'COMBAT'} />
        <TopButton icon={Skull} label="Lochy" targetView="DUNGEON" active={view === 'DUNGEON'} locked={character.level < 10} />
        <TopButton icon={Swords} label="Arena" targetView="ARENA" active={view === 'ARENA'} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT SIDEBAR (CITY & INFO) */}
        <aside className="w-64 bg-[#13161c] border-r border-white/5 flex flex-col shadow-2xl overflow-y-auto absolute left-0 top-0 bottom-0 z-20">
          <div className="p-6 text-center bg-gradient-to-b from-slate-800/20 to-transparent border-b border-white/5">
             <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Zalogowany jako</div>
             <div className="font-bold text-slate-200 truncate">{character.name}</div>
          </div>

          <div className="flex-1 py-2">
            <div className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider mt-4">Postać</div>
            <MenuButton icon={User} label="Podgląd" targetView="HUB" active={view === 'HUB' || view === 'INVENTORY'} />
            <MenuButton icon={Trophy} label="Rankingi" targetView="RANKING" active={view === 'RANKING'} />
            <MenuButton icon={Gem} label="Talizmany" targetView="TALISMANS" active={view === 'TALISMANS'} />
            <MenuButton icon={Package} label="Magazyn" targetView="STASH" active={view === 'STASH'} />
            <MenuButton icon={Calendar} label="Historia Walk" targetView="HISTORY" active={view === 'HISTORY'} />
            
            <div className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider mt-4">Miasto</div>
            <MenuButton icon={Dumbbell} label="Trener" targetView="TRAINER" active={view === 'TRAINER'} />
            <MenuButton icon={Store} label="Handlarz" targetView="SHOP" active={view === 'SHOP'} />
            <MenuButton icon={HeartPulse} label="Medyk" targetView="DOCTOR" active={view === 'DOCTOR'} />
            <MenuButton icon={Gavel} label="Aukcjoner" targetView="MARKET" active={view === 'MARKET'} />
            <MenuButton icon={Book} label="Bestiariusz" targetView="BESTIARY" active={view === 'BESTIARY'} />
            <MenuButton icon={Crown} label="Premium" targetView="PREMIUM" active={view === 'PREMIUM'} />
          </div>

          <div className="p-4 border-t border-white/5">
            <button 
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm py-2 hover:bg-red-900/20 rounded transition-colors uppercase font-bold tracking-wider"
            >
                <LogOut size={14} /> Wyloguj
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 ml-64 overflow-y-auto bg-[#0b0d10] relative p-6">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
