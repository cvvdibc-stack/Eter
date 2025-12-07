import Link from 'next/link';
import { Sword, Skull, Zap, Heart, ArrowRight } from 'lucide-react';

const classes = [
  {
    id: 'warrior',
    name: 'Wojownik',
    icon: Sword,
    description: 'Tank, blok, siła, pancerz. Wytrzymały wojownik walczący w pierwszej linii.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
  },
  {
    id: 'assassin',
    name: 'Zabójca',
    icon: Skull,
    description: 'Uniki, szybkość ataku, krytyki. Szybki zabójca polegający na unikach i ciosach krytycznych.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
  },
  {
    id: 'mage',
    name: 'Mag',
    icon: Zap,
    description: 'Burst magiczny, odporność magiczna, burn. Potężny mag rażący wrogów zaklęciami z dystansu.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
  },
  {
    id: 'cleric',
    name: 'Kleryk',
    icon: Heart,
    description: 'Leczenie, aury, sustain. Święty wojownik leczący się podczas walki.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
  },
];

export function CharacterClasses() {
  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Klasy Postaci</h2>
          <p className="text-lg text-slate-300">Wybierz swoją klasę i rozpocznij przygodę</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {classes.map((classItem) => {
            const Icon = classItem.icon;
            return (
              <div
                key={classItem.id}
                className="p-6 bg-slate-900 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className={`w-16 h-16 ${classItem.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={classItem.color} size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{classItem.name}</h3>
                <p className="text-slate-400 text-sm">{classItem.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/guide/classes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Stwórz swoją klasę teraz
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}



