import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Item, MarketListing } from '../types';
import { Coins, RefreshCw, Plus, Tag, ArrowUpDown, User, ShoppingCart, Trash2 } from 'lucide-react';
import { ItemTooltip } from './ItemTooltip';
import { ItemIcon } from './ItemIcon';

export const AuctionHouseScreen: React.FC = () => {
    const { character, user, view, fetchMarketListings, createMarketListing, buyMarketListing, cancelMarketListing, marketListings, payGold, addLog } = useGame();
    
    const [activeTab, setActiveTab] = useState<'MARKET' | 'MY_OFFERS'>('MARKET');
    const [hoveredItem, setHoveredItem] = useState<{ item: Item, rect: DOMRect } | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    
    // Listing Form
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [priceInput, setPriceInput] = useState<string>('');

    // Filters
    const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'date_desc'>('date_desc');
    const [rarityFilter, setRarityFilter] = useState<string>('all');

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        setRefreshing(true);
        await fetchMarketListings();
        setRefreshing(false);
    };

    if (!character || !user) return null;

    const handleSell = async () => {
        if (selectedItemIndex === null || !priceInput) return;
        const price = parseInt(priceInput);
        if (isNaN(price) || price <= 0) {
            addLog("Nieprawidłowa cena.");
            return;
        }
        
        const item = character.inventory[selectedItemIndex];
        if (!item) {
            addLog("Wybrano pusty slot ekwipunku.");
            return;
        }
        
        // Fee calculation (5%)
        const fee = Math.ceil(price * 0.05);
        if (character.gold < fee) {
            addLog(`Nie masz wystarczająco złota na opłatę (Wymagane: ${fee}g)`);
            return;
        }

        const success = await createMarketListing(item, price, selectedItemIndex);
        if (success) {
            setSelectedItemIndex(null);
            setPriceInput('');
            setActiveTab('MY_OFFERS');
        }
    };

    const filteredListings = marketListings.filter(l => {
        // Filter out listings with null items
        if (!l.item) return false;
        if (activeTab === 'MY_OFFERS') return l.seller_id === user.id;
        if (activeTab === 'MARKET') return l.seller_id !== user.id; // Don't show my own in global market? Or show but highlight. Usually separating is clearer.
        return true;
    }).filter(l => {
        if (rarityFilter === 'all') return true;
        return l.item?.rarity === rarityFilter;
    }).sort((a, b) => {
        if (sort === 'price_asc') return a.price - b.price;
        if (sort === 'price_desc') return b.price - a.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <div className="max-w-7xl mx-auto p-4 h-[calc(100vh-80px)] flex gap-6 animate-in fade-in duration-300 items-start">
            
            {/* NPC Panel (Left) */}
            <div className="w-72 bg-slate-900 rounded-xl border-2 border-slate-700 relative overflow-hidden shadow-2xl flex flex-col shrink-0">
                <div className="h-[300px] w-full bg-black/40 relative flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                        src="/avatars/aukcjoner.png" 
                        onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Aukcjoner'}
                        alt="Aukcjoner" 
                        className="h-full w-full object-cover object-top opacity-90"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent h-16"></div>
                </div>
                
                <div className="p-4 flex flex-col items-center text-center bg-slate-900 flex-1">
                    <h2 className="text-2xl font-serif text-purple-400 font-bold leading-none">Aukcjoner</h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Rynek Graczy</p>
                    
                    <div className="mt-4 p-3 bg-black/30 rounded border border-white/5 w-full text-sm text-slate-300 italic leading-relaxed">
                        „Tutaj złoto zmienia właściciela szybciej niż w karczmie. Pamiętaj o mojej prowizji... 5%.”
                    </div>

                    <div className="mt-auto w-full pt-4">
                        <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-bold mb-1">
                            <span>Twoje Złoto</span>
                        </div>
                        <div className="bg-black/50 p-2 rounded border border-amber-900/30 flex items-center justify-center gap-2 text-amber-500 font-mono font-bold text-lg">
                            <Coins size={18} /> {character.gold}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content (Right) */}
            <div className="flex-1 flex flex-col gap-4 h-full min-h-0 bg-[#161b22] rounded-xl border border-white/10 p-6 relative">
                
                {/* Tabs & Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('MARKET')}
                            className={`px-4 py-2 rounded font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all
                                ${activeTab === 'MARKET' ? 'bg-purple-900/50 text-purple-300 border border-purple-500/50' : 'hover:bg-white/5 text-slate-500'}`}
                        >
                            <ShoppingCart size={16} /> Oferty
                        </button>
                        <button 
                            onClick={() => setActiveTab('MY_OFFERS')}
                            className={`px-4 py-2 rounded font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all
                                ${activeTab === 'MY_OFFERS' ? 'bg-blue-900/50 text-blue-300 border border-blue-500/50' : 'hover:bg-white/5 text-slate-500'}`}
                        >
                            <Tag size={16} /> Wystaw / Twoje
                        </button>
                    </div>

                    <button 
                        onClick={loadListings} 
                        disabled={refreshing}
                        className="p-2 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                        <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* MARKET VIEW */}
                {activeTab === 'MARKET' && (
                    <div className="flex flex-col h-full min-h-0">
                        {/* Filters */}
                        <div className="flex gap-4 py-4">
                            <select 
                                value={rarityFilter} 
                                onChange={(e) => setRarityFilter(e.target.value)}
                                className="bg-[#0b0d10] border border-white/10 rounded px-3 py-1 text-sm text-slate-300 focus:outline-none focus:border-purple-500"
                            >
                                <option value="all">Wszystkie rzadkości</option>
                                <option value="common">Pospolite</option>
                                <option value="unique">Unikaty</option>
                                <option value="heroic">Heroiczne</option>
                                <option value="legendary">Legendarne</option>
                            </select>

                            <select 
                                value={sort} 
                                onChange={(e) => setSort(e.target.value as any)}
                                className="bg-[#0b0d10] border border-white/10 rounded px-3 py-1 text-sm text-slate-300 focus:outline-none focus:border-purple-500"
                            >
                                <option value="date_desc">Najnowsze</option>
                                <option value="price_asc">Cena: Rosnąco</option>
                                <option value="price_desc">Cena: Malejąco</option>
                            </select>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto min-h-0 pr-2 custom-scrollbar">
                            {filteredListings.length === 0 ? (
                                <div className="text-center py-20 text-slate-600 italic">Brak ofert spełniających kryteria.</div>
                            ) : (
                                <div className="grid grid-cols-4 gap-3">
                                    {filteredListings.map(listing => {
                                        if (!listing.item) return null;
                                        return (
                                        <div key={listing.id} className="bg-[#0b0d10] border border-white/5 rounded p-3 flex flex-col gap-2 hover:border-white/20 transition-colors group relative">
                                            <div 
                                                className="flex justify-center py-2 bg-[#13161c] rounded cursor-help"
                                                onMouseEnter={(e) => setHoveredItem({ item: listing.item, rect: e.currentTarget.getBoundingClientRect() })}
                                                onMouseLeave={() => setHoveredItem(null)}
                                            >
                                                <ItemIcon item={listing.item} size={48} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-300 truncate">{listing.item.name}</div>
                                                <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                                                    <span>Lvl {listing.item.levelReq}</span>
                                                    <span className="text-slate-400">{listing.seller_name}</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center">
                                                <div className="text-amber-500 font-mono font-bold text-sm flex items-center gap-1">
                                                    <Coins size={12} /> {listing.price}
                                                </div>
                                                <button 
                                                    onClick={() => buyMarketListing(listing)}
                                                    className="bg-green-900/30 hover:bg-green-800/50 text-green-400 border border-green-800/50 rounded px-2 py-1 text-xs font-bold uppercase transition-colors"
                                                >
                                                    Kup
                                                </button>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MY OFFERS / SELL VIEW */}
                {activeTab === 'MY_OFFERS' && (
                    <div className="flex gap-6 h-full min-h-0">
                        {/* Sell Form */}
                        <div className="w-1/3 border-r border-white/5 pr-6 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                                <Plus size={18} className="text-purple-500"/> Wystaw przedmiot
                            </h3>
                            
                            <div className="flex-1 bg-[#0b0d10] rounded border border-white/5 p-4 flex flex-col items-center justify-center mb-4 relative">
                                {selectedItemIndex !== null && character.inventory[selectedItemIndex] ? (
                                    <>
                                        <ItemIcon item={character.inventory[selectedItemIndex]} size={64} />
                                        <div className="mt-2 font-bold text-slate-200 text-center">{character.inventory[selectedItemIndex]!.name}</div>
                                        <button 
                                            onClick={() => setSelectedItemIndex(null)}
                                            className="absolute top-2 right-2 text-slate-500 hover:text-white"
                                        >
                                            X
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-slate-600 text-sm text-center">
                                        Wybierz przedmiot z plecaka po prawej
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cena (Złoto)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={priceInput}
                                            onChange={(e) => setPriceInput(e.target.value)}
                                            className="w-full bg-[#0b0d10] border border-white/10 rounded py-2 pl-8 pr-4 text-amber-500 font-mono font-bold focus:border-amber-500 focus:outline-none"
                                            placeholder="0"
                                        />
                                        <Coins size={14} className="absolute left-2.5 top-3 text-slate-500" />
                                    </div>
                                </div>

                                <div className="text-xs text-slate-500 flex justify-between px-1">
                                    <span>Prowizja (5%):</span>
                                    <span className="text-red-400 font-mono">
                                        {priceInput ? Math.ceil(parseInt(priceInput) * 0.05) : 0} g
                                    </span>
                                </div>

                                <button 
                                    onClick={handleSell}
                                    disabled={selectedItemIndex === null || !priceInput}
                                    className="w-full py-3 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded uppercase tracking-wider transition-colors shadow-lg shadow-purple-900/20"
                                >
                                    Wystaw na aukcję
                                </button>
                            </div>
                        </div>

                        {/* Inventory & Active Listings */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Inventory */}
                            <div className="h-1/2 flex flex-col mb-4">
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Twój Ekwipunek</h4>
                                <div className="flex-1 bg-[#0b0d10] rounded border border-white/5 p-2 overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-6 gap-2">
                                        {character.inventory.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => item && setSelectedItemIndex(idx)}
                                                className={`aspect-square border rounded flex items-center justify-center transition-all relative
                                                    ${item ? 'cursor-pointer hover:border-purple-500' : ''}
                                                    ${selectedItemIndex === idx && item ? 'border-purple-500 bg-purple-900/20' : 'border-white/5 bg-[#13161c]'}
                                                `}
                                                onMouseEnter={(e) => item && setHoveredItem({ item, rect: e.currentTarget.getBoundingClientRect() })}
                                                onMouseLeave={() => setHoveredItem(null)}
                                            >
                                                <div className="scale-75 pointer-events-none">
                                                    <ItemIcon item={item} size={40} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* My Active Listings */}
                            <div className="flex-1 flex flex-col min-h-0">
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Twoje aktywne aukcje</h4>
                                <div className="flex-1 bg-[#0b0d10] rounded border border-white/5 overflow-y-auto custom-scrollbar">
                                    {filteredListings.length === 0 ? (
                                        <div className="text-center py-10 text-slate-600 text-sm">Brak aktywnych aukcji.</div>
                                    ) : (
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-[#13161c] text-slate-500 text-xs uppercase sticky top-0">
                                                <tr>
                                                    <th className="p-3">Przedmiot</th>
                                                    <th className="p-3">Cena</th>
                                                    <th className="p-3">Wygasa</th>
                                                    <th className="p-3 text-right">Akcja</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredListings.map(l => {
                                                    if (!l.item) return null;
                                                    return (
                                                    <tr key={l.id} className="hover:bg-white/5">
                                                        <td className="p-3 flex items-center gap-3">
                                                            <div className="w-8 h-8">
                                                                <ItemIcon item={l.item} size={32} />
                                                            </div>
                                                            <span className="font-bold text-slate-300">{l.item.name}</span>
                                                        </td>
                                                        <td className="p-3 text-amber-500 font-mono font-bold">{l.price} g</td>
                                                        <td className="p-3 text-slate-500 text-xs">24h</td>
                                                        <td className="p-3 text-right">
                                                            <button 
                                                                onClick={() => cancelMarketListing(l.id)}
                                                                className="text-red-500 hover:text-red-400 p-1" title="Anuluj"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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

