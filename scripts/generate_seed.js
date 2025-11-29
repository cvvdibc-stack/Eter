
const fs = require('fs');

// Mock types for the script
const calculateMonsterBaseExp = (lvl, isBoss) => {
    // Simplified for seed generation, matching formula roughly or just placeholders 
    // actually we can just use the values from the file I read.
    return 0; 
};

// Monster Data Copied and Adapted from src/data/monsters.ts
// I will interpret the read file and manually paste the relevant parts or reconstruct them.
// Since I can't "import" TS in a simple node script without setup, I'll paste the data array structure here.

const MONSTERS = [
    { id: 'monster_1', name: 'Wielki Szczur', level: 1, hp: 40, damageMin: 1, damageMax: 3, defense: 2, type: 'animal', description: 'Wielki, brudny szczur zamieszkujący kanały i piwnice.', expReward: 5, goldMin: 2, goldMax: 5 },
    { id: 'monster_2', name: 'Dziki Ptak', level: 2, hp: 52, damageMin: 2, damageMax: 4, defense: 3, type: 'animal', description: 'Szybki i drapieżny ptak.', expReward: 8, goldMin: 3, goldMax: 6 },
    { id: 'monster_3', name: 'Wilk', level: 3, hp: 65, damageMin: 3, damageMax: 6, defense: 5, type: 'animal', description: 'Drapieżnik leśny polujący w watahach.', expReward: 12, goldMin: 4, goldMax: 8 },
    { id: 'monster_4', name: 'Bandzior Zarośli', level: 4, hp: 78, damageMin: 4, damageMax: 7, defense: 6, type: 'humanoid', description: 'Zwykły rzezimieszek.', expReward: 16, goldMin: 5, goldMax: 10 },
    { id: 'monster_5', name: 'Ork Przywódca', level: 5, hp: 92, damageMin: 5, damageMax: 9, defense: 8, type: 'humanoid', description: 'Brutalny dowódca.', expReward: 22, goldMin: 6, goldMax: 12 },
    { id: 'monster_6', name: 'Zgnilizny Lasu', level: 6, hp: 110, damageMin: 6, damageMax: 10, defense: 9, type: 'undead', description: '', expReward: 28, goldMin: 8, goldMax: 14 },
    { id: 'monster_7', name: 'Krwisty Pożeracz', level: 7, hp: 128, damageMin: 7, damageMax: 11, defense: 10, type: 'demon', description: '', expReward: 35, goldMin: 10, goldMax: 16 },
    { id: 'monster_8', name: 'Cień Zwiadowca', level: 8, hp: 150, damageMin: 8, damageMax: 12, defense: 12, type: 'undead', description: '', expReward: 42, goldMin: 12, goldMax: 18 },
    { id: 'monster_9', name: 'Ogar Ciemności', level: 9, hp: 175, damageMin: 9, damageMax: 13, defense: 13, type: 'demon', description: '', expReward: 50, goldMin: 14, goldMax: 20 },
    { id: 'monster_10', name: 'Ghul Wojownik', level: 10, hp: 220, damageMin: 10, damageMax: 15, defense: 15, type: 'undead', description: 'Pradawny wojownik ożywiony mroczną magią.', expReward: 65, goldMin: 16, goldMax: 24 },
    { id: 'monster_11', name: 'Bies Torfowy', level: 11, hp: 245, damageMin: 11, damageMax: 16, defense: 15, type: 'demon', description: '', expReward: 75, goldMin: 18, goldMax: 26 },
    { id: 'monster_12', name: 'Strzyga', level: 12, hp: 270, damageMin: 12, damageMax: 17, defense: 16, type: 'undead', description: '', expReward: 85, goldMin: 20, goldMax: 28 },
    { id: 'monster_13', name: 'Ożywiony Zbrojny', level: 13, hp: 300, damageMin: 13, damageMax: 18, defense: 18, type: 'undead', description: '', expReward: 95, goldMin: 22, goldMax: 30 },
    { id: 'monster_14', name: 'Mroczny Adept', level: 14, hp: 335, damageMin: 14, damageMax: 19, defense: 19, type: 'humanoid', description: '', expReward: 105, goldMin: 24, goldMax: 32 },
    { id: 'monster_15', name: 'Przeklęty Rycerz', level: 15, hp: 370, damageMin: 15, damageMax: 21, defense: 20, type: 'undead', description: '', expReward: 120, goldMin: 26, goldMax: 36 },
    { id: 'monster_16', name: 'Bestia Z Otchłani', level: 16, hp: 410, damageMin: 16, damageMax: 22, defense: 21, type: 'demon', description: '', expReward: 135, goldMin: 28, goldMax: 38 },
    { id: 'monster_17', name: 'Władca Wilków', level: 17, hp: 450, damageMin: 17, damageMax: 24, defense: 23, type: 'animal', description: '', expReward: 150, goldMin: 30, goldMax: 40 },
    { id: 'monster_18', name: 'Upiorny Łowca', level: 18, hp: 495, damageMin: 18, damageMax: 25, defense: 25, type: 'undead', description: '', expReward: 165, goldMin: 32, goldMax: 42 },
    { id: 'monster_19', name: 'Wiedźmiarz', level: 19, hp: 540, damageMin: 19, damageMax: 27, defense: 27, type: 'humanoid', description: '', expReward: 180, goldMin: 34, goldMax: 44 },
    { id: 'monster_20', name: 'Czarny Minotaur', level: 20, hp: 600, damageMin: 20, damageMax: 30, defense: 30, type: 'humanoid', description: '', expReward: 200, goldMin: 36, goldMax: 48 },
    { id: 'monster_21', name: 'Widmowy Rycerz', level: 21, hp: 660, damageMin: 21, damageMax: 31, defense: 32, type: 'undead', description: '', expReward: 220, goldMin: 38, goldMax: 50 },
    { id: 'monster_22', name: 'Dusiciel Nocy', level: 22, hp: 720, damageMin: 22, damageMax: 33, defense: 34, type: 'demon', description: '', expReward: 240, goldMin: 40, goldMax: 54 },
    { id: 'monster_23', name: 'Kapłan Mroku', level: 23, hp: 780, damageMin: 23, damageMax: 35, defense: 36, type: 'humanoid', description: '', expReward: 260, goldMin: 42, goldMax: 58 },
    { id: 'monster_24', name: 'Kamienny Tytan', level: 24, hp: 860, damageMin: 24, damageMax: 38, defense: 38, type: 'demon', description: '', expReward: 280, goldMin: 44, goldMax: 62 },
    { id: 'monster_25', name: 'Horror Z Podziemi', level: 25, hp: 940, damageMin: 25, damageMax: 40, defense: 40, type: 'demon', description: '', expReward: 300, goldMin: 46, goldMax: 66 },
    { id: 'monster_26', name: 'Smokli Wyverna', level: 26, hp: 1020, damageMin: 26, damageMax: 43, defense: 42, type: 'animal', description: '', expReward: 320, goldMin: 50, goldMax: 70 },
    { id: 'monster_27', name: 'Król Ghuli', level: 27, hp: 1100, damageMin: 27, damageMax: 45, defense: 44, type: 'undead', description: '', expReward: 350, goldMin: 55, goldMax: 75 },
    { id: 'monster_28', name: 'Pradawny Szeptacz', level: 28, hp: 1180, damageMin: 28, damageMax: 47, defense: 46, type: 'demon', description: '', expReward: 380, goldMin: 60, goldMax: 80 },
    { id: 'monster_29', name: 'Upadły Czempion', level: 29, hp: 1300, damageMin: 30, damageMax: 50, defense: 48, type: 'undead', description: '', expReward: 410, goldMin: 65, goldMax: 85 },
    { id: 'monster_30', name: 'Avatar Eteru', level: 30, hp: 1500, damageMin: 32, damageMax: 55, defense: 50, type: 'boss', description: 'Inkarnacja samej magii Eteru.', expReward: 500, goldMin: 100, goldMax: 200 },
    
    // Dungeon Bosses
    { id: 'boss_dungeon_1', name: 'Ghul Królewski', level: 12, hp: 280, damageMin: 14, damageMax: 22, defense: 20, type: 'boss', description: 'Władca krypty.', expReward: 150, goldMin: 35, goldMax: 55 },
    { id: 'boss_dungeon_2', name: 'Władca Wilków Alfa', level: 18, hp: 490, damageMin: 25, damageMax: 38, defense: 33, type: 'boss', description: 'Przywódca stada.', expReward: 250, goldMin: 60, goldMax: 90 },
    { id: 'boss_dungeon_3', name: 'Eteryczny Prorok', level: 25, hp: 920, damageMin: 32, damageMax: 45, defense: 44, type: 'boss', description: 'Mag posługujący się czystą energią Eteru.', expReward: 400, goldMin: 100, goldMax: 150 },
    { id: 'boss_dungeon_4', name: 'Avatar Eteru, Arcyforma', level: 32, hp: 1700, damageMin: 40, damageMax: 60, defense: 55, type: 'boss', description: 'Ostateczna forma Eteru.', expReward: 600, goldMin: 150, goldMax: 250 }
];

