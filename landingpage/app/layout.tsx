import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eter - Tekstowe RPG',
  description: 'Wejdź do Eteru. Walcz, handluj, rywalizuj. Tekstowe RPG z dynamiczną walką, rozbudowanym systemem przedmiotów i rankingiem graczy.',
  keywords: 'RPG, gra przeglądarkowa, tekstowe RPG, Eter, gra online',
  authors: [{ name: 'Eter Team' }],
  openGraph: {
    title: 'Eter - Tekstowe RPG',
    description: 'Wejdź do Eteru. Walcz, handluj, rywalizuj.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}



