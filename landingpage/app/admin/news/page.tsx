import { getNews } from '@/lib/queries';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminNewsPage() {
  const news = await getNews(50).catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Zarządzanie Newsami</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus size={20} />
          Dodaj news
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {news.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Brak newsów</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {news.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{item.content}</p>
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(item.published_at || item.created_at).toLocaleDateString('pl-PL')}
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



