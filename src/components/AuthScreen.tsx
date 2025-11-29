import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sword, Shield, Scroll } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, isLoading } = useGame();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password);
      if (error) setError("Rejestracja udana! Sprawdź email (lub zaloguj się w trybie demo).");
      else if (!error) { // Auto login after signup usually requires email confirm, but we can inform user
         setError("Konto utworzone! Zaloguj się.");
         setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      <div className="max-w-md w-full bg-[#101010] border border-slate-800 p-8 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
               <Sword className="text-amber-600 w-12 h-12 absolute -left-4 top-0 animate-pulse" />
               <Shield className="text-slate-700 w-12 h-12 relative z-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-widest font-serif">CIENIE ETERU</h1>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest">Mroczne RPG Przeglądarkowe</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs uppercase font-bold mb-2">Email</label>
            <input 
              type="text" // type text for demo 'demo' username support, otherwise email
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-slate-700 p-3 text-slate-200 focus:border-amber-600 outline-none rounded transition-colors"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs uppercase font-bold mb-2">Hasło</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-slate-700 p-3 text-slate-200 focus:border-amber-600 outline-none rounded transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold py-3 rounded shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ładowanie...' : (isLogin ? 'WEJDŹ DO GRY' : 'STWÓRZ KONTO')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-slate-500 hover:text-amber-500 text-sm transition-colors"
          >
            {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
          </button>
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-600">Demo Login: <span className="text-slate-400 font-mono">demo</span> / <span className="text-slate-400 font-mono">demo</span></p>
        </div>
      </div>
    </div>
  );
};

