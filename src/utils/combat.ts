import { DerivedStats } from '../types';

// Simple RNG helper
const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (percentage: number) => Math.random() * 100 < percentage;

export const calculateDamage = (
  attacker: DerivedStats, 
  defender: DerivedStats, 
  type: 'phys' | 'mag' = 'phys'
) => {
  // 1. Hit Chance Calculation
  // chance_to_hit = 80% + (Att_Dex * 0.3%) - (Def_Dex * 0.2%)
  // Need raw Dex here, but we only have DerivedStats passed in usually.
  // Approximation: derived 'dodgeChance' is proportional to Dex (Dex * 0.4) -> Dex = Dodge / 0.4
  // Better: Pass BaseStats? For now, we use DerivedStats which has specific combat stats.
  
  // Let's use the explicit Hit Chance formula logic but adapted to available derived stats
  // Attacker Crit Chance is roughly Dex * 0.3 (for non-assassins). 
  // Defender Dodge is Dex * 0.4.
  // Let's trust the derived stats directly or simplify.
  
  // Simplified Hit Check based on Dodge only (Classic RPG):
  // Hit Chance = 95% - Enemy Dodge.
  // Docs Formula: 80% + (AttDex * 0.3) - (DefDex * 0.2)
  // We will approximate AttDex from critChance/0.3 and DefDex from dodgeChance/0.4
  const attDexApprox = attacker.critChance / 0.3;
  const defDexApprox = defender.dodgeChance / 0.4;
  
  let hitChance = 80 + (attDexApprox * 0.3) - (defDexApprox * 0.2);
  hitChance = Math.max(20, Math.min(95, hitChance));

  if (!chance(hitChance)) {
    return { damage: 0, isCrit: false, isMiss: true };
  }

  // 2. Crit Check
  const isCrit = chance(attacker.critChance);
  
  // 3. Base Roll
  let damage = type === 'phys' 
    ? roll(attacker.physDmgMin, attacker.physDmgMax)
    : roll(attacker.magDmgMin, attacker.magDmgMax);

  // 4. Crit Multiplier (150% default)
  if (isCrit) damage = Math.floor(damage * 1.5);

  // 5. Mitigation (Armor/Resist)
  // reduction = (pancerz * 0.7%) capped at 60% -> This is already calculated in DerivedStats.physResist
  const reduction = type === 'phys' ? defender.physResist : defender.magResist;
  damage = Math.floor(damage * (1 - reduction));

  // Ensure min 1 dmg
  return { damage: Math.max(1, damage), isCrit, isMiss: false };
};
