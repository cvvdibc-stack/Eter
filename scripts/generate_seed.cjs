const fs = require('fs');

const monsters = [];
const legendaryItems = [];
const titanicItems = [];

// Helper for random range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Monster Names Pool
const monsterNames = [
    "Wielki Szczur", "Dziki Pies", "Leśny Wilk", "Goblin Zwiadowca", "Goblin Wojownik",
    "Wściekły Dzik", "Szaman Goblinów", "Krwawy Niedźwiedź", "Bandyta", "Herszt Bandytów",
    "Szkielet", "Szkielet Wojownik", "Ghul", "Zombie", "Mroczny Kultysta",
    "Wampirzy Sługa", "Wilkołak", "Kamienny Golem", "Żywiołak Ognia", "Pan Podziemi",
    "Młody Smok", "Lodowy Gigant", "Strażnik Grobowca", "Upiorny Rycerz", "Lis-Demon",
    "Mroczny Elf", "Cień", "Pradawny Ork", "Smoczy Strażnik", "Król Lisz"
];

const descriptions = [
    "Wielki, brudny szczur zamieszkujący kanały i piwnice.",
    "Agresywne zwierzę, które atakuje wszystko co się rusza.",
    "Drapieżnik polujący w watahach.",
    "Mały, ale przebiegły stwór.",
    "Uzbrojony w zardzewiały miecz.",
    "Niebezpieczna bestia o potężnych kłach.",
    "Włada prymitywną magią natury.",
    "Bestia, która posmakowała ludzkiej krwi.",
    "Wyjęty spod prawa rzezimieszek.",
    "Przywódca lokalnej szajki.",
    "Ożywione kości dawnego wojownika.",
    "Bezlitosna maszyna do zabijania.",
    "Pożeracz zwłok.",
    "Powolny, ale nieustępliwy.",
    "Wyznawca mrocznych bóstw.",
    "Sługa nocy, łaknący krwi.",
    "Pół-człowiek, pół-wilk.",
    "Stworzony z ożywionej skały.",
    "Płonąca istota z innego wymiaru.",
    "Władca mrocznych korytarzy.",
    "Niedojrzała jeszcze bestia, ale ziejąca ogniem.",
    "Ogromna istota z lodu.",
    "Wieczny stróż starożytnych ruin.",
    "Duch dawnego rycerza.",
    "Przebiegły demon w lisiej skórze.",
    "Wojownik z głębin ziemi.",
    "Istota z czystej ciemności.",
    "Weteran tysiąca bitew.",
    "Strzeże leża smoka.",
    "Władca nieumarłych."
];

const types = [
    'animal', 'animal', 'animal', 'humanoid', 'humanoid',
    'animal', 'humanoid', 'animal', 'humanoid', 'humanoid',
    'undead', 'undead', 'undead', 'undead', 'humanoid',
    'humanoid', 'beast', 'elemental', 'elemental', 'boss',
    'dragon', 'elemental', 'undead', 'undead', 'demon',
    'humanoid', 'demon', 'humanoid', 'dragon', 'undead'
];

