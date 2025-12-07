import { getNews, getChangelogVersions, getChangelogEntries } from '@/lib/queries';
import Link from 'next/link';
import { Newspaper, FileText, ArrowRight } from 'lucide-react';

export const revalidate = 60; // ISR: revalidate every minute

export async function NewsFeed() {
  const [news, changelogVersions] = await Promise.all([
    getNews(5, false).catch(() => []),
    getChangelogVersions(5).catch(() => []),
  ]);

  // Get entries for latest changelog version
  const latestChangelogEntries = changelogVersions.length > 0
    ? await getChangelogEntries(changelogVersions[0].id).catch(() => [])
    : [];

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-white flex items-center gap-3">
            <Newspaper className="text-blue-500" size={32} />
            Aktualności
          </h2>
          <Link
            href="/changelog"
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Zobacz changelog
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {news.length === 0 ? (
            <div className="col-span-2 p-8 bg-slate-900 rounded-lg border border-slate-700 text-center text-slate-400">
              Brak aktualności
            </div>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-slate-900 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper size={20} className="text-purple-500" />
                  <span className="text-sm text-slate-400">
                    {new Date(item.published_at || item.created_at).toLocaleDateString('pl-PL')}
                  </span>
                  {item.is_featured && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Featured</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 line-clamp-3">{item.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Latest Changelog */}
        {changelogVersions.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="text-green-500" size={24} />
              Ostatnia wersja: {changelogVersions[0].version}
            </h3>
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
              {latestChangelogEntries.length > 0 ? (
                <ul className="space-y-3">
                  {latestChangelogEntries.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="flex items-start gap-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        entry.type === 'feature' ? 'bg-green-500/20 text-green-400' :
                        entry.type === 'bugfix' ? 'bg-red-500/20 text-red-400' :
                        entry.type === 'balancing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {entry.type}
                      </span>
                      <div>
                        <span className="font-semibold text-white">{entry.title}</span>
                        {entry.description && (
                          <p className="text-slate-400 text-sm">{entry.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">Brak wpisów changelogu</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}



