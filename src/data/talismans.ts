import { TalismanDef } from '../types';

export const TALISMANS: Record<string, TalismanDef> = {
    // Common
    't_common_dmg': { id: 't_common_dmg', name: 'Talizman Skrawka Mocy', rarity: 'common', effectDescription: '+1% obrażeń', statMod: { stat: 'damage_percent', value: 1 } },
    't_common_dodge': { id: 't_common_dodge', name: 'Talizman Porannej Gwiazdy', rarity: 'common', effectDescription: '+1% uniku', statMod: { stat: 'dodge_flat', value: 1 } },
    't_common_int': { id: 't_common_int', name: 'Talizman Czystej Myśli', rarity: 'common', effectDescription: '+1 Inteligencji', statMod: { stat: 'intelligence', value: 1 } },
    't_common_crit': { id: 't_common_crit', name: 'Talizman Słabej Krwi', rarity: 'common', effectDescription: '+1% krytyka', statMod: { stat: 'crit_flat', value: 1 } },
    't_common_str': { id: 't_common_str', name: 'Talizman Polnej Siły', rarity: 'common', effectDescription: '+1 Siły', statMod: { stat: 'strength', value: 1 } },
    't_common_dex': { id: 't_common_dex', name: 'Talizman Praktyki', rarity: 'common', effectDescription: '+1 Zręczności', statMod: { stat: 'dexterity', value: 1 } },
    't_common_vit': { id: 't_common_vit', name: 'Talizman Zdrowej Duszy', rarity: 'common', effectDescription: '+2 Witalności', statMod: { stat: 'vitality', value: 2 } },
    't_common_armor': { id: 't_common_armor', name: 'Talizman Śladu Bestii', rarity: 'common', effectDescription: '+2 Pancerza', statMod: { stat: 'armor_flat', value: 2 } },
    't_common_res': { id: 't_common_res', name: 'Talizman Brązowego Cienia', rarity: 'common', effectDescription: '+1% Odporności', statMod: { stat: 'resist_percent', value: 1 } },
    't_common_speed': { id: 't_common_speed', name: 'Talizman Lekkości', rarity: 'common', effectDescription: '+1% Szybkości', statMod: { stat: 'speed', value: 1 } },

    // Unique
    't_unique_hp': { id: 't_unique_hp', name: 'Talizman Życia', rarity: 'unique', effectDescription: '+30 HP', statMod: { stat: 'hp_flat', value: 30 } },
    't_unique_dodge': { id: 't_unique_dodge', name: 'Talizman Wiatru', rarity: 'unique', effectDescription: '+2% Uniku', statMod: { stat: 'dodge_flat', value: 2 } },
    't_unique_int': { id: 't_unique_int', name: 'Talizman Arcymaga', rarity: 'unique', effectDescription: '+4 Inteligencji', statMod: { stat: 'intelligence', value: 4 } },
    't_unique_str': { id: 't_unique_str', name: 'Talizman Wojownika', rarity: 'unique', effectDescription: '+4 Siły', statMod: { stat: 'strength', value: 4 } },
    't_unique_dex': { id: 't_unique_dex', name: 'Talizman Łowcy', rarity: 'unique', effectDescription: '+4 Zręczności', statMod: { stat: 'dexterity', value: 4 } },
    't_unique_armor': { id: 't_unique_armor', name: 'Talizman Twardej Skóry', rarity: 'unique', effectDescription: '+6 Pancerza', statMod: { stat: 'armor_flat', value: 6 } },
    't_unique_crit': { id: 't_unique_crit', name: 'Talizman Krwi', rarity: 'unique', effectDescription: '+3% Krytyka', statMod: { stat: 'crit_flat', value: 3 } },
    't_unique_phys': { id: 't_unique_phys', name: 'Talizman Ostrza', rarity: 'unique', effectDescription: '+3% Obrażeń Fizycznych', statMod: { stat: 'phys_dmg_percent', value: 3 } },
    't_unique_mag': { id: 't_unique_mag', name: 'Talizman Run', rarity: 'unique', effectDescription: '+3% Obrażeń Magicznych', statMod: { stat: 'mag_dmg_percent', value: 3 } },
    't_unique_res': { id: 't_unique_res', name: 'Talizman Harmonii', rarity: 'unique', effectDescription: '+3% Odporności', statMod: { stat: 'resist_percent', value: 3 } },
    't_unique_vit': { id: 't_unique_vit', name: 'Talizman Kamiennej Duszy', rarity: 'unique', effectDescription: '+6 Witalności', statMod: { stat: 'vitality', value: 6 } },
    't_unique_gold': { id: 't_unique_gold', name: 'Talizman Złotego Błysku', rarity: 'unique', effectDescription: '+6% Złota', statMod: { stat: 'gold_percent', value: 6 } },

    // Heroic
    't_hero_dmg': { id: 't_hero_dmg', name: 'Talizman Płonącej Krwi', rarity: 'heroic', effectDescription: '+6% Obrażeń', statMod: { stat: 'damage_percent', value: 6 } },
    't_hero_int': { id: 't_hero_int', name: 'Talizman Duszy Maga', rarity: 'heroic', effectDescription: '+8 Inteligencji', statMod: { stat: 'intelligence', value: 8 } },
    't_hero_str': { id: 't_hero_str', name: 'Talizman Berserkera', rarity: 'heroic', effectDescription: '+8 Siły', statMod: { stat: 'strength', value: 8 } },
    't_hero_dex': { id: 't_hero_dex', name: 'Talizman Strzelca', rarity: 'heroic', effectDescription: '+8 Zręczności', statMod: { stat: 'dexterity', value: 8 } },
    't_hero_armor': { id: 't_hero_armor', name: 'Talizman Obrońcy', rarity: 'heroic', effectDescription: '+10 Pancerza', statMod: { stat: 'armor_flat', value: 10 } },
    't_hero_vit': { id: 't_hero_vit', name: 'Talizman Twardziela', rarity: 'heroic', effectDescription: '+12 Witalności', statMod: { stat: 'vitality', value: 12 } },
    't_hero_res': { id: 't_hero_res', name: 'Talizman Pustki', rarity: 'heroic', effectDescription: '+5% Odporności', statMod: { stat: 'resist_percent', value: 5 } },
    't_hero_dodge': { id: 't_hero_dodge', name: 'Talizman Cienia', rarity: 'heroic', effectDescription: '+6% Uniku', statMod: { stat: 'dodge_flat', value: 6 } },
    't_hero_beast': { id: 't_hero_beast', name: 'Talizman Władcy Bestii', rarity: 'heroic', effectDescription: '+5% DMG vs Zwierzęta', statMod: { stat: 'dmg_vs_animal', value: 5 } },
    't_hero_undead': { id: 't_hero_undead', name: 'Talizman Mrocznego Pogromcy', rarity: 'heroic', effectDescription: '+5% DMG vs Nieumarli', statMod: { stat: 'dmg_vs_undead', value: 5 } },
    't_hero_mag': { id: 't_hero_mag', name: 'Talizman Eterycznej Duszy', rarity: 'heroic', effectDescription: '+5% Magic DMG', statMod: { stat: 'mag_dmg_percent', value: 5 } },
    't_hero_human': { id: 't_hero_human', name: 'Talizman Łowcy Głów', rarity: 'heroic', effectDescription: '+5% DMG vs Humanoidy', statMod: { stat: 'dmg_vs_humanoid', value: 5 } },

    // Legendary
    't_leg_dmg': { id: 't_leg_dmg', name: 'Talizman Krwi Królów', rarity: 'legendary', effectDescription: '+12% Obrażeń', statMod: { stat: 'damage_percent', value: 12 } },
    't_leg_vit': { id: 't_leg_vit', name: 'Talizman Światła Życia', rarity: 'legendary', effectDescription: '+30 Witalności', statMod: { stat: 'vitality', value: 30 } },
    't_leg_dodge': { id: 't_leg_dodge', name: 'Talizman Czystego Mroku', rarity: 'legendary', effectDescription: '+10% Uniku', statMod: { stat: 'dodge_flat', value: 10 } },
    't_leg_mag': { id: 't_leg_mag', name: 'Talizman Eteru', rarity: 'legendary', effectDescription: '+10% Magic DMG', statMod: { stat: 'mag_dmg_percent', value: 10 } },
    't_leg_phys': { id: 't_leg_phys', name: 'Talizman Rozbicia', rarity: 'legendary', effectDescription: '+10% Phys DMG', statMod: { stat: 'phys_dmg_percent', value: 10 } },
    't_leg_crit': { id: 't_leg_crit', name: 'Talizman Gniewu', rarity: 'legendary', effectDescription: '+10% Krytyka', statMod: { stat: 'crit_flat', value: 10 } },
    't_leg_all': { id: 't_leg_all', name: 'Talizman Bohatera', rarity: 'legendary', effectDescription: '+20 Wszystkich Statystyk', statMod: { stat: 'all_stats', value: 20 } },
    't_leg_res': { id: 't_leg_res', name: 'Talizman Żelaznej Woli', rarity: 'legendary', effectDescription: '+15% Odporności', statMod: { stat: 'resist_percent', value: 15 } },
    't_leg_def': { id: 't_leg_def', name: 'Talizman Strażnika Otchłani', rarity: 'legendary', effectDescription: '-5% Otrzymywanych Obrażeń', statMod: { stat: 'dmg_reduction_percent', value: 5 } },
    't_leg_boss': { id: 't_leg_boss', name: 'Talizman Dusz', rarity: 'legendary', effectDescription: '+10% DMG vs Bossowie', statMod: { stat: 'dmg_vs_boss', value: 10 } },

    // Mythic (Titan)
    't_myth_dmg': { id: 't_myth_dmg', name: 'Talizman Otchłani', rarity: 'mythic', effectDescription: '+20% Obrażeń', statMod: { stat: 'damage_percent', value: 20 } },
    't_myth_mag': { id: 't_myth_mag', name: 'Talizman Starożytnej Pustki', rarity: 'mythic', effectDescription: '+20% Magic DMG + 10% Odporności', statMod: { stat: 'magic_void_set', value: 1 } }, // Special logic needed or split
    't_myth_phys': { id: 't_myth_phys', name: 'Talizman Wiecznego Wojownika', rarity: 'mythic', effectDescription: '+20% Phys DMG + 10% Redukcji', statMod: { stat: 'phys_warrior_set', value: 1 } }
};

