import { Item } from '../types';

/**
 * LEGENDARY & MYTHIC ITEMS - FIXED STATS SYSTEM
 *
 * Hierarchy: common < unique < heroic < LEGENDARY < MYTHIC
 *
 * Multipliers:
 * - common: 1.0x
 * - unique: 1.4x
 * - heroic: 1.9x
 * - legendary: 3.5x
 * - mythic: 8.0x
 *
 * Coverage: 8 slots × 4 classes × 2 tiers = 64 unique items
 */

// ============================================================================
// WARRIOR LEGENDARY ITEMS (Level 16)
// ============================================================================

const WARRIOR_LEGENDARY_16 = {
  weapon: {
    id: 'leg_warrior_weapon',
    name: 'Ostrze Tytanów',
    type: 'weapon' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'weapon_leg_warrior',
    upgradeLevel: 0,
    stats: {
      damageMin: 112,     // lvl 16 × 2.0 × 3.5
      damageMax: 168,     // lvl 16 × 3.0 × 3.5
      strength: 32,       // lvl 16 × 2.0
      vitality: 14,
      armor: 28,
      critChance: 10,
      armorPen: 18,
      piercingDamage: 28,
      firstHitShield: 1
    },
    value: 2240
  },

  armor: {
    id: 'leg_warrior_armor',
    name: 'Pancerz Nieugięcia',
    type: 'armor' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'armor_leg_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 96,          // lvl 16 × 2.0 × 3.0 (armor scaling)
      strength: 28,
      vitality: 24,
      hp: 240,
      reducedDamage: 8,
      blockValue: 20,
      hpRegen: 3
    },
    value: 2240
  },

  helmet: {
    id: 'leg_warrior_helmet',
    name: 'Hełm Praojców',
    type: 'helmet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'helmet_leg_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 64,
      strength: 24,
      vitality: 20,
      hp: 180,
      blockChance: 8,
      initiative: 3,
      stability: 2
    },
    value: 1920
  },

  boots: {
    id: 'leg_warrior_boots',
    name: 'Trzewiki Stalowego Marszu',
    type: 'boots' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'boots_leg_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 48,
      strength: 20,
      vitality: 18,
      hp: 160,
      initiative: 4,
      stability: 3,
      dodgeChance: 5
    },
    value: 1760
  },

  gloves: {
    id: 'leg_warrior_gloves',
    name: 'Rękawice Pogromcy',
    type: 'gloves' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'gloves_leg_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 40,
      strength: 22,
      damageMin: 16,
      damageMax: 24,
      critChance: 8,
      attackSpeed: 2,
      piercingDamage: 18
    },
    value: 1920
  },

  shield: {
    id: 'leg_warrior_shield',
    name: 'Tarcza Nieśmiertelnych',
    type: 'shield' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'shield_leg_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 72,
      blockChance: 18,
      blockValue: 32,
      strength: 18,
      vitality: 22,
      hp: 200,
      reducedDamage: 6
    },
    value: 2080
  },

  amulet: {
    id: 'leg_warrior_amulet',
    name: 'Amulet Krwawej Zemsty',
    type: 'amulet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'amulet_leg_warrior',
    upgradeLevel: 0,
    stats: {
      strength: 26,
      vitality: 20,
      hp: 220,
      critDamage: 25,
      hpRegen: 4,
      damageVsUndead: 15
    },
    value: 2080
  },

  ring: {
    id: 'leg_warrior_ring',
    name: 'Pierścień Wojownika',
    type: 'ring' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'warrior' as const,
    icon: 'ring_leg_warrior',
    upgradeLevel: 0,
    stats: {
      strength: 24,
      vitality: 16,
      critChance: 9,
      attackSpeed: 2,
      armorPen: 12,
      bonusExp: 5
    },
    value: 1920
  }
};

// ============================================================================
// ASSASSIN LEGENDARY ITEMS (Level 16)
// ============================================================================

