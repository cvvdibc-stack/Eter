import { Monster, LootTable } from '../types';
import { calculateMonsterBaseExp } from '../utils/formulas';

// Helper to calculate EXP based on formula
const getExp = (lvl: number, isBoss: boolean = false) => calculateMonsterBaseExp(lvl, isBoss);

// Tier 1
const rat: Monster = {
    id: 'monster_1',
    name: 'Wielki Szczur',
    level: 1,
    hp: 40, maxHp: 40,
    damageMin: 1, damageMax: 3,
    defense: 2,
    expReward: getExp(1),
    goldReward: 3, // Avg of 2-5
    type: 'animal',
    description: 'Wielki, brudny szczur zamieszkujący kanały i piwnice. Jego ugryzienie może być niebezpieczne dla nowicjuszy.',
    lootTable: { common: 80, unique: 3, hero: 0, legendary: 0, goldMin: 2, goldMax: 5 }
};

const bird: Monster = {
    id: 'monster_2',
    name: 'Dziki Ptak',
    level: 2,
    hp: 52, maxHp: 52,
    damageMin: 2, damageMax: 4,
    defense: 3,
    expReward: getExp(2),
    goldReward: 4,
    type: 'animal',
    description: 'Szybki i drapieżny ptak, który atakuje z powietrza.',
    lootTable: { common: 80, unique: 4, hero: 0, legendary: 0 }
};

const wolf: Monster = {
    id: 'monster_3',
    name: 'Wilk',
    level: 3,
    hp: 65, maxHp: 65,
    damageMin: 3, damageMax: 6,
    defense: 5,
    expReward: getExp(3),
    goldReward: 6,
    type: 'animal',
    description: 'Drapieżnik leśny polujący w watahach. Silniejszy niż wygląda.',
    lootTable: { common: 78, unique: 5, hero: 1, legendary: 0 }
};

const bandit: Monster = {
    id: 'monster_4',
    name: 'Bandzior Zarośli',
    level: 4,
    hp: 78, maxHp: 78,
    damageMin: 4, damageMax: 7,
    defense: 6,
    expReward: getExp(4),
    goldReward: 7,
    type: 'humanoid',
    description: 'Zwykły rzezimieszek czyhający na nieostrożnych podróżnych.',
    lootTable: { common: 76, unique: 6, hero: 2, legendary: 0 }
};

const orkLeader: Monster = {
    id: 'monster_5',
    name: 'Ork Przywódca',
    level: 5,
    hp: 92, maxHp: 92,
    damageMin: 5, damageMax: 9,
    defense: 8,
    expReward: getExp(5),
    goldReward: 9,
    type: 'humanoid',
    description: 'Brutalny dowódca małego oddziału orków. Nosi kradzioną zbroję.',
    lootTable: { common: 74, unique: 7, hero: 3, legendary: 0 }
};

// Tier 2
const rot: Monster = {
    id: 'monster_6',
    name: 'Zgnilizny Lasu',
    level: 6,
    hp: 110, maxHp: 110,
    damageMin: 6, damageMax: 10,
    defense: 9,
    expReward: getExp(6),
    goldReward: 10,
    type: 'undead',
    lootTable: { common: 72, unique: 8, hero: 3, legendary: 0 }
};

const devourer: Monster = {
    id: 'monster_7',
    name: 'Krwisty Pożeracz',
    level: 7,
    hp: 128, maxHp: 128,
    damageMin: 7, damageMax: 11,
    defense: 10,
    expReward: getExp(7),
    goldReward: 11,
    type: 'demon',
    lootTable: { common: 70, unique: 9, hero: 4, legendary: 0 }
};

const shadowScout: Monster = {
    id: 'monster_8',
    name: 'Cień Zwiadowca',
    level: 8,
    hp: 150, maxHp: 150,
    damageMin: 8, damageMax: 12,
    defense: 12,
    expReward: getExp(8),
    goldReward: 13,
    type: 'undead',
    lootTable: { common: 68, unique: 10, hero: 5, legendary: 0 }
};

