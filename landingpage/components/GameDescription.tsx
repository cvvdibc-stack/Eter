import { Sword, Gem, TrendingUp, Store, Mail, Skull } from 'lucide-react';

const features = [
  { icon: Sword, title: 'Taktyczne walki turowe', description: 'Strategiczne podejście do każdej walki' },
  { icon: Gem, title: 'Unikalne legendy i tytaniczne przedmioty', description: 'Zbieraj potężny ekwipunek' },
  { icon: TrendingUp, title: 'Globalny ranking graczy', description: 'Rywalizuj z najlepszymi' },
  { icon: Store, title: 'Rynek i aukcje między graczami', description: 'Handluj z innymi graczami' },
  { icon: Mail, title: 'Poczta i system handlu', description: 'Wymieniaj się przedmiotami' },
  { icon: Skull, title: 'Dziesiątki potworów i bossów', description: 'Pokonuj wyzwania' },
];

export function GameDescription() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-6">Czym jest Eter?</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Eter to tekstowe RPG z dynamiczną walką, rozbudowanym systemem przedmiotów, handlem między graczami, aukcjami i rankingiem. Rozwijaj postać, zdobywaj legendy i rywalizuj w lochach z innymi graczami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Icon className="text-purple-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



