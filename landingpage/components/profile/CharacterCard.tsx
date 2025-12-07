'use client';

import { Character } from '@/types';
import { getAvatarSrc } from '@/lib/assets';
import { Trash2, ExternalLink } from 'lucide-react';
import { CharacterDeletion } from './CharacterDeletion';
import { useState } from 'react';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const [showDelete, setShowDelete] = useState(false);

  const getProfessionName = (prof: string) => {
    const names: Record<string, string> = {
      warrior: 'Wojownik',
      mage: 'Mag',
      assassin: 'Zabójca',
      cleric: 'Kleryk',
    };
    return names[prof] || prof;
  };

  return (
    <>
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 hover:border-purple-500 transition-colors">
        <div className="flex items-start gap-4">
          <img
            src={getAvatarSrc(character.profession)}
            alt={character.name}
            className="w-16 h-16 rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{character.name}</h3>
            <p className="text-slate-400 text-sm mb-2">{getProfessionName(character.profession)}</p>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span>Poziom {character.level}</span>
              <span>{character.exp} XP</span>
              <span>{character.gold.toLocaleString()} zł</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`${process.env.NEXT_PUBLIC_GAME_URL || 'http://localhost:5173'}?character=${character.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
              title="Wejdź do gry"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={() => setShowDelete(true)}
              className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
              title="Usuń postać"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {showDelete && (
        <CharacterDeletion
          character={character}
          onClose={() => setShowDelete(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </>
  );
}



