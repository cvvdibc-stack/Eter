import { getRoadmapItems } from '@/lib/queries';
import { Plus } from 'lucide-react';

export default async function AdminRoadmapPage() {
  const items = await getRoadmapItems().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Zarządzanie Roadmapą</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus size={20} />
          Dodaj element
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        {items.length === 0 ? (
          <div className="text-center text-slate-400 py-8">Brak elementów roadmapy</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    {item.description && <p className="text-slate-400 text-sm">{item.description}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.status === 'done' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-slate-500 text-xs">Priorytet: {item.priority}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                      Edytuj
                    </button>
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



