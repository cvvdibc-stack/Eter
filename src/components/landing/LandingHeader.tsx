import React, { useState, useEffect } from 'react';
import { Shield, UserCircle, LogOut, ChevronDown, Gamepad2, Users, Globe, Newspaper, Map, Store } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface LandingHeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ currentRoute, navigate }) => {
  const { user, signOut } = useGame();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dropdownMenus = {
    gra: [
      { label: 'Start', action: () => navigate('home') },
      { label: 'Jak zacząć', action: () => navigate('pomoc') },
      { label: 'Klasy', action: () => navigate('home') },
      { label: 'System walki', action: () => navigate('home') },
      { label: 'Ekwipunek', action: () => navigate('home') },
    ],
    spolecznosc: [
      { label: 'Forum', action: () => navigate('forum') },
      { label: 'Ranking', action: () => navigate('gracze') },
      { label: 'Hall of Fame', action: () => navigate('gracze') },
      { label: 'Discord', action: () => window.open('https://discord.gg/eter', '_blank') },
    ],
    swiat: [
      { label: 'Bestiariusz', action: () => navigate('home') },
      { label: 'Przedmioty', action: () => navigate('home') },
      { label: 'Legendy', action: () => navigate('home') },
      { label: 'Mapa Świata', action: () => navigate('home') },
    ],
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#080a0c] backdrop-blur-md border-b border-white/20' 
        : 'bg-[#080a0c]/80 backdrop-blur-sm border-b border-white/10'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-amber-600 font-bold text-2xl tracking-tighter font-serif hover:text-amber-500 transition-colors"
          >
            <Shield className="fill-amber-900/20" />
            CIENIE ETERU
          </button>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Gra - Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setOpenDropdown('gra')}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors text-slate-400 hover:text-amber-500"
              >
                <Gamepad2 size={16} />
                Gra
                <ChevronDown size={14} />
              </button>
              {openDropdown === 'gra' && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-[#13161c] border border-white/10 rounded-lg shadow-xl py-2"
                  onMouseEnter={() => setOpenDropdown('gra')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {dropdownMenus.gra.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { item.action(); setOpenDropdown(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Społeczność - Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setOpenDropdown('spolecznosc')}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors text-slate-400 hover:text-amber-500"
              >
                <Users size={16} />
                Społeczność
                <ChevronDown size={14} />
              </button>
              {openDropdown === 'spolecznosc' && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-[#13161c] border border-white/10 rounded-lg shadow-xl py-2"
                  onMouseEnter={() => setOpenDropdown('spolecznosc')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {dropdownMenus.spolecznosc.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { item.action(); setOpenDropdown(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Świat Gry - Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setOpenDropdown('swiat')}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors text-slate-400 hover:text-amber-500"
              >
                <Globe size={16} />
                Świat Gry
                <ChevronDown size={14} />
              </button>
              {openDropdown === 'swiat' && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-[#13161c] border border-white/10 rounded-lg shadow-xl py-2"
                  onMouseEnter={() => setOpenDropdown('swiat')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {dropdownMenus.swiat.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { item.action(); setOpenDropdown(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Aktualności */}
            <button
              onClick={() => navigate('home')}
              className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                currentRoute === 'home'
                  ? 'text-amber-500 border-b-2 border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-500'
              }`}
            >
              <Newspaper size={16} />
              Aktualności
            </button>

            {/* Roadmapa */}
            <button
              onClick={() => navigate('roadmap')}
              className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                currentRoute === 'roadmap'
                  ? 'text-amber-500 border-b-2 border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-500'
              }`}
            >
              <Map size={16} />
              Roadmapa
            </button>

            {/* Sklep */}
            <button
              onClick={() => navigate('store')}
              className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors ${
                currentRoute === 'store'
                  ? 'text-amber-500 border-b-2 border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-500'
              }`}
            >
              <Store size={16} />
              Sklep
            </button>
          </nav>

          {/* Right side - Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate('profile')}
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <UserCircle size={20} />
                  <span className="hidden sm:inline text-sm font-bold uppercase">Profil</span>
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 bg-[#13161c] hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-bold uppercase"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Wyloguj</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => window.location.hash = ''}
                  className="px-4 py-2 text-slate-400 hover:text-amber-500 transition-colors text-sm font-bold uppercase"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => window.location.hash = 'rejestracja'}
                  className="px-6 py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg transition-all font-bold uppercase tracking-wider text-sm"
                >
                  Graj za darmo
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
