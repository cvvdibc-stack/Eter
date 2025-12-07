export type Profession = 'warrior' | 'assassin' | 'mage' | 'cleric';

export type StatName = 'strength' | 'dexterity' | 'intelligence' | 'vitality';

export interface BaseStats {
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface ItemStats {
  // Core
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  vitality?: number;
  hp?: number;
  armor?: number;
  
  damageMin?: number;
  damageMax?: number;
  magicDamage?: number;
  magicResist?: number; // %

  // Secondary - Combat
  critChance?: number; // %
  critDamage?: number; // % (New)
  dodgeChance?: number; // %
  blockChance?: number; // %
  blockValue?: number; // flat damage reduction on block (New)
  armorPen?: number; // % (New)
  magicPen?: number; // % (New)
  piercingDamage?: number; // flat (New)
  attackSpeed?: number; // SA
  initiative?: number; // %
  stability?: number; // %
  
  // Defensive
  reducedDamage?: number; // % (New)
  hpRegen?: number; // % (New)
  manaShield?: number; // % (New - dmg taken from mana)
  
  // Utility
  bonusGold?: number; // % (New)
  bonusExp?: number; // % (New)
  dropChance?: number; // % (New)
  healingPower?: number; 
  
  // Special / Rare
  damageVsUndead?: number; // % (New)
  damageVsBeast?: number; // % (New)
  damageVsDemon?: number; // % (New)
  
  poisonChance?: number; 
  burnChance?: number; 
  
  // Legendary Mechanics
  firstHitShield?: number; // CHANGED from boolean to number (for 1/0 compatibility)
  etherealVeil?: number; // % (New)
  bloodFury?: number; // % (New)
  sanctifiedAura?: number; // CHANGED from boolean to number
  overload?: number; // % (New)
  unbreakable?: number; // % (New)
}

export interface DerivedStats {
  maxHp: number;
  armor: number;
  
  // Combat Base
  physDmgMin: number;
  physDmgMax: number;
  magDmgMin: number;
  magDmgMax: number;
  
  // Core Attributes
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;

  // Detailed Stats
  critChance: number;
  critDamage: number;
  dodgeChance: number;
  blockChance: number;
  blockValue: number;
  
  physResist: number;
  magResist: number;
  
  armorPen: number;
  magicPen: number;
  piercingDamage: number;
  
  attackSpeed: number;
  initiative: number;
  stability: number;
  
  hpRegen: number;
  reducedDamage: number;
  manaShield: number;
  healingPower: number;
  
  bonusGold: number;
  bonusExp: number;
  dropChance: number;
  
  damageVsUndead: number;
  damageVsBeast: number;
  damageVsDemon: number;
  
  // Special Flags/Values
  poisonChance: number;
  burnChance: number;
  etherealVeil: number;
  bloodFury: number;
  overload: number;
  unbreakable: number;
  
  // Uncapped stats for display
  uncappedStrength: number;
  uncappedDexterity: number;
  uncappedIntelligence: number;
  uncappedVitality: number;
  statCap: number;
}

export type ItemRarity = 'common' | 'unique' | 'heroic' | 'legendary' | 'mythic' | 'talisman';
export type ItemType = 'weapon' | 'helmet' | 'armor' | 'boots' | 'gloves' | 'amulet' | 'ring' | 'talisman' | 'shield';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  stats: ItemStats;
  value: number;
  icon: string;
  levelReq: number;
  classReq?: Profession;
  upgradeLevel: number;
  bonusEffects?: string[];
  slainBy?: {
    playerName: string;
    bossName: string;
    date: string; // ISO date string
  };
}

export interface TalismanDef {
  id: string;
  name: string;
  rarity: ItemRarity;
  effectDescription: string;
  statMod?: {
      stat: string; 
      value: number;
  };
}

export type BonusType = 'GOLD' | 'EXP' | 'DROP';

export interface Character {
  id: string;
  name: string;
  profession: Profession;
  level: number;
  exp: number;
  maxExp: number;
  expToNextLevel?: number; 
  energy: number;
  maxEnergy: number;
  // HP Mechanics
  currentHp: number;
  lastRegenTime?: number;
  
  gold: number;
  premiumCurrency: number;
  baseStats: BaseStats;
  boughtStats?: {
    strength_bonus: number;
    dexterity_bonus: number;
    vitality_bonus: number;
    intelligence_bonus: number;
  };
  equipment: Record<ItemType, Item | null> | any;
  inventory: (Item | null)[];
  talismansInventory?: string[]; 
  activeTalismans?: string[]; 
  unlocked_monsters?: string[];
  completed_dungeons?: string[]; 
  unlocked_bonuses?: Record<string, BonusType[]>;
  dungeon_progress?: Record<string, number>; 
  kill_stats?: Record<string, number>; 
}

export interface CombatTurn {
  attackerId: string;
  defenderId: string;
  action: 'attack' | 'skill' | 'miss' | 'heal' | 'mechanic';
  damage: number;
  isCrit: boolean;
  log: string;
}

export interface CombatLog {
  id?: string;
  enemy_name: string;
  result: 'WIN' | 'LOSS';
  exp_gained: number;
  gold_gained: number;
  loot_gained?: string;
  type: 'EXPEDITION' | 'DUNGEON' | 'ARENA';
  created_at?: string;
  logs?: CombatTurn[];
}

export interface LootTable {
  rarity: {
    common: number;
    unique: number;
    heroic: number;
    legendary: number;
    tytanic: number;
  };
  talisman?: number; // % Chance for talisman drop
  expMultiplier?: number; // New field for Boss XP boost
  signatureSlots?: ItemType[]; // Boss-specific signature slots (e.g., ['helmet', 'gloves'])
  legends: {
    warrior: string;
    assassin: string;
    mage: string;
    cleric: string;
  };
  tytanic?: {
    warrior: string;
    assassin: string;
    mage: string;
    cleric: string;
  } | null;
  level_gate: {
    unique: number;
    heroic: number;
    legendary: number;
    tytanic: number;
  };
}

export interface BossMechanic {
  name: string;
  description: string;
  trigger: 'every_n_turns' | 'hp_below';
  value: number; 
  effect: 'damage_multiplier' | 'heal_percent' | 'stun' | 'dot_poison' | 'shield_percent' | 'ignore_armor_percent' | 'debuff_hit' | 'buff_damage';
  effectValue?: number; 
  duration?: number; 
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  damageMin: number;
  damageMax: number;
  magicDamageMin: number; // NEW
  magicDamageMax: number; // NEW
  magicResist: number; // NEW
  dodge: number; // NEW
  sa: number; // NEW (Attack Speed)
  armor: number; // NEW (Instead of defense)
  expReward: number;
  goldReward: number;
  goldMin?: number;
  goldMax?: number;
  lootTable: LootTable;
  type: 'normal' | 'elite' | 'boss' | 'animal' | 'humanoid' | 'undead' | 'demon'; 
  description?: string;
  mechanics?: BossMechanic[]; 
}

export interface Dungeon {
  id: string;
  name: string;
  levelReq: number;
  rooms: number;
  bossId: string;
  description: string;
}

export interface MarketListing {
    id: string;
    seller_id: string;
    seller_name: string;
    item: Item;
    price: number;
    created_at: string;
    expires_at: string;
}

export interface AccountStash {
    user_id: string;
    items: (Item | null)[];
    updated_at?: string;
}