const darkHound: Monster = {
    id: 'monster_9',
    name: 'Ogar Ciemności',
    level: 9,
    hp: 175, maxHp: 175,
    damageMin: 9, damageMax: 13,
    defense: 13,
    expReward: getExp(9),
    goldReward: 15,
    type: 'demon',
    lootTable: { common: 66, unique: 12, hero: 6, legendary: 0.1 }
};

const ghoulWarrior: Monster = {
    id: 'monster_10',
    name: 'Ghul Wojownik',
    level: 10,
    hp: 220, maxHp: 220,
    damageMin: 10, damageMax: 15,
    defense: 15,
    expReward: getExp(10),
    goldReward: 18,
    type: 'undead',
    description: 'Pradawny wojownik ożywiony mroczną magią. Może posiadać legendarne przedmioty.',
    lootTable: { common: 60, unique: 15, hero: 10, legendary: 0.2 }
};

// Tier 3
const imp: Monster = {
    id: 'monster_11',
    name: 'Bies Torfowy',
    level: 11,
    hp: 245, maxHp: 245,
    damageMin: 11, damageMax: 16,
    defense: 15,
    expReward: getExp(11),
    goldReward: 19,
    type: 'demon',
    lootTable: { common: 60, unique: 15, hero: 12, legendary: 0.3 }
};

const striga: Monster = {
    id: 'monster_12',
    name: 'Strzyga',
    level: 12,
    hp: 270, maxHp: 270,
    damageMin: 12, damageMax: 17,
    defense: 16,
    expReward: getExp(12),
    goldReward: 20,
    type: 'undead',
    lootTable: { common: 58, unique: 16, hero: 12, legendary: 0.3 }
};

const animatedArmor: Monster = {
    id: 'monster_13',
    name: 'Ożywiony Zbrojny',
    level: 13,
    hp: 300, maxHp: 300,
    damageMin: 13, damageMax: 18,
    defense: 18,
    expReward: getExp(13),
    goldReward: 22,
    type: 'undead',
    lootTable: { common: 58, unique: 17, hero: 12, legendary: 0.4 }
};

const darkAdept: Monster = {
    id: 'monster_14',
    name: 'Mroczny Adept',
    level: 14,
    hp: 335, maxHp: 335,
    damageMin: 14, damageMax: 19,
    defense: 19,
    expReward: getExp(14),
    goldReward: 23,
    type: 'humanoid',
    lootTable: { common: 56, unique: 18, hero: 12, legendary: 0.5 }
};

const cursedKnight: Monster = {
    id: 'monster_15',
    name: 'Przeklęty Rycerz',
    level: 15,
    hp: 370, maxHp: 370,
    damageMin: 15, damageMax: 21,
    defense: 20,
    expReward: getExp(15),
    goldReward: 26,
    type: 'undead',
    lootTable: { common: 55, unique: 18, hero: 14, legendary: 0.6 }
};

// Tier 4
const abyssBeast: Monster = {
    id: 'monster_16',
    name: 'Bestia Z Otchłani',
    level: 16,
    hp: 410, maxHp: 410,
    damageMin: 16, damageMax: 22,
    defense: 21,
    expReward: getExp(16),
    goldReward: 29,
    type: 'demon',
    lootTable: { common: 50, unique: 20, hero: 15, legendary: 0.7 }
};

const wolfLord: Monster = {
    id: 'monster_17',
    name: 'Władca Wilków',
    level: 17,
    hp: 450, maxHp: 450,
    damageMin: 17, damageMax: 24,
    defense: 23,
    expReward: getExp(17),
    goldReward: 31,
    type: 'animal',
    lootTable: { common: 50, unique: 20, hero: 15, legendary: 0.9 }
};

const ghostHunter: Monster = {
    id: 'monster_18',
    name: 'Upiorny Łowca',
    level: 18,
    hp: 495, maxHp: 495,
    damageMin: 18, damageMax: 25,
    defense: 25,
    expReward: getExp(18),
    goldReward: 34,
    type: 'undead',
    lootTable: { common: 48, unique: 22, hero: 16, legendary: 1.0 }
};

const witcher: Monster = {
    id: 'monster_19',
    name: 'Wiedźmiarz',
    level: 19,
    hp: 540, maxHp: 540,
    damageMin: 19, damageMax: 27,
    defense: 27,
    expReward: getExp(19),
    goldReward: 36,
    type: 'humanoid',
    lootTable: { common: 45, unique: 25, hero: 18, legendary: 1.2 }
};

