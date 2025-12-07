import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserCharacters } from '@/lib/queries';
import { CharacterList } from '@/components/profile/CharacterList';
import { StatsOverview } from '@/components/profile/StatsOverview';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default async function ProfilePage() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const characters = await getUserCharacters(session.user.id).catch(() => []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Panel Gracza</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CharacterList characters={characters} userId={session.user.id} />
          </div>
          <div>
            <StatsOverview user={session.user} characters={characters} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



