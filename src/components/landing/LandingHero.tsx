import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageCircle, Sword, Shield, Mail, Lock } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const LandingHero: React.FC = () => {
  const { signIn, user } = useGame();
  const [playersOnline, setPlayersOnline] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data, error } = await supabase
          .from('server_stats')
          .select('players_online')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setPlayersOnline(data.players_online || 0);
        }
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);


  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginLoading(true);

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        setLoginError(error.message);
      } else {
        setLoginEmail('');
        setLoginPassword('');
      }
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Fixed Login Window - always visible on hero section */}
      {!user && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50">
          <div className="bg-[#13161c] border border-white/10 rounded-lg shadow-xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-500 uppercase tracking-wider">Zaloguj się</h3>
            </div>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="hero-email" className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    id="hero-email"
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="hero-password" className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Hasło
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    id="hero-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-600 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoginLoading ? 'Ładowanie...' : 'WEJDŹ DO GRY'}
              </button>
              
              <p className="text-xs text-slate-500 text-center">
                Nie masz konta?{' '}
                <button
                  type="button"
                  onClick={() => window.location.hash = 'rejestracja'}
                  className="text-amber-500 hover:text-amber-400 underline uppercase font-bold"
                >
                  Zarejestruj się
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sword className="text-amber-600 w-16 h-16 absolute -left-6 top-0 animate-pulse" />
              <Shield className="text-slate-700 w-16 h-16 relative z-10" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-amber-600 tracking-widest font-serif mb-4">
            CIENIE ETERU
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-4 uppercase tracking-widest">
            Wejdź do świata Eter – powstań, walcz, zdobywaj legendy.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xl font-bold text-amber-400">{playersOnline}</span>
            <span className="text-lg">graczy online</span>
          </div>
          <a
            href="https://discord.gg/eter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-amber-500 transition-colors"
          >
            <MessageCircle size={20} />
            <span>Dołącz do Discorda</span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.hash = 'rejestracja'}
              className="px-10 py-5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg font-bold text-xl transition-all uppercase tracking-wider shadow-lg transform hover:scale-105"
            >
              Graj za darmo
            </button>
            <button
              onClick={() => window.location.hash = 'rejestracja'}
              className="px-10 py-5 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold text-xl transition-colors uppercase tracking-wider"
            >
              Zarejestruj konto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

