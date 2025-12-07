import React from 'react';

export const LandingIntro: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-amber-500 mb-12 text-center uppercase tracking-wider">
          Czym jest Eter?
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: '⚔️',
              title: 'Dynamiczne walki',
              desc: 'Taktyczne starcia PvE i PvP'
            },
            {
              icon: '🐉',
              title: 'Potężne Bestie',
              desc: 'Dziesiątki bossów i unikalnych mechanik'
            },
            {
              icon: '🗡️',
              title: 'Legendarne przedmioty',
              desc: 'Rzadkie dropy, ulepszenia, enchanty'
            },
            {
              icon: '🎒',
              title: 'Rozwój bohatera',
              desc: 'Klasy, statystyki, drzewka talentów'
            }
          ].map((item, i) => (
            <div key={i} className="bg-[#13161c] border border-white/10 p-6 rounded-lg text-center hover:border-amber-500/30 transition-colors">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-amber-400 mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



