import React, { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { Character, Profession, Item, ItemType, CombatLog, BonusType, Monster, MarketListing, PvPBattle, CombatTurn } from '../types';
=======
import { Character, Profession, Item, ItemType, CombatLog, BonusType, Monster, MarketListing, AccountStash } from '../types';
>>>>>>> from-new
import { PROFESSIONS } from '../data/professions';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { XP_TO_NEXT_LEVEL, calculateDerivedStats, calculateMaxTrainableStat, getStatsForLevel } from '../utils/formulas';
import { generateItem } from '../utils/itemGenerator';

<<<<<<< HEAD
type GameView = 'AUTH' | 'LANDING' | 'CHAR_SELECT' | 'CHARACTER_CREATION' | 'HUB' | 'COMBAT' | 'INVENTORY' | 'SHOP' | 'EXPEDITION' | 'DOCTOR' | 'PREMIUM' | 'DUNGEON' | 'ARENA' | 'BESTIARY' | 'TALISMANS' | 'HISTORY' | 'MARKET' | 'RANKING' | 'TRAINER';
=======
type GameView = 'AUTH' | 'CHAR_SELECT' | 'CHARACTER_CREATION' | 'HUB' | 'COMBAT' | 'INVENTORY' | 'SHOP' | 'EXPEDITION' | 'DOCTOR' | 'PREMIUM' | 'DUNGEON' | 'ARENA' | 'BESTIARY' | 'TALISMANS' | 'HISTORY' | 'MARKET' | 'RANKING' | 'TRAINER' | 'STASH';
>>>>>>> from-new

interface GameState {
  user: User | null;
  session: Session | null;
  character: Character | null;
  myCharacters: Character[];
  view: GameView;
  logs: string[];
  isLoading: boolean;
  unlockedMonsters: string[];
  activeMonsterId: string | null;
  activeMonsterType: 'EXPEDITION' | 'DUNGEON' | 'ARENA' | null;
  killedMonsters: Record<string, number>;
  combatHistory: CombatLog[];
  isQuickCombat: boolean;
  merchantInventory: Item[];
  monsters: Monster[];
  itemTemplates: Item[];
  marketListings: MarketListing[];
  globalWarning: string | null;
  globalToast: { message: string, type: 'error' | 'success' | 'info' } | null;
  accountStash: (Item | null)[];
}

interface GameContextType extends GameState {
  signIn: (email: string, pass: string) => Promise<{error: any}>;
  signUp: (email: string, pass: string) => Promise<{error: any}>;
  signOut: () => void;
  refreshCharacters: (userId: string) => Promise<void>;
  selectCharacter: (charId: string) => void;
  createCharacter: (name: string, profession: Profession) => Promise<void>;
  changeView: (view: GameView) => void;
  addLog: (msg: string) => void;
  showToast: (message: string, type?: 'error' | 'success' | 'info') => void;
  gainExp: (amount: number) => void;
  gainGold: (amount: number) => void; 
  addItem: (item: Item) => void;
  equipItem: (item: Item, fromInventoryIndex: number) => void;
  unequipItem: (slot: ItemType) => void;
  unlockMonster: (monsterId: string) => void;
  startCombat: (monsterId: string, type?: 'EXPEDITION' | 'DUNGEON' | 'ARENA') => void; 
  startQuickCombat: (monsterId: string, type?: 'EXPEDITION' | 'DUNGEON' | 'ARENA') => void; 
  recordKill: (monsterId: string) => void;
  addTalisman: (talismanId: string) => void;
  equipTalisman: (talismanId: string, slotIndex: number) => void;
  unequipTalisman: (slotIndex: number) => void;
  addCombatLog: (log: CombatLog) => void;
  unlockBonus: (monsterId: string) => void;
  saveDungeonProgress: (dungeonId: string, room: number) => void;
  
  // Shop & Doctor & Market
  refreshMerchant: () => void;
  buyItem: (item: Item, index: number) => void;
  sellItem: (index: number) => void;
  healCharacter: (cost: number) => void;
  payGold: (amount: number) => boolean;
  updateHp: (newHp: number) => void; 
  
  // Market
  fetchMarketListings: () => Promise<void>;
  createMarketListing: (item: Item, price: number, inventoryIndex: number) => Promise<boolean>;
  buyMarketListing: (listing: MarketListing) => Promise<void>;
  cancelMarketListing: (listingId: string) => Promise<void>;
  
  moveItem: (fromIndex: number, toIndex: number) => void;

  loadRanking: () => Promise<any[]>;
  trainStat: (stat: 'strength' | 'dexterity' | 'vitality' | 'intelligence') => Promise<void>;
<<<<<<< HEAD
  
  // Item Locking
  lockItem: (itemId: string) => void;
  unlockItem: (itemId: string) => void;
  quicksellAll: () => void;
  
  // Arena PvP
  loadArenaPlayers: () => Promise<{ suggested: Character[], others: Character[] }>;
  loadPlayerProfile: (characterId: string) => Promise<Character | null>;
  startPvPCombat: (targetCharacter: Character) => void;
  
  // PvP Notifications & Live Viewing
  createPvPBattle: (defender: Character, battleData: { attackerHp: number, defenderHp: number, attackerMaxHp: number, defenderMaxHp: number }) => Promise<string | null>;
  updatePvPBattle: (battleId: string, updates: { attackerHp?: number, defenderHp?: number, turnCount?: number, battleLogs?: any[], status?: string, winnerId?: string }) => Promise<void>;
  watchPvPBattle: (battleId: string) => void;
  activePvPBattle: PvPBattle | null;
  pvpAttackNotification: PvPBattle | null;
  dismissPvPNotification: () => void;
=======

  // Account Stash
  moveToStash: (inventoryIndex: number) => void;
  moveFromStash: (stashIndex: number) => void;
  moveStashItem: (fromIndex: number, toIndex: number) => void;
>>>>>>> from-new
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [myCharacters, setMyCharacters] = useState<Character[]>([]);
  const [view, setView] = useState<GameView>('LANDING');
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unlockedMonsters, setUnlockedMonsters] = useState<string[]>(['monster_1']);
  const [activeMonsterId, setActiveMonsterId] = useState<string | null>(null);
  const [activeMonsterType, setActiveMonsterType] = useState<'EXPEDITION' | 'DUNGEON' | 'ARENA' | null>(null);
  const [killedMonsters, setKilledMonsters] = useState<Record<string, number>>({});
  const [combatHistory, setCombatHistory] = useState<CombatLog[]>([]);
  const [isQuickCombat, setIsQuickCombat] = useState(false); 
  const [merchantInventory, setMerchantInventory] = useState<Item[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [itemTemplates, setItemTemplates] = useState<Item[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [globalWarning, setGlobalWarning] = useState<string | null>(null);
  const [globalToast, setGlobalToast] = useState<{ message: string, type: 'error' | 'success' | 'info' } | null>(null);
<<<<<<< HEAD
  const [activePvPBattle, setActivePvPBattle] = useState<PvPBattle | null>(null);
  const [pvpAttackNotification, setPvpAttackNotification] = useState<PvPBattle | null>(null);
=======
  const [accountStash, setAccountStash] = useState<(Item | null)[]>(Array(96).fill(null)); // 96 slots for stash
>>>>>>> from-new

  // ... (useEffect logic remains same, truncated for brevity if possible, but writing full file to be safe)
  // Load Game Data (Monsters & Items)
  useEffect(() => {
    const fetchData = async () => {
        // Fetch Monsters
        const { data: monstersData, error: monstersError } = await supabase
            .from('monsters')
            .select('*')
            .order('level', { ascending: true });
        
        if (monstersError) console.error("Error loading monsters:", monstersError);
        if (monstersData) {
            const mappedMonsters: Monster[] = monstersData.map((m: any) => ({
                id: m.id,
                name: m.name,
                level: m.level,
                type: m.type,
                description: m.description,
                hp: m.stats.hp,
                maxHp: m.stats.maxHp || m.stats.hp,
                damageMin: m.stats.damageMin,
                damageMax: m.stats.damageMax,
                defense: m.stats.defense,
                // Balanced SA: Normal = Lvl*2.5, Boss = Lvl*4
                attackSpeed: Math.floor(m.level * (m.type === 'boss' ? 4.0 : 2.5)),
                expReward: m.rewards.exp,
                goldReward: Math.floor((m.rewards.goldMin + m.rewards.goldMax) / 2),
                goldMin: m.rewards.goldMin,
                goldMax: m.rewards.goldMax,
                lootTable: m.loot_table,
                mechanics: m.mechanics,
                // Add expMultiplier if it exists in lootTable or root (Plan said loot table)
                // But m.loot_table is passed as lootTable.
            }));
            setMonsters(mappedMonsters);
        }

        // Fetch Item Templates
        const { data: itemsData, error: itemsError } = await supabase
            .from('items')
            .select('*');
        
        if (itemsError) console.error("Error loading items:", itemsError);
        if (itemsData) setItemTemplates(itemsData as Item[]);
    };

    fetchData();
  }, []);

  // LEVEL-BASED UNLOCKS (Fixes 13, 18, 25, 26 bugs)
  useEffect(() => {
      if (character && monsters.length > 0) {
          const level = character.level;
          // Unlock monsters up to Player Level + 2
          const shouldBeUnlocked = monsters
              .filter(m => m.level <= level + 2 && !m.id.startsWith('boss_dungeon'))
              .map(m => m.id);
          
          const current = new Set(unlockedMonsters);
          let changed = false;
          shouldBeUnlocked.forEach(id => {
              if (!current.has(id)) {
                  current.add(id);
                  changed = true;
              }
          });
          
          // Ensure Monster 1 is always unlocked
          if (!current.has('monster_1')) {
              current.add('monster_1');
              changed = true;
          }

          if (changed) {
              setUnlockedMonsters(Array.from(current));
          }
      }
  }, [character?.level, monsters, unlockedMonsters]);

  // HP Regeneration Loop
  useEffect(() => {
      if (!character || view === 'COMBAT') return;

      const interval = setInterval(() => {
          const now = Date.now();
          const lastRegen = character.lastRegenTime || now;
          const diff = now - lastRegen;
          
          if (diff >= 60000) {
              const ticks = Math.floor(diff / 60000);
              
              const stats = calculateDerivedStats(
                  character.baseStats, 
                  character.level, 
                  character.profession, 
                  character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
                  character.activeTalismans || []
              );
              
              const itemRegenPct = (stats.hpRegen || 0) / 100;
              const totalRegenPct = 0.02 + itemRegenPct;
              
              const regenAmount = Math.max(1, Math.floor(stats.maxHp * totalRegenPct) * ticks);
              
              if (regenAmount > 0 && character.currentHp < stats.maxHp) {
                  const newHp = Math.min(stats.maxHp, character.currentHp + regenAmount);
                  
                  setCharacter(prev => prev ? {
                      ...prev,
                      currentHp: newHp,
                      lastRegenTime: now
                  } : null);
              } else {
                  if (character.currentHp >= stats.maxHp) {
                       setCharacter(prev => prev ? { ...prev, lastRegenTime: now } : null);
                  }
              }
          }
      }, 10000); 

      return () => clearInterval(interval);
  }, [character, view]);


  // Load Account Stash
  useEffect(() => {
    const loadStash = async () => {
      if (!user) {
        setAccountStash(Array(96).fill(null));
        return;
      }

      if (user.id === 'demo-user') {
        // Demo mode - load from localStorage
        const demoStash = localStorage.getItem('demo_stash');
        if (demoStash) {
          const parsed = JSON.parse(demoStash);
          setAccountStash(parsed);
        } else {
          setAccountStash(Array(96).fill(null));
        }
        return;
      }

      // Real user - load from Supabase
      const { data, error } = await supabase
        .from('account_stash')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found, which is OK for first time
        console.error("Error loading stash:", error);
        return;
      }

      if (data && data.items) {
        // Ensure 96 slots
        const items = [...data.items];
        while (items.length < 96) items.push(null);
        setAccountStash(items);
      } else {
        setAccountStash(Array(96).fill(null));
      }
    };

    loadStash();
  }, [user]);

  // Auto-save Account Stash
  useEffect(() => {
    if (!user) return;

    const saveStash = async () => {
      if (user.id === 'demo-user') {
        localStorage.setItem('demo_stash', JSON.stringify(accountStash));
        return;
      }

      // Real user - save to Supabase
      const { error } = await supabase
        .from('account_stash')
        .upsert({
          user_id: user.id,
          items: accountStash,
          updated_at: new Date().toISOString()
        });

      if (error) console.error("Stash auto-save error:", error);
    };

    const timeout = setTimeout(saveStash, 2000);
    return () => clearTimeout(timeout);
  }, [accountStash, user]);

  // Inicjalizacja sesji i odtwarzanie stanu
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshCharacters(session.user.id).then(() => {
          const lastCharId = localStorage.getItem('last_char_id');
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshCharacters(session.user.id);
      } else {
        setView('AUTH');
        setMyCharacters([]);
        setCharacter(null);
        setAccountStash(Array(96).fill(null));
        localStorage.removeItem('last_char_id');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to PvP attack notifications
  useEffect(() => {
    if (!character || !user) return;

    const channel = supabase
      .channel('pvp-attacks')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pvp_battles',
          filter: `defender_id=eq.${character.id}`
        },
        (payload) => {
          const battle = payload.new as any;
          const pvpBattle: PvPBattle = {
            id: battle.id,
            attacker_id: battle.attacker_id,
            defender_id: battle.defender_id,
            attacker_name: battle.attacker_name,
            defender_name: battle.defender_name,
            status: battle.status,
            winner_id: battle.winner_id,
            battle_logs: battle.battle_logs || [],
            attacker_hp: battle.attacker_hp,
            defender_hp: battle.defender_hp,
            attacker_max_hp: battle.attacker_max_hp,
            defender_max_hp: battle.defender_max_hp,
            turn_count: battle.turn_count,
            created_at: battle.created_at,
            updated_at: battle.updated_at
          };
          setPvpAttackNotification(pvpBattle);
          showToast(`${battle.attacker_name} atakuje Cię!`, 'info');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pvp_battles',
          filter: `defender_id=eq.${character.id}`
        },
        (payload) => {
          // Update notification if battle is being watched
          if (activePvPBattle && activePvPBattle.id === payload.new.id) {
            const battle = payload.new as any;
            setActivePvPBattle({
              ...activePvPBattle,
              attacker_hp: battle.attacker_hp,
              defender_hp: battle.defender_hp,
              turn_count: battle.turn_count,
              battle_logs: battle.battle_logs || [],
              status: battle.status,
              winner_id: battle.winner_id,
              updated_at: battle.updated_at
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [character, user, activePvPBattle]);

  // Auto-select character
  useEffect(() => {
      const lastCharId = localStorage.getItem('last_char_id');
      if (user && lastCharId && myCharacters.length > 0 && !character) {
          const char = myCharacters.find(c => c.id === lastCharId);
          if (char) {
              setCharacter(char);
              setView('HUB');
              if ((char as any).unlocked_monsters) {
                 setUnlockedMonsters((char as any).unlocked_monsters);
              } else {
                 setUnlockedMonsters(['monster_1']);
              }
              if ((char as any).kill_stats) {
                  setKilledMonsters((char as any).kill_stats);
              }
          } else {
              setView('CHAR_SELECT'); 
          }
      }
  }, [myCharacters, user]);

  // Auto-save Character State
  useEffect(() => {
      if (!character || !user || user.id === 'demo-user') return;

      const saveToDb = async () => {
          const { error } = await supabase
            .from('characters')
            .update({
                level: character.level,
                exp: character.exp,
                gold: character.gold,
                stats: character.baseStats,
                max_exp: character.maxExp,
                equipment: character.equipment,
                inventory: character.inventory,
                unlocked_monsters: unlockedMonsters,
                unlocked_bonuses: character.unlocked_bonuses,
                dungeon_progress: character.dungeon_progress,
                talismans_inventory: character.talismansInventory,
                active_talismans: character.activeTalismans,
                kill_stats: killedMonsters,
                current_hp: character.currentHp,
                last_regen_time: character.lastRegenTime
            })
            .eq('id', character.id);
            
          if (error) console.error("Auto-save error:", error);
      };

      const timeout = setTimeout(saveToDb, 2000); 
      return () => clearTimeout(timeout);
  }, [character, unlockedMonsters, killedMonsters]);

  // DEMO Auto-save
  useEffect(() => {
      if (!character || !user || user.id !== 'demo-user') return;
      const updatedChars = myCharacters.map(c => c.id === character.id ? {
          ...character,
          unlocked_monsters: unlockedMonsters,
          currentHp: character.currentHp,
          lastRegenTime: character.lastRegenTime
      } : c);
      localStorage.setItem('demo_chars', JSON.stringify(updatedChars));
      setMyCharacters(updatedChars);
  }, [character, unlockedMonsters, killedMonsters]);


  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    if (email === 'demo' && pass === 'demo') {
        const demoUser = { id: 'demo-user', email: 'demo@game.com' } as User;
        setUser(demoUser);
        setSession({ user: demoUser } as Session);
        await refreshCharacters('demo-user');
        setIsLoading(false);
        return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setIsLoading(false);
    return { error };
  };

  const signUp = async (email: string, pass: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password: pass });
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem('last_char_id');
    setUser(null);
    setSession(null);
    setCharacter(null);
    await supabase.auth.signOut();
    setView('AUTH');
  };

  const refreshCharacters = async (userId: string) => {
    if (userId === 'demo-user') {
        const demoChars: Character[] = JSON.parse(localStorage.getItem('demo_chars') || '[]');
        setMyCharacters(demoChars);
        if (!localStorage.getItem('last_char_id')) setView('CHAR_SELECT');
        return;
    }

    const { data, error } = await supabase
        .from('characters')
        .select('*, player_stats(*)')
        .eq('user_id', userId);
    
    if (data) {
        const mappedChars = data.map((d: any) => {
            // Recalculate Base Stats based on Level (Fix for stuck stats)
            // Use stored stats if level 1, otherwise calculate
            // Actually always calculate to ensure consistency with growth table?
            // Or should we respect DB stats if they diverged?
            // Given the bug, we should Enforce Formula Stats.
            const calculatedBaseStats = getStatsForLevel(d.profession, d.level);
            
            // Derived maxHp
            const maxHp = 50 + (calculatedBaseStats.vitality * 6); 

            // Pad inventory to 48 slots
            const rawInventory = d.inventory || [];
            const inventory = [...rawInventory];
            while (inventory.length < 48) inventory.push(null);

            // Handle Bought Stats
            const boughtStats = d.player_stats || { strength_bonus: 0, dexterity_bonus: 0, intelligence_bonus: 0, vitality_bonus: 0 };

            return {
                ...d,
                boughtStats,
                maxExp: d.max_exp || XP_TO_NEXT_LEVEL(d.level),
                baseStats: calculatedBaseStats, // Use calculated stats
                equipment: typeof d.equipment === 'string' ? JSON.parse(d.equipment) : (d.equipment || {
                    weapon: null, helmet: null, armor: null, 
                    boots: null, gloves: null, amulet: null, ring: null
                }),
                inventory: inventory,
                unlocked_monsters: d.unlocked_monsters || ['monster_1'],
                talismansInventory: d.talismans_inventory || [], 
                activeTalismans: d.active_talismans || [],
                unlocked_bonuses: d.unlocked_bonuses || {},
                dungeon_progress: d.dungeon_progress || {},
                kill_stats: d.kill_stats || {},
                lockedItems: d.locked_items || [],
                currentHp: d.current_hp !== undefined ? d.current_hp : maxHp, 
                lastRegenTime: d.last_regen_time || Date.now()
            };
        });
        setMyCharacters(mappedChars as Character[]);
        if (!localStorage.getItem('last_char_id')) setView('CHAR_SELECT');
    }
  };

  const createCharacter = async (name: string, profession: Profession) => {
    const profData = PROFESSIONS[profession];
    const startHp = 50 + (profData.baseStats.vitality * 6);
    const newChar: Character = {
      id: Date.now().toString(),
      name,
      profession,
      level: 1,
      exp: 0,
      maxExp: XP_TO_NEXT_LEVEL(1),
      energy: 50,
      maxEnergy: 50,
      gold: 0,
      premiumCurrency: 0,
      baseStats: { ...profData.baseStats },
      equipment: {
        weapon: null, helmet: null, armor: null, 
        boots: null, gloves: null, amulet: null, ring: null
      },
      inventory: Array(48).fill(null), // Init with nulls
      talismansInventory: [],
      activeTalismans: [],
      unlocked_bonuses: {},
      dungeon_progress: {},
      kill_stats: {},
      currentHp: startHp,
      lastRegenTime: Date.now()
    };

    if (user?.id === 'demo-user') {
        const updated = [...myCharacters, newChar];
        localStorage.setItem('demo_chars', JSON.stringify(updated));
        setMyCharacters(updated);
        selectCharacter(newChar.id);
    } else if (user) {
        const { data, error } = await supabase.from('characters').insert({
            user_id: user.id,
            name: newChar.name,
            profession: newChar.profession,
            stats: newChar.baseStats,
            max_exp: newChar.maxExp,
            equipment: newChar.equipment,
            unlocked_monsters: ['monster_1'],
            current_hp: newChar.currentHp,
            last_regen_time: newChar.lastRegenTime
        }).select().single();

        if (!error && data) {
             await refreshCharacters(user.id);
             selectCharacter(data.id);
        } else {
             console.error(error);
             addLog("Błąd tworzenia postaci: " + error?.message);
        }
    }
  };

  const selectCharacter = (charId: string) => {
    const char = myCharacters.find(c => c.id === charId);
    if (char) {
        // Apply offline regen on select
        const now = Date.now();
        const lastRegen = char.lastRegenTime || now;
        const diff = now - lastRegen;
        
        let updatedChar = { ...char };

        if (diff >= 60000) {
             const ticks = Math.floor(diff / 60000);
             const stats = calculateDerivedStats(
                  char.baseStats, 
                  char.level, 
                  char.profession, 
                  char.equipment ? Object.values(char.equipment).filter(i => i !== null) as any[] : [],
                  char.activeTalismans || []
              );
             const regenAmount = Math.floor(stats.maxHp * 0.02) * ticks;
             if (regenAmount > 0) {
                 const newHp = Math.min(stats.maxHp, char.currentHp + regenAmount);
                 updatedChar.currentHp = newHp;
                 updatedChar.lastRegenTime = now;
             }
        }

        setCharacter(updatedChar);
        localStorage.setItem('last_char_id', charId);
        if ((char as any).unlocked_monsters) {
             setUnlockedMonsters((char as any).unlocked_monsters);
        }
        if ((char as any).kill_stats) {
            setKilledMonsters((char as any).kill_stats);
        }
        setView('HUB');
        addLog(`Witaj w świecie gry, ${char.name}!`);
        refreshMerchant(); // Init merchant
    }
  };

  const changeView = (newView: GameView) => setView(newView);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 50));
  };

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
      setGlobalToast({ message, type });
      setTimeout(() => setGlobalToast(null), 3000);
  };

  const gainExp = (amount: number) => {
    if (!character) return;
    
    let newExp = character.exp + amount;
    let newLevel = character.level;
    let newMaxExp = character.maxExp;

    while (newExp >= newMaxExp) {
      newExp -= newMaxExp;
      newLevel++;
      newMaxExp = XP_TO_NEXT_LEVEL(newLevel); 
      addLog(`Awansowałeś na poziom ${newLevel}!`);
    }
    
    // Recalculate Base Stats for new level
    const newBaseStats = getStatsForLevel(character.profession, newLevel);
    
    setCharacter(prev => prev ? { ...prev, level: newLevel, exp: newExp, maxExp: newMaxExp, baseStats: newBaseStats } : null);
  };

  const gainGold = (amount: number) => {
      if (!character) return;
      setCharacter(prev => prev ? { ...prev, gold: prev.gold + amount } : null);
  };


  const addToFirstFreeSlot = (currentInv: (Item | null)[], item: Item): (Item | null)[] | null => {
      const newInv = [...currentInv];
      // Pad to 48
      while (newInv.length < 48) newInv.push(null);
      
      const emptyIdx = newInv.findIndex(slot => slot === null);
      if (emptyIdx === -1) return null;
      
      newInv[emptyIdx] = item;
      return newInv;
  };

  const isInventoryFull = (inv: (Item | null)[]): boolean => {
      const padded = [...inv];
      while (padded.length < 48) padded.push(null);
      return padded.every(slot => slot !== null);
  };

  const addItem = async (item: Item) => {
    if (!character) return;
    const newInventory = addToFirstFreeSlot(character.inventory, item);
    
    if (!newInventory) {
        addLog("⚠️ Plecak pełny! Przedmiot przepadł. Zrób miejsce w plecaku przed następną walką.");
        showToast("Plecak pełny! Przedmiot przepadł. Zrób miejsce przed następną walką.", 'error');
        return;
    }
    
    setCharacter(prev => prev ? { ...prev, inventory: newInventory } : null);
    addLog(`Otrzymano przedmiot: ${item.name} (${item.rarity})`);
  };

  const equipItem = (item: Item, fromInventoryIndex: number) => {
    if (!character) return;
    
    if (item.levelReq > character.level) {
        addLog(`Wymagany poziom: ${item.levelReq}`);
        showToast(`Wymagany poziom: ${item.levelReq}`, 'error');
        return;
    }

    if (item.classReq && item.classReq !== character.profession) {
         const professionName = PROFESSIONS[item.classReq].name;
         addLog(`Wymagana klasa: ${professionName}`);
         showToast(`Ten przedmiot jest tylko dla klasy: ${professionName}`, 'error');
         return;
    }

    const slot = item.type;
    const currentEquipped = character.equipment[slot];
    
    const newInventory = [...character.inventory];
    // Pad if needed
    while (newInventory.length < 48) newInventory.push(null);

    // If equipping from inventory, that slot becomes null (or takes equipped item)
    if (currentEquipped) {
        newInventory[fromInventoryIndex] = currentEquipped;
    } else {
        newInventory[fromInventoryIndex] = null;
    }

    const newEquipment = { ...character.equipment, [slot]: item };

    setCharacter(prev => prev ? {
        ...prev,
        equipment: newEquipment,
        inventory: newInventory
    } : null);

    addLog(`Założono: ${item.name}`);
  };

  const unequipItem = (slot: ItemType) => {
    if (!character) return;
    const itemToUnequip = character.equipment[slot];
    if (!itemToUnequip) return;

    const newInventory = addToFirstFreeSlot(character.inventory, itemToUnequip);

    if (!newInventory) {
        addLog("Plecak pełny!");
        return;
    }

    setCharacter(prev => prev ? {
        ...prev,
        equipment: { ...prev.equipment, [slot]: null },
        inventory: newInventory
    } : null);

    addLog(`Zdjęto: ${itemToUnequip.name}`);
  };

  const unlockMonster = (monsterId: string) => {
     if (!unlockedMonsters.includes(monsterId)) {
         const newUnlocked = [...unlockedMonsters, monsterId];
         setUnlockedMonsters(newUnlocked);
         addLog(`Odblokowano nową bestię!`);
     }
  };

  const startCombat = (monsterId: string, type: 'EXPEDITION' | 'DUNGEON' | 'ARENA' = 'EXPEDITION') => {
      if (!character) return;
      
      const stats = calculateDerivedStats(
          character.baseStats, 
          character.level, 
          character.profession, 
          character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
          character.activeTalismans || [],
          character.boughtStats
      );
      
      if (character.currentHp <= stats.maxHp * 0.1) {
          const msg = "Twój stan zdrowia jest zbyt niski, aby walczyć! (≤10%). Odwiedź Medyka.";
          addLog(msg);
          showToast(msg, 'error');
          return; 
      }

      // Check if inventory is full
      if (isInventoryFull(character.inventory)) {
          const msg = "⚠️ Plecak jest pełny! Zdobyte przedmioty mogą przepaść. Zrób miejsce przed walką.";
          addLog(msg);
          showToast(msg, 'error');
          // Don't block combat, just warn
      }

      setActiveMonsterId(monsterId);
      setActiveMonsterType(type); // Set Context
      setIsQuickCombat(false);
      setView('COMBAT');
  };

  const startQuickCombat = (monsterId: string, type: 'EXPEDITION' | 'DUNGEON' | 'ARENA' = 'EXPEDITION') => {
      if (!character) return;
      
      const stats = calculateDerivedStats(
          character.baseStats, 
          character.level, 
          character.profession, 
          character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
          character.activeTalismans || [],
          character.boughtStats
      );
      
      if (character.currentHp <= stats.maxHp * 0.1) {
          const msg = "Zbyt niskie HP! Odwiedź Medyka.";
          addLog(msg);
          showToast(msg, 'error');
          return; 
      }

      // Check if inventory is full
      if (isInventoryFull(character.inventory)) {
          const msg = "⚠️ Plecak jest pełny! Zdobyte przedmioty mogą przepaść. Zrób miejsce przed walką.";
          addLog(msg);
          showToast(msg, 'error');
          // Don't block combat, just warn
      }

      setActiveMonsterId(monsterId);
      setActiveMonsterType(type); // Set Context based on arg
      setIsQuickCombat(true);
      setView('COMBAT');
  };

  const recordKill = (monsterId: string) => {
      setKilledMonsters(prev => ({
          ...prev,
          [monsterId]: (prev[monsterId] || 0) + 1
      }));
  };

  const addTalisman = (talismanId: string) => {
      if (!character) return;
      if (character.talismansInventory?.includes(talismanId)) {
          addLog("Już posiadasz ten talizman.");
          return;
      }
      setCharacter(prev => prev ? {
          ...prev,
          talismansInventory: [...(prev.talismansInventory || []), talismanId]
      } : null);
  };

  const equipTalisman = (talismanId: string, slotIndex: number) => {
      if (!character) return;
      const active = [...(character.activeTalismans || [])];
      
      if (active.includes(talismanId)) {
          addLog("Ten talizman jest już założony.");
          return;
      }

      while (active.length <= slotIndex) active.push("");
      active[slotIndex] = talismanId;
      const cleaned = active.map(id => id || ""); 
      
      setCharacter(prev => prev ? { ...prev, activeTalismans: cleaned } : null);
      addLog("Założono talizman.");
  };

  const unequipTalisman = (slotIndex: number) => {
      if (!character || !character.activeTalismans) return;
      const active = [...character.activeTalismans];
      if (active[slotIndex]) {
          active[slotIndex] = ""; 
          setCharacter(prev => prev ? { ...prev, activeTalismans: active } : null);
          addLog("Zdjęto talizman.");
      }
  };

  const addCombatLog = async (log: CombatLog) => {
      setCombatHistory(prev => [log, ...prev].slice(0, 50));
      if (user && user.id !== 'demo-user' && character) {
          const { error } = await supabase.from('combat_logs').insert({
              user_id: user.id,
              character_id: character.id,
              enemy_name: log.enemy_name,
              result: log.result,
              exp_gained: log.exp_gained,
              gold_gained: log.gold_gained,
              loot_gained: log.loot_gained,
              type: log.type,
              logs: log.logs 
          });
          if (error) console.error("Error saving combat log:", error);
      }
  };

  const unlockBonus = (monsterId: string) => {
      if (!character) return;
      const currentBonuses = character.unlocked_bonuses?.[monsterId] || [];
      if (currentBonuses.length >= 3) return; 

      const allBonuses: BonusType[] = ['GOLD', 'EXP', 'DROP'];
      const available = allBonuses.filter(b => !currentBonuses.includes(b));
      if (available.length === 0) return;

      const picked = available[Math.floor(Math.random() * available.length)];
      const newBonuses = { 
          ...character.unlocked_bonuses, 
          [monsterId]: [...currentBonuses, picked] 
      };

      setCharacter(prev => prev ? { ...prev, unlocked_bonuses: newBonuses } : null);
      const labels = { GOLD: 'Złoto +20%', EXP: 'EXP +15%', DROP: 'Drop +12%' };
      addLog(`ODBLOKOWANO BONUS: ${labels[picked]} z tej bestii!`);
  };

  const saveDungeonProgress = (dungeonId: string, room: number) => {
      if (!character) return;
      const progress = character.dungeon_progress || {};
      const newProgress = { ...progress, [dungeonId]: room };
      setCharacter(prev => prev ? { ...prev, dungeon_progress: newProgress } : null);
  };

  // --- SHOP & DOCTOR ---

  const refreshMerchant = () => {
      if (!character) return;
      // Generate 12-16 items
      const count = Math.floor(Math.random() * 5) + 12; 
      const items: Item[] = [];
      
      for (let i = 0; i < count; i++) {
          // Only Common / Unique
          const roll = Math.random();
          let rarity: 'common' | 'unique' = 'common';
          if (roll > 0.85) rarity = 'unique';
          
          // Level approx player level +/- 2
          const level = Math.max(1, character.level + Math.floor(Math.random() * 5) - 2);
          // Shop Multiplier 0.6
          items.push(generateItem(level, character.profession, rarity, undefined, 0.6));
      }
      setMerchantInventory(items);
  };

  const buyItem = (item: Item, index: number) => {
      if (!character) return;
      if (character.gold < item.value) {
          addLog("Nie stać Cię na ten przedmiot!");
          return;
      }
      
      const newInventory = addToFirstFreeSlot(character.inventory, item);
      if (!newInventory) {
          addLog("Masz pełny plecak!");
          return;
      }

      setCharacter(prev => prev ? {
          ...prev,
          gold: prev.gold - item.value,
          inventory: newInventory
      } : null);

      // Remove from merchant
      const newMerchantInv = [...merchantInventory];
      newMerchantInv.splice(index, 1);
      setMerchantInventory(newMerchantInv);
      
      addLog(`Kupiono: ${item.name}`);
  };

  const sellItem = (index: number) => {
      if (!character) return;
      const item = character.inventory[index];
      if (!item) return;

      // Check if item is locked
      const lockedItems = character.lockedItems || [];
      if (lockedItems.includes(item.id)) {
          addLog("Ten przedmiot jest zablokowany i nie może być sprzedany!");
          return;
      }

      const sellPrice = Math.floor(item.value * 0.4); // 40% value
      
      const newInv = [...character.inventory];
      // Just clear the slot, keep order
      newInv[index] = null;

      setCharacter(prev => prev ? {
          ...prev,
          gold: prev.gold + sellPrice,
          inventory: newInv
      } : null);

      addLog(`Sprzedano: ${item.name} (+${sellPrice} złota)`);
  };

  const updateHp = (newHp: number) => {
      if (!character) return;
      
      const stats = calculateDerivedStats(
          character.baseStats, 
          character.level, 
          character.profession, 
          character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
          character.activeTalismans || [],
          character.boughtStats
      );
      
      const validHp = Math.max(0, Math.min(newHp, stats.maxHp));
      setCharacter(prev => prev ? { ...prev, currentHp: validHp } : null);
  };

  const healCharacter = (cost: number) => {
      if (!character) return;
      if (character.gold < cost) {
          addLog("Nie masz wystarczająco złota!");
          return;
      }
      
      // Heal Full
      const stats = calculateDerivedStats(
          character.baseStats, 
          character.level, 
          character.profession, 
          character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
          character.activeTalismans || [],
          character.boughtStats
      );

      setCharacter(prev => prev ? { 
          ...prev, 
          gold: prev.gold - cost,
          currentHp: stats.maxHp
      } : null);
      addLog("Medyk wyleczył Twoje rany.");
  };

  const payGold = (amount: number): boolean => {
      if (!character || character.gold < amount) return false;
      setCharacter(prev => prev ? { ...prev, gold: prev.gold - amount } : null);
      return true;
  };

  // --- MARKET SYSTEM ---

  const fetchMarketListings = async () => {
      if (user?.id === 'demo-user') {
          // Demo mock listing?
          setMarketListings([]);
          return;
      }

      const { data, error } = await supabase
          .from('market_listings')
          .select('*')
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });
      
      if (error) {
          console.error("Error fetching market listings:", error);
          return;
      }

      if (data) {
          setMarketListings(data as MarketListing[]);
      }
  };

  const createMarketListing = async (item: Item, price: number, inventoryIndex: number): Promise<boolean> => {
      if (!user || !character) return false;
      if (user.id === 'demo-user') {
          addLog("Rynek niedostępny w trybie demo.");
          return false;
      }

      // 5% fee check
      const fee = Math.ceil(price * 0.05);
      if (character.gold < fee) {
          addLog(`Za mało złota na opłatę aukcyjną (${fee}g).`);
          return false;
      }

      // Remove item from inventory & pay fee
      const newInv = [...character.inventory];
      // Just clear slot
      newInv[inventoryIndex] = null;
      
      const { error } = await supabase.from('market_listings').insert({
          seller_id: user.id,
          seller_name: character.name,
          item: item,
          price: price
      });

      if (error) {
          addLog("Błąd wystawiania przedmiotu: " + error.message);
          return false;
      }

      // Update local state immediately
      setCharacter(prev => prev ? {
          ...prev,
          gold: prev.gold - fee,
          inventory: newInv
      } : null);

      addLog(`Wystawiono przedmiot: ${item.name} za ${price}g (Opłata: ${fee}g)`);
      await fetchMarketListings();
      return true;
    };

  const buyMarketListing = async (listing: MarketListing) => {
      if (!user || !character) return;
      if (user.id === 'demo-user') {
          addLog("Rynek niedostępny w trybie demo.");
          return;
      }

      if (character.gold < listing.price) {
          addLog("Nie masz wystarczająco złota!");
          return;
      }

      // Check for space using helper logic
      const newInventory = addToFirstFreeSlot(character.inventory, listing.item);
      if (!newInventory) {
          addLog("Masz pełny plecak!");
          return;
      }

      // Call the stored procedure for safe transaction
      const { data, error } = await supabase.rpc('buy_market_item', {
          listing_id: listing.id,
          buyer_id: user.id
      });

      if (error) {
          addLog("Błąd transakcji: " + error.message);
          return;
      }

      if (data === true) {
          // Success - update local state (optimistic or refetch)
          setCharacter(prev => prev ? {
              ...prev,
              gold: prev.gold - listing.price,
              inventory: newInventory
          } : null);
          
          addLog(`Kupiono przedmiot: ${listing.item.name}`);
          await fetchMarketListings();
      } else {
          addLog("Transakcja nieudana (przedmiot sprzedany lub brak środków).");
          await fetchMarketListings();
      }
  };

  const cancelMarketListing = async (listingId: string) => {
      if (!user || !character) return;
      if (user.id === 'demo-user') return;

      // Optimistic find listing to return item
      const listing = marketListings.find(l => l.id === listingId);
      if (!listing) return;

      const newInventory = addToFirstFreeSlot(character.inventory, listing.item);
      if (!newInventory) {
          addLog("Zrób miejsce w plecaku, aby anulować aukcję!");
          return;
      }

      const { error } = await supabase.from('market_listings').delete().eq('id', listingId).eq('seller_id', user.id);

      if (error) {
          addLog("Błąd anulowania: " + error.message);
          return;
      }

      // Return item to inventory
      setCharacter(prev => prev ? {
          ...prev,
          inventory: newInventory
      } : null);

      addLog("Anulowano aukcję. Przedmiot wrócił do plecaka.");
      await fetchMarketListings();
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
      if (!character) return;
      
      // Ensure indices are valid (0-47)
      if (fromIndex < 0 || fromIndex >= 48 || toIndex < 0 || toIndex >= 48) return;
      if (fromIndex === toIndex) return;

      const newInventory = [...character.inventory];
      
      // Pad inventory if needed
      while (newInventory.length < 48) {
          newInventory.push(null); 
      }

      // Swap logic for fixed slots
      const temp = newInventory[fromIndex];
      newInventory[fromIndex] = newInventory[toIndex];
      newInventory[toIndex] = temp;
      
      setCharacter(prev => prev ? { ...prev, inventory: newInventory } : null);
  };

  const lockItem = (itemId: string) => {
      if (!character) return;
      const lockedItems = character.lockedItems || [];
      if (lockedItems.includes(itemId)) return; // Already locked
      
      setCharacter(prev => prev ? {
          ...prev,
          lockedItems: [...lockedItems, itemId]
      } : null);
      
      addLog("Przedmiot zablokowany przed sprzedażą.");
  };

  const unlockItem = (itemId: string) => {
      if (!character) return;
      const lockedItems = character.lockedItems || [];
      if (!lockedItems.includes(itemId)) return; // Not locked
      
      setCharacter(prev => prev ? {
          ...prev,
          lockedItems: lockedItems.filter(id => id !== itemId)
      } : null);
      
      addLog("Przedmiot odblokowany.");
  };

  const quicksellAll = () => {
      if (!character) return;
      const lockedItems = character.lockedItems || [];
      let totalGold = 0;
      let soldCount = 0;
      
      const newInv = character.inventory.map((item, index) => {
          if (!item) return null;
          if (lockedItems.includes(item.id)) return item; // Keep locked items
          
          const sellPrice = Math.floor(item.value * 0.4);
          totalGold += sellPrice;
          soldCount++;
          return null;
      });

      if (soldCount === 0) {
          addLog("Brak przedmiotów do sprzedania (wszystkie są zablokowane lub plecak jest pusty).");
          return;
      }

      setCharacter(prev => prev ? {
          ...prev,
          gold: prev.gold + totalGold,
          inventory: newInv
      } : null);

      addLog(`Szybka sprzedaż: ${soldCount} przedmiotów za ${totalGold} złota.`);
  };

  const loadRanking = async () => {
      const { data, error } = await supabase
          .from('characters')
          .select('id, name, level, exp, gold, profession')
          .order('level', { ascending: false })
          .order('exp', { ascending: false })
          .limit(100);
      if (error) {
          console.error(error);
          return [];
      }
      return data || [];
  };

  const trainStat = async (stat: 'strength' | 'dexterity' | 'vitality' | 'intelligence') => {
      if (!character || !user) return;
      const currentBonus = (character.boughtStats as any)?.[`${stat}_bonus`] || 0;

      // New Limit Logic
      const baseStat = character.baseStats[stat];
      const currentTotal = baseStat + currentBonus;
      const maxStat = calculateMaxTrainableStat(baseStat, character.level);

      if (currentTotal >= maxStat) {
          addLog(`Osiągnięto maksymalny poziom treningu dla tej statystyki! (${maxStat})`);
          showToast(`Limit treningu osiągnięty! Awansuj, aby zwiększyć limit.`, 'info');
          return;
      }

      const cost = Math.floor(10 * Math.pow(currentBonus, 2));
      if (currentBonus === 0 && cost === 0) {
          // Edge case if bonus is 0, cost is 0? Formula says 10 * 0^2 = 0.
          // Previous logic had "if (bonus === 0) cost = 50".
          // Let's check previous code...
          // Wait, the previous code had `const cost = Math.floor(10 * Math.pow(currentBonus, 2));`
          // And `if (currentBonus === 0) cost = 50;` was in TrainerScreen, not here?
          // No, it was in GameContext too. Let's add base cost for 0.
      }

      let finalCost = cost;
      if (currentBonus === 0) finalCost = 50;

      if (character.gold < finalCost) {
          addLog(`Koszt treningu: ${finalCost} złota. Nie stać Cię!`);
          return;
      }

      // Pay
      const newGold = character.gold - finalCost;
      const newBonus = currentBonus + 1;

      // Update Local
      const newBoughtStats = { ...character.boughtStats, [`${stat}_bonus`]: newBonus };

      setCharacter(prev => prev ? { ...prev, gold: newGold, boughtStats: newBoughtStats } : null);

      addLog(`Wytrenowano ${stat} (+1). Koszt: ${finalCost}`);

      // Update DB
      if (user.id !== 'demo-user') {
          const { error } = await supabase.from('player_stats').upsert({
              character_id: character.id,
              strength_bonus: newBoughtStats.strength_bonus,
              dexterity_bonus: newBoughtStats.dexterity_bonus,
              vitality_bonus: newBoughtStats.vitality_bonus,
              intelligence_bonus: newBoughtStats.intelligence_bonus
          });
          if (error) console.error("Stat update error", error);
      }
  };