const ASSASSIN_LEGENDARY_16 = {
  weapon: {
    id: 'leg_assassin_weapon',
    name: 'Cień Nocy',
    type: 'weapon' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'weapon_leg_assassin',
    upgradeLevel: 0,
    stats: {
      damageMin: 96,
      damageMax: 144,
      dexterity: 36,
      critChance: 18,
      critDamage: 35,
      dodgeChance: 12,
      poisonChance: 22,
      initiative: 5,
      stability: 3
    },
    value: 2240
  },

  armor: {
    id: 'leg_assassin_armor',
    name: 'Płaszcz Cieni',
    type: 'armor' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'armor_leg_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 48,
      dexterity: 32,
      vitality: 20,
      dodgeChance: 14,
      initiative: 5,
      stability: 4,
      poisonChance: 10
    },
    value: 2240
  },

  helmet: {
    id: 'leg_assassin_helmet',
    name: 'Maska Mroku',
    type: 'helmet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'helmet_leg_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 32,
      dexterity: 28,
      critChance: 10,
      dodgeChance: 10,
      initiative: 6,
      stability: 3
    },
    value: 1920
  },

  boots: {
    id: 'leg_assassin_boots',
    name: 'Buty Bezgłośnego Kroku',
    type: 'boots' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'boots_leg_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 24,
      dexterity: 30,
      dodgeChance: 12,
      initiative: 7,
      stability: 4,
      attackSpeed: 3
    },
    value: 1760
  },

  gloves: {
    id: 'leg_assassin_gloves',
    name: 'Pazury Węża',
    type: 'gloves' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'gloves_leg_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 20,
      dexterity: 26,
      damageMin: 14,
      damageMax: 21,
      critChance: 12,
      poisonChance: 18,
      attackSpeed: 3
    },
    value: 1920
  },

  shield: {
    id: 'leg_assassin_shield',
    name: 'Krótkie Ostrze Zemsty',
    type: 'shield' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'shield_leg_assassin',
    upgradeLevel: 0,
    stats: {
      damageMin: 40,
      damageMax: 60,
      dexterity: 20,
      poisonChance: 25,
      critChance: 10,
      attackSpeed: 2
    },
    value: 2080
  },

  amulet: {
    id: 'leg_assassin_amulet',
    name: 'Amulet Trucizny',
    type: 'amulet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'amulet_leg_assassin',
    upgradeLevel: 0,
    stats: {
      dexterity: 30,
      poisonChance: 20,
      critDamage: 30,
      dodgeChance: 8,
      damageVsBeast: 18
    },
    value: 2080
  },

  ring: {
    id: 'leg_assassin_ring',
    name: 'Pierścień Cienia',
    type: 'ring' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'assassin' as const,
    icon: 'ring_leg_assassin',
    upgradeLevel: 0,
    stats: {
      dexterity: 28,
      critChance: 11,
      attackSpeed: 3,
      initiative: 4,
      bonusGold: 8
    },
    value: 1920
  }
};

// ============================================================================
// MAGE LEGENDARY ITEMS (Level 16)
// ============================================================================

