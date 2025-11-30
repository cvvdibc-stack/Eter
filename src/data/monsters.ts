import { Monster, LootTable } from '../types';
import { calculateMonsterBaseExp } from '../utils/formulas';

// Helper to calculate EXP based on formula
const getExp = (lvl: number, isBoss: boolean = false) => calculateMonsterBaseExp(lvl, isBoss);

const COMMON_LEGENDS = {
    warrior: 'leg_warrior_1',
    assassin: 'leg_assassin_1',
    mage: 'leg_mage_1',
    cleric: 'leg_cleric_1'
};

const BOSS_TYTANIC = {
    warrior: 'tytan_warrior_1',
    assassin: 'tytan_assassin_1',
    mage: 'tytan_mage_1',
    cleric: 'tytan_cleric_1'
};

// Tier 1
const rat: Monster = {
    id: 'monster_1',
    name: 'Wielki Szczur',
    level: 1,
    hp: 50, maxHp: 50, // 40 * 1.25
    damageMin: 1, damageMax: 4, // 1-3 * 1.2
    defense: 2,
    expReward: getExp(1),
    goldReward: 3,
    type: 'animal',
    description: 'Wielki, brudny szczur zamieszkujący kanały i piwnice. Jego ugryzienie może być niebezpieczne dla nowicjuszy.',
    lootTable: { common: 85, unique: 15, hero: 0, legendary: 0, goldMin: 2, goldMax: 5, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const bird: Monster = {
    id: 'monster_2',
    name: 'Dziki Ptak',
    level: 2,
    hp: 65, maxHp: 65, // 52 * 1.25
    damageMin: 2, damageMax: 5, // 2-4 * 1.2
    defense: 3,
    expReward: getExp(2),
    goldReward: 4,
    type: 'animal',
    description: 'Szybki i drapieżny ptak, który atakuje z powietrza.',
    lootTable: { common: 85, unique: 15, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const wolf: Monster = {
    id: 'monster_3',
    name: 'Wilk',
    level: 3,
    hp: 81, maxHp: 81, // 65 * 1.25
    damageMin: 4, damageMax: 7, // 3-6 * 1.2
    defense: 5,
    expReward: getExp(3),
    goldReward: 6,
    type: 'animal',
    description: 'Drapieżnik leśny polujący w watahach. Silniejszy niż wygląda.',
    lootTable: { common: 85, unique: 15, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const bandit: Monster = {
    id: 'monster_4',
    name: 'Bandzior Zarośli',
    level: 4,
    hp: 98, maxHp: 98, // 78 * 1.25
    damageMin: 5, damageMax: 8, // 4-7 * 1.2
    defense: 6,
    expReward: getExp(4),
    goldReward: 7,
    type: 'humanoid',
    description: 'Zwykły rzezimieszek czyhający na nieostrożnych podróżnych.',
    lootTable: { common: 85, unique: 15, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const orkLeader: Monster = {
    id: 'monster_5',
    name: 'Ork Przywódca',
    level: 5,
    hp: 115, maxHp: 115, // 92 * 1.25
    damageMin: 6, damageMax: 11, // 5-9 * 1.2
    defense: 8,
    expReward: getExp(5),
    goldReward: 9,
    type: 'humanoid',
    description: 'Brutalny dowódca małego oddziału orków. Nosi kradzioną zbroję.',
    lootTable: { common: 80, unique: 20, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

// Tier 2
const rot: Monster = {
    id: 'monster_6',
    name: 'Zgnilizny Lasu',
    level: 6,
    hp: 138, maxHp: 138, // 110 * 1.25
    damageMin: 7, damageMax: 12, // 6-10 * 1.2
    defense: 9,
    expReward: getExp(6),
    goldReward: 10,
    type: 'undead',
    lootTable: { common: 80, unique: 20, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const devourer: Monster = {
    id: 'monster_7',
    name: 'Krwisty Pożeracz',
    level: 7,
    hp: 160, maxHp: 160, // 128 * 1.25
    damageMin: 8, damageMax: 13, // 7-11 * 1.2
    defense: 10,
    expReward: getExp(7),
    goldReward: 11,
    type: 'demon',
    lootTable: { common: 80, unique: 20, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const shadowScout: Monster = {
    id: 'monster_8',
    name: 'Cień Zwiadowca',
    level: 8,
    hp: 188, maxHp: 188, // 150 * 1.25
    damageMin: 10, damageMax: 14, // 8-12 * 1.2
    defense: 12,
    expReward: getExp(8),
    goldReward: 13,
    type: 'undead',
    lootTable: { common: 80, unique: 20, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const darkHound: Monster = {
    id: 'monster_9',
    name: 'Ogar Ciemności',
    level: 9,
    hp: 219, maxHp: 219, // 175 * 1.25
    damageMin: 11, damageMax: 16, // 9-13 * 1.2
    defense: 13,
    expReward: getExp(9),
    goldReward: 15,
    type: 'demon',
    lootTable: { common: 80, unique: 20, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const ghoulWarrior: Monster = {
    id: 'monster_10',
    name: 'Ghul Wojownik',
    level: 10,
    hp: 275, maxHp: 275, // 220 * 1.25
    damageMin: 12, damageMax: 18, // 10-15 * 1.2
    defense: 15,
    expReward: getExp(10),
    goldReward: 18,
    type: 'undead',
    description: 'Pradawny wojownik ożywiony mroczną magią. Może posiadać legendarne przedmioty.',
    lootTable: { common: 80, unique: 20, hero: 0, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

// Tier 3
const imp: Monster = {
    id: 'monster_11',
    name: 'Bies Torfowy',
    level: 11,
    hp: 306, maxHp: 306, // 245 * 1.25
    damageMin: 13, damageMax: 19, // 11-16 * 1.2
    defense: 15,
    expReward: getExp(11),
    goldReward: 19,
    type: 'demon',
    lootTable: { common: 70, unique: 20, hero: 10, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const striga: Monster = {
    id: 'monster_12',
    name: 'Strzyga',
    level: 12,
    hp: 338, maxHp: 338, // 270 * 1.25
    damageMin: 14, damageMax: 20, // 12-17 * 1.2
    defense: 16,
    expReward: getExp(12),
    goldReward: 20,
    type: 'undead',
    lootTable: { common: 70, unique: 20, hero: 10, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const animatedArmor: Monster = {
    id: 'monster_13',
    name: 'Ożywiony Zbrojny',
    level: 13,
    hp: 375, maxHp: 375, // 300 * 1.25
    damageMin: 15, damageMax: 21, // 13-18 * 1.2
    defense: 18,
    expReward: getExp(13),
    goldReward: 22,
    type: 'undead',
    lootTable: { common: 70, unique: 20, hero: 10, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const darkAdept: Monster = {
    id: 'monster_14',
    name: 'Mroczny Adept',
    level: 14,
    hp: 419, maxHp: 419, // 335 * 1.25
    damageMin: 17, damageMax: 23, // 14-19 * 1.2
    defense: 19,
    expReward: getExp(14),
    goldReward: 23,
    type: 'humanoid',
    lootTable: { common: 65, unique: 20, hero: 15, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const cursedKnight: Monster = {
    id: 'monster_15',
    name: 'Przeklęty Rycerz',
    level: 15,
    hp: 462, maxHp: 462, // 370 * 1.25
    damageMin: 18, damageMax: 25, // 15-21 * 1.2
    defense: 20,
    expReward: getExp(15),
    goldReward: 26,
    type: 'undead',
    lootTable: { common: 65, unique: 20, hero: 15, legendary: 0, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

// Tier 4
const abyssBeast: Monster = {
    id: 'monster_16',
    name: 'Bestia Z Otchłani',
    level: 16,
    hp: 512, maxHp: 512, // 410 * 1.25
    damageMin: 19, damageMax: 26, // 16-22 * 1.2
    defense: 21,
    expReward: getExp(16),
    goldReward: 29,
    type: 'demon',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const wolfLord: Monster = {
    id: 'monster_17',
    name: 'Władca Wilków',
    level: 17,
    hp: 562, maxHp: 562, // 450 * 1.25
    damageMin: 20, damageMax: 29, // 17-24 * 1.2
    defense: 23,
    expReward: getExp(17),
    goldReward: 31,
    type: 'animal',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const ghostHunter: Monster = {
    id: 'monster_18',
    name: 'Upiorny Łowca',
    level: 18,
    hp: 619, maxHp: 619, // 495 * 1.25
    damageMin: 22, damageMax: 30, // 18-25 * 1.2
    defense: 25,
    expReward: getExp(18),
    goldReward: 34,
    type: 'undead',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const witcher: Monster = {
    id: 'monster_19',
    name: 'Wiedźmiarz',
    level: 19,
    hp: 675, maxHp: 675, // 540 * 1.25
    damageMin: 23, damageMax: 32, // 19-27 * 1.2
    defense: 27,
    expReward: getExp(19),
    goldReward: 36,
    type: 'humanoid',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const blackMinotaur: Monster = {
    id: 'monster_20',
    name: 'Czarny Minotaur',
    level: 20,
    hp: 750, maxHp: 750, // 600 * 1.25
    damageMin: 24, damageMax: 36, // 20-30 * 1.2
    defense: 30,
    expReward: getExp(20),
    goldReward: 39,
    type: 'humanoid',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

// Tier 5
const phantomKnight: Monster = {
    id: 'monster_21',
    name: 'Widmowy Rycerz',
    level: 21,
    hp: 825, maxHp: 825, // 660 * 1.25
    damageMin: 25, damageMax: 37, // 21-31 * 1.2
    defense: 32,
    expReward: getExp(21),
    goldReward: 42,
    type: 'undead',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const nightStrangler: Monster = {
    id: 'monster_22',
    name: 'Dusiciel Nocy',
    level: 22,
    hp: 900, maxHp: 900, // 720 * 1.25
    damageMin: 26, damageMax: 40, // 22-33 * 1.2
    defense: 34,
    expReward: getExp(22),
    goldReward: 45,
    type: 'demon',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const darkPriest: Monster = {
    id: 'monster_23',
    name: 'Kapłan Mroku',
    level: 23,
    hp: 975, maxHp: 975, // 780 * 1.25
    damageMin: 28, damageMax: 42, // 23-35 * 1.2
    defense: 36,
    expReward: getExp(23),
    goldReward: 48,
    type: 'humanoid',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const stoneTitan: Monster = {
    id: 'monster_24',
    name: 'Kamienny Tytan',
    level: 24,
    hp: 1075, maxHp: 1075, // 860 * 1.25
    damageMin: 29, damageMax: 46, // 24-38 * 1.2
    defense: 38,
    expReward: getExp(24),
    goldReward: 52,
    type: 'demon',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const undergroundHorror: Monster = {
    id: 'monster_25',
    name: 'Horror Z Podziemi',
    level: 25,
    hp: 1175, maxHp: 1175, // 940 * 1.25
    damageMin: 30, damageMax: 48, // 25-40 * 1.2
    defense: 40,
    expReward: getExp(25),
    goldReward: 55,
    type: 'demon',
    lootTable: { common: 60, unique: 25, hero: 12, legendary: 3, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

// Tier 6
const wyvern: Monster = {
    id: 'monster_26',
    name: 'Smokli Wyverna',
    level: 26,
    hp: 1275, maxHp: 1275, // 1020 * 1.25
    damageMin: 31, damageMax: 52, // 26-43 * 1.2
    defense: 42,
    expReward: getExp(26),
    goldReward: 60,
    type: 'animal',
    lootTable: { common: 50, unique: 25, hero: 15, legendary: 3, tytanic: 0.4, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const ghoulKing: Monster = {
    id: 'monster_27',
    name: 'Król Ghuli',
    level: 27,
    hp: 1375, maxHp: 1375, // 1100 * 1.25
    damageMin: 32, damageMax: 54, // 27-45 * 1.2
    defense: 44,
    expReward: getExp(27),
    goldReward: 65,
    type: 'undead',
    lootTable: { common: 50, unique: 25, hero: 15, legendary: 3, tytanic: 0.4, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const whisperer: Monster = {
    id: 'monster_28',
    name: 'Pradawny Szeptacz',
    level: 28,
    hp: 1475, maxHp: 1475, // 1180 * 1.25
    damageMin: 34, damageMax: 56, // 28-47 * 1.2
    defense: 46,
    expReward: getExp(28),
    goldReward: 70,
    type: 'demon',
    lootTable: { common: 50, unique: 25, hero: 15, legendary: 3, tytanic: 0.4, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const fallenChamp: Monster = {
    id: 'monster_29',
    name: 'Upadły Czempion',
    level: 29,
    hp: 1625, maxHp: 1625, // 1300 * 1.25
    damageMin: 36, damageMax: 60, // 30-50 * 1.2
    defense: 48,
    expReward: getExp(29),
    goldReward: 75,
    type: 'undead',
    lootTable: { common: 50, unique: 25, hero: 15, legendary: 3, tytanic: 0.4, legends: COMMON_LEGENDS, level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 } }
};

const avatar: Monster = {
    id: 'monster_30',
    name: 'Avatar Eteru',
    level: 30,
    hp: 1875, maxHp: 1875, // 1500 * 1.25
    damageMin: 38, damageMax: 66, // 32-55 * 1.2
    defense: 50,
    expReward: getExp(30, true),
    goldReward: 100,
    type: 'boss',
    description: 'Inkarnacja samej magii Eteru. Ostateczne wyzwanie.',
    lootTable: { 
        common: 50, unique: 20, hero: 15, legendary: 3, tytanic: 0.4,
        legends: COMMON_LEGENDS, 
        tytanic: BOSS_TYTANIC,
        expMultiplier: 6,
        level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 },
        rarity: { common: 50, unique: 20, heroic: 15, legendary: 3, tytanic: 0.4 } // Adjusted for boss
    }
};

// --- DUNGEON BOSSES ---

const dungeonBoss1: Monster = {
    id: 'boss_dungeon_1',
    name: 'Ghul Królewski',
    level: 12,
    hp: 350, maxHp: 350, // 280 * 1.25
    damageMin: 17, damageMax: 26, // 14-22 * 1.2
    defense: 20,
    expReward: getExp(12, true),
    goldReward: 35,
    type: 'boss',
    description: 'Władca krypty, którego ugryzienie zatruwa duszę.',
    lootTable: { 
        common: 60, unique: 20, hero: 15, legendary: 3, talisman: 1, 
        legends: COMMON_LEGENDS, 
        tytanic: BOSS_TYTANIC,
        expMultiplier: 6,
        level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 }
    },
    mechanics: [
        { name: 'Ugryzienie Ghula', description: 'Zadaje 125% obrażeń + trucizna', trigger: 'every_n_turns', value: 2, effect: 'dot_poison', effectValue: 6, duration: 3 },
        { name: 'Regeneracja', description: 'Leczy 5% HP co 3 tury', trigger: 'every_n_turns', value: 3, effect: 'heal_percent', effectValue: 5 }
    ]
};

const dungeonBoss2: Monster = {
    id: 'boss_dungeon_2',
    name: 'Władca Wilków Alfa',
    level: 18,
    hp: 612, maxHp: 612, // 490 * 1.25
    damageMin: 30, damageMax: 46, // 25-38 * 1.2
    defense: 33,
    expReward: getExp(18, true),
    goldReward: 60,
    type: 'boss',
    description: 'Przywódca stada, którego wycie mrozi krew w żyłach.',
    lootTable: { 
        common: 60, unique: 20, hero: 15, legendary: 3, talisman: 1.5, 
        legends: COMMON_LEGENDS, 
        tytanic: BOSS_TYTANIC,
        expMultiplier: 6,
        level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 }
    },
    mechanics: [
        { name: 'Alfa-Szarpnięcie', description: 'Ignoruje 50% pancerza', trigger: 'every_n_turns', value: 3, effect: 'ignore_armor_percent', effectValue: 0.5 },
        { name: 'Stado Wilków', description: '+20% uniku gdy HP < 50%', trigger: 'hp_below', value: 50, effect: 'debuff_hit', effectValue: 20 } 
    ]
};

const dungeonBoss3: Monster = {
    id: 'boss_dungeon_3',
    name: 'Eteryczny Prorok',
    level: 25,
    hp: 1150, maxHp: 1150, // 920 * 1.25
    damageMin: 38, damageMax: 54, // 32-45 * 1.2
    defense: 44,
    expReward: getExp(25, true),
    goldReward: 100,
    type: 'boss',
    description: 'Mag posługujący się czystą energią Eteru.',
    lootTable: { 
        common: 55, unique: 20, hero: 15, legendary: 3, talisman: 2, 
        legends: COMMON_LEGENDS, 
        tytanic: BOSS_TYTANIC,
        expMultiplier: 6,
        level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 }
    },
    mechanics: [
        { name: 'Uderzenie Eteru', description: 'Obrażenia magiczne 1.5x', trigger: 'every_n_turns', value: 3, effect: 'damage_multiplier', effectValue: 1.5 },
        { name: 'Boska Bariera', description: 'Tarcza redukująca obrażenia', trigger: 'every_n_turns', value: 4, effect: 'shield_percent', effectValue: 35, duration: 2 }
    ]
};

const dungeonBoss4: Monster = {
    id: 'boss_dungeon_4',
    name: 'Avatar Eteru, Arcyforma',
    level: 32,
    hp: 2125, maxHp: 2125, // 1700 * 1.25
    damageMin: 48, damageMax: 72, // 40-60 * 1.2
    defense: 55,
    expReward: getExp(32, true),
    goldReward: 150,
    type: 'boss',
    description: 'Ostateczna forma Eteru. Pan Upadłej Cytadeli.',
    lootTable: { 
        common: 50, unique: 25, hero: 15, legendary: 3, mythic: 0.4, talisman: 4, 
        legends: COMMON_LEGENDS, 
        tytanic: BOSS_TYTANIC,
        expMultiplier: 6,
        level_gate: { unique: 1, heroic: 11, legendary: 16, tytanic: 26 },
        rarity: { common: 50, unique: 25, heroic: 15, legendary: 3, tytanic: 0.4 }
    },
    mechanics: [
        { name: 'Rytuał Dusz', description: 'Kradnie 10% HP', trigger: 'every_n_turns', value: 3, effect: 'heal_percent', effectValue: 10 }, 
        { name: 'Promień Obłędu', description: '1.7x DMG, Ignoruje pancerz', trigger: 'every_n_turns', value: 4, effect: 'damage_multiplier', effectValue: 1.7 }
    ]
};

export const DUNGEON_BOSSES = [dungeonBoss1, dungeonBoss2, dungeonBoss3, dungeonBoss4];

export const MONSTERS: Monster[] = [
    rat, bird, wolf, bandit, orkLeader,
    rot, devourer, shadowScout, darkHound, ghoulWarrior,
    imp, striga, animatedArmor, darkAdept, cursedKnight,
    abyssBeast, wolfLord, ghostHunter, witcher, blackMinotaur,
    phantomKnight, nightStrangler, darkPriest, stoneTitan, undergroundHorror,
    wyvern, ghoulKing, whisperer, fallenChamp, avatar
];
