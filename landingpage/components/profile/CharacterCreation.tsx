'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profession } from '@/types';
import { X, Sword, Skull, Zap, Heart } from 'lucide-react';

interface CharacterCreationProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const professions: Array<{ id: Profession; name: string; icon: any; description: string }> = [
  { id: 'warrior', name: 'Wojownik', icon: Sword, description: 'Tank, blok, siła, pancerz' },
  { id: 'mage', name: 'Mag', icon: Zap, description: 'Burst magiczny, odporność magiczna' },
  { id: 'assassin', name: 'Zabójca', icon: Skull, description: 'Uniki, szybkość ataku, krytyki' },
  { id: 'cleric', name: 'Kleryk', icon: Heart, description: 'Leczenie, aury, sustain' },
];

export function CharacterCreation({ userId, onClose, onSuccess }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState<Profession>('warrior');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check character limit
      const { data: existing } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', userId);

      if (existing && existing.length >= 5) {
        throw new Error('Maksymalna liczba postaci to 5');
      }

      // Create character (matching the main game's structure)
      const { data, error: createError } = await supabase
        .from('characters')
        .insert({
          user_id: userId,
          name: name.trim(),
          profession,
          level: 1,
          exp: 0,
          max_exp: 100,
          gold: 0,
          stats: {
            strength: profession === 'warrior' ? 10 : profession === 'assassin' ? 4 : profession === 'mage' ? 2 : 4,
            dexterity: profession === 'assassin' ? 10 : profession === 'warrior' ? 4 : profession === 'mage' ? 4 : 2,
            intelligence: profession === 'mage' ? 10 : profession === 'cleric' ? 8 : 2,
            vitality: profession === 'warrior' ? 8 : profession === 'cleric' ? 6 : 4,
          },
          equipment: {},
          inventory: [],
          unlocked_monsters: ['monster_1'],
        })
        .select()
        .single();

      if (createError) throw createError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Błąd tworzenia postaci');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Tworzenie Postaci</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nazwa postaci</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="Wprowadź nazwę"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">Klasa</label>
            <div className="grid grid-cols-2 gap-4">
              {professions.map((prof) => {
                const Icon = prof.icon;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setProfession(prof.id)}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      profession === prof.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="text-purple-500" size={24} />
                      <span className="font-semibold text-white">{prof.name}</span>
                    </div>
                    <p className="text-sm text-slate-400">{prof.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Tworzenie...' : 'Stwórz postać'}
          </button>
        </form>
      </div>
    </div>
  );
}