const blackMinotaur: Monster = {
    id: 'monster_20',
    name: 'Czarny Minotaur',
    level: 20,
    hp: 600, maxHp: 600,
    damageMin: 20, damageMax: 30,
    defense: 30,
    expReward: getExp(20),
    goldReward: 39,
    type: 'humanoid',
    lootTable: { common: 40, unique: 25, hero: 20, legendary: 1.5 }
};

// Tier 5
const phantomKnight: Monster = {
    id: 'monster_21',
    name: 'Widmowy Rycerz',
    level: 21,
    hp: 660, maxHp: 660,
    damageMin: 21, damageMax: 31,
    defense: 32,
    expReward: getExp(21),
    goldReward: 42,
    type: 'undead',
    lootTable: { common: 40, unique: 25, hero: 20, legendary: 1.7 }
};

const nightStrangler: Monster = {
    id: 'monster_22',
    name: 'Dusiciel Nocy',
    level: 22,
    hp: 720, maxHp: 720,
    damageMin: 22, damageMax: 33,
    defense: 34,
    expReward: getExp(22),
    goldReward: 45,
    type: 'demon',
    lootTable: { common: 38, unique: 28, hero: 22, legendary: 2.0 }
};

const darkPriest: Monster = {
    id: 'monster_23',
    name: 'Kapłan Mroku',
    level: 23,
    hp: 780, maxHp: 780,
    damageMin: 23, damageMax: 35,
    defense: 36,
    expReward: getExp(23),
    goldReward: 48,
    type: 'humanoid',
    lootTable: { common: 35, unique: 30, hero: 22, legendary: 2.2 }
};

const stoneTitan: Monster = {
    id: 'monster_24',
    name: 'Kamienny Tytan',
    level: 24,
    hp: 860, maxHp: 860,
    damageMin: 24, damageMax: 38,
    defense: 38,
    expReward: getExp(24),
    goldReward: 52,
    type: 'demon',
    lootTable: { common: 35, unique: 30, hero: 24, legendary: 2.5 }
};

const undergroundHorror: Monster = {
    id: 'monster_25',
    name: 'Horror Z Podziemi',
    level: 25,
    hp: 940, maxHp: 940,
    damageMin: 25, damageMax: 40,
    defense: 40,
    expReward: getExp(25),
    goldReward: 55,
    type: 'demon',
    lootTable: { common: 30, unique: 30, hero: 25, legendary: 3.0 }
};

// Tier 6
const wyvern: Monster = {
    id: 'monster_26',
    name: 'Smokli Wyverna',
    level: 26,
    hp: 1020, maxHp: 1020,
    damageMin: 26, damageMax: 43,
    defense: 42,
    expReward: getExp(26),
    goldReward: 60,
    type: 'animal',
    lootTable: { common: 30, unique: 30, hero: 25, legendary: 3.2 }
};

const ghoulKing: Monster = {
    id: 'monster_27',
    name: 'Król Ghuli',
    level: 27,
    hp: 1100, maxHp: 1100,
    damageMin: 27, damageMax: 45,
    defense: 44,
    expReward: getExp(27),
    goldReward: 65,
    type: 'undead',
    lootTable: { common: 25, unique: 30, hero: 28, legendary: 3.4 }
};

const whisperer: Monster = {
    id: 'monster_28',
    name: 'Pradawny Szeptacz',
    level: 28,
    hp: 1180, maxHp: 1180,
    damageMin: 28, damageMax: 47,
    defense: 46,
    expReward: getExp(28),
    goldReward: 70,
    type: 'demon',
    lootTable: { common: 25, unique: 30, hero: 28, legendary: 3.6 }
};

const fallenChamp: Monster = {
    id: 'monster_29',
    name: 'Upadły Czempion',
    level: 29,
    hp: 1300, maxHp: 1300,
    damageMin: 30, damageMax: 50,
    defense: 48,
    expReward: getExp(29),
    goldReward: 75,
    type: 'undead',
    lootTable: { common: 20, unique: 30, hero: 30, legendary: 4.0 }
};

