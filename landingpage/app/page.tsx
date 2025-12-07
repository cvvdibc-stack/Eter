import { HeroSection } from '@/components/HeroSection';
import { GameDescription } from '@/components/GameDescription';
import { GamePreview } from '@/components/GamePreview';
import { CharacterClasses } from '@/components/CharacterClasses';
import { GettingStarted } from '@/components/GettingStarted';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoginSidebar } from '@/components/auth/LoginSidebar';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="relative">
        <LoginSidebar />
        <HeroSection />
        <GameDescription />
        <GamePreview />
        <CharacterClasses />
        <GettingStarted />
      </main>
      <Footer />
    </div>
  );
}

