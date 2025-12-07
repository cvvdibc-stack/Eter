import { getLiveFeed } from '@/lib/queries';
import { Zap } from 'lucide-react';

export const revalidate = 15; // ISR: revalidate every 15 seconds

export async function LiveFeed() {
  const events = await getLiveFeed(10).catch(() => []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'LEGENDARY_DROP':
        return '⭐';
      case 'LEVEL_UP':
        return '⬆️';
      case 'BOSS_KILL':
        return '💀';
      case 'ITEM_DROP':
        return '📦';
      default:
        return '✨';
    }
  };

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Zap className="text-yellow-500" size={32} />
          <h2 className="text-4xl font-bold text-white">Live Feed</h2>
          <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Na żywo
          </span>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              Brak wydarzeń w feedzie
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-slate-900 rounded border border-slate-700 hover:border-purple-500 transition-colors animate-fade-in"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getEventIcon(event.event_type)}</span>
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-semibold text-purple-400">{event.character_name}</span>
                        {' '}
                        {event.message}
                        {event.item_name && (
                          <span className="text-yellow-400"> {event.item_name}</span>
                        )}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        {new Date(event.created_at).toLocaleString('pl-PL')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



