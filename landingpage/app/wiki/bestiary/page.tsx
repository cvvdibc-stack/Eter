import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default function BestiaryPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Bestiariusz</h1>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 prose prose-invert max-w-none">
          <p className="text-slate-300">
            Kompletny bestiariusz potworów i bossów w grze.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}



