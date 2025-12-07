import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Map, CheckCircle, Circle, Clock } from 'lucide-react';

export const LandingRoadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<{ inProgress: any[], planned: any[], done: any[] }>({
    inProgress: [],
    planned: [],
    done: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const { data, error } = await supabase
          .from('roadmap_items')
          .select('*')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setRoadmap({
            inProgress: data.filter(item => item.status === 'in_progress'),
            planned: data.filter(item => item.status === 'planned'),
            done: data.filter(item => item.status === 'done').slice(0, 5) // Show only 5 recent done items
          });
        }
      } catch (err) {
        console.error('Error loading roadmap:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
    const interval = setInterval(fetchRoadmap, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress': return <Clock className="text-amber-500" size={20} />;
      case 'planned': return <Circle className="text-blue-500" size={20} />;
      case 'done': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Circle className="text-slate-500" size={20} />;
    }
  };

  const renderColumn = (title: string, items: any[], icon: React.ReactNode) => (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="text-2xl font-bold text-amber-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-slate-500 text-sm">Brak elementów</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-[#13161c] border border-white/10 rounded-lg p-4 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-400 mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  )}
                </div>
                {item.priority > 0 && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">
                    🔥
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Map className="text-amber-500" size={32} />
          <h2 className="text-4xl font-bold text-amber-500 uppercase tracking-wider">Roadmap</h2>
        </div>

        {loading ? (
          <div className="bg-[#13161c] border border-white/10 rounded-lg p-8 text-center">
            <p className="text-slate-400">Ładowanie roadmapy...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {renderColumn('W toku', roadmap.inProgress, <Clock className="text-amber-500" size={24} />)}
            {renderColumn('W planach', roadmap.planned, <Circle className="text-blue-500" size={24} />)}
            {renderColumn('Zrobione', roadmap.done, <CheckCircle className="text-green-500" size={24} />)}
          </div>
        )}
      </div>
    </section>
  );
};



