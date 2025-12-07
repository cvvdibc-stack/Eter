import { getServerStats } from '@/lib/queries';
import { Activity, Users, Gift } from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getServerStats().catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard Administracyjny</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <Gift className="text-purple-500" size={24} />
            <h3 className="text-lg font-semibold text-white">Dropy Dziś</h3>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.unique_drops_today || 0}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Szybkie linki</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/news"
            className="p-4 bg-slate-900 rounded border border-slate-700 hover:border-purple-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Zarządzanie Newsami</h3>
            <p className="text-slate-400 text-sm">Dodawaj, edytuj i publikuj newsy</p>
          </a>
          <a
            href="/admin/roadmap"
            className="p-4 bg-slate-900 rounded border border-slate-700 hover:border-purple-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Roadmap</h3>
            <p className="text-slate-400 text-sm">Zarządzaj elementami roadmapy</p>
          </a>
          <a
            href="/admin/changelog"
            className="p-4 bg-slate-900 rounded border border-slate-700 hover:border-purple-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Changelog</h3>
            <p className="text-slate-400 text-sm">Twórz nowe wersje i wpisy</p>
          </a>
          <a
            href="/admin/forum"
            className="p-4 bg-slate-900 rounded border border-slate-700 hover:border-purple-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Moderacja Forum</h3>
            <p className="text-slate-400 text-sm">Zarządzaj tematami i postami</p>
          </a>
        </div>
      </div>
    </div>
  );
}



