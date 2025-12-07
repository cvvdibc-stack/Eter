import { ForumPost } from '@/types';
import { Heart } from 'lucide-react';

interface PostListProps {
  posts: ForumPost[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Odpowiedzi ({posts.length})</h2>
      {posts.length === 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center text-slate-400">
          Brak odpowiedzi w tym temacie
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-slate-400">
                  {new Date(post.created_at).toLocaleString('pl-PL')}
                  {post.is_edited && <span className="ml-2 text-xs">(edytowany)</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Heart size={16} />
                <span className="text-sm">{post.likes_count}</span>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}



