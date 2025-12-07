import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Zasady Gry</h1>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 prose prose-invert max-w-none">
          <p className="text-slate-300">
            Zasady i regulacje dotyczące gry Eter. Proszę uzupełnić.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}



