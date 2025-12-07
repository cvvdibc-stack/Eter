import React from 'react';
import { useGame } from '../context/GameContext';
import { User, Shield, ShoppingBag, Map, Scroll } from 'lucide-react';
import { getProfessionName } from '../utils/professionUtils';

export const GameHub: React.FC = () => {
  const { character, changeView } = useGame();

  if (!character) return null;

  const menuItems = [
    { label: 'Postać', icon: <User />, action: () => changeView('INVENTORY') }, // Merging Char sheet + Inv for now or separate? User asked for separate.
    { label: 'Ekwipunek', icon: <Shield />, action: () => changeView('INVENTORY') },
    { label: 'Ekspedycje', icon: <Map />, action: () => changeView('EXPEDITION') },
    { label: 'Sklep', icon: <ShoppingBag />, action: () => changeView('SHOP') },
    // { label: 'Zadania', icon: <Scroll />, action: () => {} },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Character Summary */}
      <div className="md:col-span-1 bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-2xl">
            {character.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{character.name}</h2>
            <p className="text-amber-500">Lvl {character.level} {getProfessionName(character.profession)}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-red-600 h-full" 
              style={{ width: '100%' }} // HP
            ></div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-amber-500 h-full" 
              style={{ width: `${(character.exp / character.maxExp) * 100}%` }} 
            ></div>
          </div>
          <div className="flex justify-between text-sm text-slate-400 mt-1">
            <span>EXP: {character.exp}/{character.maxExp}</span>
            <span>Złoto: {character.gold}</span>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 p-6 rounded-lg flex flex-col items-center justify-center gap-3 transition-all group"
          >
            <div className="text-slate-400 group-hover:text-amber-500 transition-colors scale-150">
              {item.icon}
            </div>
            <span className="text-lg font-semibold text-slate-200">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

