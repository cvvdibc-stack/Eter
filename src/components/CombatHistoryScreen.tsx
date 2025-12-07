import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CombatLog } from '../types';

export const CombatHistoryScreen: React.FC = () => {
  const { character } = useGame();
  const [history, setHistory] = useState<CombatLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (character) {
          setLoading(true);
          supabase.from('combat_logs')
            .select('*')
            .eq('character_id', character.id)
            .order('created_at', { ascending: false })
            .limit(50)
            .then(({ data, error }) => {
                if (data) {
                    setHistory(data);
                }
                if (error) {
                    console.error("Error loading history:", error);
                }
                setLoading(false);
            });
      }
  }, [character]);

  return (
      <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-slate-300 mb-6 flex items-center gap-2">
              <Calendar size={24} /> Historia Walk
          </h2>
          
          <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-[#0b0d10] text-xs uppercase font-bold text-slate-500">
                      <tr>
                          <th className="p-4">Przeciwnik</th>
                          <th className="p-4">Wynik</th>
                          <th className="p-4">Nagrody</th>
                          <th className="p-4">Typ</th>
                          <th className="p-4 text-right">Czas</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {loading ? (
                          <tr><td colSpan={5} className="p-8 text-center">Ładowanie...</td></tr>
                      ) : (
                        history.map((log, idx) => (
                          <tr key={log.id || idx} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-bold text-slate-200">{log.enemy_name}</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${log.result === 'WIN' ? 'bg-green-900/30 text-green-400 border border-green-900/50' : 'bg-red-900/30 text-red-400 border border-red-900/50'}`}>
                                      {log.result === 'WIN' ? 'WYGRANA' : 'PORAŻKA'}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <div className="flex flex-col gap-1">
                                      {log.exp_gained > 0 && <span className="text-blue-400 text-xs">+{log.exp_gained} EXP</span>}
                                      {log.gold_gained > 0 && <span className="text-yellow-500 text-xs">+{log.gold_gained} Złota</span>}
                                      {log.loot_gained && <span className="text-purple-400 text-xs font-bold">🎁 {log.loot_gained}</span>}
                                  </div>
                              </td>
                              <td className="p-4 text-xs uppercase tracking-wider text-slate-500">{log.type}</td>
                              <td className="p-4 text-right font-mono text-xs opacity-50">
                                  {log.created_at ? new Date(log.created_at).toLocaleTimeString() : 'Teraz'}
                              </td>
                          </tr>
                        ))
                      )}
                      {!loading && history.length === 0 && (
                          <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-600 italic">
                                  Brak historii walk.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );
};
