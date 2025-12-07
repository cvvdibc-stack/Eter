'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send } from 'lucide-react';

interface PostFormProps {
  topicId: string;
}

export function PostForm({ topicId }: PostFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Musisz być zalogowany');
      }

      const { error: insertError } = await supabase.from('forum_posts').insert({
        topic_id: topicId,
        author_id: session.user.id,
        content: content.trim(),
      });

      if (insertError) throw insertError;

      setContent('');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Błąd dodawania odpowiedzi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Dodaj odpowiedź</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        minLength={10}
        rows={6}
        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 mb-4"
        placeholder="Napisz swoją odpowiedź..."
      />

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        <Send size={18} />
        {loading ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
      </button>
    </form>
  );
}



