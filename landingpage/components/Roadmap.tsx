import { getRoadmapItems } from '@/lib/queries';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function Roadmap() {
  const items = await getRoadmapItems().catch(() => []);

  const inProgress = items.filter((item) => item.status === 'in_progress');
  const planned = items.filter((item) => item.status === 'planned');
  const done = items.filter((item) => item.status === 'done');

  const columns = [
    { title: 'W toku', items: inProgress, icon: Clock, color: 'text-yellow-500' },
    { title: 'W planach', items: planned, icon: Circle, color: 'text-blue-500' },
    { title: 'Zrobione', items: done, icon: CheckCircle2, color: 'text-green-500' },
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Roadmap / Postęp prac</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const Icon = column.icon;
            return (
              <div key={column.title} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className={column.color} size={24} />
                  <h3 className="text-xl font-semibold text-white">{column.title}</h3>
                  <span className="ml-auto px-2 py-1 bg-slate-700 text-slate-300 text-sm rounded">
                    {column.items.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {column.items.length === 0 ? (
                    <p className="text-slate-500 text-sm">Brak elementów</p>
                  ) : (
                    column.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-900 rounded border border-slate-700 hover:border-purple-500 transition-colors"
                      >
                        <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                        {item.description && (
                          <p className="text-slate-400 text-sm">{item.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



