import React, { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';
import { Trophy, ArrowRight } from 'lucide-react';
import { getProfessionName } from '../../../utils/professionUtils';

export const LandingTopRanking: React.FC = () => {
  const { loadRanking } = useGame();
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const result = await loadRanking();
        setRanking(result.slice(0, 10)); // Top 10
      } catch (err) {
        console.error('Error loading ranking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
    const interval = setInterval(fetchRanking, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, [loadRanking]);


  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-amber-500 uppercase tracking-wider flex items-center gap-3">
            <Trophy className="text-amber-500" size={32} />
            Ranking TOP 10
          </h2>
          <button
            onClick={() => window.location.hash = 'gracze'}
            className="flex items-center gap-2 px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider"
          >
            Zobacz pełny ranking
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie rankingu...</p>
          </div>
        ) : (
          <div className="bg-[#13161c] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0b0d10] border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Nick</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Klasa</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Online</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ranking.map((entry, idx) => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`font-bold ${
                          idx === 0 ? 'text-amber-500' :
                          idx === 1 ? 'text-slate-300' :
                          idx === 2 ? 'text-amber-700' :
                          'text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-amber-400">{entry.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 font-bold">{entry.level}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-400">{getProfessionName(entry.profession as any)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#0b0d10] border-t border-white/10 text-center">
              <p className="text-xs text-slate-500">Aktualizowane co 60 sekund</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};



