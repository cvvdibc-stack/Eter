'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle } from 'lucide-react';
import { LoginModal } from './auth/LoginModal';
import { RegisterModal } from './auth/RegisterModal';

export function HeroSection() {
  const [playersOnline, setPlayersOnline] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Load server stats client-side
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
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Ambient effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Logo placeholder */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
              Eter
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-6">
              Wejdź do Eteru. Walcz, handluj, rywalizuj.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-lg transition-colors shadow-lg shadow-purple-500/50"
            >
              Graj za darmo
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-lg transition-colors border border-slate-700"
            >
              Zaloguj się
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg font-semibold text-white">{playersOnline}</span>
              <span>graczy online</span>
            </div>
            <a
              href="https://discord.gg/eter"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <MessageCircle size={20} />
              <span>Dołącz do Discorda</span>
            </a>
          </div>
        </div>
      </section>

    {showLogin && (
      <LoginModal
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
    )}
    {showRegister && (
      <RegisterModal
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    )}
    </>
  );
}

