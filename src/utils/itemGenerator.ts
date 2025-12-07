import { Item, ItemRarity, ItemStats, ItemType, Profession } from '../types';

/* --------------------------- CONFIG: BASE STAT VALUES --------------------------- */
// Fixed base values (no more wide ranges) - semi-random will add ±variance
const STAT_BASE_VALUES = {
    PRIMARY: (lvl: number) => lvl * 1.5,
    DAMAGE: (lvl: number) => lvl * 1.4,
    MAGIC_DMG: (lvl: number) => lvl * 1.8,
    ARMOR: (lvl: number) => lvl * 1.2,
    HP: (lvl: number) => lvl * 10,
    VITALITY: (lvl: number) => lvl * 1.2,
    PERCENT_SMALL: () => 3,
    PERCENT_MED: () => 7,
    PERCENT_BIG: () => 11,
    FLAT_SMALL: (lvl: number) => lvl * 0.8,
    FLAT_MED: (lvl: number) => lvl * 1.5,
    INITIATIVE: () => 3,
    STABILITY: () => 2,
    POISON: () => 12,
    BURN: () => 12,
};

/* --------------------------- CONFIG: CONTROLLED VARIANCE --------------------------- */
// Variance for semi-random generation (legendary/mythic use fixed database)
const CONTROLLED_VARIANCE = {
    common: { min: 0.95, max: 1.05 },    // ±5%
    unique: { min: 0.92, max: 1.08 },    // ±8%
    heroic: { min: 0.90, max: 1.10 }     // ±10%
};

/* --------------------------- CONFIG: RARITIES ------------------------------ */
/* Fixed number of BONUSES (on top of implicit) */
const RARITY_BONUSES = {
    common: 1,
    unique: 2,
    heroic: 3,
    legendary: 5,
    mythic: 7,
    talisman: 1
};

const RARITY_MULTIPLIER = {
    common: 1.0,
    unique: 1.4,
    heroic: 1.9,
    legendary: 3.5,  // Legendary/Mythic should use fixed database, but keeping for fallback
    mythic: 8.0,
    talisman: 1.0
};

/* ------------------- CONFIG: CLASSES – Allowed / Forbidden ------------------- */
const CLASS_MATRIX: Record<Profession, { allowed: (keyof ItemStats)[], forbidden: (keyof ItemStats)[] }> = {
    warrior: {
        allowed: [
            'strength', 'vitality', 'armor', 'hp', 'blockChance', 'blockValue',
            'damageMin', 'damageMax', 'attackSpeed', 'piercingDamage',
            'reducedDamage', 'armorPen', 'hpRegen', 'critChance'
        ],
        forbidden: ['intelligence', 'magicDamage', 'magicResist', 'healingPower', 'poisonChance', 'burnChance']
    },
    assassin: {
        allowed: [
            'dexterity', 'strength', 'critChance', 'critDamage', 'dodgeChance',
            'vitality', 'damageMin', 'damageMax', 'attackSpeed', 'initiative',
            'stability', 'poisonChance', 'armorPen', 'piercingDamage'
        ],
        forbidden: ['intelligence', 'magicDamage', 'magicResist', 'blockChance', 'blockValue', 'burnChance']
    },
    mage: {
        allowed: [
            'intelligence', 'magicDamage', 'magicResist', 'hp', 'vitality',
            'attackSpeed', 'initiative', 'burnChance', 'magicPen', 'manaShield',
            'hpRegen', 'critChance'
        ],
        forbidden: ['strength', 'armor', 'blockChance', 'blockValue', 'damageMin', 'damageMax', 'poisonChance']
    },
    cleric: {
        allowed: [
            'intelligence', 'vitality', 'healingPower', 'armor', 'hp',
            'magicResist', 'manaShield', 'blockChance', 'blockValue',
            'reducedDamage', 'initiative'
        ],
        forbidden: ['dexterity', 'critDamage', 'damageMin', 'damageMax', 'poisonChance', 'burnChance']
    }
};

