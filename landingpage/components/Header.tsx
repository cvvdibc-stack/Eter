'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, LogOut, LogIn, UserCircle } from 'lucide-react';
import { LoginModal } from './auth/LoginModal';
import { RegisterModal } from './auth/RegisterModal';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-500">Eter</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/gracze" className="text-slate-300 hover:text-white transition-colors">
                Gracze
              </Link>
              <Link href="/pomoc" className="text-slate-300 hover:text-white transition-colors">
                Pomoc
              </Link>
              <Link href="/forum" className="text-slate-300 hover:text-white transition-colors">
                Forum
              </Link>
              <Link href="/rejestracja" className="text-slate-300 hover:text-white transition-colors">
                Rejestracja
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <UserCircle size={20} />
                    <span className="hidden sm:inline">Profil</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Wyloguj</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <UserCircle size={20} />
                  <span className="hidden sm:inline">Profil</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />}
    </>
  );
}

