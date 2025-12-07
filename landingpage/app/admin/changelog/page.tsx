import { getChangelogVersions } from '@/lib/queries';
import { Plus } from 'lucide-react';

export default async function AdminChangelogPage() {
  const versions = await getChangelogVersions(50).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Zarządzanie Changelogiem</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus size={20} />
          Nowa wersja
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        {versions.length === 0 ? (
          <div className="text-center text-slate-400 py-8">Brak wersji changelogu</div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className="p-4 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Wersja {version.version}</h3>
                    {version.description && <p className="text-slate-400 text-sm">{version.description}</p>}
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(version.release_date).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={`/admin/changelog/${version.id}`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    >
                      Edytuj
                    </a>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



