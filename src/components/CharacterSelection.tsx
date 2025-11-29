import React from 'react';
import { useGame } from '../context/GameContext';
import { Plus, User as UserIcon, Play, Trash2 } from 'lucide-react';
import { PROFESSIONS } from '../data/professions';

export const CharacterSelection: React.FC = () => {
  const { myCharacters, createCharacter, selectCharacter, signOut, changeView } = useGame();

  const handleCreate = () => {
    changeView('CHARACTER_CREATION');
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-8 text-slate-200">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-amber-500 font-serif tracking-wider">WYBIERZ BOHATERA</h1>
          <button 
            onClick={signOut}
            className="text-slate-500 hover:text-red-400 transition-colors text-sm uppercase font-bold tracking-widest"
          >
            Wyloguj
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Existing Characters */}
          {myCharacters.map((char) => (
            <div 
              key={char.id} 
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-amber-500 transition-all group relative flex flex-col"
            >
              <div className="flex-1 text-center">
                <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full mb-4 flex items-center justify-center border-2 border-slate-600 group-hover:border-amber-500 transition-colors">
                  <UserIcon size={40} className="text-slate-400 group-hover:text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{char.name}</h2>
                <p className="text-amber-600 text-sm font-bold uppercase tracking-wider mb-4">
                  Lvl {char.level} {PROFESSIONS[char.profession].name}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-black/20 p-2 rounded mb-6">
                  <span>Złoto: {char.gold}</span>
                  <span>Mapa: 1-1</span>
                </div>
              </div>

              <button 
                onClick={() => selectCharacter(char.id)}
                className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Play size={16} /> GRAJ
              </button>
            </div>
          ))}

          {/* Create New Slot */}
          {myCharacters.length < 3 && (
            <button 
              onClick={handleCreate}
              className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:text-amber-500 hover:border-amber-500/50 hover:bg-slate-800/30 transition-all min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center mb-4">
                <Plus size={32} />
              </div>
              <span className="font-bold text-lg uppercase tracking-wider">Stwórz Postać</span>
              <span className="text-xs mt-2 opacity-50">Wolne sloty: {3 - myCharacters.length}/3</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