<<<<<<< HEAD
  // Helper to convert Character to Monster for PvP combat
  const createPvPMonster = (char: Character): Monster => {
    const stats = calculateDerivedStats(
      char.baseStats,
      char.level,
      char.profession,
      char.equipment ? Object.values(char.equipment).filter(i => i !== null) as any[] : [],
      char.activeTalismans || [],
      char.boughtStats
    );

    return {
      id: `pvp_${char.id}`,
      name: char.name,
      level: char.level,
      hp: stats.maxHp,
      maxHp: stats.maxHp,
      damageMin: stats.physDmgMin,
      damageMax: stats.physDmgMax,
      magicDamageMin: stats.magDmgMin,
      magicDamageMax: stats.magDmgMax,
      magicResist: stats.magResist,
      dodge: stats.dodgeChance,
      sa: stats.attackSpeed,
      armor: stats.armor,
      expReward: 0, // No EXP from PvP
      goldReward: 0, // No Gold from PvP
      lootTable: { rarity: { common: 0, unique: 0, heroic: 0, legendary: 0, tytanic: 0 } },
      type: 'humanoid',
      description: `Gracz: ${char.name} (${char.profession})`,
      profession: char.profession // Store profession for damage type determination
    };
  };

  const loadArenaPlayers = async (): Promise<{ suggested: Character[], others: Character[] }> => {
    if (!character || !user) {
      return { suggested: [], others: [] };
    }

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*, player_stats(*)')
        .neq('id', character.id); // Exclude own character only

      if (error) {
        console.error('Error loading arena players:', error);
        return { suggested: [], others: [] };
      }

      if (!data || data.length === 0) {
        return { suggested: [], others: [] };
      }

      // Map characters similar to refreshCharacters
      const mappedChars = data.map((d: any) => {
        const calculatedBaseStats = getStatsForLevel(d.profession, d.level);
        const maxHp = 50 + (calculatedBaseStats.vitality * 6);
        const rawInventory = d.inventory || [];
        const inventory = [...rawInventory];
        while (inventory.length < 48) inventory.push(null);
        const boughtStats = d.player_stats || { strength_bonus: 0, dexterity_bonus: 0, intelligence_bonus: 0, vitality_bonus: 0 };

        return {
          ...d,
          boughtStats,
          maxExp: d.max_exp || XP_TO_NEXT_LEVEL(d.level),
          baseStats: calculatedBaseStats,
          equipment: typeof d.equipment === 'string' ? JSON.parse(d.equipment) : (d.equipment || {
            weapon: null, helmet: null, armor: null,
            boots: null, gloves: null, amulet: null, ring: null
          }),
          inventory: inventory,
          unlocked_monsters: d.unlocked_monsters || ['monster_1'],
          talismansInventory: d.talismans_inventory || [],
          activeTalismans: d.active_talismans || [],
          unlocked_bonuses: d.unlocked_bonuses || {},
          dungeon_progress: d.dungeon_progress || {},
          kill_stats: d.kill_stats || {},
          lockedItems: d.locked_items || [],
          currentHp: d.current_hp !== undefined ? d.current_hp : maxHp,
          lastRegenTime: d.last_regen_time || Date.now()
        };
      }) as Character[];

      // Split into suggested (similar level ±5) and others
      const playerLevel = character.level;
      const suggested = mappedChars.filter(c => Math.abs(c.level - playerLevel) <= 5);
      const others = mappedChars.filter(c => Math.abs(c.level - playerLevel) > 5);

      // Sort suggested by level difference (closest first)
      suggested.sort((a, b) => Math.abs(a.level - playerLevel) - Math.abs(b.level - playerLevel));
      
      // Sort others by level (descending)
      others.sort((a, b) => b.level - a.level);

      return { suggested, others };
    } catch (err) {
      console.error('Error in loadArenaPlayers:', err);
      return { suggested: [], others: [] };
    }
  };

  const loadPlayerProfile = async (characterId: string): Promise<Character | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*, player_stats(*)')
        .eq('id', characterId)
        .single();

      if (error || !data) {
        console.error('Error loading player profile:', error);
        return null;
      }

      const calculatedBaseStats = getStatsForLevel(data.profession, data.level);
      const maxHp = 50 + (calculatedBaseStats.vitality * 6);
      const rawInventory = data.inventory || [];
      const inventory = [...rawInventory];
      while (inventory.length < 48) inventory.push(null);
      const boughtStats = data.player_stats || { strength_bonus: 0, dexterity_bonus: 0, intelligence_bonus: 0, vitality_bonus: 0 };

      return {
        ...data,
        boughtStats,
        maxExp: data.max_exp || XP_TO_NEXT_LEVEL(data.level),
        baseStats: calculatedBaseStats,
        equipment: typeof data.equipment === 'string' ? JSON.parse(data.equipment) : (data.equipment || {
          weapon: null, helmet: null, armor: null,
          boots: null, gloves: null, amulet: null, ring: null
        }),
        inventory: inventory,
        unlocked_monsters: data.unlocked_monsters || ['monster_1'],
        talismansInventory: data.talismans_inventory || [],
        activeTalismans: data.active_talismans || [],
        unlocked_bonuses: data.unlocked_bonuses || {},
        dungeon_progress: data.dungeon_progress || {},
        kill_stats: data.kill_stats || {},
        lockedItems: data.locked_items || [],
        currentHp: data.current_hp !== undefined ? data.current_hp : maxHp,
        lastRegenTime: data.last_regen_time || Date.now()
      } as Character;
    } catch (err) {
      console.error('Error in loadPlayerProfile:', err);
      return null;
    }
  };

  const createPvPBattle = async (defender: Character, battleData: { attackerHp: number, defenderHp: number, attackerMaxHp: number, defenderMaxHp: number }): Promise<string | null> => {
    if (!character || !user) return null;

    try {
      const { data, error } = await supabase
        .from('pvp_battles')
        .insert({
          attacker_id: character.id,
          defender_id: defender.id,
          attacker_name: character.name,
          defender_name: defender.name,
          status: 'active',
          attacker_hp: battleData.attackerHp,
          defender_hp: battleData.defenderHp,
          attacker_max_hp: battleData.attackerMaxHp,
          defender_max_hp: battleData.defenderMaxHp,
          turn_count: 0,
          battle_logs: []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating PvP battle:', error);
        return null;
      }

      return data.id;
    } catch (err) {
      console.error('Error in createPvPBattle:', err);
      return null;
    }
  };

  const startPvPCombat = async (targetCharacter: Character) => {
    if (!character) return;

    const pvpMonster = createPvPMonster(targetCharacter);
    
    // Calculate initial HP
    const playerStats = calculateDerivedStats(
      character.baseStats,
      character.level,
      character.profession,
      character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
      character.activeTalismans || [],
      character.boughtStats
    );

    // Create battle in database
    const battleId = await createPvPBattle(targetCharacter, {
      attackerHp: playerStats.maxHp,
      defenderHp: pvpMonster.maxHp,
      attackerMaxHp: playerStats.maxHp,
      defenderMaxHp: pvpMonster.maxHp
    });

    if (!battleId) {
      showToast('Nie udało się rozpocząć walki PvP', 'error');
      return;
    }
    
    // Add to monsters array synchronously using functional update
    setMonsters(prev => {
      // Remove any existing PvP monster with same ID
      const filtered = prev.filter(m => !m.id.startsWith('pvp_'));
      return [...filtered, pvpMonster];
    });
    
    // Start combat - use setTimeout to ensure state update
    setTimeout(() => {
      setActiveMonsterId(pvpMonster.id);
      setActiveMonsterType('ARENA');
      changeView('COMBAT');
    }, 0);
  };

  const updatePvPBattle = async (battleId: string, updates: { attackerHp?: number, defenderHp?: number, turnCount?: number, battleLogs?: any[], status?: string, winnerId?: string }) => {
    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.attackerHp !== undefined) updateData.attacker_hp = updates.attackerHp;
      if (updates.defenderHp !== undefined) updateData.defender_hp = updates.defenderHp;
      if (updates.turnCount !== undefined) updateData.turn_count = updates.turnCount;
      if (updates.battleLogs !== undefined) updateData.battle_logs = updates.battleLogs;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.winnerId !== undefined) updateData.winner_id = updates.winnerId;

      const { error } = await supabase
        .from('pvp_battles')
        .update(updateData)
        .eq('id', battleId);

      if (error) {
        console.error('Error updating PvP battle:', error);
      }
    } catch (err) {
      console.error('Error in updatePvPBattle:', err);
    }
  };

  const watchPvPBattle = (battleId: string) => {
    // Load battle and set as active for viewing
    supabase
      .from('pvp_battles')
      .select('*')
      .eq('id', battleId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('Error loading battle:', error);
          return;
        }

        const battle: PvPBattle = {
          id: data.id,
          attacker_id: data.attacker_id,
          defender_id: data.defender_id,
          attacker_name: data.attacker_name,
          defender_name: data.defender_name,
          status: data.status,
          winner_id: data.winner_id,
          battle_logs: data.battle_logs || [],
          attacker_hp: data.attacker_hp,
          defender_hp: data.defender_hp,
          attacker_max_hp: data.attacker_max_hp,
          defender_max_hp: data.defender_max_hp,
          turn_count: data.turn_count,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setActivePvPBattle(battle);
        changeView('COMBAT');
      });
