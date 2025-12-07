import { Item, ItemRarity, Profession, LootTable } from '../types';
import { TALISMANS } from '../data/talismans';
import { generateItem } from './itemGenerator';
import { getLegendaryItem } from '../data/legendaryItems';

export const generateLoot = (
  level: number,
  profession: Profession,
  lootTable?: LootTable,
  itemTemplates: Item[] = [],
  playerName?: string,
  bossName?: string
): Item => {
  // Default LootTable if not provided
  if (!lootTable) {
      return generateItem(level, profession, 'common');
  }

  // 0. Determine Target Profession (Random / Equal Chance)
  // Users requested equal drop rates for all classes to encourage trading/market.
  const allProfs: Profession[] = ['warrior', 'assassin', 'mage', 'cleric'];
  const targetProfession = allProfs[Math.floor(Math.random() * allProfs.length)];

  // 1. Level Gating
  const allowedRarities = ['common'];
  // Check if level_gate exists (it might be missing on older data or partial updates)
  if (lootTable.level_gate) {
      if (lootTable.level_gate.unique !== undefined && level >= lootTable.level_gate.unique) allowedRarities.push('unique');
      if (lootTable.level_gate.heroic !== undefined && level >= lootTable.level_gate.heroic) allowedRarities.push('heroic');
      if (lootTable.level_gate.legendary !== undefined && level >= lootTable.level_gate.legendary) allowedRarities.push('legendary');
      if (lootTable.level_gate.tytanic !== undefined && level >= lootTable.level_gate.tytanic) allowedRarities.push('tytanic');
  } else {
      // Fallback if no level_gate defined
      allowedRarities.push('unique');
  }

  // 2. Rarity Roll (Sequential)
  const rand = Math.random() * 100;
  let rarity: ItemRarity = 'common';

  // Safety check for rarity table presence - handle both missing rarity object and missing tytanic property
  const rarities = lootTable.rarity || { common: 100, unique: 0, heroic: 0, legendary: 0, tytanic: 0 };
  // Ensure all required properties exist with safe defaults
  const safeRarities = {
    common: rarities.common ?? 100,
    unique: rarities.unique ?? 0,
    heroic: rarities.heroic ?? 0,
    legendary: rarities.legendary ?? 0,
    tytanic: rarities.tytanic ?? 0
  };

  if (allowedRarities.includes('tytanic') && safeRarities.tytanic > 0 && rand < safeRarities.tytanic) {
      rarity = 'mythic';
  }
  else if (allowedRarities.includes('legendary') && rand < (safeRarities.tytanic + safeRarities.legendary)) {
      rarity = 'legendary';
  }
  else if (allowedRarities.includes('heroic') && rand < (safeRarities.tytanic + safeRarities.legendary + safeRarities.heroic)) {
      rarity = 'heroic';
  }
  else if (allowedRarities.includes('unique') && rand < (safeRarities.tytanic + safeRarities.legendary + safeRarities.heroic + safeRarities.unique)) {
      rarity = 'unique';
  }
  else {
      rarity = 'common';
  }

  // 3. Item Selection
  // If Legendary/Mythic, use FIXED DATABASE (no more random generation!)
  if (rarity === 'legendary' || rarity === 'mythic') {
      // Boss-Specific Signature Slots (if defined) or all slots (fallback)
      const allSlots: ItemType[] = ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'shield', 'amulet', 'ring'];
      const availableSlots = lootTable.signatureSlots && lootTable.signatureSlots.length > 0
          ? lootTable.signatureSlots
          : allSlots;

      const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];

      // Construct item ID based on profession, rarity tier, and slot
      const prefix = rarity === 'legendary' ? 'leg' : 'tytan';
      const itemId = `${prefix}_${targetProfession}_${randomSlot}`;

      // Get FIXED item from database
      const legendaryItem = getLegendaryItem(itemId, level);

      if (legendaryItem) {
          // Return fixed item with enforced class requirement
          const item: Item = {
              ...legendaryItem,
              classReq: targetProfession
          };

          // MYTHIC ONLY: Add "Slain By" metadata for prestige
          if (rarity === 'mythic' && playerName && bossName) {
              item.slainBy = {
                  playerName,
                  bossName,
                  date: new Date().toISOString()
              };
          }

          return item;
      }

      // Fallback if template not found - use semi-random generation
      console.warn(`[LootSystem] Legendary/Mythic template not found: ${itemId}, falling back to generator`);
      return generateItem(level, targetProfession, rarity);
  }

  // Common / Unique / Heroic - use semi-random generation
  return generateItem(level, targetProfession, rarity);
};

export const generateTalismanLoot = (level: number): string | null => {
    const rand = Math.random();
    let rarity = 'common';
    if (rand > 0.98) rarity = 'mythic';
    else if (rand > 0.92) rarity = 'legendary';
    else if (rand > 0.75) rarity = 'heroic';
    else if (rand > 0.40) rarity = 'unique';
    
    const candidates = Object.values(TALISMANS).filter(t => t.rarity === rarity);
    
    if (candidates.length === 0) {
         const commonCandidates = Object.values(TALISMANS).filter(t => t.rarity === 'common');
         if (commonCandidates.length === 0) return null;
         return commonCandidates[Math.floor(Math.random() * commonCandidates.length)].id;
    }
    
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    return chosen.id;
};
