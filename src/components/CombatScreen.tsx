import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { calculateDerivedStats, calculateMonsterExpGain, calculateMonsterGold } from '../utils/formulas';
import { calculateDamage } from '../utils/combat';
import { generateLoot } from '../utils/lootSystem';
import { DerivedStats, Monster, CombatTurn } from '../types';
import { Sword, Skull, Zap, Heart } from 'lucide-react';
import { getAvatarSrc, getMonsterSrc } from '../utils/assets';

export const CombatScreen: React.FC = () => {
  const { 
      character, changeView, addLog, gainExp, gainGold, addItem, activeMonsterId, activeMonsterType,
      addCombatLog, isQuickCombat, recordKill, unlockBonus, updateHp, healCharacter,
      monsters, itemTemplates
  } = useGame();
  const [monster, setMonster] = useState<Monster | null>(null);
  const [monsterHp, setMonsterHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(0);
  const [combatLogs, setCombatLogs] = useState<CombatTurn[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleOver, setBattleOver] = useState(false);
  const [battleResult, setBattleResult] = useState<'WIN' | 'LOSS' | null>(null);
  const [rewards, setRewards] = useState<{exp: number, gold: number, loot?: string} | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  
  // Status Effects
  const [monsterDebuffs, setMonsterDebuffs] = useState<{poison: number, burn: number}>({poison: 0, burn: 0});

  // Image Error States
  const [playerImgError, setPlayerImgError] = useState(false);
  const [monsterImgError, setMonsterImgError] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Helper to get Monster SA
  const getMonsterSA = (m: Monster) => {
      const base = m.attackSpeed || (80 + (m.level * 2));
      const typeBonus = m.type === 'boss' ? 30 : 0;
      return base + typeBonus;
  };

  // Init Battle
  useEffect(() => {
    if (!character || !activeMonsterId || monsters.length === 0) return;
    
    const selectedMonster = monsters.find(m => m.id === activeMonsterId);
    if (!selectedMonster) {
        addLog("Błąd: Nie znaleziono potwora!");
        changeView('HUB');
        return;
    }

    setMonster(selectedMonster);
    
    const stats = calculateDerivedStats(
        character.baseStats, 
        character.level, 
        character.profession, 
        character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
        character.activeTalismans || [],
        character.boughtStats
    );

    setMonsterHp(selectedMonster.maxHp);
    setPlayerHp(character.currentHp); 
    setPlayerImgError(false);
    setMonsterImgError(false);
    setCombatLogs([]);
    setBattleOver(false);
    setBattleResult(null);
    setRewards(null);
    setTurnCount(0);
    setMonsterDebuffs({poison: 0, burn: 0});

    // INITIATIVE LOGIC
    const playerSA = stats.attackSpeed;
    const monsterSA = getMonsterSA(selectedMonster);
    
    let playerStarts = true;
    if (playerSA > monsterSA) playerStarts = true;
    else if (monsterSA > playerSA) playerStarts = false;
    else playerStarts = Math.random() > 0.5;

    setIsPlayerTurn(playerStarts);

    // Initial Log about Initiative
    const initLog: CombatTurn = {
        attackerId: 'system', defenderId: 'system',
        action: 'mechanic', damage: 0, isCrit: false,
        log: playerStarts 
            ? `Rozpoczynasz walkę! (Twoja SA: ${playerSA} vs ${monsterSA})` 
            : `${selectedMonster.name} jest szybszy i atakuje pierwszy! (SA: ${monsterSA} vs ${playerSA})`
    };
    setCombatLogs([initLog]);

  }, [activeMonsterId, monsters]);

  // Scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [combatLogs]);

  // Battle Loop
  useEffect(() => {
    if (!monster || !character || battleOver) return;

    if (isQuickCombat) {
        resolveQuickCombat(monster.maxHp, character.currentHp);
    } else {
        // Delay only if it's not the very first instant turn, or make it consistent
        const timer = setTimeout(() => {
            executeTurn();
        }, 800); // Slightly faster turns
        return () => clearTimeout(timer);
    }
  }, [turnCount, battleOver, monster, character, isQuickCombat]);

  const resolveQuickCombat = (startMonsterHp: number, startPlayerHp: number) => {
      if (!monster || !character) return;

      const playerStats = calculateDerivedStats(
        character.baseStats, character.level, character.profession, 
        character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
        character.activeTalismans || [],
        character.boughtStats
      );

      const monsterSA = getMonsterSA(monster);
      const monsterStats: DerivedStats = {
        maxHp: monster.maxHp, armor: monster.defense, dodgeChance: 5, critChance: 5,
        physDmgMin: monster.damageMin, physDmgMax: monster.damageMax,
        magDmgMin: 0, magDmgMax: 0, physResist: monster.defense / (monster.defense + 50), magResist: 0,
        healingPower: 0, blockChance: 0,
        attackSpeed: monsterSA, initiative: 0, stability: 0, strength: 0, dexterity: 0, intelligence: 0, vitality: 0,
        // Defaults for new required properties
        critDamage: 150, armorPen: 0, magicPen: 0, piercingDamage: 0,
        hpRegen: 0, reducedDamage: 0, manaShield: 0, bonusGold: 0, bonusExp: 0, dropChance: 0,
        damageVsUndead: 0, damageVsBeast: 0, damageVsDemon: 0,
        poisonChance: 0, burnChance: 0, etherealVeil: 0, bloodFury: 0, overload: 0, unbreakable: 0, blockValue: 0
      };

      const damageType: 'phys' | 'mag' = (character.profession === 'mage' || character.profession === 'cleric') ? 'mag' : 'phys';

      let currentMonsterHp = startMonsterHp;
      let currentPlayerHp = startPlayerHp;
      let logs: CombatTurn[] = [];
      let turn = turnCount;
      
      // Initiative (Already decided if mid-fight? Re-eval for quick combat simplicity)
      let isPlayer = isPlayerTurn;

      logs.push({
          attackerId: 'system', defenderId: 'system', action: 'mechanic', damage: 0, isCrit: false,
          log: `=== SZYBKA WALKA ===`
      });

      // DoT Simulation (Reset DoTs for simplicity in quick combat or carry over?)
      // Let's reset for simplicity or assume 0
      let poisonTurns = 0;
      let burnTurns = 0;
      const poisonDmg = Math.floor(playerStats.dexterity * 0.5);
      const burnDmg = Math.floor(playerStats.intelligence * 0.5);
      
      const poisonChance = playerStats.poisonChance || 0;
      const burnChance = playerStats.burnChance || 0;

      while (currentMonsterHp > 0 && currentPlayerHp > 0 && turn < 100) {
          turn++;

          // Apply DoTs to Monster
          if (poisonTurns > 0) {
              currentMonsterHp -= poisonDmg;
              poisonTurns--;
              logs.push({ attackerId: 'player', defenderId: 'monster', action: 'mechanic', damage: poisonDmg, isCrit: false, log: `Trucizna zadaje ${poisonDmg} obrażeń.`});
          }
          if (burnTurns > 0) {
              currentMonsterHp -= burnDmg;
              burnTurns--;
              logs.push({ attackerId: 'player', defenderId: 'monster', action: 'mechanic', damage: burnDmg, isCrit: false, log: `Podpalenie zadaje ${burnDmg} obrażeń.`});
          }

          if (currentMonsterHp <= 0) break;

          if (isPlayer) {
              const result = calculateDamage(playerStats, monsterStats, damageType);
              currentMonsterHp = Math.max(0, currentMonsterHp - result.damage);
              
              logs.push({
                attackerId: 'player', defenderId: 'monster',
                action: result.isMiss ? 'miss' : 'attack',
                damage: result.damage, isCrit: result.isCrit,
                log: result.isMiss ? `${monster.name} wykonał UNIK!` : `Zadałeś ${result.damage} obrażeń ${result.isCrit ? '(KRYTYK!)' : ''}`
              });

              // Apply Effects
              if (!result.isMiss) {
                  if (character.profession === 'assassin' && Math.random() * 100 < poisonChance) poisonTurns = 3;
                  if (character.profession === 'mage' && Math.random() * 100 < burnChance) burnTurns = 3;
              }

          } else {
              const result = calculateDamage(monsterStats, playerStats, 'phys');
              currentPlayerHp = Math.max(0, currentPlayerHp - result.damage);
              logs.push({
                attackerId: 'monster', defenderId: 'player',
                action: result.isMiss ? 'miss' : 'attack',
                damage: result.damage, isCrit: result.isCrit,
                log: result.isMiss ? `Uniknąłeś ataku!` : `${monster.name} zadał Ci ${result.damage} obrażeń`
              });
          }
          isPlayer = !isPlayer;
      }

      setMonsterHp(currentMonsterHp);
      setPlayerHp(currentPlayerHp);
      setCombatLogs(prev => [...prev, ...logs]); // Append logs
      setTurnCount(turn);

      if (currentPlayerHp > 0) endBattle(true, [...combatLogs, ...logs], currentPlayerHp);
      else endBattle(false, [...combatLogs, ...logs], 0);
  };

  const executeTurn = () => {
    if (!monster || !character) return;

    const playerStats = calculateDerivedStats(
        character.baseStats, character.level, character.profession, 
        character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
        character.activeTalismans || [],
        character.boughtStats
    );
    
    const monsterStats: DerivedStats = {
      maxHp: monster.maxHp, armor: monster.defense, dodgeChance: 5, critChance: 5,
      physDmgMin: monster.damageMin, physDmgMax: monster.damageMax,
      magDmgMin: 0, magDmgMax: 0, physResist: monster.defense / (monster.defense + 50), magResist: 0,
      healingPower: 0, blockChance: 0,
      attackSpeed: 0, initiative: 0, stability: 0, strength: 0, dexterity: 0, intelligence: 0, vitality: 0,
      critDamage: 150, armorPen: 0, magicPen: 0, piercingDamage: 0,
        hpRegen: 0, reducedDamage: 0, manaShield: 0, bonusGold: 0, bonusExp: 0, dropChance: 0,
        damageVsUndead: 0, damageVsBeast: 0, damageVsDemon: 0,
        poisonChance: 0, burnChance: 0, etherealVeil: 0, bloodFury: 0, overload: 0, unbreakable: 0, blockValue: 0
    };

    const damageType: 'phys' | 'mag' = (character.profession === 'mage' || character.profession === 'cleric') ? 'mag' : 'phys';

    let currentTurnLogs: CombatTurn[] = [];
    let currentMonsterHp = monsterHp;

    if (isPlayerTurn) {
        // Player Turn
        const result = calculateDamage(playerStats, monsterStats, damageType);
        currentMonsterHp = Math.max(0, currentMonsterHp - result.damage);
        setMonsterHp(currentMonsterHp);
      
        currentTurnLogs.push({
            attackerId: 'player', defenderId: 'monster',
            action: result.isMiss ? 'miss' : 'attack',
            damage: result.damage, isCrit: result.isCrit,
            log: result.isMiss ? `${monster.name} wykonał UNIK!` : `Zadałeś ${result.damage} obrażeń ${result.isCrit ? '(KRYTYK!)' : ''}`
        });

        // Apply New Status Effects
        if (!result.isMiss) {
             if (character.profession === 'assassin' && playerStats.poisonChance) {
                 if (Math.random() * 100 < playerStats.poisonChance) {
                     setMonsterDebuffs(prev => ({...prev, poison: 3}));
                     currentTurnLogs.push({attackerId: 'player', defenderId: 'monster', action: 'mechanic', damage: 0, isCrit: false, log: "Nałożyłeś truciznę!"});
                 }
             }
             if (character.profession === 'mage' && playerStats.burnChance) {
                 if (Math.random() * 100 < playerStats.burnChance) {
                     setMonsterDebuffs(prev => ({...prev, burn: 3}));
                     currentTurnLogs.push({attackerId: 'player', defenderId: 'monster', action: 'mechanic', damage: 0, isCrit: false, log: "Podpaliłeś wroga!"});
                 }
             }
        }

        if (currentMonsterHp <= 0) {
            setCombatLogs(prev => [...prev, ...currentTurnLogs]);
            endBattle(true, [...combatLogs, ...currentTurnLogs], playerHp); 
            return;
        }
    } else {
        // Monster Turn
        let dotDmg = 0;
        if (monsterDebuffs.poison > 0) {
            const dmg = Math.floor(playerStats.dexterity * 0.5); // Scaling poison
            dotDmg += dmg;
            currentMonsterHp -= dmg;
            setMonsterDebuffs(prev => ({...prev, poison: prev.poison - 1}));
            currentTurnLogs.push({attackerId: 'player', defenderId: 'monster', action: 'mechanic', damage: dmg, isCrit: false, log: `Trucizna zadaje ${dmg} obrażeń.`});
        }
        if (monsterDebuffs.burn > 0) {
            const dmg = Math.floor(playerStats.intelligence * 0.5); // Scaling burn
            dotDmg += dmg;
            currentMonsterHp -= dmg;
            setMonsterDebuffs(prev => ({...prev, burn: prev.burn - 1}));
            currentTurnLogs.push({attackerId: 'player', defenderId: 'monster', action: 'mechanic', damage: dmg, isCrit: false, log: `Ogień zadaje ${dmg} obrażeń.`});
        }

        setMonsterHp(currentMonsterHp);

        if (currentMonsterHp <= 0) {
            setCombatLogs(prev => [...prev, ...currentTurnLogs]);
            endBattle(true, [...combatLogs, ...currentTurnLogs], playerHp);
            return;
        }

        // Then Monster Attacks
        const result = calculateDamage(monsterStats, playerStats, 'phys');
        const newPlayerHp = Math.max(0, playerHp - result.damage);
        setPlayerHp(newPlayerHp);

        currentTurnLogs.push({
            attackerId: 'monster', defenderId: 'player',
            action: result.isMiss ? 'miss' : 'attack',
            damage: result.damage, isCrit: result.isCrit,
            log: result.isMiss ? `Uniknąłeś ataku!` : `${monster.name} zadał Ci ${result.damage} obrażeń`
        });

        if (newPlayerHp <= 0) {
            setCombatLogs(prev => [...prev, ...currentTurnLogs]);
            endBattle(false, [...combatLogs, ...currentTurnLogs], 0);
            return;
        }
    }

    setCombatLogs(prev => [...prev, ...currentTurnLogs]);
    setIsPlayerTurn(!isPlayerTurn);
    setTurnCount(prev => prev + 1);
  };

  const endBattle = (win: boolean, finalLogs: CombatTurn[], remainingHp: number) => {
    setBattleOver(true);
    setBattleResult(win ? 'WIN' : 'LOSS');
    
    updateHp(remainingHp);

    if (win && monster) {
      // DUNGEON PROGRESSION LOGIC
      const dungeonRunStr = localStorage.getItem('active_dungeon_run');
      if (dungeonRunStr && activeMonsterType === 'DUNGEON') {
          try {
              const run = JSON.parse(dungeonRunStr);
              localStorage.setItem('active_dungeon_run', JSON.stringify({ ...run, status: 'COMPLETED' }));
          } catch(e) {}
      }

      // 1. EXP Calculation
      let expGain = calculateMonsterExpGain(character!.level, monster.level, monster.expReward);
      
      const bonuses = character!.unlocked_bonuses?.[monster.id] || [];
      
      const stats = calculateDerivedStats(character!.baseStats, character!.level, character!.profession, Object.values(character!.equipment).filter(i=>i) as any, character!.activeTalismans || [], character!.boughtStats);
      const bonusExpPct = (stats.bonusExp || 0) / 100;
      const bonusGoldPct = (stats.bonusGold || 0) / 100;

      if (bonuses.includes('EXP')) {
          expGain = Math.floor(expGain * (1.15 + bonusExpPct));
      } else {
          expGain = Math.floor(expGain * (1 + bonusExpPct));
      }
      gainExp(expGain);
      
      // 2. Gold Calculation
      let goldReward = calculateMonsterGold(monster.level, monster.type === 'boss');
      
      if (bonuses.includes('GOLD')) {
          goldReward = Math.floor(goldReward * (1.20 + bonusGoldPct));
      } else {
          goldReward = Math.floor(goldReward * (1 + bonusGoldPct));
      }

      gainGold(goldReward);
      recordKill(monster.id);
      
      // Removed Manual Unlock (Handled by Level Up + useEffect in GameContext)

      // 4. Mastery Bonus Chance
      if (Math.random() < 0.03) {
          unlockBonus(monster.id);
          addLog("Odblokowano nowy bonus bestiariusza!");
      }

      // 5. Loot
      let lootItemName: string | undefined;
      let dropChance = 0.30; 
      
      if (stats.dropChance) dropChance += stats.dropChance / 100;
      if (bonuses.includes('DROP')) dropChance += 0.12;

      if (Math.random() < dropChance) {
        const item = generateLoot(monster.level, character!.profession, monster.lootTable, itemTemplates);
        addItem(item);
        lootItemName = item.name;
      }

      setRewards({
          exp: expGain,
          gold: goldReward,
          loot: lootItemName
      });

      addCombatLog({
          enemy_name: monster.name,
          result: 'WIN',
          exp_gained: expGain,
          gold_gained: goldReward,
          loot_gained: lootItemName,
          type: 'EXPEDITION',
          logs: finalLogs
      });

    } else {
      if (monster) {
          addCombatLog({
              enemy_name: monster.name,
              result: 'LOSS',
              exp_gained: 0,
              gold_gained: 0,
              type: 'EXPEDITION',
              logs: finalLogs
          });
      }
    }
  };

  if (!monster || !character) return <div className="p-10 text-center text-slate-500 animate-pulse">Ładowanie areny...</div>;

  const maxHp = calculateDerivedStats(
      character.baseStats, 
      character.level, 
      character.profession, 
      character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
      character.activeTalismans || [],
      character.boughtStats
  ).maxHp;

  const playerStats = calculateDerivedStats(
    character.baseStats, 
    character.level, 
    character.profession, 
    character.equipment ? Object.values(character.equipment).filter(i => i !== null) as any[] : [],
    character.activeTalismans || [],
    character.boughtStats
  );

  const isMagicClass = character.profession === 'mage' || character.profession === 'cleric';
  
  const monsterSA = getMonsterSA(monster);

  // Handle return view logic
  const handleReturn = () => {
      if (activeMonsterType === 'DUNGEON') {
          changeView('DUNGEON');
      } else if (activeMonsterType === 'ARENA') {
          changeView('ARENA');
      } else {
          changeView('EXPEDITION');
      }
  };

  const handleHeal = () => {
      const healCost = character.level * 5;
      healCharacter(healCost);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-300 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 h-auto md:h-[220px] relative gap-4">
        
        {/* PLAYER CARD */}
        <div className="w-full md:flex-1 h-[220px] bg-slate-900 rounded-xl overflow-hidden relative border-2 border-amber-600 shadow-2xl group">
            {!playerImgError ? (
                <img 
                    src={getAvatarSrc(character.profession)}
                    alt={character.profession}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    onError={() => setPlayerImgError(true)}
                />
            ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <Sword size={60} className="text-amber-500 opacity-50" />
                 </div>
            )}

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex flex-col items-center">
                <h3 className="text-white font-bold text-lg font-serif drop-shadow-md">{character.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1">
                    <span>{character.profession}</span>
                    <span className="text-slate-500">•</span>
                    <span>Lvl {character.level}</span>
                </div>
                <div className="w-full h-2 bg-slate-900/80 rounded-full mt-2 relative border border-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500" style={{width: `${(playerHp/maxHp)*100}%`}}></div>
                </div>
                <span className="text-[10px] text-white mt-0.5 font-mono opacity-80">{playerHp} / {maxHp}</span>
            </div>
        </div>

        {/* VS */}
        <div className="shrink-0 flex flex-col items-center z-10">
            <span className="text-4xl font-black text-red-600 font-serif italic drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse">VS</span>
            <div className="bg-black/80 px-2 py-0.5 rounded text-[10px] text-slate-400 uppercase tracking-widest border border-white/10 mt-1">
                Tura <span className="text-white font-bold">{turnCount}</span>
            </div>
        </div>

        {/* MONSTER CARD */}
        <div className="w-full md:flex-1 h-[220px] bg-slate-900 rounded-xl overflow-hidden relative border-2 border-red-700 shadow-2xl group">
            {!monsterImgError ? (
                <img 
                    src={getMonsterSrc(monster.id)}
                    alt={monster.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    onError={() => setMonsterImgError(true)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <Skull size={60} className="text-red-500 opacity-50" />
                </div>
            )}

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex flex-col items-center">
                <h3 className="text-red-400 font-bold text-lg font-serif drop-shadow-md">{monster.name}</h3>
                <div className="text-[10px] text-red-800/80 font-bold uppercase tracking-wider mt-1 bg-black/40 px-2 py-0.5 rounded">
                    Poziom {monster.level}
                </div>
                <div className="w-full h-2 bg-slate-900/80 rounded-full mt-2 relative border border-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500" style={{width: `${(monsterHp/monster.maxHp)*100}%`}}></div>
                </div>
                <span className="text-[10px] text-white mt-0.5 font-mono opacity-80">{monsterHp} / {monster.maxHp}</span>
            </div>
        </div>
      </div>

      {/* Stats Comparison Bar */}
      <div className="flex justify-between bg-[#0b0d10] p-2 rounded-lg mb-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider border border-white/10 shadow-inner items-center">
        <div className="flex gap-4 pl-2">
            <span>DMG: <span className="text-amber-500 font-mono text-xs">
                {isMagicClass 
                    ? `${playerStats.magDmgMin}-${playerStats.magDmgMax}`
                    : `${playerStats.physDmgMin}-${playerStats.physDmgMax}`}
            </span></span>
            <span>SA: <span className="text-cyan-400 font-mono text-xs">{playerStats.attackSpeed}</span></span>
            <span>Unik: <span className="text-green-400 font-mono text-xs">{playerStats.dodgeChance}%</span></span>
        </div>
        
        {/* Quick Combat Button */}
        {!battleOver && (
            <button 
                onClick={() => resolveQuickCombat(monsterHp, playerHp)}
                className="flex items-center gap-1 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-500 px-3 py-1 rounded border border-yellow-700/50 text-xs transition-colors"
            >
                <Zap size={12} /> Szybka Walka
            </button>
        )}

        <div className="flex gap-4 pr-2 text-right">
            <span>Unik: <span className="text-green-400 font-mono text-xs">5%</span></span>
            <span>SA: <span className="text-red-400 font-mono text-xs">{monsterSA}</span></span>
            <span>DMG: <span className="text-red-500 font-mono text-xs">{monster.damageMin}-{monster.damageMax}</span></span>
        </div>
      </div>

      {/* Combat Log */}
      <div className="h-[250px] bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner overflow-hidden flex flex-col relative">
         <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10"></div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {combatLogs.length === 0 && (
                <div className="text-center text-slate-600 italic py-10">Oczekiwanie na pierwszy ruch...</div>
            )}
            {combatLogs.map((log, idx) => (
            <div 
                key={idx} 
                className={`py-2 px-3 rounded text-xs border-l-2 animate-in slide-in-from-bottom-1 duration-200 ${
                log.attackerId === 'player' 
                    ? 'bg-slate-900/50 border-green-600 text-green-100 ml-8' 
                    : log.attackerId === 'system'
                        ? 'bg-blue-900/20 border-blue-500 text-blue-200 mx-8 text-center'
                        : 'bg-red-950/30 border-red-600 text-red-100 mr-8'
                }`}
            >
                <div className="flex justify-between items-center">
                    <span className="font-bold">{log.log}</span>
                    {log.isCrit && <span className="text-[9px] bg-yellow-500 text-black px-1 rounded font-bold uppercase">CRIT</span>}
                </div>
            </div>
            ))}
            
            {/* Result Panel */}
            {battleOver && battleResult && (
                <div className={`mt-4 p-4 rounded-lg border-2 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4 duration-500 relative
                    ${battleResult === 'WIN' ? 'border-amber-500/50' : 'border-red-600/50'}`}
                >
                    {/* Discrete Heal Button */}
                    <button 
                        onClick={handleHeal}
                        className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-950/40 hover:bg-green-900/60 text-green-400 px-2 py-1.5 rounded border border-green-900/50 text-[10px] font-mono transition-colors"
                        title="Ulecz postać"
                    >
                        <Heart size={12} className="text-green-500" />
                        <span>{character.level * 5}g</span>
                    </button>

                    <h3 className={`text-2xl font-black uppercase tracking-widest ${battleResult === 'WIN' ? 'text-amber-500' : 'text-red-600'}`}>
                        {battleResult === 'WIN' ? 'Zwycięstwo!' : 'Porażka'}
                    </h3>
                    
                    {battleResult === 'WIN' && (
                        <div className="flex gap-6 text-sm font-mono">
                            <span className="text-blue-400 font-bold">+{rewards?.exp} EXP</span>
                            <span className="text-yellow-500 font-bold">+{rewards?.gold} Złota</span>
                            {rewards?.loot && <span className="text-purple-400 font-bold">🎁 {rewards.loot}</span>}
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={handleReturn}
                            className={`px-8 py-2 rounded font-bold text-sm uppercase tracking-widest transition-all border ${
                                battleResult === 'WIN'
                                    ? 'bg-amber-700 hover:bg-amber-600 border-amber-500 text-white'
                                    : 'bg-slate-700 hover:bg-slate-600 border-slate-500 text-slate-300'
                            }`}
                        >
                            {battleResult === 'WIN' ? 'Kontynuuj' : 'Powrót do mapy'}
                        </button>
                    </div>
                </div>
            )}
            
            <div ref={logsEndRef} />
         </div>
      </div>
    </div>
  );
};
