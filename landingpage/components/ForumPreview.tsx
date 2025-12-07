import { getForumTopics } from '@/lib/queries';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const revalidate = 30; // ISR: revalidate every 30 seconds

export async function ForumPreview() {
  const topics = await getForumTopics(undefined, 5).catch(() => []);

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="text-green-500" size={32} />
            Forum Społeczności
          </h2>
          <Link
            href="/forum"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Zobacz forum
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          {topics.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Brak tematów na forum
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/${topic.id}`}
                  className="block p-6 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {topic.is_pinned && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Przypięty</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${
                          topic.category === 'guides' ? 'bg-blue-500/20 text-blue-400' :
                          topic.category === 'trade' ? 'bg-green-500/20 text-green-400' :
                          topic.category === 'bugreport' ? 'bg-red-500/20 text-red-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {topic.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{topic.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{topic.content}</p>
                    </div>
                    <div className="ml-6 text-right text-sm text-slate-500">
                      <div>{topic.posts_count} odpowiedzi</div>
                      <div>{topic.views} wyświetleń</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



