import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Item } from '../types';
import { ItemTooltip } from './ItemTooltip';
import { ItemIcon } from './ItemIcon';
import { Package, ArrowLeftRight } from 'lucide-react';

export const StashScreen: React.FC = () => {
  const { character, accountStash, moveToStash, moveFromStash, moveStashItem, moveItem, showToast } = useGame();
  const [hoveredItem, setHoveredItem] = useState<{ item: Item, rect: DOMRect, source: 'stash' | 'inventory' } | null>(null);
  const [activeStashTab, setActiveStashTab] = useState<0 | 1 | 2 | 3>(0);
  const [activeInventoryTab, setActiveInventoryTab] = useState<0 | 1>(0);

  // Drag & Drop handlers for stash
  const handleStashDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('stash', index.toString());
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleStashDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleStashDrop = (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromStashStr = e.dataTransfer.getData('stash');
      const fromInventoryStr = e.dataTransfer.getData('inventory');

      if (fromStashStr) {
          // Moving within stash
          const fromIndex = parseInt(fromStashStr, 10);
          if (!isNaN(fromIndex)) {
              moveStashItem(fromIndex, toIndex);
          }
      } else if (fromInventoryStr) {
          // Moving from inventory to stash
          const fromIndex = parseInt(fromInventoryStr, 10);
          if (!isNaN(fromIndex)) {
              if (!character?.inventory[fromIndex]) return;

              // Check if target slot is empty
              if (accountStash[toIndex] !== null) {
                  showToast('Ten slot magazynu jest zajęty!', 'error');
                  return;
              }

              moveToStash(fromIndex);
          }
      }
  };

  // Drag & Drop handlers for inventory
  const handleInventoryDragStart = (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('inventory', index.toString());
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleInventoryDrop = (e: React.DragEvent, toIndex: number) => {
      e.preventDefault();
      const fromInventoryStr = e.dataTransfer.getData('inventory');
      const fromStashStr = e.dataTransfer.getData('stash');

      if (fromInventoryStr) {
          // Moving within inventory
          const fromIndex = parseInt(fromInventoryStr, 10);
          if (!isNaN(fromIndex)) {
              moveItem(fromIndex, toIndex);
          }
      } else if (fromStashStr) {
          // Moving from stash to inventory
          const fromIndex = parseInt(fromStashStr, 10);
          if (!isNaN(fromIndex)) {
              if (!accountStash[fromIndex]) return;

              // Check if target slot is empty
              if (character?.inventory[toIndex] !== null) {
                  showToast('Ten slot plecaka jest zajęty!', 'error');
                  return;
              }

              moveFromStash(fromIndex);
          }
      }
  };

  if (!character) return null;

  // Split stash into 4 pages (24 slots each)
  const stashSlice = accountStash.slice(activeStashTab * 24, (activeStashTab + 1) * 24);

  // Split inventory into 2 pages (24 slots each)
  const inventorySlice = character.inventory.slice(activeInventoryTab * 24, (activeInventoryTab + 1) * 24);

  const stashItemCount = accountStash.filter(item => item !== null).length;
  const inventoryItemCount = character.inventory.filter(item => item !== null).length;

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a0d12] to-[#14181f] p-6 flex flex-col lg:flex-row gap-6">
      {/* LEFT PANEL: Account Stash */}
      <div className="flex-1 bg-[#161b22] border-2 border-amber-900/30 rounded-xl p-4 shadow-2xl flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-amber-900/20">
          <Package className="text-amber-500" size={24} />
          <div>
            <h2 className="text-xl font-bold text-amber-500 font-serif">Magazyn Konta</h2>
            <p className="text-xs text-slate-400">Dostępny dla wszystkich postaci ({stashItemCount}/96)</p>
          </div>
        </div>

        {/* Stash Tabs */}
        <div className="flex gap-2 mb-3">
          {[0, 1, 2, 3].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveStashTab(tab as 0 | 1 | 2 | 3)}
              className={`flex-1 text-xs px-3 py-2 rounded border font-bold transition-all ${
                activeStashTab === tab
                  ? 'bg-amber-900/50 border-amber-500 text-amber-200 shadow-lg'
                  : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Zakładka {tab + 1}
            </button>
          ))}
        </div>

        {/* Stash Grid */}
        <div className="flex-1 bg-[#0f1115] border-2 border-amber-900/20 p-3 rounded-lg overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {stashSlice.map((item, i) => {
              const actualIndex = activeStashTab * 24 + i;

              return (
                <div
                  key={actualIndex}
                  onClick={() => {
                    if (!item) return;
                    moveFromStash(actualIndex);
                  }}
                  onMouseEnter={(e) => item && setHoveredItem({
                    item,
                    rect: e.currentTarget.getBoundingClientRect(),
                    source: 'stash'
                  })}
                  onMouseLeave={() => setHoveredItem(null)}
                  draggable={!!item}
                  onDragStart={(e) => item && handleStashDragStart(e, actualIndex)}
                  onDragOver={handleStashDragOver}
                  onDrop={(e) => handleStashDrop(e, actualIndex)}
                  className={`w-16 h-16 border-2 rounded flex items-center justify-center relative group cursor-pointer transition-all
                    ${item
                      ? 'bg-[#1a1d24] border-amber-700/50 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20'
                      : 'bg-[#0b0d10] border-amber-900/10 hover:border-amber-900/30'
                    }`}
                >
                  {item && (
                    <div className="p-0.5 pointer-events-none">
                      <ItemIcon item={item} size={56} />
                    </div>
                  )}
                  {!item && (
                    <div className="text-amber-900/20 text-2xl pointer-events-none">
                      <Package size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 text-center border-t border-white/5 pt-2">
          Przeciągnij przedmiot z plecaka, aby dodać do magazynu
        </div>
      </div>

      {/* CENTER: Transfer Icon */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="bg-amber-900/20 border-2 border-amber-500/30 rounded-full p-4">
          <ArrowLeftRight className="text-amber-500" size={32} />
        </div>
      </div>

      {/* RIGHT PANEL: Character Inventory */}
      <div className="w-full lg:w-[400px] bg-[#161b22] border-2 border-white/10 rounded-xl p-4 shadow-lg flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md">
            {character.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white">{character.name}</h3>
            <p className="text-xs text-slate-400">{character.profession} • Lvl {character.level}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-xs text-slate-500 uppercase font-bold">
            Plecak ({inventoryItemCount}/48)
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveInventoryTab(0)}
              className={`text-[10px] px-2 py-1 rounded border ${
                activeInventoryTab === 0
                  ? 'bg-blue-900/50 border-blue-500 text-blue-200'
                  : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
              }`}
            >
              I
            </button>
            <button
              onClick={() => setActiveInventoryTab(1)}
              className={`text-[10px] px-2 py-1 rounded border ${
                activeInventoryTab === 1
                  ? 'bg-blue-900/50 border-blue-500 text-blue-200'
                  : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
              }`}
            >
              II
            </button>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="flex-1 bg-[#0f1115] border border-[#2a2e38] p-2 rounded overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {inventorySlice.map((item, i) => {
              const actualIndex = activeInventoryTab * 24 + i;

              return (
                <div
                  key={actualIndex}
                  onClick={() => {
                    if (!item) return;
                    moveToStash(actualIndex);
                  }}
                  onMouseEnter={(e) => item && setHoveredItem({
                    item,
                    rect: e.currentTarget.getBoundingClientRect(),
                    source: 'inventory'
                  })}
                  onMouseLeave={() => setHoveredItem(null)}
                  draggable={!!item}
                  onDragStart={(e) => item && handleInventoryDragStart(e, actualIndex)}
                  onDragOver={handleStashDragOver}
                  onDrop={(e) => handleInventoryDrop(e, actualIndex)}
                  className={`w-14 h-14 border-2 rounded flex items-center justify-center relative group cursor-pointer transition-all
                    ${item
                      ? 'bg-[#1a1d24] border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20'
                      : 'bg-[#0b0d10] border-white/5'
                    }`}
                >
                  {item && (
                    <div className="p-0.5 pointer-events-none">
                      <ItemIcon item={item} size={46} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 text-center border-t border-white/5 pt-2">
          Kliknij przedmiot, aby przenieść do magazynu
        </div>
      </div>

      {/* Tooltip Layer */}
      {hoveredItem && (
        <ItemTooltip
          item={hoveredItem.item}
          playerLevel={character.level}
          playerClass={character.profession}
          rect={hoveredItem.rect}
        />
      )}
    </div>
  );
};
