import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Newspaper, ArrowRight } from 'lucide-react';

export const LandingNewsChangelog: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [changelogVersions, setChangelogVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 3 latest news
        const { data: newsData } = await supabase
          .from('news')
          .select('*')
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(3);

        // Fetch latest changelog version with entries
        const { data: versionData } = await supabase
          .from('changelog_versions')
          .select('*')
          .order('release_date', { ascending: false })
          .limit(1);

        if (versionData && versionData.length > 0) {
          const { data: entriesData } = await supabase
            .from('changelog_entries')
            .select('*')
            .eq('version_id', versionData[0].id)
            .order('created_at', { ascending: false })
            .limit(5);

          setChangelogVersions([{ ...versionData[0], entries: entriesData || [] }]);
        }

        setNews(newsData || []);
      } catch (err) {
        console.error('Error loading news/changelog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'changelog': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'event': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTagColor = (type: string) => {
    switch (type) {
      case 'balancing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'content': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'bugfix': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'feature': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <section className="py-20 px-4 bg-[#0b0d10]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-amber-500 mb-12 text-center uppercase tracking-wider flex items-center justify-center gap-3">
          <Newspaper className="text-amber-500" size={32} />
          News + Changelog
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* News Column */}
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-6 uppercase tracking-wider">Aktualności</h3>
            {loading ? (
              <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-slate-400">Ładowanie...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-slate-400">Brak aktualności</p>
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#13161c] border border-white/10 rounded-lg p-6 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getTypeColor(item.type)}`}>
                        {item.type === 'news' ? 'Aktualność' : item.type === 'event' ? 'Wydarzenie' : 'Changelog'}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(item.published_at || item.created_at).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-amber-400 mb-2">{item.title}</h4>
                    <p className="text-slate-400 text-sm line-clamp-2">{item.content}</p>
                  </div>
                ))}
                <button
                  onClick={() => window.location.hash = 'home'}
                  className="w-full px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  Więcej aktualności
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Changelog Column */}
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-6 uppercase tracking-wider">Changelog</h3>
            {loading ? (
              <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-slate-400">Ładowanie...</p>
              </div>
            ) : changelogVersions.length === 0 ? (
              <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-slate-400">Brak changelogu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {changelogVersions.map((version) => (
                  <div key={version.id} className="bg-[#13161c] border border-white/10 rounded-lg p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded text-sm font-bold uppercase">
                          v{version.version}
                        </span>
                        <span className="text-sm text-slate-500">
                          {new Date(version.release_date).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                      {version.description && (
                        <p className="text-slate-400 text-sm mb-4">{version.description}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {version.entries && version.entries.length > 0 ? (
                        version.entries.map((entry: any) => (
                          <div key={entry.id} className="flex items-start gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase border flex-shrink-0 ${getTagColor(entry.type)}`}>
                              {entry.type === 'balancing' ? 'Balans' : entry.type === 'content' ? 'Treść' : entry.type === 'bugfix' ? 'Fix' : 'Funkcja'}
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-amber-400">{entry.title}</div>
                              {entry.description && (
                                <div className="text-xs text-slate-500">{entry.description}</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-sm">Brak wpisów</p>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => window.location.hash = 'changelog'}
                  className="w-full px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  Pełny changelog
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};



