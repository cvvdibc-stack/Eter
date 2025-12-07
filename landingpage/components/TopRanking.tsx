import { getTopRanking } from '@/lib/queries';
import Link from 'next/link';
import { Trophy, ArrowRight } from 'lucide-react';
import { getAvatarSrc } from '@/lib/assets';

export const revalidate = 120; // ISR: revalidate every 2 minutes

export async function TopRanking() {
  const ranking = await getTopRanking(10).catch(() => []);

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
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            Ranking TOP 10
          </h2>
          <Link
            href="/ranking"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Zobacz pełny ranking
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Miejsce</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Gracz</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Klasa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Poziom</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {ranking.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      Brak danych rankingowych
                    </td>
                  </tr>
                ) : (
                  ranking.map((player, index) => (
                    <tr key={player.id} className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-slate-300">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                            <img
                              src={getAvatarSrc(player.profession)}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-semibold text-white">{player.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{getProfessionName(player.profession)}</td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{player.level}</span>
                        <span className="text-slate-400 text-sm ml-2">({player.exp} XP)</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-slate-400 text-sm">Online</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}



