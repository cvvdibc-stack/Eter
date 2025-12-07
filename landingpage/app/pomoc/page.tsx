import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { BookOpen, MessageCircle, FileText, HelpCircle } from 'lucide-react';

export default function PomocPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Pomoc</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link
              href="/guide/how-to-start"
              className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition-colors"
            >
              <BookOpen className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Jak zacząć</h3>
              <p className="text-slate-400 text-sm">
                Przewodnik dla nowych graczy
              </p>
            </Link>
            
            <Link
              href="/guide/classes"
              className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition-colors"
            >
              <HelpCircle className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Klasy postaci</h3>
              <p className="text-slate-400 text-sm">
                Poznaj dostępne klasy
              </p>
            </Link>
            
            <Link
              href="/forum"
              className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition-colors"
            >
              <MessageCircle className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Forum</h3>
              <p className="text-slate-400 text-sm">
                Zadaj pytanie społeczności
              </p>
            </Link>
            
            <Link
              href="/guide"
              className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition-colors"
            >
              <FileText className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Wszystkie poradniki</h3>
              <p className="text-slate-400 text-sm">
                Kompletna lista poradników
              </p>
            </Link>
          </div>

          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Często zadawane pytania</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Jak utworzyć konto?</h3>
                <p className="text-slate-400">
                  Kliknij "Rejestracja" w menu nawigacyjnym lub użyj formularza rejestracji na stronie głównej.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Jak utworzyć postać?</h3>
                <p className="text-slate-400">
                  Po zalogowaniu przejdź do profilu i kliknij "Utwórz nową postać". Wybierz imię i klasę.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Jak zacząć grać?</h3>
                <p className="text-slate-400">
                  Sprawdź nasz przewodnik "Jak zacząć" w sekcji Pomoc lub przejdź do <Link href="/guide/how-to-start" className="text-purple-400 hover:text-purple-300 underline">poradnika</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