const itemTemplates = [];
const sqlStatements = [];

// Helper to generate loot table
const getLootTable = (monsterId, isBoss) => {
    if (isBoss) {
        return JSON.stringify({
            rarity: { common: 50, unique: 25, heroic: 15, legendary: 9.8, tytanic: 0.066 },
            legends: {
                warrior: `leg_${monsterId}_warrior`,
                assassin: `leg_${monsterId}_assassin`,
                mage: `leg_${monsterId}_mage`,
                cleric: `leg_${monsterId}_cleric`
            },
            tytanic: {
                warrior: `tyt_${monsterId}_warrior`,
                assassin: `tyt_${monsterId}_assassin`,
                mage: `tyt_${monsterId}_mage`,
                cleric: `tyt_${monsterId}_cleric`
            },
            level_gate: { heroic: 10, legendary: 15, tytanic: 20 }
        });
    } else {
        return JSON.stringify({
            rarity: { common: 75, unique: 20, heroic: 4, legendary: 0.2, tytanic: 0 },
            legends: {
                warrior: `leg_${monsterId}_warrior`,
                assassin: `leg_${monsterId}_assassin`,
                mage: `leg_${monsterId}_mage`,
                cleric: `leg_${monsterId}_cleric`
            },
            tytanic: null,
            level_gate: { unique: 1, heroic: 10, legendary: 16, tytanic: 999 }
        });
    }
};

