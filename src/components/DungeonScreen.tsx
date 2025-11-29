import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Skull, Sword, Lock, ArrowRight, Shield, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Monster } from '../types';
import { getMonsterSrc } from '../utils/assets';

// Hardcoded Dungeon Definitions
const DUNGEONS = [
    { id: 'dungeon_1', name: 'Mroczne Kanały', levelReq: 10, rooms: 3, bossId: 'boss_kanaly', description: 'Siedlisko gigantycznych szczurów i odpadków.', bg: 'from-green-900/20' },
    { id: 'dungeon_2', name: 'Opuszczona Kopalnia', levelReq: 15, rooms: 4, bossId: 'boss_kopalnia', description: 'Duchy górników wciąż strzegą złóż.', bg: 'from-slate-800/40' },
    { id: 'dungeon_3', name: 'Zapomniana Krypta', levelReq: 20, rooms: 5, bossId: 'boss_krypta', description: 'Starożytne zło budzi się ze snu.', bg: 'from-purple-900/30' },
    { id: 'dungeon_4', name: 'Wulkaniczna Twierdza', levelReq: 25, rooms: 6, bossId: 'boss_twierdza', description: 'Twierdza ognistych demonów.', bg: 'from-red-900/30' },
];

export const DungeonScreen: React.FC = () => {
    const { character, startCombat, startQuickCombat, monsters, combatHistory, globalToast, showToast } = useGame();
    
    const [view, setView] = useState<'LIST' | 'EXPLORE'>('LIST');
    const [activeDungeonId, setActiveDungeonId] = useState<string | null>(null);
    const [currentRoom, setCurrentRoom] = useState<number>(1);
    const [roomCompleted, setRoomCompleted] = useState<boolean>(false);
    
    // State for randomized room monsters (to keep them consistent during a run)
    const [roomMonsters, setRoomMonsters] = useState<Monster[]>([]);
    const [page, setPage] = useState(0);

    const activeDungeon = DUNGEONS.find(d => d.id === activeDungeonId);

    // Restore state from localStorage on mount or when monsters load
    useEffect(() => {
        const savedRun = localStorage.getItem('active_dungeon_run');
        if (savedRun) {
            const { dungeonId, room, status, monsters: savedMonsters } = JSON.parse(savedRun);
            if (dungeonId && room) {
                setActiveDungeonId(dungeonId);
                
                // Check if status is COMPLETED but we are not at the boss
                const dungeon = DUNGEONS.find(d => d.id === dungeonId);
                let currentR = room;
                let currentS = status;

                // Auto-advance if saved as COMPLETED but not final room
                if (status === 'COMPLETED' && dungeon && room < dungeon.rooms) {
                     currentR = room + 1;
                     currentS = 'PENDING';
                     // Update storage immediately
                     const updatedRun = { ...JSON.parse(savedRun), room: currentR, status: currentS };
                     localStorage.setItem('active_dungeon_run', JSON.stringify(updatedRun));
                }

                setCurrentRoom(currentR);
                setView('EXPLORE');
                
                // Set page to show current room
                const initialPage = Math.floor((currentR - 1) / 4);
                setPage(initialPage);

                if (currentS === 'COMPLETED') {
                    setRoomCompleted(true);
                } else {
                    setRoomCompleted(false);
                }

                // Only restore monsters if we have monster data loaded
                if (savedMonsters && savedMonsters.length > 0 && monsters.length > 0) {
                     // Map saved IDs back to full monster objects
                     const restored = savedMonsters.map((id: string) => monsters.find(m => m.id === id)).filter(Boolean);
                     if (restored.length > 0) setRoomMonsters(restored);
                }
            }
        }
    }, [monsters]); // Added dependency on monsters

    // Helper to pick monsters for the run
    const pickMonstersForDungeon = (dungeon: typeof DUNGEONS[0]) => {
        if (!monsters || monsters.length === 0) return [];

        const picked: Monster[] = [];
        
        for (let i = 1; i <= dungeon.rooms; i++) {
            if (i === dungeon.rooms) {
                // Boss
                const bossLevel = dungeon.levelReq + dungeon.rooms; 
                const bossCandidate = monsters.find(m => 
                    (m.level >= bossLevel || Math.abs(m.level - bossLevel) <= 2) && 
                    (m.type === 'boss' || m.type === 'demon' || m.type === 'dragon')
                );
                picked.push(bossCandidate || monsters[monsters.length - 1]); // Fallback
            } else {
                // Normal Room
                const targetLevel = dungeon.levelReq + (i - 1);
                const candidates = monsters.filter(m => 
                    !m.id.includes('boss') && 
                    m.level >= targetLevel && 
                    m.level <= targetLevel + 2
                );
                
                if (candidates.length > 0) {
                     picked.push(candidates[Math.floor(Math.random() * candidates.length)]);
                } else {
                     const fallback = monsters.find(m => m.level >= targetLevel) || monsters[0];
                     picked.push(fallback);
                }
            }
        }
        return picked;
    };

    const enterDungeon = (dungeonId: string) => {
        const dungeon = DUNGEONS.find(d => d.id === dungeonId);
        if (!dungeon) return;

        const generatedMonsters = pickMonstersForDungeon(dungeon);
        setRoomMonsters(generatedMonsters);
        
        setActiveDungeonId(dungeonId);
        setCurrentRoom(1);
        setRoomCompleted(false);
        setView('EXPLORE');
        setPage(0);
        
        localStorage.setItem('active_dungeon_run', JSON.stringify({ 
            dungeonId, 
            room: 1, 
            status: 'PENDING',
            monsters: generatedMonsters.map(m => m.id)
        }));
    };

    const leaveDungeon = () => {
        setActiveDungeonId(null);
        setCurrentRoom(1);
        setRoomCompleted(false);
        setRoomMonsters([]);
        setView('LIST');
        localStorage.removeItem('active_dungeon_run');
    };

    const advanceRoom = () => {
        if (!activeDungeon) return;
        const nextRoom = currentRoom + 1;
        
        if (nextRoom > activeDungeon.rooms) {
            // Dungeon Finished
            showToast("Loch Ukończony! Gratulacje!", 'success');
            leaveDungeon();
        } else {
            setCurrentRoom(nextRoom);
            setRoomCompleted(false);
            
            // Auto advance page if needed
            const newPage = Math.floor((nextRoom - 1) / 4);
            if (newPage !== page) setPage(newPage);

            const savedRun = JSON.parse(localStorage.getItem('active_dungeon_run') || '{}');
            localStorage.setItem('active_dungeon_run', JSON.stringify({ 
                ...savedRun,
                room: nextRoom, 
                status: 'PENDING' 
            }));
        }
    };

    const handleCombat = (monster: Monster, quick: boolean = false) => {
        localStorage.setItem('dungeon_combat_pending', 'true');
        if (quick) {
            startQuickCombat(monster.id, 'DUNGEON');
        } else {
            startCombat(monster.id, 'DUNGEON'); // Explicitly set context
        }
    };

    // Check for combat return status
    useEffect(() => {
        const pending = localStorage.getItem('dungeon_combat_pending');
        if (pending && activeDungeonId && view === 'EXPLORE') {
            localStorage.removeItem('dungeon_combat_pending');
            
            const lastLog = combatHistory[0];
            // Ensure we check if the last combat was actually a WIN
            if (lastLog && lastLog.result === 'WIN' && new Date(lastLog.created_at!).getTime() > Date.now() - 30000) {
                 // Auto-advance logic instead of just setting roomCompleted
                 if (activeDungeon && currentRoom < activeDungeon.rooms) {
                     // Simulate advanceRoom
                     const nextRoom = currentRoom + 1;
                     setCurrentRoom(nextRoom);
                     setRoomCompleted(false);
                     
                     // Auto advance page if needed
                     const newPage = Math.floor((nextRoom - 1) / 4);
                     if (newPage !== page) setPage(newPage);

                     const savedRun = JSON.parse(localStorage.getItem('active_dungeon_run') || '{}');
                     localStorage.setItem('active_dungeon_run', JSON.stringify({ 
                         ...savedRun,
                         room: nextRoom, 
                         status: 'PENDING' 
                     }));
                 } else if (activeDungeon && currentRoom === activeDungeon.rooms) {
                     // Boss Defeated - Show completed state (handled by UI button "Loch Ukończony" or auto-leave?)
                     // AUTO FINISH DUNGEON
                     showToast("Loch Ukończony! Gratulacje!", 'success');
                     leaveDungeon();
                     // Cleanup storage implicitly handled by leaveDungeon
                 }
            }
        } else if (activeDungeonId && view === 'EXPLORE') {
             // Fallback: Check local storage status directly (if coming from CombatScreen redirect)
             const savedRun = JSON.parse(localStorage.getItem('active_dungeon_run') || '{}');
             if (savedRun.status === 'COMPLETED' && savedRun.room < (activeDungeon?.rooms || 0)) {
                 // Auto advance logic duplicated for safety
                 const nextRoom = savedRun.room + 1;
                 setCurrentRoom(nextRoom);
                 setRoomCompleted(false);
                 
                 const newPage = Math.floor((nextRoom - 1) / 4);
                 if (newPage !== page) setPage(newPage);
                 
                 localStorage.setItem('active_dungeon_run', JSON.stringify({ 
                     ...savedRun,
                     room: nextRoom, 
                     status: 'PENDING' 
                 }));
             }
        }
    }, [view, activeDungeonId, combatHistory, activeDungeon]);


    if (view === 'LIST') {
        return (
            <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <Skull size={32} className="text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 font-serif">Lochy</h2>
                        <p className="text-slate-400">Niebezpieczne podziemia pełne skarbów i bossów.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {DUNGEONS.map(dungeon => {
                        const isLocked = character.level < dungeon.levelReq;
                        return (
                            <div 
                                key={dungeon.id}
                                className={`relative group bg-[#161b22] border-2 rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-[450px] shadow-lg
                                    ${isLocked 
                                        ? 'border-white/5 opacity-60 grayscale' 
                                        : 'border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-1'}
                                `}
                            >
                                {/* Header */}
                                <div className={`p-3 text-center border-b border-white/5 rounded-t-xl relative z-20 bg-[#0b0d10]`}>
                                    <h3 className={`text-lg font-bold font-serif tracking-wider truncate ${isLocked ? 'text-slate-600' : 'text-purple-300'}`}>
                                        {dungeon.name}
                                    </h3>
                                </div>

                                {/* Image Area */}
                                <div className="relative flex-1 bg-black/40 border-b border-white/5 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-b ${dungeon.bg} to-transparent opacity-50`}></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Skull size={80} className={isLocked ? "text-slate-700" : "text-purple-500/50 group-hover:text-purple-500/80 transition-colors"} />
                                    </div>
                                    
                                    {/* Level Overlay */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 flex items-end justify-center">
                                         <span className={`px-3 py-1 bg-black/60 rounded border border-white/10 text-xs font-bold uppercase tracking-wider ${isLocked ? 'text-red-500' : 'text-green-400'}`}>
                                            LVL {dungeon.levelReq}+
                                        </span>
                                    </div>
                                </div>

                                {/* Description Area */}
                                <div className="p-4 flex flex-col relative z-10 bg-[#161b22] h-[140px]">
                                    <p className="text-[11px] text-slate-400 italic mb-4 leading-relaxed line-clamp-3 text-center">
                                        {dungeon.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="flex justify-between items-center mb-3 text-xs text-slate-500 px-2">
                                            <span>Pokoje: <span className="text-slate-300">{dungeon.rooms}</span></span>
                                            <span>Boss: <span className="text-red-400">Tak</span></span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => enterDungeon(dungeon.id)}
                                            disabled={isLocked}
                                            className={`w-full py-3 rounded font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-lg
                                                ${isLocked 
                                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' 
                                                    : 'bg-purple-900/50 hover:bg-purple-700 text-purple-200 border border-purple-500/50 group-hover:border-purple-500'}
                                                `}
                                        >
                                            {isLocked ? <><Lock size={14}/> Zablokowane</> : <><Sword size={16}/> Eksploruj</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (!activeDungeon || (monsters.length > 0 && roomMonsters.length === 0)) {
        // If monsters are loaded but roomMonsters empty -> regen
        if (monsters.length > 0 && activeDungeon) {
             const gen = pickMonstersForDungeon(activeDungeon);
             if (gen.length > 0) setRoomMonsters(gen);
        }
        // Show loading if still waiting
        if (monsters.length === 0) return <div className="p-10 text-center text-purple-400 animate-pulse">Ładowanie bestiariusza...</div>;
    }

    // Pagination logic
    const maxPage = Math.ceil(roomMonsters.length / 4) - 1;
    const startIndex = page * 4;
    // Ensure we always display 4 slots for consistent layout
    const currentMonsters = roomMonsters.slice(startIndex, startIndex + 4);
    const placeholders = Array(4 - currentMonsters.length).fill(null);

    const updatePage = (newPage: number) => {
        const p = Math.max(0, Math.min(maxPage, newPage));
        setPage(p);
    };
  
    const nextPage = () => updatePage(page + 1);
    const prevPage = () => updatePage(page - 1);

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-300 p-6 overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-900/30">
                <div>
                    <h2 className="text-2xl font-bold text-purple-300 font-serif flex items-center gap-3">
                        <span className="text-purple-600">Loch:</span> {activeDungeon?.name}
                    </h2>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                        Postęp: Pokój {currentRoom} / {activeDungeon?.rooms}
                    </p>
                </div>
                <button 
                    onClick={leaveDungeon}
                    className="px-4 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded border border-red-900/30 text-sm font-bold uppercase"
                >
                    Poddaj się
                </button>
            </div>

             {/* PAGINATION CONTROLS */}
            {(roomMonsters.length > 4) && (
                <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={prevPage} 
                        disabled={page === 0}
                        className={`p-2 rounded-full border border-slate-700 ${page === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-purple-500'}`}
                    >
                        <ChevronLeft size={32} />
                    </button>
            
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Strona {page + 1} / {maxPage + 1}</div>
            
                    <button 
                        onClick={nextPage} 
                        disabled={page === maxPage}
                        className={`p-2 rounded-full border border-slate-700 ${page === maxPage ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-purple-500'}`}
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            )}

            {/* Global Toast Notification */}
            {globalToast && (
                <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 border
                    ${globalToast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 
                      globalToast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 
                      'bg-slate-800/90 border-slate-500 text-slate-200'}
                `}>
                    <div className={`rounded-full p-1 ${
                        globalToast.type === 'error' ? 'bg-red-500' : 
                        globalToast.type === 'success' ? 'bg-green-500' : 
                        'bg-slate-500'
                    }`}>
                        {globalToast.type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="19"></line><line x1="12" y1="5" x2="12" y2="15"></line></svg>
                        )}
                    </div>
                    <span className="font-bold tracking-wide text-sm">{globalToast.message}</span>
                </div>
            )}

            {/* ROOMS CARDS - VISUALIZING PROGRESS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentMonsters.map((monster, idx) => {
                    const realIndex = startIndex + idx;
                    const roomNum = realIndex + 1;
                    const isCompleted = roomNum < currentRoom;
                    const isCurrent = roomNum === currentRoom;
                    const isLocked = roomNum > currentRoom;
                    const isBoss = roomNum === activeDungeon!.rooms;

                    return (
                        <div 
                            key={realIndex}
                            className={`bg-[#161b22] border-2 rounded-xl flex flex-col h-[450px] shadow-lg relative overflow-hidden transition-all
                                ${isCurrent 
                                    ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] z-10' 
                                    : isCompleted 
                                        ? 'border-[#2a2e38] grayscale opacity-60' 
                                        : 'border-[#1f242d] opacity-60'}
                            `}
                        >
                            {/* Header */}
                            <div className={`p-3 text-center border-b border-white/5 rounded-t-xl relative z-20 ${isCurrent ? 'bg-purple-900/20' : 'bg-[#0b0d10]'}`}>
                                <h3 className={`text-lg font-bold font-serif tracking-wider truncate ${isCurrent ? 'text-purple-300' : 'text-slate-600'}`}>
                                    Pokój {roomNum}
                                </h3>
                            </div>

                            {/* Image Area */}
                            <div className="relative flex-1 bg-black/40 border-b border-white/5 group overflow-hidden">
                                <img 
                                    src={getMonsterSrc(monster.id)} 
                                    alt={monster.name}
                                    className={`w-full h-full object-cover transition-transform duration-700 ${isCurrent ? 'scale-110' : 'scale-100'}`}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent`}></div>
                                
                                {/* Status Overlay */}
                                {isCompleted && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                        <div className="text-green-500 font-bold uppercase tracking-widest border-2 border-green-500 px-4 py-2 rounded transform -rotate-12 flex items-center gap-2">
                                            <ArrowRight size={20}/> Pokonano
                                        </div>
                                    </div>
                                )}
                                {isLocked && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                        <Lock size={40} className="text-slate-600" />
                                    </div>
                                )}
                                
                                {/* Monster Name Overlay */}
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 text-center">
                                     <h4 className={`font-bold font-serif ${isBoss ? 'text-red-400' : 'text-slate-200'}`}>
                                        {monster.name}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        Lvl {monster.level} • {monster.hp} HP
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-3 bg-[#13161c] grid grid-cols-2 gap-2 relative z-20 min-h-[80px] items-center">
                                {isCurrent ? (
                                    roomCompleted ? (
                                        <div 
                                            onClick={leaveDungeon}
                                            className="col-span-2 py-3 bg-green-600/20 hover:bg-green-600/30 cursor-pointer border border-green-500/50 text-green-400 font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ArrowRight size={18} /> Loch Ukończony
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => handleCombat(monster)}
                                                className={`py-2 font-bold rounded border-t shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-1 transform active:scale-95 transition-all
                                                    ${isBoss 
                                                        ? 'bg-gradient-to-b from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white border-red-600' 
                                                        : 'bg-gradient-to-b from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white border-purple-500'}
                                                `}
                                            >
                                                <Sword size={14} /> Atak
                                            </button>
                                            <button 
                                                onClick={() => handleCombat(monster, true)}
                                                className="py-2 bg-[#1a1d24] hover:bg-[#2a2e38] text-slate-300 font-bold rounded border border-slate-600 text-xs uppercase tracking-widest flex items-center justify-center gap-1 transform active:scale-95 transition-all"
                                            >
                                                <Zap size={14} className="text-yellow-500" /> Szybka
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <div className="col-span-2 py-2 bg-[#1a1d24] text-slate-600 font-bold rounded text-center text-xs uppercase border border-white/5 cursor-not-allowed">
                                        {isCompleted ? 'Ukończono' : 'Zablokowane'}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Placeholders to keep grid size consistent */}
                {placeholders.map((_, idx) => (
                     <div 
                        key={`placeholder-${idx}`} 
                        className="hidden lg:block bg-[#161b22]/30 border-2 border-dashed border-[#1f242d] rounded-xl h-[450px]" 
                     />
                ))}
            </div>
        </div>
    );
};