const MAGE_LEGENDARY_16 = {
  weapon: {
    id: 'leg_mage_weapon',
    name: 'Laska Wieczności',
    type: 'weapon' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'weapon_leg_mage',
    upgradeLevel: 0,
    stats: {
      magicDamage: 154,   // lvl 16 × 2.75 × 3.5
      intelligence: 34,
      magicPen: 22,
      burnChance: 20,
      magicResist: 14,
      initiative: 4,
      overload: 14
    },
    value: 2240
  },

  armor: {
    id: 'leg_mage_armor',
    name: 'Szata Eteryczna',
    type: 'armor' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'armor_leg_mage',
    upgradeLevel: 0,
    stats: {
      armor: 28,
      intelligence: 32,
      vitality: 18,
      magicResist: 18,
      manaShield: 16,
      hp: 200,
      hpRegen: 3
    },
    value: 2240
  },

  helmet: {
    id: 'leg_mage_helmet',
    name: 'Tiara Arcymaga',
    type: 'helmet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'helmet_leg_mage',
    upgradeLevel: 0,
    stats: {
      armor: 20,
      intelligence: 30,
      magicDamage: 40,
      magicResist: 14,
      initiative: 4,
      overload: 8
    },
    value: 1920
  },

  boots: {
    id: 'leg_mage_boots',
    name: 'Sandały Astralnego Marszu',
    type: 'boots' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'boots_leg_mage',
    upgradeLevel: 0,
    stats: {
      armor: 16,
      intelligence: 26,
      vitality: 16,
      initiative: 6,
      manaShield: 12,
      dodgeChance: 6
    },
    value: 1760
  },

  gloves: {
    id: 'leg_mage_gloves',
    name: 'Rękawice Płomieni',
    type: 'gloves' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'gloves_leg_mage',
    upgradeLevel: 0,
    stats: {
      armor: 14,
      intelligence: 24,
      magicDamage: 36,
      burnChance: 18,
      attackSpeed: 2,
      magicPen: 14
    },
    value: 1920
  },

  shield: {
    id: 'leg_mage_shield',
    name: 'Orb Nieskończoności',
    type: 'shield' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'shield_leg_mage',
    upgradeLevel: 0,
    stats: {
      magicDamage: 60,
      intelligence: 22,
      burnChance: 16,
      manaShield: 18,
      magicResist: 16,
      overload: 10
    },
    value: 2080
  },

  amulet: {
    id: 'leg_mage_amulet',
    name: 'Amulet Ognistego Serca',
    type: 'amulet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'amulet_leg_mage',
    upgradeLevel: 0,
    stats: {
      intelligence: 28,
      magicDamage: 50,
      burnChance: 16,
      magicPen: 18,
      damageVsDemon: 20
    },
    value: 2080
  },

  ring: {
    id: 'leg_mage_ring',
    name: 'Pierścień Pradawnej Mocy',
    type: 'ring' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'mage' as const,
    icon: 'ring_leg_mage',
    upgradeLevel: 0,
    stats: {
      intelligence: 26,
      magicDamage: 44,
      attackSpeed: 2,
      initiative: 3,
      bonusExp: 6
    },
    value: 1920
  }
};

// ============================================================================
// CLERIC LEGENDARY ITEMS (Level 16)
// ============================================================================

const CLERIC_LEGENDARY_16 = {
  weapon: {
    id: 'leg_cleric_weapon',
    name: 'Berło Świętej Mocy',
    type: 'weapon' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'weapon_leg_cleric',
    upgradeLevel: 0,
    stats: {
      magicDamage: 135,
      intelligence: 30,
      vitality: 22,
      healingPower: 28,
      magicResist: 16,
      hpRegen: 4,
      sanctifiedAura: 1
    },
    value: 2240
  },

  armor: {
    id: 'leg_cleric_armor',
    name: 'Habit Sprawiedliwych',
    type: 'armor' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'armor_leg_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 64,
      intelligence: 28,
      vitality: 26,
      hp: 260,
      healingPower: 22,
      magicResist: 16,
      reducedDamage: 6
    },
    value: 2240
  },

  helmet: {
    id: 'leg_cleric_helmet',
    name: 'Korona Błogosławionego',
    type: 'helmet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'helmet_leg_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 48,
      intelligence: 26,
      vitality: 20,
      hp: 200,
      magicResist: 14,
      hpRegen: 3
    },
    value: 1920
  },

  boots: {
    id: 'leg_cleric_boots',
    name: 'Buty Pielgrzyma',
    type: 'boots' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'boots_leg_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 36,
      intelligence: 22,
      vitality: 22,
      hp: 180,
      initiative: 4,
      healingPower: 16
    },
    value: 1760
  },

  gloves: {
    id: 'leg_cleric_gloves',
    name: 'Rękawice Uzdrowiciela',
    type: 'gloves' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'gloves_leg_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 28,
      intelligence: 20,
      vitality: 18,
      healingPower: 24,
      hpRegen: 4,
      magicResist: 10
    },
    value: 1920
  },

  shield: {
    id: 'leg_cleric_shield',
    name: 'Relikwiarz Światła',
    type: 'shield' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'shield_leg_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 56,
      blockChance: 14,
      blockValue: 24,
      intelligence: 18,
      vitality: 20,
      healingPower: 18,
      magicResist: 14
    },
    value: 2080
  },

  amulet: {
    id: 'leg_cleric_amulet',
    name: 'Amulet Ochrony',
    type: 'amulet' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'amulet_leg_cleric',
    upgradeLevel: 0,
    stats: {
      intelligence: 24,
      vitality: 24,
      hp: 240,
      healingPower: 20,
      reducedDamage: 8,
      hpRegen: 4
    },
    value: 2080
  },

  ring: {
    id: 'leg_cleric_ring',
    name: 'Pierścień Błogosławieństwa',
    type: 'ring' as const,
    rarity: 'legendary' as const,
    levelReq: 16,
    classReq: 'cleric' as const,
    icon: 'ring_leg_cleric',
    upgradeLevel: 0,
    stats: {
      intelligence: 22,
      vitality: 20,
      healingPower: 18,
      hpRegen: 3,
      bonusExp: 6
    },
    value: 1920
  }
};

