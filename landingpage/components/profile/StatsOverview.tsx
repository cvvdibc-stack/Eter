import { User } from '@/types';

interface StatsOverviewProps {
  user: User;
  characters: any[];
}

export function StatsOverview({ user, characters }: StatsOverviewProps) {
  const totalLevel = characters.reduce((sum, char) => sum + char.level, 0);
  const totalGold = characters.reduce((sum, char) => sum + char.gold, 0);

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Status Konta</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Liczba postaci</p>
            <p className="text-white">{characters.length} / 5</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Statystyki</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-400">Suma poziomów</p>
            <p className="text-white text-2xl font-bold">{totalLevel}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Suma złota</p>
            <p className="text-white text-2xl font-bold">{totalGold.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Szybkie linki</h3>
        <div className="space-y-2">
          <a
            href={`${process.env.NEXT_PUBLIC_GAME_URL || 'http://localhost:5173'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
          >
            Wejdź do gry
          </a>
        </div>
      </div>
    </div>
  );
}



