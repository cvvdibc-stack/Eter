import Link from 'next/link';
import { Github, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Eter</h3>
            <p className="text-slate-400 text-sm">
              Tekstowe RPG z dynamiczną walką, rozbudowanym systemem przedmiotów i rankingiem graczy.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Prawne</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Polityka Prywatności
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Zasady Gry
                </Link>
              </li>
              <li>
                <Link href="/rodo" className="text-slate-400 hover:text-white text-sm transition-colors">
                  RODO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Społeczność</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/eter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <MessageCircle size={16} />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/eter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/changelog" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@eter.game" className="text-slate-400 hover:text-white text-sm transition-colors">
                  support@eter.game
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Eter. Wszystkie prawa zastrzeżone.
            </p>
            <p className="text-slate-500 text-xs">
              Grafiki mogą być wygenerowane przez AI. Zastrzeżenia prawne.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



