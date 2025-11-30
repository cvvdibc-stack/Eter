import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Item } from '../types';
import { RefreshCw, Coins, User, ShoppingBag, Gem } from 'lucide-react';
import { ItemTooltip } from './ItemTooltip';
import { ItemIcon } from './ItemIcon';

export const ShopScreen: React.FC = () => {
    const { character, merchantInventory, refreshMerchant, buyItem, sellItem, payGold } = useGame();
    
    const [merchantTab, setMerchantTab] = useState<0 | 1>(0);
    const [playerTab, setPlayerTab] = useState<0 | 1>(0);
    
    const [hoveredItem, setHoveredItem] = useState<{ item: Item, rect: DOMRect } | null>(null);

    // Initial refresh if empty
    useEffect(() => {
        if (merchantInventory.length === 0) {
            refreshMerchant();
        }
    }, []);

    if (!character) return null;

    const handleRefresh = () => {
        refreshMerchant();
    };

    const renderGrid = (items: Item[], tab: number, onItemClick: (item: Item, index: number) => void, isSelling?: boolean) => {
        const slice = Array.from({ length: 24 }).map((_, i) => {
            const actualIndex = tab * 24 + i;
            return items[actualIndex] || null;
        });

        return (
            <div className="grid grid-cols-6 gap-1.5 content-start">
                {slice.map((item, i) => {
                    const actualIndex = tab * 24 + i;
                    return (
                        <div 
                            key={actualIndex}
                            onClick={() => item && onItemClick(item, actualIndex)}
                            onMouseEnter={(e) => item && setHoveredItem({ item, rect: e.currentTarget.getBoundingClientRect() })}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`w-10 h-10 border-2 rounded flex items-center justify-center relative group cursor-pointer transition-colors
                                ${item 
                                    ? isSelling 
                                        ? 'bg-[#1a1d24] border-slate-700 hover:border-green-500'
                                        : 'bg-[#1a1d24] border-slate-700 hover:border-amber-500' 
                                    : 'bg-[#0b0d10] border-white/5'}`}
                        >
                             {item && (
                                <div className="p-0.5 pointer-events-none">
                                    <ItemIcon item={item} size={32} />
                                </div>
                             )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-6 animate-in fade-in duration-300 items-start">
            {/* NPC Panel (Left) */}
            <div className="hidden md:flex w-72 bg-slate-900 rounded-xl border-2 border-slate-700 relative overflow-hidden shadow-2xl flex-col shrink-0">
                <div className="h-[350px] w-full bg-black/40 relative flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                        src="/avatars/handlarz.png" 
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Handlarz'}
                        alt="Handlarz" 
                        className="h-full w-full object-cover object-top opacity-90"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent h-16"></div>
                </div>
                
                <div className="p-4 flex flex-col items-center text-center bg-slate-900">
                    <h2 className="text-2xl font-serif text-amber-500 font-bold leading-none">Handlarz</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Rzadkie towary</p>
                    
                    <div className="mt-4 p-3 bg-black/30 rounded border border-white/5 w-full">
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                            „Witaj podróżniku. Szukasz czegoś wartościowego? Moje towary są najlepsze w krainie.”
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content (Right) */}
            <div className="flex-1 flex flex-col gap-4 h-full min-h-0">
                
                {/* Header */}
                <div className="bg-[#1a1d24] border-2 border-amber-900/50 p-4 rounded-lg shadow-inner flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-amber-100 font-bold text-lg">Sklep</h3>
                        <p className="text-slate-400 text-sm">Kliknij przedmiot, aby kupić lub sprzedać.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/30 px-4 py-2 rounded-full border border-white/5">
                        <span className="text-amber-500 font-mono font-bold flex items-center gap-2">
                            <Coins size={16} /> {character.gold}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-red-400 font-mono font-bold flex items-center gap-2">
                            <Gem size={16} /> {character.premiumCurrency}
                        </span>
                    </div>
                </div>

                {/* Shop Columns */}
                <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 items-start">
                    
                    {/* Merchant Column - FIXED HEIGHT */}
                    <div className="bg-[#161b22] border border-white/10 rounded-xl p-4 flex flex-col relative h-[380px]">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 shrink-0">
                            <h4 className="font-bold text-slate-200 flex items-center gap-2">
                                <ShoppingBag size={18} className="text-amber-500"/> Oferta
                            </h4>
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-1 mr-2">
                                    <button onClick={() => setMerchantTab(0)} className={`text-[9px] px-1.5 py-0.5 rounded border ${merchantTab === 0 ? 'border-amber-500 text-amber-200' : 'border-slate-700 text-slate-500'}`}>I</button>
                                    <button onClick={() => setMerchantTab(1)} className={`text-[9px] px-1.5 py-0.5 rounded border ${merchantTab === 1 ? 'border-amber-500 text-amber-200' : 'border-slate-700 text-slate-500'}`}>II</button>
                                </div>
                                <button 
                                    onClick={handleRefresh}
                                    className="text-[10px] bg-red-900/30 hover:bg-red-900/50 text-red-400 px-2 py-1 rounded border border-red-900/50 flex items-center gap-1 transition-colors"
                                >
                                    <RefreshCw size={10} /> Odśwież (15 💎)
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                            {renderGrid(merchantInventory, merchantTab, (item, idx) => buyItem(item, idx), false)}
                        </div>
                    </div>

                    {/* Player Column - FIXED HEIGHT */}
                    <div className="bg-[#161b22] border border-white/10 rounded-xl p-4 flex flex-col relative h-[380px]">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 shrink-0">
                            <h4 className="font-bold text-slate-200 flex items-center gap-2">
                                <User size={18} className="text-green-500"/> Twój Plecak ({character.inventory.length}/48)
                            </h4>
                            <div className="flex gap-1">
                                <button onClick={() => setPlayerTab(0)} className={`text-[9px] px-1.5 py-0.5 rounded border ${playerTab === 0 ? 'border-green-500 text-green-200' : 'border-slate-700 text-slate-500'}`}>I</button>
                                <button onClick={() => setPlayerTab(1)} className={`text-[9px] px-1.5 py-0.5 rounded border ${playerTab === 1 ? 'border-green-500 text-green-200' : 'border-slate-700 text-slate-500'}`}>II</button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                            {renderGrid(character.inventory, playerTab, (item, idx) => sellItem(idx), true)}
                        </div>
                    </div>

                </div>
            </div>

            {/* Tooltip Layer */}
            {hoveredItem && (
                <ItemTooltip 
                    item={hoveredItem.item} 
                    playerLevel={character.level} 
                    rect={hoveredItem.rect} 
                />
            )}
        </div>
    );
};