/* ---------------------- NAME POOLS ------------------------------ */
const ITEM_NAMES = {
    warrior: {
        weapon: ['Miecz', 'Topór', 'Młot', 'Ostrze'],
        armor: ['Zbroja', 'Kirys', 'Pancerz'],
        helmet: ['Hełm', 'Przyłbica'],
        shield: ['Tarcza', 'Puklerz', 'Pawęż']
    },
    assassin: {
        weapon: ['Sztylet', 'Pazur', 'Kozik'],
        armor: ['Płaszcz Cienia', 'Skórzana Zbroja'],
        helmet: ['Kaptur', 'Maska'],
        shield: ['Sztylet Pomocniczy', 'Krótkie Ostrze']
    },
    mage: {
        weapon: ['Kostur', 'Różdżka', 'Laska'],
        armor: ['Szata', 'Toga', 'Opończa'],
        helmet: ['Kapelusz', 'Tiara'],
        shield: ['Orb', 'Kula', 'Księga']
    },
    cleric: {
        weapon: ['Buława', 'Berło', 'Laska'],
        armor: ['Habit', 'Ornat', 'Szata Zakonna'],
        helmet: ['Korona', 'Kaptur'],
        shield: ['Relikwiarz', 'Tarcza Zakonna']
    }
};

const GENERIC = {
    boots: ['Buty', 'Trzewiki', 'Sandały'],
    ring: ['Pierścień', 'Sygnet', 'Obrączka'],
    amulet: ['Amulet', 'Talizman', 'Wisior'],
    gloves: ['Rękawice', 'Karwasze']
};

const ADJ = {
    common: ['Zwykły', 'Prosty', 'Stary'],
    unique: ['Solidny', 'Rzadki', 'Dobry'],
    heroic: ['Potężny', 'Bohaterski', 'Wyśmienity'],
    legendary: ['Legendarny', 'Zapomniany', 'Smoczy'],
    mythic: ['Boski', 'Eteryczny', 'Nieśmiertelny'],
    talisman: ['Magiczny']
};

/* --------------------------- CONFIG: ARMOR SCALING --------------------------- */
const ARMOR_CLASS_MULTIPLIER = {
    warrior: 1.6,
    cleric: 1.2,
    assassin: 0.9,
    mage: 0.6
};

const ARMOR_SLOT_MULTIPLIER: Record<string, number> = {
    armor: 1.5,
    helmet: 1.2,
    boots: 1.0,
    gloves: 0.8,
    shield: 1.8
};

/* --------------------------- CONFIG: STAT SLOT SCALING --------------------------- */
// Reduces effective value of stats on certain slots (e.g. minimal DMG on rings)
const STAT_SLOT_MULTIPLIER: Record<string, Record<string, number>> = {
    amulet: {
        damageMin: 0.25,
        damageMax: 0.25,
        magicDamage: 0.25,
        armor: 0.2
    },
    ring: {
        damageMin: 0.25,
        damageMax: 0.25,
        magicDamage: 0.25,
        armor: 0.2
    },
    boots: {
        damageMin: 0,
        damageMax: 0,
        magicDamage: 0
    },
    helmet: {
        damageMin: 0,
        damageMax: 0,
        magicDamage: 0
    },
    gloves: {
        damageMin: 0,
        damageMax: 0,
        magicDamage: 0
    },
    armor: {
        damageMin: 0,
        damageMax: 0,
        magicDamage: 0
    }
};

/* --------------------------- HELPER FUNCTIONS ------------------------------ */
const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];

// New function: Apply controlled variance to base values
const getStatValue = (
    baseValue: number,
    multiplier: number,
    rarity: ItemRarity
): number => {
    const variance = CONTROLLED_VARIANCE[rarity as keyof typeof CONTROLLED_VARIANCE];

    if (!variance) {
        // Legendary/Mythic/Talisman - no variance (should use fixed database)
        return Math.floor(baseValue * multiplier);
    }

    // Common/Unique/Heroic - apply controlled variance
    const randomFactor = variance.min + Math.random() * (variance.max - variance.min);
    return Math.floor(baseValue * multiplier * randomFactor);
};

