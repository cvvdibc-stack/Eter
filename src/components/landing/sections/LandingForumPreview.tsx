import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MessageSquare, ArrowRight } from 'lucide-react';

export const LandingForumPreview: React.FC = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data: topicsData, error: topicsError } = await supabase
          .from('forum_topics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (topicsError) throw topicsError;

        if (topicsData) {
          const topicsWithCounts = await Promise.all(
            topicsData.map(async (topic) => {
              const { count } = await supabase
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
    <section className="py-20 px-4 bg-[#0b0d10]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-amber-500" size={32} />
            <h2 className="text-4xl font-bold text-amber-500 uppercase tracking-wider">Forum Preview</h2>
          </div>
          <button
            onClick={() => window.location.hash = 'forum'}
            className="flex items-center gap-2 px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider"
          >
            Przejdź do forum
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie forum...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Brak tematów na forum</p>
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
                    <h3 className="text-lg font-semibold text-amber-400 mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">{topic.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Autor: {topic.author_name || 'Anonimowy'}</span>
                      <span>•</span>
                      <span>{topic.post_count || 0} odpowiedzi</span>
                      <span>•</span>
                      <span>{new Date(topic.created_at).toLocaleDateString('pl-PL')}</span>
                    </div>
                  </div>
                  {topic.is_pinned && (
                    <div className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 rounded text-amber-400 text-xs font-bold uppercase flex-shrink-0">
                      Przypięty
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};