// ============================================================================
// WARRIOR MYTHIC ITEMS (Level 26)
// ============================================================================

const WARRIOR_MYTHIC_26 = {
  weapon: {
    id: 'tytan_warrior_weapon',
    name: 'Wola Nieśmiertelnych',
    type: 'weapon' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'weapon_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      damageMin: 416,     // lvl 26 × 2.0 × 8.0
      damageMax: 624,     // lvl 26 × 3.0 × 8.0
      strength: 78,       // lvl 26 × 3.0
      vitality: 39,
      armor: 78,
      critChance: 18,
      critDamage: 35,
      armorPen: 35,
      piercingDamage: 78,
      attackSpeed: 4,
      firstHitShield: 1,
      bloodFury: 15,
      unbreakable: 12
    },
    value: 13520
  },

  armor: {
    id: 'tytan_warrior_armor',
    name: 'Tytaniczny Pancerz Niebios',
    type: 'armor' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'armor_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 312,         // lvl 26 × 4.0 × 3.0
      strength: 65,
      vitality: 52,
      hp: 520,
      reducedDamage: 15,
      blockValue: 45,
      hpRegen: 6,
      unbreakable: 15
    },
    value: 13520
  },

  helmet: {
    id: 'tytan_warrior_helmet',
    name: 'Korona Władcy Wojny',
    type: 'helmet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'helmet_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 208,
      strength: 58,
      vitality: 45,
      hp: 390,
      blockChance: 14,
      critChance: 12,
      initiative: 5,
      stability: 4
    },
    value: 11960
  },

  boots: {
    id: 'tytan_warrior_boots',
    name: 'Buty Tytana',
    type: 'boots' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'boots_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 156,
      strength: 52,
      vitality: 39,
      hp: 340,
      initiative: 7,
      stability: 5,
      dodgeChance: 8,
      attackSpeed: 2
    },
    value: 10920
  },

  gloves: {
    id: 'tytan_warrior_gloves',
    name: 'Karwasze Zniszczenia',
    type: 'gloves' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'gloves_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 130,
      strength: 55,
      damageMin: 52,
      damageMax: 78,
      critChance: 16,
      critDamage: 30,
      attackSpeed: 4,
      piercingDamage: 45
    },
    value: 11960
  },

  shield: {
    id: 'tytan_warrior_shield',
    name: 'Aegis Eteru',
    type: 'shield' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'shield_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      armor: 234,
      blockChance: 28,
      blockValue: 78,
      strength: 45,
      vitality: 52,
      hp: 430,
      reducedDamage: 12,
      unbreakable: 18
    },
    value: 12480
  },

  amulet: {
    id: 'tytan_warrior_amulet',
    name: 'Amulet Pradawnego Wojownika',
    type: 'amulet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'amulet_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      strength: 62,
      vitality: 48,
      hp: 460,
      critDamage: 42,
      hpRegen: 7,
      armorPen: 28,
      damageVsUndead: 25,
      damageVsDemon: 25
    },
    value: 12480
  },

  ring: {
    id: 'tytan_warrior_ring',
    name: 'Pierścień Wiecznej Walki',
    type: 'ring' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'warrior' as const,
    icon: 'ring_mythic_warrior',
    upgradeLevel: 0,
    stats: {
      strength: 58,
      vitality: 39,
      critChance: 15,
      attackSpeed: 4,
      armorPen: 22,
      piercingDamage: 40,
      bonusExp: 10,
      bonusGold: 12
    },
    value: 11960
  }
};