const avatar: Monster = {
    id: 'monster_30',
    name: 'Avatar Eteru',
    level: 30,
    hp: 1500, maxHp: 1500,
    damageMin: 32, damageMax: 55,
    defense: 50,
    expReward: getExp(30, true),
    goldReward: 100,
    type: 'boss',
    description: 'Inkarnacja samej magii Eteru. Ostateczne wyzwanie.',
    lootTable: { common: 10, unique: 20, hero: 40, legendary: 5.0 }
};

// --- DUNGEON BOSSES ---

const dungeonBoss1: Monster = {
    id: 'boss_dungeon_1',
    name: 'Ghul Królewski',
    level: 12,
    hp: 280, maxHp: 280,
    damageMin: 14, damageMax: 22,
    defense: 20,
    expReward: getExp(12, true),
    goldReward: 35,
    type: 'boss',
    description: 'Władca krypty, którego ugryzienie zatruwa duszę.',
    lootTable: { common: 20, unique: 30, hero: 40, legendary: 5, talisman: 1 },
    mechanics: [
        { name: 'Ugryzienie Ghula', description: 'Zadaje 125% obrażeń + trucizna', trigger: 'every_n_turns', value: 2, effect: 'dot_poison', effectValue: 6, duration: 3 },
        { name: 'Regeneracja', description: 'Leczy 5% HP co 3 tury', trigger: 'every_n_turns', value: 3, effect: 'heal_percent', effectValue: 5 }
    ]
};

const dungeonBoss2: Monster = {
    id: 'boss_dungeon_2',
    name: 'Władca Wilków Alfa',
    level: 18,
    hp: 490, maxHp: 490,
    damageMin: 25, damageMax: 38,
    defense: 33,
    expReward: getExp(18, true),
    goldReward: 60,
    type: 'boss',
    description: 'Przywódca stada, którego wycie mrozi krew w żyłach.',
    lootTable: { common: 15, unique: 25, hero: 45, legendary: 7, talisman: 1.5 },
    mechanics: [
        { name: 'Alfa-Szarpnięcie', description: 'Ignoruje 50% pancerza', trigger: 'every_n_turns', value: 3, effect: 'ignore_armor_percent', effectValue: 0.5 },
        { name: 'Stado Wilków', description: '+20% uniku gdy HP < 50%', trigger: 'hp_below', value: 50, effect: 'debuff_hit', effectValue: 20 } // Simulating dodge by debuffing hit chance or just passive logic
    ]
};

const dungeonBoss3: Monster = {
    id: 'boss_dungeon_3',
    name: 'Eteryczny Prorok',
    level: 25,
    hp: 920, maxHp: 920,
    damageMin: 32, damageMax: 45,
    defense: 44,
    expReward: getExp(25, true),
    goldReward: 100,
    type: 'boss',
    description: 'Mag posługujący się czystą energią Eteru.',
    lootTable: { common: 10, unique: 20, hero: 50, legendary: 10, talisman: 2 },
    mechanics: [
        { name: 'Uderzenie Eteru', description: 'Obrażenia magiczne 1.5x', trigger: 'every_n_turns', value: 3, effect: 'damage_multiplier', effectValue: 1.5 },
        { name: 'Boska Bariera', description: 'Tarcza redukująca obrażenia', trigger: 'every_n_turns', value: 4, effect: 'shield_percent', effectValue: 35, duration: 2 }
    ]
};

const dungeonBoss4: Monster = {
    id: 'boss_dungeon_4',
    name: 'Avatar Eteru, Arcyforma',
    level: 32,
    hp: 1700, maxHp: 1700,
    damageMin: 40, damageMax: 60,
    defense: 55,
    expReward: getExp(32, true),
    goldReward: 150,
    type: 'boss',
    description: 'Ostateczna forma Eteru. Pan Upadłej Cytadeli.',
    lootTable: { common: 5, unique: 15, hero: 40, legendary: 15, mythic: 2, talisman: 4 },
    mechanics: [
        { name: 'Rytuał Dusz', description: 'Kradnie 10% HP', trigger: 'every_n_turns', value: 3, effect: 'heal_percent', effectValue: 10 }, // Simplified steal as heal
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
