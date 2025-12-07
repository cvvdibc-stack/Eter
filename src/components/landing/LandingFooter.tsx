import React from 'react';
import { MessageCircle, Github, Mail, BookOpen, FileText, Map, Users, Shield } from 'lucide-react';

interface LandingFooterProps {
  navigate: (route: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ navigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080a0c] border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Informacje */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} />
              Informacje
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  O grze
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('pomoc')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Poradniki
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Wiki
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('roadmap')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Roadmapa
                </button>
              </li>
            </ul>
          </div>

          {/* Społeczność */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} />
              Społeczność
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('forum')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Forum
                </button>
              </li>
              <li>
                <a
                  href="https://discord.gg/eter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition-colors"
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
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Prawo */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} />
              Prawo
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('terms')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Regulamin
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Polityka Prywatności
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('rules')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Zasady Gry
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('rodo')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  RODO
                </button>
              </li>
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} />
              Developer
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/eter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('api')}
                  className="text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  API Docs
                </button>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@eter.game"
                  className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition-colors"
                >
                  <Mail size={16} />
                  support@eter.game
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} CIENIE ETERU. Wszystkie prawa zastrzeżone.
            </p>
            <p className="text-slate-500 text-xs">
              Grafiki mogą być wygenerowane przez AI. Zastrzeżenia prawne.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

