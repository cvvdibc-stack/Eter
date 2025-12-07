import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SupportGamePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Wsparcie Gry</h1>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
          <p className="text-slate-300">
            Strona donacji i wsparcia gry. W przygotowaniu.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}



