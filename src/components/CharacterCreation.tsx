import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { PROFESSIONS } from '../data/professions';
import { Profession } from '../types';
import { Sword, Skull, Zap, Heart } from 'lucide-react';

export const CharacterCreation: React.FC = () => {
  const { createCharacter } = useGame();
  const [name, setName] = useState('');
  const [selectedProf, setSelectedProf] = useState<Profession>('warrior');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createCharacter(name, selectedProf);
    }
  };

  const getIcon = (p: Profession) => {
    switch(p) {
      case 'warrior': return <Sword size={32} />;
      case 'assassin': return <Skull size={32} />;
      case 'mage': return <Zap size={32} />;
      case 'cleric': return <Heart size={32} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-4xl font-bold text-center mb-8 text-amber-500 font-serif">Stwórz Bohatera</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-slate-400 mb-2">Imię Postaci</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:border-amber-500 outline-none"
                placeholder="Wpisz imię..."
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-4">Wybierz Profesję</label>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(PROFESSIONS) as Profession[]).map((prof) => (
                  <button
                    key={prof}
                    onClick={() => setSelectedProf(prof)}
                    className={`p-4 rounded border-2 transition-all flex flex-col items-center gap-2 ${
                      selectedProf === prof 
                        ? 'border-amber-500 bg-slate-700' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {getIcon(prof)}
                    <span className="capitalize font-bold">{PROFESSIONS[prof].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-slate-900 rounded p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-amber-500 mb-2">
              {PROFESSIONS[selectedProf].name}
            </h2>
            <p className="text-slate-300 italic mb-4">
              {PROFESSIONS[selectedProf].role}
            </p>
            <p className="text-slate-400 mb-6">
              {PROFESSIONS[selectedProf].description}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Siła:</span> 
                <span className="text-amber-400">{PROFESSIONS[selectedProf].baseStats.strength}</span>
              </div>
              <div className="flex justify-between">
                <span>Zręczność:</span> 
                <span className="text-amber-400">{PROFESSIONS[selectedProf].baseStats.dexterity}</span>
              </div>
              <div className="flex justify-between">
                <span>Inteligencja:</span> 
                <span className="text-amber-400">{PROFESSIONS[selectedProf].baseStats.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span>Witalność:</span> 
                <span className="text-amber-400">{PROFESSIONS[selectedProf].baseStats.vitality}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-sm text-emerald-400">
                Pasywka: {PROFESSIONS[selectedProf].passive}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full mt-8 py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-bold text-xl transition-colors"
        >
          Rozpocznij Przygodę
        </button>
      </div>
    </div>
  );
};

