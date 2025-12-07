'use client';

import { useState } from 'react';
import { Character } from '@/types';
import { CharacterCard } from './CharacterCard';
import { CharacterCreation } from './CharacterCreation';
import { Plus } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  userId: string;
}

export function CharacterList({ characters, userId }: CharacterListProps) {
  const [showCreate, setShowCreate] = useState(false);
  const maxCharacters = 5;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Moje Postacie</h2>
        {characters.length < maxCharacters && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Stwórz postać
          </button>
        )}
      </div>

      {showCreate && (
        <CharacterCreation
          userId={userId}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            window.location.reload();
          }}
        />
      )}

      {characters.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="mb-4">Nie masz jeszcze żadnej postaci</p>
          {characters.length < maxCharacters && (
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Stwórz pierwszą postać
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
}



