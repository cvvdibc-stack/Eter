import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Zap } from 'lucide-react';

export const LandingLiveFeed: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('live_feed')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          setEvents(data);
        }
      } catch (err) {
        console.error('Error loading live feed:', err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Zap className="text-amber-500" size={32} />
          <h2 className="text-4xl font-bold text-amber-500 uppercase tracking-wider">Live Feed</h2>
        </div>

        <div className="bg-[#13161c] border border-white/10 rounded-lg p-6 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <p>Brak aktywności</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-[#0b0d10] border-l-4 border-amber-500/30 rounded hover:bg-[#161b22] transition-colors"
                >
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 animate-pulse flex-shrink-0"></div>
                  <div className="flex-1">
                    <span className="text-amber-400 font-semibold">{event.character_name}</span>
                    {' '}
                    <span className="text-slate-300">{event.message}</span>
                    {event.item_name && (
                      <span className="text-purple-400 font-semibold ml-1">*{event.item_name}*</span>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(event.created_at).toLocaleTimeString('pl-PL')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};



