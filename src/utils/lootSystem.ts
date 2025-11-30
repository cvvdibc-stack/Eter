import { Item, ItemRarity, Profession, LootTable } from '../types';
import { TALISMANS } from '../data/talismans';
import { generateItem } from './itemGenerator';

export const generateLoot = (level: number, profession: Profession, lootTable?: LootTable, itemTemplates: Item[] = []): Item => {
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
  // If Legendary/Mythic, we prefer using the predefined Templates for Name/Icon
  if (rarity === 'legendary' || rarity === 'mythic') {
      let itemId: string | null = null;

      if (rarity === 'legendary') {
          itemId = lootTable.legends[targetProfession]; // Use targetProfession
      } else {
          // Mythic / Tytanic
          if (lootTable.tytanic) {
              itemId = lootTable.tytanic[targetProfession]; // Use targetProfession
          }
      }

      if (itemId && itemTemplates.length > 0) {
          const template = itemTemplates.find(i => i.id === itemId);
          if (template) {
              // RE-GENERATE STATS based on the template's type and intended class
              const generated = generateItem(level, targetProfession, rarity, template.type);
              
              // Calculate Value correctly for template-based items
              // value = rarityMultiplier (handled in generateItem) * 20 * levelReq
              // generateItem already handles value calculation now. 
              // We just need to ensure we keep the template name/icon but use generated stats (as per original logic to keep balance dynamic)
              // Or should we use template stats?
              // "Generator często daje itemy za mocne -> Balans robi się niemożliwy"
              // "Itemy z bazy (legend/tytan) nie mają classReq" -> "Naprawa: Itemy z loot generatora mają: classReq: profession"
              // If we use template stats, they are fixed JSON. If we regenerate, we use generator logic.
              // The plan says: "Itemy z bazy (legend/tytan) nie mają classReq ... Dodać kolumnę... i przy seedowaniu ustawiać poprawną klasę."
              // It doesn't explicitly say "Don't use generator stats". But "Generator często daje itemy za mocne" suggests maybe we SHOULD use fixed stats?
              // However, fixed stats don't scale with level.
              // "Dla szablonów z bazy: value = rarityMultiplier * 20 * (levelReq)" -> Suggests we use template properties.
              
              // Let's stick to: Use Generator for stats to ensure scaling, but use Template Name/Icon/ID.
              // AND ensure classReq is set.
              
              return {
                  ...generated,
                  name: template.name,
                  icon: template.icon || generated.icon,
                  id: Math.random().toString(36).substr(2, 9),
                  classReq: targetProfession, // Enforce
                  value: generated.value // Generator value is now correct
              };
          }
      }
  }

  // Common / Unique / Heroic OR Fallback
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
