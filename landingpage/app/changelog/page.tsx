import { getChangelogVersions, getChangelogEntries } from '@/lib/queries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileText, Tag } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // ISR: revalidate every minute

export default async function ChangelogPage() {
  const versions = await getChangelogVersions(20).catch(() => []);

  const versionsWithEntries = await Promise.all(
    versions.map(async (version) => {
      const entries = await getChangelogEntries(version.id).catch(() => []);
      return { ...version, entries };
    })
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-500/20 text-green-400';
      case 'bugfix':
        return 'bg-red-500/20 text-red-400';
      case 'balancing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'content':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <FileText className="text-blue-500" size={32} />
          Changelog
        </h1>

        <div className="space-y-8">
          {versionsWithEntries.length === 0 ? (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center text-slate-400">
              Brak wpisów changelogu
            </div>
          ) : (
            versionsWithEntries.map((version) => (
              <div key={version.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Wersja {version.version}</h2>
                    <p className="text-slate-400">
                      {new Date(version.release_date).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>

                {version.description && (
                  <p className="text-slate-300 mb-4">{version.description}</p>
                )}

                {version.entries.length > 0 && (
                  <div className="space-y-3">
                    {version.entries.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 p-3 bg-slate-900 rounded border border-slate-700">
                        <span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${getTypeColor(entry.type)}`}>
                          <Tag size={12} />
                          {entry.type}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{entry.title}</h4>
                          {entry.description && (
                            <p className="text-slate-400 text-sm mt-1">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}



