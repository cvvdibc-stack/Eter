import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Shield, Sword } from 'lucide-react';
import { LandingHeader } from './LandingHeader';
import { LandingHero } from './LandingHero';
import { LandingFooter } from './LandingFooter';
import { LandingIntro } from './sections/LandingIntro';
import { LandingPreview } from './sections/LandingPreview';
import { LandingTopRanking } from './sections/LandingTopRanking';
import { LandingNewsChangelog } from './sections/LandingNewsChangelog';
import { LandingRoadmap } from './sections/LandingRoadmap';
import { LandingHowToStart } from './sections/LandingHowToStart';
import { LandingLiveFeed } from './sections/LandingLiveFeed';
import { LandingForumPreview } from './sections/LandingForumPreview';
import { LandingServerStatus } from './sections/LandingServerStatus';
import { useGame } from '../../context/GameContext';
import { getProfessionName } from '../../utils/professionUtils';

export const LandingPage: React.FC = () => {
  const { changeView, user } = useGame();
  const [currentRoute, setCurrentRoute] = useState<string>('home');

  // Handle routing based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentRoute(hash);
      
      // If user navigates to profile and is logged in, redirect to game
      if (hash === 'profile' && user) {
        changeView('CHAR_SELECT');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user, changeView]);

  const navigate = (route: string) => {
    if (route === 'profile' && user) {
      changeView('CHAR_SELECT');
      return;
    }
    window.location.hash = route;
    setCurrentRoute(route);
  };

  // Render different pages based on route
  const renderContent = () => {
    switch (currentRoute) {
      case 'gracze':
        return <LandingGracze />;
      case 'changelog':
        return <LandingChangelog />;
      case 'pomoc':
        return <LandingPomoc />;
      case 'forum':
        return <LandingForum />;
      case 'rejestracja':
        return <LandingRejestracja />;
      case 'roadmap':
        return <LandingRoadmap />;
      case 'store':
        return <LandingStore />;
      default:
        return (
          <>
            <LandingHero />
            <LandingNewsChangelog />
            <LandingIntro />
            <LandingPreview />
            <LandingTopRanking />
            <LandingRoadmap />
            <LandingCharacterClasses />
            <LandingHowToStart />
            <LandingForumPreview />
            <LandingLiveFeed />
            <LandingServerStatus />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none"></div>
      
      <LandingHeader currentRoute={currentRoute} navigate={navigate} />
      
      <main className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1">
          {renderContent()}
        </div>
        <LandingFooter navigate={navigate} />
      </main>
    </div>
  );
};

// Placeholder components - will be created
const LandingStore: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-500 mb-8 uppercase tracking-wider">Sklep</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
            <h3 className="text-2xl font-semibold text-amber-400 mb-4">Premium</h3>
            <p className="text-slate-400 mb-6">Odkryj funkcje premium i wspomóż rozwój gry</p>
            <button
              onClick={() => window.location.hash = 'premium'}
              className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg font-bold transition-all uppercase tracking-wider"
            >
              Zobacz Premium
            </button>
          </div>
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
            <h3 className="text-2xl font-semibold text-amber-400 mb-4">Wsparcie Gry</h3>
            <p className="text-slate-400 mb-6">Wesprzyj twórców i otrzymaj wyjątkowe nagrody</p>
            <button
              onClick={() => window.location.hash = 'support-game'}
              className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg font-bold transition-all uppercase tracking-wider"
            >
              Wesprzyj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingCharacterClasses = () => {
  const classes = [
    { 
      name: 'Wojownik', 
      icon: '⚔️',
      desc: 'Mistrz walki wręcz. Wysoka siła i wytrzymałość. Idealny do walki w pierwszej linii.',
      playstyle: 'Bezpośrednia walka, tankowanie obrażeń',
      stats: ['Siła: ⭐⭐⭐⭐⭐', 'Wytrzymałość: ⭐⭐⭐⭐⭐', 'Zręczność: ⭐⭐']
    },
    { 
      name: 'Zabójca', 
      icon: '🗡️',
      desc: 'Zwinny i przebiegły. Zbalansowane statystyki. Specjalizuje się w szybkich atakach.',
      playstyle: 'Szybkie ataki, uniki, krytyczne trafienia',
      stats: ['Zręczność: ⭐⭐⭐⭐⭐', 'Siła: ⭐⭐⭐', 'Inteligencja: ⭐⭐⭐']
    },
    { 
      name: 'Mag', 
      icon: '🔮',
      desc: 'Mistrz magii. Wysoka inteligencja i mocne zaklęcia. Słaby fizycznie, ale potężny magicznie.',
      playstyle: 'Zaklęcia z daleka, kontrola pola walki',
      stats: ['Inteligencja: ⭐⭐⭐⭐⭐', 'Zręczność: ⭐⭐', 'Siła: ⭐']
    },
    { 
      name: 'Kleryk', 
      icon: '🛡️',
      desc: 'Uzdrowiciel i wsparcie. Łączy obronę z leczeniem. Niezastąpiony w drużynach.',
      playstyle: 'Leczenie, wsparcie, obrona',
      stats: ['Inteligencja: ⭐⭐⭐⭐', 'Wytrzymałość: ⭐⭐⭐⭐', 'Siła: ⭐⭐']
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#0b0d10]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-amber-500 mb-4 text-center uppercase tracking-wider">
          Klasy postaci – wybierz swoją drogę
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-3xl mx-auto">
          Wybierz jedną z czterech dostępnych klas, każda z unikalnymi umiejętnościami i stylem gry.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls, i) => (
            <div key={i} className="bg-[#13161c] border border-white/10 p-6 rounded-lg hover:border-amber-500/30 transition-colors flex flex-col">
              <div className="text-6xl mb-4 text-center">{cls.icon}</div>
              <h3 className="text-xl font-semibold text-amber-400 mb-3 text-center">{cls.name}</h3>
              <p className="text-slate-400 text-sm mb-4 flex-1">{cls.desc}</p>
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Styl gry:</p>
                <p className="text-slate-300 text-sm">{cls.playstyle}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Staty dominujące:</p>
                <div className="space-y-1">
                  {cls.stats.map((stat, idx) => (
                    <div key={idx} className="text-xs text-amber-400">{stat}</div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => window.location.hash = 'pomoc'}
                className="mt-auto px-4 py-2 bg-[#0b0d10] hover:bg-amber-600/20 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-400 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wider"
              >
                Zobacz klasę
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingFeatures = () => (
  <section className="py-20 px-4 bg-[#0b0d10]">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-amber-500 mb-12 text-center uppercase tracking-wider">Funkcje gry</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'System walki', desc: 'Dynamiczne pojedynki z potworami i innymi graczami' },
          { title: 'Ekwipunek', desc: 'Zbieraj i ulepszaj przedmioty o różnych rzadkościach' },
          { title: 'Dungeony', desc: 'Eksploruj lochy pełne wyzwań i nagród' },
          { title: 'Arena PvP', desc: 'Rywalizuj z innymi graczami w turniejach' },
          { title: 'Handel', desc: 'Kupuj i sprzedawaj przedmioty na aukcji' },
          { title: 'Postęp', desc: 'Rozwijaj swoją postać i odkrywaj nowe możliwości' },
        ].map((feature, i) => (
          <div key={i} className="bg-[#13161c] border border-white/10 p-6 rounded-lg hover:border-amber-500/30 transition-colors">
            <h3 className="text-xl font-semibold text-amber-400 mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LandingNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [changelogVersions, setChangelogVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch news
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(5);

        if (newsError) throw newsError;

        // Fetch latest changelog versions
        const { data: changelogData, error: changelogError } = await supabase
          .from('changelog_versions')
          .select('*')
          .order('release_date', { ascending: false })
          .limit(3);

        if (changelogError) throw changelogError;

        setNews(newsData || []);
        setChangelogVersions(changelogData || []);
      } catch (err) {
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return 'Aktualność';
      case 'changelog': return 'Changelog';
      case 'event': return 'Wydarzenie';
      default: return 'News';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'changelog': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'event': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <section className="py-20 px-4 bg-[#0b0d10]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-amber-500 uppercase tracking-wider">Aktualności</h2>
          <button
            onClick={() => window.location.hash = 'changelog'}
            className="px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider text-sm"
          >
            Zobacz changelog
          </button>
        </div>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie aktualności...</p>
          </div>
        ) : (
          <>
            {news.length === 0 && changelogVersions.length === 0 ? (
              <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-slate-400">Brak aktualności</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#13161c] border border-white/10 rounded-lg p-6 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getTypeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="text-sm text-slate-500">
                        {new Date(item.published_at || item.created_at).toLocaleDateString('pl-PL')}
                      </span>
                      {item.is_featured && (
                        <span className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs rounded border border-amber-500/30 font-bold uppercase">
                          Wyróżnione
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-amber-400 mb-3">{item.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3">{item.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Latest Changelog Versions */}
            {changelogVersions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-amber-500 mb-4 uppercase tracking-wider">Ostatnie aktualizacje</h3>
                <div className="space-y-4">
                  {changelogVersions.map((version) => (
                    <div
                      key={version.id}
                      className="bg-[#13161c] border border-white/10 rounded-lg p-6 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded text-sm font-bold uppercase">
                            v{version.version}
                          </span>
                          <span className="text-sm text-slate-500">
                            {new Date(version.release_date).toLocaleDateString('pl-PL')}
                          </span>
                        </div>
                      </div>
                      {version.description && (
                        <p className="text-slate-400 text-sm mt-2">{version.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const LandingCTA = () => (
  <section className="py-20 px-4 bg-[#0b0d10]">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold text-amber-500 mb-6 uppercase tracking-wider">Gotowy na przygodę?</h2>
      <p className="text-slate-400 mb-8 text-lg">
        Dołącz do społeczności graczy i rozpocznij swoją podróż w świecie Eteru
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.hash = 'rejestracja'}
          className="px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg font-bold text-lg transition-all uppercase tracking-wider shadow-lg"
        >
          Rozpocznij teraz
        </button>
        <button
          onClick={() => window.location.hash = 'pomoc'}
          className="px-8 py-4 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold text-lg transition-colors uppercase tracking-wider"
        >
          Dowiedz się więcej
        </button>
      </div>
    </div>
  </section>
);

const LandingGracze: React.FC = () => {
  const { loadRanking } = useGame();
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const result = await loadRanking();
        setRanking(result.slice(0, 10)); // Top 10
      } catch (err) {
        console.error('Error loading ranking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
    const interval = setInterval(fetchRanking, 60000);
    return () => clearInterval(interval);
  }, [loadRanking]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-500 mb-8 uppercase tracking-wider">Ranking graczy</h1>
        
        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie rankingu...</p>
          </div>
        ) : (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-6">
            <div className="space-y-2">
              {ranking.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 bg-[#0b0d10] border border-white/5 rounded-lg hover:border-amber-500/30 transition-colors"
                >
                  <div className={`w-10 h-10 flex items-center justify-center font-bold rounded ${
                    idx === 0 ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' :
                    idx === 1 ? 'bg-slate-600/20 text-slate-300 border border-slate-500/30' :
                    idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' :
                    'bg-slate-800/20 text-slate-400 border border-white/10'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-amber-400">{entry.name}</div>
                    <div className="text-sm text-slate-400">
                      {getProfessionName(entry.profession as any)} • Poziom {entry.level} • {entry.exp} XP
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-500">{entry.level}</div>
                    <div className="text-xs text-slate-500">Poziom</div>
                  </div>
                </div>
              ))}
            </div>
            {ranking.length === 0 && (
              <p className="text-slate-400 text-center py-8">Brak danych rankingu</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const LandingPomoc = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-amber-500 mb-8 uppercase tracking-wider">Pomoc</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-amber-400 mb-6 uppercase tracking-wider">Jak zacząć</h2>
        <div className="space-y-4">
          {['Utwórz konto', 'Wybierz klasę', 'Rozpocznij przygodę'].map((step, i) => (
            <div key={i} className="bg-[#13161c] border border-white/10 p-6 rounded-lg flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600/20 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 font-bold text-xl">
                {i + 1}
              </div>
              <p className="text-slate-300 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#13161c] border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-amber-400 mb-6 uppercase tracking-wider">Często zadawane pytania</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Jak utworzyć konto?</h3>
            <p className="text-slate-400">
              Kliknij "Rejestracja" w menu nawigacyjnym i wypełnij formularz rejestracji.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Jak utworzyć postać?</h3>
            <p className="text-slate-400">
              Po zalogowaniu przejdź do profilu i kliknij "Utwórz nową postać". Wybierz imię i klasę.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-500 mb-2">Jakie klasy są dostępne?</h3>
            <p className="text-slate-400">
              W grze dostępne są 4 klasy: Wojownik, Łucznik, Mag i Złodziej. Każda ma unikalne umiejętności.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LandingForum: React.FC = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data: topicsData, error: topicsError } = await supabase
          .from('forum_topics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (topicsError) throw topicsError;

        if (topicsData) {
          // Fetch post counts for each topic
          const topicsWithCounts = await Promise.all(
            topicsData.map(async (topic) => {
              const { count, error: countError } = await supabase
                .from('forum_posts')
                .select('*', { count: 'exact', head: true })
                .eq('topic_id', topic.id);
              
              return {
                ...topic,
                post_count: count || 0
              };
            })
          );
          setTopics(topicsWithCounts);
        }
      } catch (err) {
        console.error('Error loading forum topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
    const interval = setInterval(fetchTopics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-amber-500 uppercase tracking-wider">Forum</h1>
          <button
            onClick={() => window.location.hash = 'rejestracja'}
            className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg font-bold transition-all uppercase tracking-wider"
          >
            Utwórz temat
          </button>
        </div>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie forum...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#13161c] border border-white/10 rounded-lg p-6 hover:border-amber-500/30 transition-colors cursor-pointer"
                onClick={() => window.location.hash = `forum/${topic.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-amber-400 mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{topic.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Autor: {topic.author_name || 'Anonimowy'}</span>
                      <span>•</span>
                      <span>{new Date(topic.created_at).toLocaleDateString('pl-PL')}</span>
                      <span>•</span>
                      <span>{topic.post_count || 0} odpowiedzi</span>
                    </div>
                  </div>
                  {topic.is_pinned && (
                    <div className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 rounded text-amber-400 text-xs font-bold uppercase">
                      Przypięty
                    </div>
                  )}
                </div>
              </div>
            ))}
            {topics.length === 0 && (
              <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                <p className="text-slate-400">Brak tematów na forum</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const LandingChangelog: React.FC = () => {
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const { data, error } = await supabase
          .from('changelog_versions')
          .select('*')
          .order('release_date', { ascending: false })
          .limit(20);

        if (error) throw error;
        setVersions(data || []);
        if (data && data.length > 0 && !selectedVersion) {
          setSelectedVersion(data[0].id);
        }
      } catch (err) {
        console.error('Error loading changelog versions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, []);

  useEffect(() => {
    if (!selectedVersion) return;

    const fetchEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('changelog_entries')
          .select('*')
          .eq('version_id', selectedVersion)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (err) {
        console.error('Error loading changelog entries:', err);
      }
    };
    fetchEntries();
  }, [selectedVersion]);

  const getTagColor = (type: string) => {
    switch (type) {
      case 'balancing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'content': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'bugfix': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'feature': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTagLabel = (type: string) => {
    switch (type) {
      case 'balancing': return 'Balansowanie';
      case 'content': return 'Treść';
      case 'bugfix': return 'Poprawka';
      case 'feature': return 'Funkcja';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-500 mb-8 uppercase tracking-wider">Changelog</h1>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie changelogu...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Version List */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-bold text-amber-400 mb-4 uppercase tracking-wider">Wersje</h2>
              <div className="space-y-2">
                {versions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => setSelectedVersion(version.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedVersion === version.id
                        ? 'bg-[#13161c] border-amber-500/30 text-amber-400'
                        : 'bg-[#0b0d10] border-white/10 text-slate-400 hover:border-amber-500/20 hover:text-amber-500'
                    }`}
                  >
                    <div className="font-bold text-sm">v{version.version}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(version.release_date).toLocaleDateString('pl-PL')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entries List */}
            <div className="md:col-span-3">
              {selectedVersion ? (
                <>
                  {versions.find(v => v.id === selectedVersion) && (
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-amber-400 mb-2">
                        Wersja {versions.find(v => v.id === selectedVersion)?.version}
                      </h2>
                      {versions.find(v => v.id === selectedVersion)?.description && (
                        <p className="text-slate-400">
                          {versions.find(v => v.id === selectedVersion)?.description}
                        </p>
                      )}
                      <p className="text-sm text-slate-500 mt-2">
                        Data wydania: {new Date(versions.find(v => v.id === selectedVersion)?.release_date || '').toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  )}

                  {entries.length === 0 ? (
                    <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                      <p className="text-slate-400">Brak wpisów dla tej wersji</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="bg-[#13161c] border border-white/10 rounded-lg p-6 hover:border-amber-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getTagColor(entry.type)}`}>
                              {getTagLabel(entry.type)}
                            </span>
                            <span className="text-sm text-slate-500">
                              {new Date(entry.created_at).toLocaleDateString('pl-PL')}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-amber-400 mb-2">{entry.title}</h3>
                          <p className="text-slate-400 text-sm">{entry.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
                  <p className="text-slate-400">Wybierz wersję, aby zobaczyć zmiany</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LandingRejestracja: React.FC = () => {
  const { signUp } = useGame();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      return;
    }

    if (!acceptTerms) {
      setError('Musisz zaakceptować regulamin');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setError('Konto utworzone! Zaloguj się.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-amber-500 mb-8 text-center uppercase tracking-wider">Rejestracja</h1>
        <div className="bg-[#13161c] border border-white/10 rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs uppercase font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-slate-200 focus:border-amber-600 outline-none rounded transition-colors"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase font-bold mb-2">Hasło</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-slate-200 focus:border-amber-600 outline-none rounded transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase font-bold mb-2">Potwierdź hasło</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-slate-200 focus:border-amber-600 outline-none rounded transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-white/10 bg-[#0a0a0a] text-amber-600 focus:ring-amber-600"
                required
              />
              <label className="text-sm text-slate-400">
                Akceptuję{' '}
                <a href="#" className="text-amber-500 hover:text-amber-400">
                  regulamin
                </a>{' '}
                i{' '}
                <a href="#" className="text-amber-500 hover:text-amber-400">
                  politykę prywatności
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-3 rounded shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {isLoading ? 'Rejestracja...' : 'STWÓRZ KONTO'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.hash = ''}
              className="text-slate-500 hover:text-amber-500 text-sm transition-colors uppercase"
            >
              Masz już konto? Zaloguj się
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

