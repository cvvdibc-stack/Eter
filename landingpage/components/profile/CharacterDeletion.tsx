'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Character } from '@/types';
import { X, AlertTriangle } from 'lucide-react';

interface CharacterDeletionProps {
  character: Character;
  onClose: () => void;
  onSuccess: () => void;
}

export function CharacterDeletion({ character, onClose, onSuccess }: CharacterDeletionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canDelete, setCanDelete] = useState<boolean | null>(null);

  const checkDeletionEligibility = async () => {
    try {
      const { data, error: checkError } = await supabase.rpc('can_delete_character', {
        character_id_param: character.id,
      });

      if (checkError) throw checkError;
      setCanDelete(data === true);
    } catch (err: any) {
      setError(err.message || 'Błąd sprawdzania uprawnień');
    }
  };

  useEffect(() => {
    checkDeletionEligibility();
  }, []);

  const handleDelete = async () => {
    if (!canDelete) {
      setError('Postać musi być nieaktywna przez 3 dni, aby można było ją usunąć');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: deleteError } = await supabase
        .from('characters')
        .delete()
        .eq('id', character.id);

      if (deleteError) throw deleteError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Błąd usuwania postaci');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" size={24} />
          <h2 className="text-2xl font-bold text-white">Usuwanie Postaci</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {canDelete === null ? (
          <p className="text-slate-300 mb-4">Sprawdzanie uprawnień...</p>
        ) : canDelete ? (
          <>
            <p className="text-slate-300 mb-4">
              Czy na pewno chcesz usunąć postać <span className="font-semibold text-white">{character.name}</span>?
              Ta operacja jest nieodwracalna.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Usuwanie...' : 'Usuń'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Anuluj
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-slate-300 mb-4">
              Nie możesz usunąć tej postaci. Postać musi być nieaktywna przez co najmniej 3 dni.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Zamknij
            </button>
          </>
        )}
      </div>
    </div>
  );
}

