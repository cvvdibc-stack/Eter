import { getForumTopic, getForumPosts } from '@/lib/queries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PostList } from '@/components/forum/PostList';
import { PostForm } from '@/components/forum/PostForm';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export const revalidate = 30; // ISR: revalidate every 30 seconds

export default async function ForumTopicPage({ params }: { params: { topicId: string } }) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const [topic, posts] = await Promise.all([
    getForumTopic(params.topicId).catch(() => null),
    getForumPosts(params.topicId).catch(() => []),
  ]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center text-slate-400">
            <p>Temat nie został znaleziony</p>
            <Link href="/forum" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
              Wróć do forum
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Wróć do forum
        </Link>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">{topic.title}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 whitespace-pre-wrap">{topic.content}</p>
          </div>
        </div>

        <PostList posts={posts} />

        {session && !topic.is_locked && (
          <div className="mt-6">
            <PostForm topicId={topic.id} />
          </div>
        )}

        {!session && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700 text-center text-slate-400">
            <p>Musisz być zalogowany, aby odpowiadać w temacie</p>
            <Link href="/#login" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
              Zaloguj się
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}



