import { BaseStats, DerivedStats, Profession, Item } from '../types';
import { TALISMANS } from '../data/talismans';

// Total EXP for Level L = 55 * L^2 + 110 * L
const getTotalExpForLevel = (level: number) => 55 * Math.pow(level, 2) + 110 * level;

export const XP_TO_NEXT_LEVEL = (currentLevel: number) => {
    const totalNext = getTotalExpForLevel(currentLevel + 1);
    const totalCurrent = getTotalExpForLevel(currentLevel);
    return Math.floor(totalNext - totalCurrent);
};

export const calculateMonsterBaseExp = (level: number, isBoss: boolean = false): number => {
    let baseExp = 4 + (level * 2.5) + Math.pow(level, 1.5);
    if (isBoss) baseExp *= 1.35;
    return Math.floor(baseExp);
};

export const calculateMonsterExpGain = (playerLevel: number, monsterLevel: number, baseExp: number): number => {
    const diff = monsterLevel - playerLevel;
    let modifier = 1.0;

    // 1. Level Difference Logic
    if (diff > 0) {
        // Monster stronger: +10% exp per level diff (max +50%)
        const bonus = Math.min(0.50, diff * 0.10);
        modifier += bonus;
    } else if (diff < 0) {
        // Player stronger: -15% exp per level diff (max -90%)
        // e.g. Lvl 5 vs Lvl 1 (-4) = -60% exp.
        const penalty = Math.min(0.90, Math.abs(diff) * 0.15);
        modifier -= penalty;
    }
    
    modifier = Math.max(0.1, modifier); // Minimum 10% exp always
    
    let finalExp = baseExp * modifier;

    // 2. Random Variance (+/- 10%)
    // range [0.9, 1.1]
    const variance = 0.9 + Math.random() * 0.2;
    finalExp *= variance;

    return Math.floor(finalExp);
};

export const calculateMonsterGold = (level: number, isBoss: boolean = false): number => {
    if (isBoss) {
        return (level * 8) + Math.floor(Math.random() * 26) + 5; 
    } else {
        const base = 1 + Math.floor(level * 1.2);
        const rng = Math.floor(Math.random() * (level * 0.6 + 1)); 
        return base + rng;
    }
};

const getClassBaseSA = (prof: Profession): number => {
    switch(prof) {
        case 'assassin': return 120;
        case 'mage': return 100;
        case 'cleric': return 95;
        case 'warrior': return 90;
        default: return 90;
    }
};

const getWeaponSABonus = (profession: Profession, weapon?: Item | null, shield?: Item | null): number => {
    let bonus = 0;
    if (weapon) {
        if (profession === 'assassin') bonus += 20; 
        else if (profession === 'mage') bonus += 10; 
        else if (profession === 'warrior') bonus += 5; 
        else if (profession === 'cleric') bonus += 5; 
    }
    if (shield) {
        if (profession === 'warrior' || profession === 'cleric') {
            bonus -= 5;
        }
    }
    return bonus;
};

