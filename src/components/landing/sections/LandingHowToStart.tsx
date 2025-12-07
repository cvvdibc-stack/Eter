import React from 'react';
import { ArrowRight } from 'lucide-react';

export const LandingHowToStart: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-[#0b0d10]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-amber-500 mb-12 text-center uppercase tracking-wider">
          Jak zacząć
        </h2>
        <div className="space-y-6 mb-8">
          {[
            { step: '1️⃣', title: 'Załóż darmowe konto', desc: 'Rejestracja zajmuje tylko chwilę' },
            { step: '2️⃣', title: 'Stwórz pierwszą postać', desc: 'Wybierz klasę i rozpocznij przygodę' },
            { step: '3️⃣', title: 'Wyrusz w przygodę', desc: 'Eksploruj świat, walcz z potworami' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#13161c] border border-white/10 rounded-lg p-6 flex items-center gap-6 hover:border-amber-500/30 transition-colors"
            >
              <div className="text-4xl">{item.step}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-amber-400 mb-1">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => window.location.hash = 'pomoc'}
            className="px-6 py-3 bg-[#13161c] hover:bg-[#161b22] border border-white/10 text-slate-300 rounded-lg font-semibold transition-colors uppercase tracking-wider flex items-center gap-2 mx-auto"
          >
            Przeczytaj poradnik Jak Zacząć
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};



