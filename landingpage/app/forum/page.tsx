import { getForumTopics } from '@/lib/queries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MessageSquare, Plus, Pin } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 30; // ISR: revalidate every 30 seconds

const categories = [
  { id: 'general', name: 'Ogólne', color: 'bg-slate-700' },
  { id: 'guides', name: 'Poradniki', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'trade', name: 'Handel', color: 'bg-green-500/20 text-green-400' },
  { id: 'bugreport', name: 'Bug Report', color: 'bg-red-500/20 text-red-400' },
];

export default async function ForumPage() {
  const allTopics = await getForumTopics().catch(() => []);

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  const getCategoryColor = (id: string) => {
    return categories.find((c) => c.id === id)?.color || 'bg-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="text-green-500" size={32} />
            Forum
          </h1>
          <Link
            href="/forum/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Nowy temat
          </Link>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {allTopics.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              Brak tematów na forum
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {allTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/${topic.id}`}
                  className="block p-6 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {topic.is_pinned && (
                          <Pin className="text-yellow-500" size={16} />
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(topic.category)}`}>
                          {getCategoryName(topic.category)}
                        </span>
                        {topic.is_locked && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Zamknięty</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{topic.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{topic.content}</p>
                    </div>
                    <div className="ml-6 text-right text-sm text-slate-500 min-w-[100px]">
                      <div>{topic.posts_count} odpowiedzi</div>
                      <div>{topic.views} wyświetleń</div>
                      <div className="text-xs mt-2">
                        {new Date(topic.last_post_at).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}



