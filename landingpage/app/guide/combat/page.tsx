import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CombatPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Mechanika Walki</h1>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 prose prose-invert max-w-none">
          <p className="text-slate-300">
            Szczegółowy opis mechaniki walki w grze Eter.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}



