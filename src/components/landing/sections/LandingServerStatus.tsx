import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Server, ArrowRight } from 'lucide-react';

export const LandingServerStatus: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('server_stats')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error loading server stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const uptimePercent = stats?.uptime_seconds ? Math.min(99.99, (stats.uptime_seconds / (30 * 86400)) * 100) : 99.97;

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Server className="text-amber-500" size={32} />
            <h2 className="text-4xl font-bold text-amber-500 uppercase tracking-wider">Status Serwera</h2>
          </div>
          <button
            onClick={() => window.location.hash = 'status'}
            className="flex items-center gap-2 px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider"
          >
            Pełny status serwera
            <ArrowRight size={18} />
          </button>
        </div>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie statusu...</p>
          </div>
        ) : (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider">Status</div>
                  <div className="text-xl font-bold text-green-400">Online</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Gracze</div>
                <div className="text-2xl font-bold text-amber-400">{stats?.players_online || 0}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Średnia 24h</div>
                <div className="text-2xl font-bold text-slate-300">{stats?.players_24h_avg || 0}</div>
              </div>

              <div>
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Uptime</div>
                <div className="text-2xl font-bold text-amber-400">{uptimePercent.toFixed(2)}%</div>
                {stats?.uptime_seconds && (
                  <div className="text-xs text-slate-500 mt-1">
                    {calculateUptime(stats.uptime_seconds)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};