// Generate Item Stats based on level and class
const generateStats = (level, profession, rarity) => {
    const multiplier = rarity === 'tytanic' ? 2.0 : 1.5; // Stronger stats
    const stats = {};
    
    // Basic stats
    if (profession === 'warrior') {
        stats.strength = Math.floor(level * 2 * multiplier);
        stats.vitality = Math.floor(level * 1.5 * multiplier);
        stats.damageMin = Math.floor(level * 1.2 * multiplier);
    } else if (profession === 'assassin') {
        stats.dexterity = Math.floor(level * 2 * multiplier);
        stats.critChance = 5 + Math.floor(level * 0.2);
        stats.attackSpeed = 10 + Math.floor(level * 0.5);
    } else if (profession === 'mage') {
        stats.intelligence = Math.floor(level * 2 * multiplier);
        stats.magicDamage = Math.floor(level * 1.5 * multiplier);
        stats.manaShield = 5 + Math.floor(level * 0.2);
    } else if (profession === 'cleric') {
        stats.intelligence = Math.floor(level * 1.8 * multiplier);
        stats.vitality = Math.floor(level * 1.8 * multiplier);
        stats.healingPower = Math.floor(level * 1.5 * multiplier);
    }
    
    // Add one "special" stat
    if (rarity === 'tytanic') {
        stats.allResist = 5 + Math.floor(level * 0.2); // Example
        stats.hpRegen = 2 + Math.floor(level * 0.1);
    }

    return JSON.stringify(stats);
};

// Generate Items
MONSTERS.forEach(monster => {
    const isBoss = monster.type === 'boss' || monster.id.startsWith('boss');
    
    // Create Monster Insert
    const stats = JSON.stringify({
        hp: monster.hp,
        maxHp: monster.hp,
        damageMin: monster.damageMin,
        damageMax: monster.damageMax,
        defense: monster.defense
    });
    const rewards = JSON.stringify({
        exp: monster.expReward,
        goldMin: monster.goldMin,
        goldMax: monster.goldMax
    });
    const lootTable = getLootTable(monster.id, isBoss);
    
    sqlStatements.push(`INSERT INTO monsters (id, name, level, is_boss, type, description, stats, rewards, loot_table) VALUES ('${monster.id}', '${monster.name}', ${monster.level}, ${isBoss}, '${monster.type}', '${monster.description}', '${stats}', '${rewards}', '${lootTable}') ON CONFLICT (id) DO UPDATE SET stats = EXCLUDED.stats, rewards = EXCLUDED.rewards, loot_table = EXCLUDED.loot_table;`);

    // Generate Legends
    const professions = ['warrior', 'assassin', 'mage', 'cleric'];
    const itemTypes = {
        warrior: 'weapon',
        assassin: 'weapon',
        mage: 'weapon',
        cleric: 'amulet' 
    };
    const itemNames = {
        warrior: ['Miecz', 'Topór', 'Młot', 'Ostrze'],
        assassin: ['Sztylet', 'Ostrze', 'Klinga', 'Noże'],
        mage: ['Kostur', 'Różdżka', 'Laska', 'Orb'],
        cleric: ['Amulet', 'Relikwia', 'Symbol', 'Talizman']
    };

    professions.forEach(prof => {
        // Legend
        const legId = `leg_${monster.id}_${prof}`;
        const legName = `${itemNames[prof][Math.floor(Math.random()*itemNames[prof].length)]} ${monster.name.split(' ')[1] || monster.name}`;
        const legStats = generateStats(monster.level, prof, 'legendary');
        sqlStatements.push(`INSERT INTO items (id, name, type, rarity, profession, level_req, stats) VALUES ('${legId}', '${legName} (Legenda)', '${itemTypes[prof]}', 'legendary', '${prof}', ${monster.level}, '${legStats}') ON CONFLICT (id) DO NOTHING;`);
        
        // Tytanic (Boss Only)
        if (isBoss) {
            const tytId = `tyt_${monster.id}_${prof}`;
            const tytName = `Pradawny ${itemNames[prof][0]} ${monster.name.split(' ')[1] || monster.name}`;
            const tytStats = generateStats(monster.level, prof, 'tytanic');
            sqlStatements.push(`INSERT INTO items (id, name, type, rarity, profession, level_req, stats) VALUES ('${tytId}', '${tytName} (Tytan)', '${itemTypes[prof]}', 'tytanic', '${prof}', ${monster.level}, '${tytStats}') ON CONFLICT (id) DO NOTHING;`);
        }
    });
});

console.log(sqlStatements.join('\n'));