export const calculateDerivedStats = (
  base: BaseStats, 
  level: number, 
  profession: Profession, 
  equipment: Item[] = [],
  activeTalismans: string[] = []
): DerivedStats => {
  const safeBase = base || { strength: 0, dexterity: 0, intelligence: 0, vitality: 0 };

  // 1. Talismans
  let tStr = 0, tDex = 0, tInt = 0, tVit = 0;
  let tHp = 0, tArmor = 0, tDodge = 0, tCrit = 0;
  let tDmgPct = 0, tPhysPct = 0, tMagPct = 0, tResistPct = 0, tDmgRed = 0;
  let tSA = 0, tInit = 0, tStab = 0;
  
  // Simple accumulators for other stats if they exist on talismans later
  let tGold = 0, tExp = 0, tDrop = 0;

  activeTalismans.forEach(id => {
      if (!id) return;
      const def = TALISMANS[id];
      if (!def || !def.statMod) return;
      
      const { stat, value } = def.statMod;
      switch (stat) {
          case 'strength': tStr += value; break;
          case 'dexterity': tDex += value; break;
          case 'intelligence': tInt += value; break;
          case 'vitality': tVit += value; break;
          case 'hp_flat': tHp += value; break;
          case 'armor_flat': tArmor += value; break;
          case 'dodge_flat': tDodge += value; break;
          case 'crit_flat': tCrit += value; break;
          case 'damage_percent': tDmgPct += value; break;
          case 'phys_dmg_percent': tPhysPct += value; break;
          case 'mag_dmg_percent': tMagPct += value; break;
          case 'resist_percent': tResistPct += value; break;
          case 'dmg_reduction_percent': tDmgRed += value; break;
          case 'all_stats': tStr += value; tDex += value; tInt += value; tVit += value; break;
          case 'attack_speed': tSA += value; break;
          case 'initiative': tInit += value; break;
          case 'stability': tStab += value; break;
          case 'gold_percent': tGold += value; break;
          case 'exp_percent': tExp += value; break;
          case 'drop_percent': tDrop += value; break;
      }
  });

  // 2. Equipment Accumulators
  let eStr = 0, eDex = 0, eInt = 0, eVit = 0;
  let eHp = 0, eArmor = 0, eDmgMin = 0, eDmgMax = 0, eMagDmg = 0;
  let eCrit = 0, eDodge = 0, eMagRes = 0, eHeal = 0, eBlock = 0;
  let eSA = 0, eInit = 0, eStab = 0;

  // New Secondary Stats
  let eCritDmg = 0;
  let eBlockVal = 0;
  let eArmorPen = 0;
  let eMagicPen = 0;
  let ePiercing = 0;
  
  // Defensive
  let eRedDmg = 0;
  let eHpRegen = 0;
  let eManaShield = 0;
  
  // Utility
  let eGold = 0;
  let eExp = 0;
  let eDrop = 0;
  
  // Special
  let eDmgUndead = 0;
  let eDmgBeast = 0;
  let eDmgDemon = 0;
  
  // Mechanics
  let hasFirstHitShield = false;
  let hasSanctifiedAura = false;
  let eEthereal = 0;
  let eBloodFury = 0;
  let eOverload = 0;
  let eUnbreakable = 0;
  
  let ePoison = 0;
  let eBurn = 0;

  let weaponItem: Item | null = null;
  let shieldItem: Item | null = null;

  equipment.forEach(item => {
    if (item?.type === 'weapon') weaponItem = item;
    if (item?.type === 'shield') shieldItem = item;

    if (item?.stats) {
      const s = item.stats;
      eStr += s.strength || 0;
      eDex += s.dexterity || 0;
      eInt += s.intelligence || 0;
      eVit += s.vitality || 0;
      eHp += s.hp || 0;
      eArmor += s.armor || 0;
      eDmgMin += s.damageMin || 0;
      eDmgMax += s.damageMax || 0;
      eMagDmg += s.magicDamage || 0;
      eCrit += s.critChance || 0;
      eDodge += s.dodgeChance || 0;
      eMagRes += s.magicResist || 0;
      eHeal += s.healingPower || 0;
      eBlock += s.blockChance || 0;
      eSA += s.attackSpeed || 0;
      eInit += s.initiative || 0;
      eStab += s.stability || 0;

      // New
      eCritDmg += s.critDamage || 0;
      eBlockVal += s.blockValue || 0;
      eArmorPen += s.armorPen || 0;
      eMagicPen += s.magicPen || 0;
      ePiercing += s.piercingDamage || 0;
      
      eRedDmg += s.reducedDamage || 0;
      eHpRegen += s.hpRegen || 0;
      eManaShield += s.manaShield || 0;
      
      eGold += s.bonusGold || 0;
      eExp += s.bonusExp || 0;
      eDrop += s.dropChance || 0;
      
      eDmgUndead += s.damageVsUndead || 0;
      eDmgBeast += s.damageVsBeast || 0;
      eDmgDemon += s.damageVsDemon || 0;
      
      if (s.firstHitShield) hasFirstHitShield = true;
      if (s.sanctifiedAura) hasSanctifiedAura = true;
      
      eEthereal += s.etherealVeil || 0;
      eBloodFury += s.bloodFury || 0;
      eOverload += s.overload || 0;
      eUnbreakable += s.unbreakable || 0;
      
      ePoison = Math.max(ePoison, s.poisonChance || 0); // Max or Sum? Usually Max for chance or Sum for stacks. Let's use Max for chance.
      eBurn = Math.max(eBurn, s.burnChance || 0);
    }
  });

  // 3. Total Stats
  const str = safeBase.strength + tStr + eStr;
  const dex = safeBase.dexterity + tDex + eDex;
  const int = safeBase.intelligence + tInt + eInt;
  const vit = safeBase.vitality + tVit + eVit;

  // 4. Derived
  const maxHp = (vit * 6) + (level * 10) + 50 + tHp + eHp; 
  const armor = (str * 0.5) + eArmor + tArmor;

  let dodgeChance = (dex * 0.3) + eDodge + tDodge;
  let critChance = (dex * 0.3) + eCrit + tCrit;

  if (profession === 'assassin') {
      critChance += dex * 0.2; 
      dodgeChance += dex * 0.1;
  }
  
  const baseWpnMin = 1 + level; 
  const baseWpnMax = 2 + level;

  let damageStat = 0;
  let multiplier = 1.0;

  switch (profession) {
      case 'mage': damageStat = int; multiplier = 1.7; break;
      case 'warrior': damageStat = str; multiplier = 1.8; break;
      case 'assassin': damageStat = dex; multiplier = 1.4; break;
      case 'cleric': damageStat = int; multiplier = 1.4; break;
  }

  const statDmg = (damageStat * multiplier) * 0.5;

  const physBonus = 1 + (tDmgPct + tPhysPct) / 100;
  const magBonus = 1 + (tDmgPct + tMagPct) / 100;

  let physDmgMin = 0, physDmgMax = 0, magDmgMin = 0, magDmgMax = 0;

  if (profession === 'mage') {
       const baseMagic = eMagDmg + statDmg;
       magDmgMin = Math.floor((baseWpnMin + baseMagic) * magBonus);
       magDmgMax = Math.floor((baseWpnMax + baseMagic) * magBonus);
       physDmgMin = Math.floor((baseWpnMin + eDmgMin) * physBonus);
       physDmgMax = Math.floor((baseWpnMax + eDmgMax) * physBonus);
  } else {
       const basePhys = eDmgMin + statDmg;
       const basePhysMax = eDmgMax + statDmg;
       physDmgMin = Math.floor((baseWpnMin + basePhys) * physBonus);
       physDmgMax = Math.floor((baseWpnMax + basePhysMax) * physBonus);
       magDmgMin = Math.floor(eMagDmg * magBonus);
       magDmgMax = Math.floor(eMagDmg * magBonus);
  }

  let physResist = Math.min(0.60, (armor * 0.005));
  physResist += (tResistPct + tDmgRed) / 100;
  
  let magResistBase = Math.min(0.60, (int * 0.005));
  let magResistTotal = magResistBase + (eMagRes / 100) + ((tResistPct + tDmgRed) / 100);
  
  const finalPhysResist = Math.min(0.75, physResist);
  const finalMagResist = Math.min(0.75, magResistTotal);

  const baseSA = getClassBaseSA(profession);
  const weaponSABonus = getWeaponSABonus(profession, weaponItem, shieldItem);
  const dexSABonus = Math.floor(dex / 5);
  
  const attackSpeed = baseSA + weaponSABonus + dexSABonus + eSA + tSA;
  const initiative = eInit + tInit;
  const stability = eStab + tStab;

  return {
    maxHp: Math.floor(maxHp),
    armor: Math.floor(armor),
    dodgeChance: parseFloat(dodgeChance.toFixed(2)),
    critChance: parseFloat(critChance.toFixed(2)),
    physDmgMin, physDmgMax, magDmgMin, magDmgMax,
    physResist: parseFloat(finalPhysResist.toFixed(2)),
    magResist: parseFloat(finalMagResist.toFixed(2)),
    blockChance: parseFloat(eBlock.toFixed(2)),
    healingPower: parseFloat(eHeal.toFixed(2)),
    
    attackSpeed: Math.max(10, attackSpeed),
    initiative: parseFloat(initiative.toFixed(2)),
    stability: parseFloat(stability.toFixed(2)),

    strength: Math.floor(str),
    dexterity: Math.floor(dex),
    intelligence: Math.floor(int),
    vitality: Math.floor(vit),

    // New Stats
    critDamage: 150 + eCritDmg, // Base 150%
    blockValue: eBlockVal,
    armorPen: eArmorPen,
    magicPen: eMagicPen,
    piercingDamage: ePiercing,
    
    reducedDamage: parseFloat((eRedDmg + tDmgRed).toFixed(2)),
    hpRegen: eHpRegen,
    manaShield: eManaShield,
    
    bonusGold: eGold + tGold,
    bonusExp: eExp + tExp,
    dropChance: eDrop + tDrop,
    
    damageVsUndead: eDmgUndead,
    damageVsBeast: eDmgBeast,
    damageVsDemon: eDmgDemon,
    
    poisonChance: ePoison,
    burnChance: eBurn,
    
    // Mechanics
    etherealVeil: eEthereal,
    bloodFury: eBloodFury,
    overload: eOverload,
    unbreakable: eUnbreakable,
    // Flags in boolean? Or logic handles numbers > 0.
  };
};
