import { Item, ItemRarity, Profession, LootTable } from '../types';
import { TALISMANS } from '../data/talismans';
import { generateItem } from './itemGenerator';

export const generateLoot = (level: number, profession: Profession, lootTable?: LootTable, itemTemplates: Item[] = []): Item => {
  // Default LootTable if not provided
  if (!lootTable) {
      return generateItem(level, profession, 'common');
  }

  // 1. Level Gating
  const allowedRarities = ['common'];
  if (level >= lootTable.level_gate.unique) allowedRarities.push('unique');
  if (level >= lootTable.level_gate.heroic) allowedRarities.push('heroic');
  if (level >= lootTable.level_gate.legendary) allowedRarities.push('legendary');
  if (level >= lootTable.level_gate.tytanic) allowedRarities.push('tytanic');

  // 2. Rarity Roll (Sequential)
  const rand = Math.random() * 100;
  let rarity: ItemRarity = 'common';

  if (allowedRarities.includes('tytanic') && lootTable.rarity.tytanic > 0 && rand < lootTable.rarity.tytanic) {
      rarity = 'mythic';
  }
  else if (allowedRarities.includes('legendary') && rand < (lootTable.rarity.tytanic + lootTable.rarity.legendary)) {
      rarity = 'legendary';
  }
  else if (allowedRarities.includes('heroic') && rand < (lootTable.rarity.tytanic + lootTable.rarity.legendary + lootTable.rarity.heroic)) {
      rarity = 'heroic';
  }
  else if (allowedRarities.includes('unique') && rand < (lootTable.rarity.tytanic + lootTable.rarity.legendary + lootTable.rarity.heroic + lootTable.rarity.unique)) {
      rarity = 'unique';
  }
  else {
      rarity = 'common';
  }

  // 3. Item Selection
  // If Legendary/Mythic, we prefer using the predefined Templates for Name/Icon,
  // BUT we MUST regenerate stats to ensure consistency with the new generator rules (caps, bonuses count, etc.)
  if (rarity === 'legendary' || rarity === 'mythic') {
      // Previously picked randomClass. Now enforcing PLAYER PROFESSION
      // "Czy jest gdzies wzmianka o tym, że mogę dropnąć tylko itemy na swoją profesje?"
      // YES, we enforce it now.
      
      let itemId: string | null = null;

      if (rarity === 'legendary') {
          itemId = lootTable.legends[profession];
      } else {
          // Mythic / Tytanic
          if (lootTable.tytanic) {
              itemId = lootTable.tytanic[profession];
          }
      }

      if (itemId && itemTemplates.length > 0) {
          const template = itemTemplates.find(i => i.id === itemId);
          if (template) {
              // RE-GENERATE STATS based on the template's type and intended class (which is profession)
              const generated = generateItem(level, profession, rarity, template.type);
              
              return {
                  ...generated,
                  name: template.name,
                  icon: template.icon || generated.icon,
                  id: Math.random().toString(36).substr(2, 9)
              };
          }
      }
  }

  // Common / Unique / Heroic OR Fallback
  return generateItem(level, profession, rarity);
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
