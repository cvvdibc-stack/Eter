import React from 'react';
import { Image } from 'lucide-react';

export const LandingPreview: React.FC = () => {
  const screenshots = [
    { title: 'Walka', desc: 'Dynamiczne pojedynki' },
    { title: 'Ekwipunek', desc: 'Zarządzaj przedmiotami' },
    { title: 'Bestiariusz', desc: 'Poznaj potwory' },
    { title: 'Poczta', desc: 'Komunikacja z graczami' },
    { title: 'Dropy Legend', desc: 'Rzadkie przedmioty' },
    { title: 'Ranking', desc: 'Rywalizuj z innymi' },
  ];

  return (
    <section className="py-20 px-4 bg-[#0b0d10]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-amber-500 mb-8 text-center uppercase tracking-wider">
          Preview Gry
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {screenshots.map((item, i) => (
            <div
              key={i}
              className="bg-[#13161c] border border-white/10 rounded-lg p-8 aspect-video flex items-center justify-center hover:border-amber-500/30 transition-colors cursor-pointer group"
            >
              <div className="text-center">
                <Image className="text-slate-600 group-hover:text-amber-500 transition-colors mx-auto mb-2" size={48} />
                <h3 className="text-lg font-semibold text-amber-400 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => window.location.hash = 'home'}
            className="px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider"
          >
            Zobacz cały świat gry
          </button>
        </div>
      </div>
    </section>
  );
};



