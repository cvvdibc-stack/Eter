import Link from 'next/link';
import { UserPlus, User, Map } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Załóż konto',
    description: 'Zarejestruj się i utwórz swoje konto w grze',
  },
  {
    number: 2,
    icon: User,
    title: 'Stwórz bohatera',
    description: 'Wybierz klasę i stwórz swoją pierwszą postać',
  },
  {
    number: 3,
    icon: Map,
    title: 'Idź na pierwszą wyprawę',
    description: 'Zdobądź ekwipunek i rozpocznij przygodę',
  },
];

export function GettingStarted() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Jak zacząć?</h2>
          <p className="text-lg text-slate-300">Prosta instrukcja w 3 krokach</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="text-purple-500" size={24} />
                      </div>
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>
                  {step.number < steps.length && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-purple-500" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/guide/how-to-start"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Przeczytaj pełny poradnik
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}



