import { DerivedStats } from '../types';

// Simple RNG helper
const roll = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (percentage: number) => Math.random() * 100 < percentage;

export const calculateDamage = (
  attacker: DerivedStats, 
  defender: DerivedStats, 
  type: 'phys' | 'mag' = 'phys'
) => {
  // 1. Dodge Check (using defender's dodgeChance directly, capped at 60%)
  // Dodge chance is already capped at 60% in calculateDerivedStats
  const dodgeChance = Math.min(60, defender.dodgeChance);
  
  // Check if defender dodges the attack
  if (chance(dodgeChance)) {
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
