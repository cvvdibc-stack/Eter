import { getLiveFeed } from '@/lib/queries';
import { Plus } from 'lucide-react';

export default async function AdminLiveEventsPage() {
  const events = await getLiveFeed(50).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Zarządzanie Live Events</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus size={20} />
          Dodaj event
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        {events.length === 0 ? (
          <div className="text-center text-slate-400 py-8">Brak eventów</div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="p-4 bg-slate-900 rounded border border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                        {event.event_type}
                      </span>
                      {!event.is_public && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Prywatny</span>
                      )}
                    </div>
                    <p className="text-white">
                      <span className="font-semibold text-purple-400">{event.character_name}</span>
                      {' '}
                      {event.message}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(event.created_at).toLocaleString('pl-PL')}
                    </p>
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



