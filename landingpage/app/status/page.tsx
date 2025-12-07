import { getServerStats, getLiveFeed } from '@/lib/queries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Activity, Users, Clock, Gift } from 'lucide-react';

export const revalidate = 30; // ISR: revalidate every 30 seconds

export default async function StatusPage() {
  const [stats, recentDrops] = await Promise.all([
    getServerStats().catch(() => null),
    getLiveFeed(10).catch(() => []),
  ]);

  const uniqueDrops = recentDrops.filter((e) => e.event_type === 'LEGENDARY_DROP' || e.event_type === 'ITEM_DROP');

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Status Serwera</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-green-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Gracze Online</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.players_online || 0}</p>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-blue-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Średnia 24h</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.players_24h_avg || 0}</p>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-yellow-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Uptime</h3>
            </div>
            <p className="text-lg font-bold text-white">
              {stats ? formatUptime(stats.uptime_seconds) : '0d 0h 0m'}
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="text-purple-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Dropy Dziś</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.unique_drops_today || 0}</p>
          </div>
        </div>

        {uniqueDrops.length > 0 && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Ostatnie Unikalne Dropy</h2>
            <div className="space-y-3">
              {uniqueDrops.slice(0, 10).map((drop) => (
                <div key={drop.id} className="p-3 bg-slate-900 rounded border border-slate-700">
                  <p className="text-white">
                    <span className="font-semibold text-purple-400">{drop.character_name}</span>
                    {' '}
                    {drop.message}
                    {drop.item_name && <span className="text-yellow-400"> {drop.item_name}</span>}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    {new Date(drop.created_at).toLocaleString('pl-PL')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}