// Generate 30 Monsters
for (let i = 1; i <= 30; i++) {
    const isBoss = i % 5 === 0; // Boss every 5 levels
    const level = i;
    
    // Stats Scaling
    const hp = isBoss ? (level * 120 + 200) : (level * 30 + 20);
    const dmgMin = isBoss ? (level * 4 + 5) : (level * 1.5 + 1);
    const dmgMax = isBoss ? (level * 5 + 10) : (level * 2 + 3);
    const armor = isBoss ? (level * 3 + 5) : (level * 1.5);
    const sa = isBoss ? (90 + level * 3) : (80 + level * 2); // Bosses are faster
    const dodge = isBoss ? (5 + level * 0.5) : (1 + level * 0.2);
    
    // Rewards
    const exp = isBoss ? (level * 25 + 50) : (4 + (level * 2.5) + Math.pow(level, 1.5));
    const goldMin = isBoss ? (level * 8 + 5) : (1 + Math.floor(level * 1.2));
    const goldMax = isBoss ? (level * 12 + 20) : (2 + Math.floor(level * 1.8));

    // Loot Table
    const lootTable = {
        rarity: {
            common: isBoss ? 50 : 75,
            unique: isBoss ? 25 : 20,
            heroic: isBoss ? 15 : 4,
            legendary: isBoss ? 9.8 : 0.2,
            tytanic: isBoss ? 0.066 : 0
        },
        legends: {
            warrior: `leg_monster_${i}_warrior`,
            assassin: `leg_monster_${i}_assassin`,
            mage: `leg_monster_${i}_mage`,
            cleric: `leg_monster_${i}_cleric`
        },
        tytanic: isBoss ? {
            warrior: `tyt_boss_${i}_warrior`,
            assassin: `tyt_boss_${i}_assassin`,
            mage: `tyt_boss_${i}_mage`,
            cleric: `tyt_boss_${i}_cleric`
        } : null,
        level_gate: {
            unique: 1,
            heroic: 10,
            legendary: 16,
            tytanic: 20
        }
    };

    monsters.push({
        id: `monster_${i}`,
        name: monsterNames[i-1],
        level: level,
        is_boss: isBoss,
        type: types[i-1],
        description: descriptions[i-1],
        stats: JSON.stringify({
            hp: Math.floor(hp),
            maxHp: Math.floor(hp),
            armor: Math.floor(armor),
            damageMin: Math.floor(dmgMin),
            damageMax: Math.floor(dmgMax),
            magicDamageMin: 0,
            magicDamageMax: 0,
            magicResist: Math.floor(level * 0.5),
            dodge: Math.floor(dodge),
            sa: Math.floor(sa)
        }),
        rewards: JSON.stringify({
            exp: Math.floor(exp),
            goldMin: Math.floor(goldMin),
            goldMax: Math.floor(goldMax)
        }),
        loot_table: JSON.stringify(lootTable),
        image: null,
        mechanics: '[]'
    });

    // Generate Legends for this monster (One per class)
    const itemTypes = ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'amulet', 'ring', 'shield'];
    const itemNames = ['Mocy', 'Gniewu', 'Cienia', 'Światła', 'Zagłady', 'Nadziei', 'Pustki', 'Eteru'];
    
    ['warrior', 'assassin', 'mage', 'cleric'].forEach(prof => {
        const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const itemName = `Legenda ${monsterNames[i-1]} (${prof})`;
        
        // Specific stats for Legend
        const stats = {};
        if (prof === 'warrior') { stats.strength = level * 3; stats.vitality = level * 2; stats.armor = level * 2; }
        if (prof === 'assassin') { stats.dexterity = level * 3; stats.critChance = 5 + level; stats.dodgeChance = 2; }
        if (prof === 'mage') { stats.intelligence = level * 3; stats.magicDamage = level * 2; stats.manaShield = 5; }
        if (prof === 'cleric') { stats.intelligence = level * 2; stats.vitality = level * 3; stats.healingPower = level * 2; }
        
        // Add secondary
        stats.hp = level * 10;
        
        legendaryItems.push({
            id: `leg_monster_${i}_${prof}`,
            name: itemName,
            type: type, 
            rarity: 'legendary',
            profession: prof,
            level_req: Math.max(1, level - 2),
            stats: JSON.stringify(stats),
            image: null
        });
    });

    // Generate Titanics if Boss
    if (isBoss) {
        ['warrior', 'assassin', 'mage', 'cleric'].forEach(prof => {
            const stats = {};
            // OP Stats
            if (prof === 'warrior') { stats.strength = level * 5; stats.firstHitShield = true; stats.unbreakable = 10; }
            if (prof === 'assassin') { stats.dexterity = level * 5; stats.bloodFury = 10; stats.initiative = 5; }
            if (prof === 'mage') { stats.intelligence = level * 5; stats.overload = 10; stats.magicPen = 10; }
            if (prof === 'cleric') { stats.intelligence = level * 4; stats.sanctifiedAura = true; stats.hpRegen = 2; }
            
            stats.maxHp = level * 20;

            titanicItems.push({
                id: `tyt_boss_${i}_${prof}`,
                name: `Tytan ${monsterNames[i-1]} (${prof})`,
                type: 'weapon', 
                rarity: 'mythic', 
                profession: prof,
                level_req: level,
                stats: JSON.stringify(stats),
                image: null
            });
        });
    }
}

// Generate SQL
console.log(`
-- Clean tables
DELETE FROM monsters;
DELETE FROM items;

-- Insert Monsters
INSERT INTO monsters (id, name, level, is_boss, type, description, stats, rewards, loot_table, mechanics) VALUES
${monsters.map(m => `('${m.id}', '${m.name}', ${m.level}, ${m.is_boss}, '${m.type}', '${m.description}', '${m.stats}', '${m.rewards}', '${m.loot_table}', '${m.mechanics}')`).join(',\n')};

-- Insert Legendary Items
INSERT INTO items (id, name, type, rarity, profession, level_req, stats) VALUES
${legendaryItems.map(i => `('${i.id}', '${i.name}', '${i.type}', '${i.rarity}', '${i.profession}', ${i.level_req}, '${i.stats}')`).join(',\n')};

-- Insert Titanic Items
${titanicItems.length > 0 ? `INSERT INTO items (id, name, type, rarity, profession, level_req, stats) VALUES
${titanicItems.map(i => `('${i.id}', '${i.name}', '${i.type}', '${i.rarity}', '${i.profession}', ${i.level_req}, '${i.stats}')`).join(',\n')};` : ''}
`);

