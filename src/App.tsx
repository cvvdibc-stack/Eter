import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { CharacterCreation } from './components/CharacterCreation';
import { InventoryScreen } from './components/InventoryScreen';
import { CombatScreen } from './components/CombatScreen';
import { ExpeditionScreen } from './components/ExpeditionScreen';
import { BestiaryScreen } from './components/BestiaryScreen';
import { DungeonScreen } from './components/DungeonScreen';
import { TalismansScreen } from './components/TalismansScreen';
import { CombatHistoryScreen } from './components/CombatHistoryScreen';
import { ShopScreen } from './components/ShopScreen'; 
import { DoctorScreen } from './components/DoctorScreen'; 
import { AuctionHouseScreen } from './components/AuctionHouseScreen';
import { GameLayout } from './components/layout/GameLayout';
import { AuthScreen } from './components/AuthScreen';
import { CharacterSelection } from './components/CharacterSelection';
import { RankingScreen } from './components/RankingScreen';
import { TrainerScreen } from './components/TrainerScreen';
import { StashScreen } from './components/StashScreen';

const GameContent: React.FC = () => {
  const { view, user } = useGame();

  // 1. Auth Flow
  if (!user && view === 'AUTH') {
    return <AuthScreen />;
  }

  // 2. Character Selection Flow
  if (view === 'CHAR_SELECT') {
    return <CharacterSelection />;
  }

  // 3. Creation Flow
  if (view === 'CHARACTER_CREATION') {
    return <CharacterCreation />;
  }

  // 4. Main Game Loop
  return (
    <GameLayout>
      {(() => {
        switch (view) {
          case 'HUB':
            return <InventoryScreen />; // HUB is now Inventory/Overview
          case 'INVENTORY':
            return <InventoryScreen />;
          case 'EXPEDITION':
            return <ExpeditionScreen />;
          case 'COMBAT':
             return <CombatScreen />;
          case 'DUNGEON':
             return <DungeonScreen />;
          case 'ARENA':
             return <div className="p-10 text-white bg-black/50 rounded border border-amber-900/50 text-center">
                <h2 className="text-3xl font-bold text-amber-600 mb-4 font-serif">Arena Gladiatorów</h2>
                <p className="text-slate-400">Walcz z innymi graczami o chwałę. (PvP wkrótce)</p>
             </div>;
          case 'SHOP':
            return <ShopScreen />;
          case 'DOCTOR':
            return <DoctorScreen />;
          case 'MARKET':
            return <AuctionHouseScreen />;
           case 'PREMIUM':
            return <div className="p-10 text-white bg-slate-800/50 rounded border border-slate-700">
                <h2 className="text-2xl font-bold text-purple-500 mb-4">Sklep Premium</h2>
                <p>Wspomóż twórców (i siebie).</p>
            </div>;
           case 'BESTIARY':
              return <BestiaryScreen />;
           case 'TALISMANS':
              return <TalismansScreen />;
           case 'HISTORY':
              return <CombatHistoryScreen />;
           case 'RANKING':
              return <RankingScreen />;
           case 'TRAINER':
              return <TrainerScreen />;
           case 'STASH':
              return <StashScreen />;
          default:
            return <InventoryScreen />;
        }
      })()}
    </GameLayout>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
