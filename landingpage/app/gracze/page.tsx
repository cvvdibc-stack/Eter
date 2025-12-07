import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TopRanking } from '@/components/TopRanking';
import { Suspense } from 'react';

export default function GraczePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Gracze</h1>
          
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Ranking TOP 10</h2>
            <Suspense fallback={<div className="text-slate-400">Ładowanie rankingu...</div>}>
              <TopRanking />
            </Suspense>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Statystyki społeczności</h3>
              <p className="text-slate-400">
                Tutaj znajdziesz statystyki dotyczące społeczności graczy Eter.
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Znajdź graczy</h3>
              <p className="text-slate-400">
                Wyszukaj innych graczy i sprawdź ich profile.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