// ============================================================================
// ASSASSIN MYTHIC ITEMS (Level 26)
// ============================================================================

const ASSASSIN_MYTHIC_26 = {
  weapon: {
    id: 'tytan_assassin_weapon',
    name: 'Szpony Pustki',
    type: 'weapon' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'weapon_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      damageMin: 364,
      damageMax: 546,
      dexterity: 91,
      critChance: 28,
      critDamage: 55,
      dodgeChance: 20,
      poisonChance: 35,
      attackSpeed: 6,
      initiative: 9,
      stability: 6,
      etherealVeil: 18
    },
    value: 13520
  },

  armor: {
    id: 'tytan_assassin_armor',
    name: 'Szata Wiecznego Cienia',
    type: 'armor' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'armor_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 156,
      dexterity: 78,
      vitality: 45,
      dodgeChance: 22,
      initiative: 9,
      stability: 7,
      poisonChance: 18,
      etherealVeil: 14
    },
    value: 13520
  },

  helmet: {
    id: 'tytan_assassin_helmet',
    name: 'Maska Prastarej Nocy',
    type: 'helmet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'helmet_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 104,
      dexterity: 70,
      critChance: 18,
      dodgeChance: 16,
      initiative: 10,
      stability: 6,
      poisonChance: 12
    },
    value: 11960
  },

  boots: {
    id: 'tytan_assassin_boots',
    name: 'Sandały Widma',
    type: 'boots' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'boots_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 78,
      dexterity: 75,
      dodgeChance: 20,
      initiative: 12,
      stability: 8,
      attackSpeed: 5,
      etherealVeil: 12
    },
    value: 10920
  },

  gloves: {
    id: 'tytan_assassin_gloves',
    name: 'Rękawice Zabójcy Bogów',
    type: 'gloves' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'gloves_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      armor: 65,
      dexterity: 65,
      damageMin: 45,
      damageMax: 68,
      critChance: 20,
      poisonChance: 28,
      attackSpeed: 5,
      critDamage: 40
    },
    value: 11960
  },

  shield: {
    id: 'tytan_assassin_shield',
    name: 'Wakizashi Krwawego Księżyca',
    type: 'shield' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'shield_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      damageMin: 130,
      damageMax: 195,
      dexterity: 52,
      poisonChance: 38,
      critChance: 18,
      attackSpeed: 4,
      dodgeChance: 12
    },
    value: 12480
  },

  amulet: {
    id: 'tytan_assassin_amulet',
    name: 'Amulet Wiecznej Trucizny',
    type: 'amulet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'amulet_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      dexterity: 75,
      poisonChance: 32,
      critDamage: 48,
      dodgeChance: 14,
      damageVsBeast: 28,
      damageVsDemon: 22
    },
    value: 12480
  },

  ring: {
    id: 'tytan_assassin_ring',
    name: 'Pierścień Pradawnego Zabójcy',
    type: 'ring' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'assassin' as const,
    icon: 'ring_mythic_assassin',
    upgradeLevel: 0,
    stats: {
      dexterity: 70,
      critChance: 19,
      attackSpeed: 5,
      initiative: 8,
      poisonChance: 20,
      bonusGold: 15,
      bonusExp: 10
    },
    value: 11960
  }
};

// ============================================================================
// MAGE MYTHIC ITEMS (Level 26)
// ============================================================================

