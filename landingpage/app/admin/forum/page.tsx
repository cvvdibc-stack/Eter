import { getForumTopics } from '@/lib/queries';

export default async function AdminForumPage() {
  const topics = await getForumTopics(50).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Moderacja Forum</h1>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {topics.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Brak tematów</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {topics.map((topic) => (
              <div key={topic.id} className="p-6 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{topic.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-slate-500 text-xs">{topic.posts_count} odpowiedzi</span>
                      <span className="text-slate-500 text-xs">{topic.views} wyświetleń</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm">
                      {topic.is_pinned ? 'Odepnij' : 'Przypnij'}
                    </button>
                    <button className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm">
                      {topic.is_locked ? 'Otwórz' : 'Zamknij'}
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