// Legacy function for compatibility (deprecated - use getStatValue)
const getRangeValue = (range: number[] | number, mult: number) => {
    if (Array.isArray(range)) {
        const base = rand(range[0], range[1]);
        return Math.floor(base * mult);
    }
    return Math.floor(range * mult);
};

/* -------------------------- MAIN GENERATOR -------------------------------- */
export const generateItem = (
    level: number,
    profession: Profession,
    rarity: ItemRarity = 'common',
    forcedType?: ItemType,
    statsMultiplier: number = 1.0 // NEW argument for Shop scaling
): Item => {
    /* ----------------- 1. SELECT TYPE ----------------- */
    const possibleTypes: ItemType[] = ['weapon', 'helmet', 'armor', 'boots', 'ring', 'amulet', 'gloves'];
    if (Math.random() < 0.25) possibleTypes.push('shield');
    const type = forcedType || pick(possibleTypes);

    /* ----------------- 2. IMPLICIT STATS -------------------- */
    const implicit: (keyof ItemStats)[] = [];

    if (type === 'weapon') {
        if (profession === 'mage' || profession === 'cleric')
            implicit.push('magicDamage');
        else {
            implicit.push('damageMin', 'damageMax');
        }
    }

    if (['armor', 'helmet', 'boots', 'gloves'].includes(type))
        implicit.push('armor');

    if (type === 'shield') {
        // Shield Logic:
        // Assassin/Mage -> Offhand Weapon with specific stats
        // Warrior/Cleric -> True Shield (Armor + Block)
        
        if (profession === 'assassin') {
             // Assassin Offhand (Poison focus)
             implicit.push('damageMin', 'damageMax', 'poisonChance');
        } else if (profession === 'mage') {
             // Mage Offhand (Burn/Magic focus)
             implicit.push('magicDamage', 'burnChance');
        } else {
             // Standard Shield
             implicit.push('blockChance', 'armor');
        }
    }

    /* ----------------- 3. BONUS COUNT ----------------------- */
    const bonusCount = RARITY_BONUSES[rarity];
    
    const allowed = [...CLASS_MATRIX[profession].allowed];
    const forbidden = CLASS_MATRIX[profession].forbidden;

    // Remove implicit from allowed so we don't pick them again as bonus
    implicit.forEach(s => {
        const idx = allowed.indexOf(s);
        if (idx !== -1) allowed.splice(idx, 1);
    });

    // Remove forbidden
    forbidden.forEach(s => {
        const idx = allowed.indexOf(s);
        if (idx !== -1) allowed.splice(idx, 1);
    });
    
    // STRICT FILTERING FOR SLOTS
    for (let i = allowed.length - 1; i >= 0; i--) {
        const stat = allowed[i];
        
        // Remove Damage stats from Defensive Slots (unless Assassin Shield/Offhand)
        const isDamageStat = ['damageMin', 'damageMax', 'magicDamage'].includes(stat);
        
        if (isDamageStat) {
            // Armor, Helmet, Boots, Gloves -> NO DAMAGE
            if (['armor', 'helmet', 'boots', 'gloves'].includes(type)) {
                allowed.splice(i, 1);
                continue;
            }
            // Shield -> Only Assassin allows damage on shield (offhand)
            if (type === 'shield' && profession !== 'assassin') {
                allowed.splice(i, 1);
                continue;
            }
        }

        // Remove Armor from Weapons (unless rare chance?)
        if (type === 'weapon' && stat === 'armor') {
             allowed.splice(i, 1);
             continue;
        }
    }

    /* ----------------- 4. SELECT BONUSES ---------------------- */
    const bonusStats: (keyof ItemStats)[] = [];

    // Force Rare/Class Specific Bonuses first if High Rarity
    if (rarity === 'legendary' || rarity === 'mythic') {
        // Attack Speed chance
        if (Math.random() < 0.4 && allowed.includes('attackSpeed')) {
            bonusStats.push('attackSpeed');
            allowed.splice(allowed.indexOf('attackSpeed'), 1);
        }
        
        // Class specials
        let special: keyof ItemStats | null = null;
        if (profession === 'warrior') special = 'firstHitShield';
        if (profession === 'mage') special = 'overload';
        if (profession === 'cleric') special = 'sanctifiedAura';
        if (profession === 'assassin') special = 'bloodFury';

        if (special && Math.random() < 0.3 && !forbidden.includes(special)) {
             bonusStats.push(special);
        }
    }

    // Fill remaining slots
    for (let i = bonusStats.length; i < bonusCount; i++) {
        if (allowed.length === 0) break;
        const stat = pick(allowed);
        bonusStats.push(stat);
        allowed.splice(allowed.indexOf(stat), 1);
    }

    /* ----------------- 5. CALCULATE VALUES ---------------- */
    const stats: ItemStats = {};
    const multiplier = RARITY_MULTIPLIER[rarity] * statsMultiplier; // Apply Shop Multiplier

    const applyStat = (stat: keyof ItemStats, isImplicit: boolean) => {
        let baseValue: number;
        let isPercent = false;

        switch (stat) {
            case 'strength':
            case 'dexterity':
            case 'intelligence':
                baseValue = STAT_BASE_VALUES.PRIMARY(level);
                stats[stat] = Math.max(1, getStatValue(baseValue, multiplier, rarity));
                return;

            case 'damageMin':
            case 'damageMax':
                baseValue = STAT_BASE_VALUES.DAMAGE(level);
                stats[stat] = Math.max(1, getStatValue(baseValue, multiplier, rarity));
                return;

            case 'magicDamage':
                baseValue = STAT_BASE_VALUES.MAGIC_DMG(level);
                stats[stat] = Math.max(1, getStatValue(baseValue, multiplier, rarity));
                return;

            case 'armor':
                baseValue = STAT_BASE_VALUES.ARMOR(level);
                const classMul = ARMOR_CLASS_MULTIPLIER[profession];
                const slotMul = ARMOR_SLOT_MULTIPLIER[type] || 1.0;

                // If armor is bonus on non-armor slot (e.g. Ring), reduce it heavily
                let bonusMalus = 1.0;
                if (!isImplicit && !['armor', 'helmet', 'boots', 'gloves', 'shield'].includes(type)) {
                    bonusMalus = 0.2;
                }

                const finalArmor = getStatValue(baseValue, multiplier * classMul * slotMul * bonusMalus, rarity);
                stats[stat] = Math.max(1, finalArmor);
                return;

            case 'hp':
                baseValue = STAT_BASE_VALUES.HP(level);
                stats[stat] = Math.max(1, getStatValue(baseValue, multiplier, rarity));
                return;

            case 'vitality':
            case 'healingPower':
                baseValue = STAT_BASE_VALUES.VITALITY(level);
                stats[stat] = Math.max(1, getStatValue(baseValue, multiplier, rarity));
                return;

            case 'critChance':
            case 'dodgeChance':
            case 'magicResist':
            case 'blockChance':
                baseValue = STAT_BASE_VALUES.PERCENT_MED();
                isPercent = true;
                break;

            case 'critDamage':
                baseValue = 17; // Base 17% (range was 10-25)
                isPercent = true;
                break;

            case 'piercingDamage':
                baseValue = STAT_BASE_VALUES.FLAT_MED(level);
                break;

            case 'armorPen':
            case 'magicPen':
                baseValue = STAT_BASE_VALUES.PERCENT_MED();
                isPercent = true;
                break;

            case 'reducedDamage':
                baseValue = STAT_BASE_VALUES.PERCENT_SMALL();
                isPercent = true;
                break;

            case 'hpRegen':
                baseValue = 2.5; // Base 2.5%
                isPercent = true;
                break;

            case 'attackSpeed':
                baseValue = 3; // Base 3 SA
                break;

            case 'initiative':
                baseValue = STAT_BASE_VALUES.INITIATIVE();
                break;

            case 'stability':
                baseValue = STAT_BASE_VALUES.STABILITY();
                break;

            case 'poisonChance':
                baseValue = STAT_BASE_VALUES.POISON();
                isPercent = true;
                break;

            case 'burnChance':
                baseValue = STAT_BASE_VALUES.BURN();
                isPercent = true;
                break;

            // Flags
            case 'firstHitShield':
            case 'sanctifiedAura':
                stats[stat] = 1;
                return;

            case 'overload':
            case 'bloodFury':
            case 'etherealVeil':
            case 'unbreakable':
                baseValue = 10; // Base 10%
                isPercent = true;
                break;

            // Utility
            case 'bonusGold':
            case 'bonusExp':
            case 'dropChance':
                baseValue = STAT_BASE_VALUES.PERCENT_SMALL();
                isPercent = true;
                break;

            case 'blockValue':
                baseValue = STAT_BASE_VALUES.FLAT_MED(level);
                break;

            case 'manaShield':
                baseValue = STAT_BASE_VALUES.PERCENT_MED();
                isPercent = true;
                break;

            case 'damageVsUndead':
            case 'damageVsBeast':
            case 'damageVsDemon':
                baseValue = STAT_BASE_VALUES.PERCENT_BIG();
                isPercent = true;
                break;

            default:
                baseValue = 2; // Fallback base value
        }

        let val = getStatValue(baseValue, multiplier, rarity);
        
        // Apply Slot Specific Multiplier for Stats (e.g. reduced Damage on Rings)
        if (!isImplicit && STAT_SLOT_MULTIPLIER[type] && STAT_SLOT_MULTIPLIER[type][stat]) {
            val = Math.floor(val * STAT_SLOT_MULTIPLIER[type][stat]);
        }

        // Cap Logic
        if (isPercent) {
            if (val > 60) val = 60; 
            if (stat === 'critChance' && val > 25) val = 25;
            if (stat === 'dodgeChance' && val > 25) val = 25;
            if (stat === 'blockChance' && val > 35) val = 35;
            if (stat === 'magicResist' && val > 30) val = 30;
        }
        
        // Piercing Cap
        if (stat === 'piercingDamage') {
             const maxPiercing = level * 1.5; 
             if (val > maxPiercing) val = Math.floor(maxPiercing);
        }

        stats[stat] = Math.max(isPercent ? 1 : 1, val);
    };

    implicit.forEach(s => applyStat(s, true));
    bonusStats.forEach(s => applyStat(s, false));

    /* ----------------- 6. NAME ------------------------------ */
    let baseName = 'Przedmiot';
    
    if (['weapon', 'armor', 'helmet', 'shield'].includes(type)) {
        const classNames = ITEM_NAMES[profession];
        if (classNames && type in classNames) {
             // @ts-ignore 
             const list = classNames[type as keyof typeof classNames];
             if (list) baseName = pick(list);
        }
    } else {
        // @ts-ignore
        const list = GENERIC[type];
        if (list) baseName = pick(list);
    }

    const name = `${pick(ADJ[rarity])} ${baseName}`;

    // RENAME SHIELDS FOR ASSASSIN/MAGE
    let finalName = name;
    if (type === 'shield') {
        if (profession === 'assassin') finalName = finalName.replace('Tarcza', 'Krótkie Ostrze').replace('Puklerz', 'Wakizashi').replace('Pawęż', 'Sztylet Pomocniczy');
        if (profession === 'mage') finalName = finalName.replace('Tarcza', 'Orb').replace('Puklerz', 'Księga').replace('Pawęż', 'Kryształ');
    }

    /* ----------------- RETURN FINAL ITEM --------------------- */
    // Value Calculation: Quadratic scaling with level to ensure high-level items are much more expensive
    // Formula: (Level * 10 + Level^2) * Multiplier
    const baseValue = (level * 10) + Math.pow(level, 2); 
    const value = Math.floor(baseValue * multiplier);

    return {
        id: Math.random().toString(36).substr(2, 9),
        name: finalName,
        type,
        rarity,
        stats,
        value: Math.max(10, value), // Ensure at least 10 gold
        levelReq: level,
        classReq: profession, // Set Class Requirement
        icon: 'default',
        upgradeLevel: 0
    };
};