const MAGE_MYTHIC_26 = {
  weapon: {
    id: 'tytan_mage_weapon',
    name: 'Kostur Apokalipsy',
    type: 'weapon' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'weapon_mythic_mage',
    upgradeLevel: 0,
    stats: {
      magicDamage: 728,   // lvl 26 × 3.5 × 8.0
      intelligence: 88,
      magicPen: 42,
      burnChance: 35,
      magicResist: 28,
      manaShield: 24,
      initiative: 8,
      attackSpeed: 4,
      overload: 25
    },
    value: 13520
  },

  armor: {
    id: 'tytan_mage_armor',
    name: 'Szata Transcendencji',
    type: 'armor' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'armor_mythic_mage',
    upgradeLevel: 0,
    stats: {
      armor: 91,
      intelligence: 78,
      vitality: 45,
      magicResist: 32,
      manaShield: 28,
      hp: 420,
      hpRegen: 6,
      overload: 12
    },
    value: 13520
  },

  helmet: {
    id: 'tytan_mage_helmet',
    name: 'Diadem Pradawnej Mocy',
    type: 'helmet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'helmet_mythic_mage',
    upgradeLevel: 0,
    stats: {
      armor: 65,
      intelligence: 75,
      magicDamage: 130,
      magicResist: 25,
      initiative: 7,
      overload: 16,
      burnChance: 18
    },
    value: 11960
  },

  boots: {
    id: 'tytan_mage_boots',
    name: 'Buty Eterycznego Kroku',
    type: 'boots' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'boots_mythic_mage',
    upgradeLevel: 0,
    stats: {
      armor: 52,
      intelligence: 65,
      vitality: 39,
      initiative: 10,
      manaShield: 20,
      dodgeChance: 10,
      magicResist: 18
    },
    value: 10920
  },

  gloves: {
    id: 'tytan_mage_gloves',
    name: 'Rękawice Inferno',
    type: 'gloves' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'gloves_mythic_mage',
    upgradeLevel: 0,
    stats: {
      armor: 45,
      intelligence: 60,
      magicDamage: 117,
      burnChance: 28,
      attackSpeed: 4,
      magicPen: 30,
      overload: 14
    },
    value: 11960
  },

  shield: {
    id: 'tytan_mage_shield',
    name: 'Kodeks Absolutu',
    type: 'shield' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'shield_mythic_mage',
    upgradeLevel: 0,
    stats: {
      magicDamage: 195,
      intelligence: 55,
      burnChance: 25,
      manaShield: 30,
      magicResist: 28,
      overload: 18,
      magicPen: 25
    },
    value: 12480
  },

  amulet: {
    id: 'tytan_mage_amulet',
    name: 'Amulet Gwiazd',
    type: 'amulet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'amulet_mythic_mage',
    upgradeLevel: 0,
    stats: {
      intelligence: 70,
      magicDamage: 162,
      burnChance: 25,
      magicPen: 35,
      damageVsDemon: 32,
      overload: 15
    },
    value: 12480
  },

  ring: {
    id: 'tytan_mage_ring',
    name: 'Pierścień Wiecznego Płomienia',
    type: 'ring' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'mage' as const,
    icon: 'ring_mythic_mage',
    upgradeLevel: 0,
    stats: {
      intelligence: 65,
      magicDamage: 143,
      attackSpeed: 4,
      initiative: 6,
      burnChance: 20,
      bonusExp: 12,
      bonusGold: 10
    },
    value: 11960
  }
};

// ============================================================================
// CLERIC MYTHIC ITEMS (Level 26)
// ============================================================================

