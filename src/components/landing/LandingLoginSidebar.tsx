import React, { useState, useEffect } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const LandingLoginSidebar: React.FC = () => {
  const { user, signIn } = useGame();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Don't show sidebar if user is logged in
  if (user) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        setEmail('');
        setPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40" style={{ position: 'fixed' }}>
      <div className="bg-[#13161c] border-l border-t border-b border-white/10 rounded-l-lg shadow-xl p-6 w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-amber-500 uppercase tracking-wider">Zaloguj się</h3>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-slate-400 hover:text-amber-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Hasło
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white rounded-lg transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ładowanie...' : 'WEJDŹ DO GRY'}
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
  );
};