=======
  // --- ACCOUNT STASH METHODS ---

  const moveToStash = (inventoryIndex: number) => {
      if (!character) return;

      const item = character.inventory[inventoryIndex];
      if (!item) {
          addLog("Brak przedmiotu w tym slocie!");
          return;
      }

      // Find first free stash slot
      const freeStashSlot = accountStash.findIndex(slot => slot === null);
      if (freeStashSlot === -1) {
          addLog("Magazyn pełny!");
          showToast("Magazyn jest pełny!", 'error');
          return;
      }

      // Move item from inventory to stash
      const newInventory = [...character.inventory];
      newInventory[inventoryIndex] = null;

      const newStash = [...accountStash];
      newStash[freeStashSlot] = item;

      setCharacter(prev => prev ? { ...prev, inventory: newInventory } : null);
      setAccountStash(newStash);
      addLog(`Przeniesiono do magazynu: ${item.name}`);
  };

  const moveFromStash = (stashIndex: number) => {
      if (!character) return;

      const item = accountStash[stashIndex];
      if (!item) {
          addLog("Brak przedmiotu w tym slocie magazynu!");
          return;
      }

      // Find first free inventory slot
      const newInventory = addToFirstFreeSlot(character.inventory, item);
      if (!newInventory) {
          addLog("Plecak pełny!");
          showToast("Plecak jest pełny!", 'error');
          return;
      }

      // Remove from stash
      const newStash = [...accountStash];
      newStash[stashIndex] = null;

      setCharacter(prev => prev ? { ...prev, inventory: newInventory } : null);
      setAccountStash(newStash);
      addLog(`Pobrano z magazynu: ${item.name}`);
  };

  const moveStashItem = (fromIndex: number, toIndex: number) => {
      if (fromIndex < 0 || fromIndex >= 96 || toIndex < 0 || toIndex >= 96) return;
      if (fromIndex === toIndex) return;

      const newStash = [...accountStash];

      // Swap logic
      const temp = newStash[fromIndex];
      newStash[fromIndex] = newStash[toIndex];
      newStash[toIndex] = temp;

      setAccountStash(newStash);
>>>>>>> from-new
  };

  return (
    <GameContext.Provider value={{
      user,
      session,
      character,
      myCharacters,
      view,
      logs,
      isLoading,
      unlockedMonsters,
      activeMonsterId,
      activeMonsterType,
      killedMonsters,
      combatHistory,
      isQuickCombat,
      merchantInventory,
      monsters,
      itemTemplates,
      marketListings,
      globalWarning,
      globalToast,
      accountStash,
      signIn,
      signUp,
      signOut,
      refreshCharacters,
      selectCharacter,
      createCharacter,
      changeView,
      addLog,
      gainExp,
      gainGold,
      addItem,
      equipItem,
      unequipItem,
      unlockMonster,
      startCombat,
      startQuickCombat,
      recordKill,
      addTalisman,
      equipTalisman,
      unequipTalisman,
      addCombatLog,
      unlockBonus,
      saveDungeonProgress,
      refreshMerchant,
      buyItem,
      sellItem,
      healCharacter,
      payGold,
      updateHp,
      fetchMarketListings,
      createMarketListing,
      buyMarketListing,
      cancelMarketListing,
      moveItem,
      lockItem,
      unlockItem,
      quicksellAll,
      showToast,
      loadRanking,
      trainStat,
<<<<<<< HEAD
      loadArenaPlayers,
      loadPlayerProfile,
      startPvPCombat,
      createPvPBattle,
      updatePvPBattle,
      watchPvPBattle,
      activePvPBattle,
      pvpAttackNotification,
      dismissPvPNotification: () => setPvpAttackNotification(null)
=======
      moveToStash,
      moveFromStash,
      moveStashItem
>>>>>>> from-new
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