const CLERIC_MYTHIC_26 = {
  weapon: {
    id: 'tytan_cleric_weapon',
    name: 'Promień Zbawienia',
    type: 'weapon' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'weapon_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      magicDamage: 637,
      intelligence: 78,
      vitality: 58,
      healingPower: 78,
      armor: 78,
      magicResist: 35,
      hpRegen: 8,
      reducedDamage: 16,
      sanctifiedAura: 1,
      unbreakable: 18
    },
    value: 13520
  },

  armor: {
    id: 'tytan_cleric_armor',
    name: 'Habit Nieśmiertelnych',
    type: 'armor' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'armor_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 208,
      intelligence: 70,
      vitality: 65,
      hp: 650,
      healingPower: 52,
      magicResist: 32,
      reducedDamage: 14,
      hpRegen: 7,
      unbreakable: 14
    },
    value: 13520
  },

  helmet: {
    id: 'tytan_cleric_helmet',
    name: 'Korona Świętego Królestwa',
    type: 'helmet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'helmet_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 156,
      intelligence: 65,
      vitality: 52,
      hp: 480,
      magicResist: 25,
      healingPower: 40,
      hpRegen: 6
    },
    value: 11960
  },

  boots: {
    id: 'tytan_cleric_boots',
    name: 'Buty Męczennika',
    type: 'boots' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'boots_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 117,
      intelligence: 55,
      vitality: 55,
      hp: 440,
      initiative: 7,
      healingPower: 38,
      reducedDamage: 10
    },
    value: 10920
  },

  gloves: {
    id: 'tytan_cleric_gloves',
    name: 'Rękawice Cudotwórcy',
    type: 'gloves' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'gloves_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 91,
      intelligence: 52,
      vitality: 45,
      healingPower: 62,
      hpRegen: 8,
      magicResist: 20,
      sanctifiedAura: 1
    },
    value: 11960
  },

  shield: {
    id: 'tytan_cleric_shield',
    name: 'Tarcza Bożej Łaski',
    type: 'shield' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'shield_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      armor: 182,
      blockChance: 22,
      blockValue: 62,
      intelligence: 45,
      vitality: 52,
      healingPower: 45,
      magicResist: 28,
      unbreakable: 16
    },
    value: 12480
  },

  amulet: {
    id: 'tytan_cleric_amulet',
    name: 'Amulet Wiecznego Światła',
    type: 'amulet' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'amulet_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      intelligence: 60,
      vitality: 60,
      hp: 580,
      healingPower: 55,
      reducedDamage: 14,
      hpRegen: 8,
      damageVsUndead: 30
    },
    value: 12480
  },

  ring: {
    id: 'tytan_cleric_ring',
    name: 'Pierścień Niebiańskiej Mocy',
    type: 'ring' as const,
    rarity: 'mythic' as const,
    levelReq: 26,
    classReq: 'cleric' as const,
    icon: 'ring_mythic_cleric',
    upgradeLevel: 0,
    stats: {
      intelligence: 55,
      vitality: 52,
      healingPower: 45,
      hpRegen: 6,
      magicResist: 18,
      bonusExp: 12,
      bonusGold: 10
    },
    value: 11960
  }
};

// ============================================================================
// EXPORT - COMPLETE DATABASE
// ============================================================================

export const LEGENDARY_ITEMS: Record<string, Item> = {
  // Warrior Legendary (lvl 16)
  ...Object.fromEntries(
    Object.entries(WARRIOR_LEGENDARY_16).map(([key, item]) => [item.id, item])
  ),

  // Assassin Legendary (lvl 16)
  ...Object.fromEntries(
    Object.entries(ASSASSIN_LEGENDARY_16).map(([key, item]) => [item.id, item])
  ),

  // Mage Legendary (lvl 16)
  ...Object.fromEntries(
    Object.entries(MAGE_LEGENDARY_16).map(([key, item]) => [item.id, item])
  ),

  // Cleric Legendary (lvl 16)
  ...Object.fromEntries(
    Object.entries(CLERIC_LEGENDARY_16).map(([key, item]) => [item.id, item])
  ),

  // Warrior Mythic (lvl 26)
  ...Object.fromEntries(
    Object.entries(WARRIOR_MYTHIC_26).map(([key, item]) => [item.id, item])
  ),

  // Assassin Mythic (lvl 26)
  ...Object.fromEntries(
    Object.entries(ASSASSIN_MYTHIC_26).map(([key, item]) => [item.id, item])
  ),

  // Mage Mythic (lvl 26)
  ...Object.fromEntries(
    Object.entries(MAGE_MYTHIC_26).map(([key, item]) => [item.id, item])
  ),

  // Cleric Mythic (lvl 26)
  ...Object.fromEntries(
    Object.entries(CLERIC_MYTHIC_26).map(([key, item]) => [item.id, item])
  )
};

// Helper function to get legendary item with optional level scaling
export const getLegendaryItem = (
  templateId: string,
  dropLevel?: number
): Item | null => {
  const template = LEGENDARY_ITEMS[templateId];
  if (!template) return null;

  // Return copy with new ID (each drop is unique instance)
  return {
    ...template,
    id: Math.random().toString(36).substr(2, 9),
    stats: { ...template.stats },
    levelReq: dropLevel || template.levelReq
  };
};

// Get all items for specific class and rarity
export const getItemsByClassAndRarity = (
  classReq: string,
  rarity: 'legendary' | 'mythic'
): Item[] => {
  return Object.values(LEGENDARY_ITEMS).filter(
    item => item.classReq === classReq && item.rarity === rarity
  );
};

// Count total items
export const ITEM_COUNT = {
  legendary: 32,
  mythic: 32,
  total: 64
};
