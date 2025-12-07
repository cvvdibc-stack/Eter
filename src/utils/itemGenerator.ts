import { Item, ItemRarity, ItemStats, ItemType, Profession } from '../types';

<<<<<<< HEAD
/* ==========================================================================
   KONFIGURACJA: BALANS I ZAKRESY STATYSTYK
   ========================================================================== */

const STAT_RANGES = {
    // Podstawowe atrybuty (Str, Dex, Int) - skalowanie liniowe
    PRIMARY: (lvl: number) => [Math.floor(lvl * 1.0), Math.floor(lvl * 1.5) + 2],
    
    // Ofensywne
    DAMAGE: (lvl: number) => [Math.floor(lvl * 0.8), lvl * 2],
    MAGIC_DMG: (lvl: number) => [Math.floor(lvl * 1.2), Math.floor(lvl * 2.4)],
    PIERCING: (lvl: number) => [lvl, lvl * 2], // Flat penetration
    
    // Defensywne
    ARMOR: (lvl: number) => [Math.floor(lvl * 0.8), Math.floor(lvl * 1.6) + 5],
    HP: (lvl: number) => [lvl * 8, lvl * 16], // Zwiększone HP dla dłuższych walk
    VITALITY: (lvl: number) => [Math.floor(lvl * 0.8), Math.floor(lvl * 1.5)],
    
    // Procentowe (Fixed ranges)
    PERCENT_SMALL: (_lvl: number) => [1, 5],   // np. Gold Find, Exp
    PERCENT_MED: (_lvl: number) => [3, 10],    // np. Crit, Dodge
    PERCENT_BIG: (_lvl: number) => [5, 15],    // np. Specjalne proce
    
    // Statusy
    INITIATIVE: (_lvl: number) => [2, 8],
    STABILITY: (_lvl: number) => [1, 5],
    POISON: (_lvl: number) => [5, 15],
    BURN: (_lvl: number) => [5, 15],
=======
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
>>>>>>> from-new
};

/* --- KONFIGURACJA: RZADKOŚĆ (RARITY) --- */
const RARITY_CONFIG = {
    common:     { bonuses: 1, statMult: 1.0,  priceMult: 1 },
    unique:     { bonuses: 2, statMult: 1.35, priceMult: 1.5 },
    heroic:     { bonuses: 3, statMult: 2.0,  priceMult: 3.0 },
    legendary:  { bonuses: 4, statMult: 3.8,  priceMult: 10.0 }, // Mocne, ale nie "god mode"
    mythic:     { bonuses: 6, statMult: 7.5,  priceMult: 50.0 }, // Bardzo rzadkie i bardzo drogie
    talisman:   { bonuses: 1, statMult: 1.0,  priceMult: 2.0 }
};

<<<<<<< HEAD
/* --- KONFIGURACJA: ZESTAWY (SETS) --- */
// Szansa na wylosowanie setu dla rzadkości: Heroic(15%), Legendary(30%), Mythic(50%)
const ITEM_SETS: Record<Profession, string[]> = {
    warrior: ['Zestaw Smoczego Serca', 'Pancerz Upadłego Króla', 'Zbroja Berserkera'],
    assassin: ['Cienie Nocy', 'Szaty Krwawego Księżyca', 'Ekwipunek Skrytobójcy'],
    mage: ['Szaty Arcymaga', 'Zestaw Feniksa', 'Tajemnice Pustki'],
    cleric: ['Szaty Świętego', 'Pancerz Paladyna', 'Światło Nadziei']
=======
const RARITY_MULTIPLIER = {
    common: 1.0,
    unique: 1.4,
    heroic: 1.9,
    legendary: 3.5,  // Legendary/Mythic should use fixed database, but keeping for fallback
    mythic: 8.0,
    talisman: 1.0
>>>>>>> from-new
};

/* ==========================================================================
   MATRYCA KLAS I FILTRY
   ========================================================================== */

const CLASS_MATRIX: Record<Profession, { allowed: (keyof ItemStats)[], forbidden: (keyof ItemStats)[] }> = {
    warrior: {
        allowed: [
            'strength', 'vitality', 'armor', 'hp', 'blockChance', 'blockValue',
            'damageMin', 'damageMax', 'attackSpeed', 'piercingDamage',
            'reducedDamage', 'armorPen', 'hpRegen', 'critChance', 'firstHitShield'
        ],
        forbidden: ['intelligence', 'magicDamage', 'magicResist', 'healingPower', 'poisonChance', 'burnChance', 'magicPen']
    },
    assassin: {
        allowed: [
            'dexterity', 'strength', 'critChance', 'critDamage', 'dodgeChance',
            'vitality', 'damageMin', 'damageMax', 'attackSpeed', 'initiative',
            'stability', 'poisonChance', 'armorPen', 'piercingDamage', 'bloodFury'
        ],
        forbidden: ['intelligence', 'magicDamage', 'magicResist', 'blockChance', 'blockValue', 'burnChance', 'healingPower']
    },
    mage: {
        allowed: [
            'intelligence', 'magicDamage', 'magicResist', 'hp', 'vitality',
            'attackSpeed', 'initiative', 'burnChance', 'magicPen', 'manaShield',
            'hpRegen', 'critChance', 'overload'
        ],
        forbidden: ['strength', 'armor', 'blockChance', 'blockValue', 'damageMin', 'damageMax', 'poisonChance', 'piercingDamage']
    },
    cleric: {
        allowed: [
            'intelligence', 'vitality', 'healingPower', 'armor', 'hp',
            'magicResist', 'manaShield', 'blockChance', 'blockValue',
            'reducedDamage', 'initiative', 'sanctifiedAura'
        ],
        forbidden: ['dexterity', 'critDamage', 'damageMin', 'damageMax', 'poisonChance', 'burnChance', 'armorPen']
    }
};

/* ==========================================================================
   NAZEWNICTWO I PODTYPY
   ========================================================================== */

// Mapa do wykrywania podtypu broni po nazwie (dla ikonek)
const WEAPON_SUBTYPES: Record<string, string> = {
    'Miecz': 'sword', 'Ostrze': 'sword', 'Rapier': 'sword',
    'Topór': 'axe', 'Toporek': 'axe',
    'Młot': 'mace', 'Buława': 'mace', 'Berło': 'scepter',
    'Sztylet': 'dagger', 'Pazur': 'claw', 'Kozik': 'dagger', 'Wakizashi': 'dagger',
    'Kostur': 'staff', 'Laska': 'staff',
    'Różdżka': 'wand'
};

const ITEM_NAMES = {
    warrior: {
        weapon: ['Miecz', 'Topór', 'Młot', 'Ostrze Dwuręczne'],
        armor: ['Zbroja Płytowa', 'Kirys', 'Ciężki Pancerz'],
        helmet: ['Hełm', 'Przyłbica', 'Salada'],
        shield: ['Tarcza', 'Puklerz', 'Pawęż']
    },
    assassin: {
        weapon: ['Sztylet', 'Pazur', 'Kozik', 'Krótki Miecz'],
        armor: ['Płaszcz Cienia', 'Skórzana Zbroja', 'Kamizelka'],
        helmet: ['Kaptur', 'Maska', 'Chusta'],
        shield: ['Wakizashi', 'Sztylet Pomocniczy', 'Krótkie Ostrze'] // Offhandy zamiast tarcz
    },
    mage: {
        weapon: ['Kostur', 'Różdżka', 'Laska Maga'],
        armor: ['Szata', 'Toga', 'Opończa'],
        helmet: ['Kapelusz', 'Tiara', 'Diadem'],
        shield: ['Orb', 'Kula Mocy', 'Księga Zaklęć'] // Offhandy magiczne
    },
    cleric: {
        weapon: ['Buława', 'Berło', 'Laska'],
        armor: ['Habit', 'Ornat', 'Szata Zakonna'],
        helmet: ['Korona', 'Kaptur', 'Mitra'],
        shield: ['Relikwiarz', 'Tarcza Zakonna']
    }
};

const GENERIC_NAMES = {
    boots: ['Buty', 'Trzewiki', 'Sandały', 'Nagolenniki'],
    ring: ['Pierścień', 'Sygnet', 'Obrączka'],
    amulet: ['Amulet', 'Talizman', 'Wisior', 'Naszyjnik'],
    gloves: ['Rękawice', 'Karwasze', 'Owijacze']
};

const ADJECTIVES = {
    common: ['Zwykły', 'Prosty', 'Stary', 'Zużyty'],
    unique: ['Solidny', 'Rzadki', 'Wzmocniony', 'Lśniący'],
    heroic: ['Potężny', 'Bohaterski', 'Wyśmienity', 'Zdobiony'],
    legendary: ['Legendarny', 'Zapomniany', 'Smoczy', 'Pradawny'],
    mythic: ['Boski', 'Eteryczny', 'Nieśmiertelny', 'Astralny'],
    talisman: ['Magiczny']
};

/* ==========================================================================
   MNOŻNIKI SLOTÓW (KARY I BONUSY)
   ========================================================================== */
const ARMOR_CLASS_MULTIPLIER = { warrior: 1.6, cleric: 1.2, assassin: 0.9, mage: 0.6 };

const STAT_SLOT_PENALTY: Record<string, Record<string, number>> = {
    // Biżuteria ma słabsze obrażenia bazowe i pancerz
    amulet: { damageMin: 0.3, damageMax: 0.3, magicDamage: 0.3, armor: 0.2 },
    ring:   { damageMin: 0.3, damageMax: 0.3, magicDamage: 0.3, armor: 0.2 },
    // Elementy pancerza nie powinny mieć DMG, ale jeśli wylosują, to 0
    boots:  { damageMin: 0, damageMax: 0, magicDamage: 0 },
    helmet: { damageMin: 0, damageMax: 0, magicDamage: 0 },
    gloves: { damageMin: 0, damageMax: 0, magicDamage: 0 },
    armor:  { damageMin: 0, damageMax: 0, magicDamage: 0 }
};

/* Helper Functions */
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];
<<<<<<< HEAD
=======

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
>>>>>>> from-new
const getRangeValue = (range: number[] | number, mult: number) => {
    if (Array.isArray(range)) return Math.floor(rand(range[0], range[1]) * mult);
    return Math.floor(range * mult);
};

/* ==========================================================================
   GLÓWNA FUNKCJA GENERATORA
   ========================================================================== */
export const generateItem = (
    level: number,
    profession: Profession,
    rarity: ItemRarity = 'common',
    forcedType?: ItemType,
    shopMultiplier: number = 1.0
): Item => {
    
    // 1. WYBÓR TYPU
    // Zwiększamy szansę na 'shield' do 30%, żeby Assassin łatwiej znalazł broń pomocniczą
    const possibleTypes: ItemType[] = ['weapon', 'helmet', 'armor', 'boots', 'ring', 'amulet', 'gloves'];
    if (Math.random() < 0.30) possibleTypes.push('shield');
    
    const type = forcedType || pick(possibleTypes);

    // 2. PODTYP I STATYSTYKI WRODZONE (IMPLICIT)
    const implicit: (keyof ItemStats)[] = [];
    let subtype: string | undefined = undefined; // Domyślnie brak podtypu

    // -- Logika Broni --
    if (type === 'weapon') {
        if (profession === 'mage' || profession === 'cleric') implicit.push('magicDamage');
        else implicit.push('damageMin', 'damageMax');
    }

    // -- Logika Pancerza --
    if (['armor', 'helmet', 'boots', 'gloves'].includes(type)) implicit.push('armor');

    // -- Logika Tarczy / Offhandu (KLUCZOWE DLA ZABÓJCY) --
    if (type === 'shield') {
        if (profession === 'assassin') {
            subtype = 'offhand_weapon';
            // Assassin dostaje broń pomocniczą (dmg + poison) zamiast bloku
            implicit.push('damageMin', 'damageMax', 'poisonChance', 'attackSpeed');
        } else if (profession === 'mage') {
            subtype = 'offhand_magic';
            implicit.push('magicDamage', 'burnChance');
        } else {
            subtype = 'shield';
            implicit.push('blockChance', 'armor');
        }
    }

    // 3. PRZYGOTOWANIE PULI BONUSÓW
    const config = RARITY_CONFIG[rarity];
    const allowed = [...CLASS_MATRIX[profession].allowed];
    
    // Usuwamy statystyki wrodzone i zakazane
    implicit.forEach(s => { 
        const i = allowed.indexOf(s); 
        if (i !== -1) allowed.splice(i, 1); 
    });
    
    // Filtrowanie Slotów (np. brak DMG na butach, chyba że to unikalny trait)
    for (let i = allowed.length - 1; i >= 0; i--) {
        const stat = allowed[i];
        const isDmg = ['damageMin', 'damageMax', 'magicDamage'].includes(stat);
        
        // Pancerze nie dostają dmg
        if (isDmg && ['armor', 'helmet', 'boots', 'gloves'].includes(type)) {
            allowed.splice(i, 1); 
            continue;
        }
        // Tarcza dostaje DMG tylko jeśli to Assassin (bo to sztylet)
        if (isDmg && type === 'shield' && profession !== 'assassin') {
            allowed.splice(i, 1); 
            continue;
        }
    }

    // 4. LOSOWANIE BONUSÓW (AFFIXÓW)
    const bonusStats: (keyof ItemStats)[] = [];
    
    // Bonusy specjalne dla wysokich rzadkości
    if (rarity === 'legendary' || rarity === 'mythic') {
        // 40% szans na Attack Speed
        if (Math.random() < 0.4 && allowed.includes('attackSpeed')) {
            bonusStats.push('attackSpeed');
            allowed.splice(allowed.indexOf('attackSpeed'), 1);
        }
        // 35% szans na Umiejętność Klasową
        const classSpecials: Record<Profession, keyof ItemStats> = {
            warrior: 'firstHitShield',
            assassin: 'bloodFury',
            mage: 'overload',
            cleric: 'sanctifiedAura'
        };
        const special = classSpecials[profession];
        if (special && Math.random() < 0.35 && CLASS_MATRIX[profession].allowed.includes(special)) {
            bonusStats.push(special);
        }
    }

    // Dopełnianie do limitu
    for (let i = bonusStats.length; i < config.bonuses; i++) {
        if (allowed.length === 0) break;
        const stat = pick(allowed);
        bonusStats.push(stat);
        allowed.splice(allowed.indexOf(stat), 1);
    }
    
    // Safety check: Pierścienie/Amulety zawsze powinny coś mieć
    if (['ring', 'amulet'].includes(type) && bonusStats.length === 0 && allowed.length > 0) {
        bonusStats.push(pick(allowed));
    }

    // 5. OBLICZANIE WARTOŚCI STATYSTYK
    const stats: ItemStats = {};
    const finalMult = config.statMult * shopMultiplier;

    const applyStat = (stat: keyof ItemStats, isImplicit: boolean) => {
<<<<<<< HEAD
        let val = 0;
=======
        let baseValue: number;
>>>>>>> from-new
        let isPercent = false;

        // Specjalna logika dla Armora (zależna od klasy i slotu)
        if (stat === 'armor') {
            const baseRange = STAT_RANGES.ARMOR(level);
            const classM = ARMOR_CLASS_MULTIPLIER[profession];
            
            // Określenie mnożnika slotu
            let slotM = 1.0;
            if (type === 'shield') {
                slotM = 1.8;
            } else if (['armor', 'helmet', 'boots', 'gloves'].includes(type)) {
                slotM = 1.0;
            } else {
                // Biżuteria (ring, amulet) - bardzo mały mnożnik
                slotM = 0.2;
            }
            
            // Mnożniki specyficzne dla typu pancerza
            let typeMult = 1.0;
            if (type === 'armor') typeMult = 1.5;
            else if (type === 'helmet') typeMult = 1.2;
            else if (type === 'gloves') typeMult = 0.8;
            else if (type === 'boots') typeMult = 1.0;
            else if (type === 'shield') typeMult = 1.8;

            // Jeśli pancerz wylosował się jako bonus na pierścieniu (mała szansa), dajemy karę
            const bonusPenalty = (!isImplicit && !['armor', 'helmet', 'boots', 'gloves', 'shield'].includes(type)) ? 0.2 : 1.0;

            const raw = rand(baseRange[0], baseRange[1]);
            val = Math.floor(raw * finalMult * classM * slotM * typeMult * bonusPenalty);
            stats[stat] = Math.max(1, val);
            return;
        }

        // Mapowanie statystyk na zakresy
        switch (stat) {
<<<<<<< HEAD
            case 'strength': 
            case 'dexterity': 
            case 'intelligence': 
                val = getRangeValue(STAT_RANGES.PRIMARY(level), finalMult); 
                break;
            case 'damageMin': 
            case 'damageMax': 
                val = getRangeValue(STAT_RANGES.DAMAGE(level), finalMult); 
                break;
            case 'magicDamage': 
                val = getRangeValue(STAT_RANGES.MAGIC_DMG(level), finalMult); 
                break;
            case 'hp': 
                val = getRangeValue(STAT_RANGES.HP(level), finalMult); 
                break;
            case 'vitality': 
            case 'healingPower': 
                val = getRangeValue(STAT_RANGES.VITALITY(level), finalMult); 
                break;
            case 'piercingDamage': 
                val = getRangeValue(STAT_RANGES.PIERCING(level), finalMult); 
                break;
            case 'initiative': 
                val = getRangeValue(STAT_RANGES.INITIATIVE(level), finalMult); 
                break;
            
            // Procentowe
            case 'critChance': 
            case 'dodgeChance': 
            case 'blockChance': 
            case 'magicResist': 
            case 'armorPen': 
            case 'magicPen':
                val = getRangeValue(STAT_RANGES.PERCENT_MED(level), finalMult); 
                isPercent = true; 
                break;
            case 'critDamage': 
                val = getRangeValue([15, 40], finalMult); 
                isPercent = true; 
                break;
            case 'attackSpeed': 
                val = getRangeValue([2, 8], finalMult); 
                isPercent = true; 
                break;
            case 'poisonChance': 
                val = getRangeValue(STAT_RANGES.POISON(level), finalMult); 
                isPercent = true; 
                break;
            case 'burnChance': 
                val = getRangeValue(STAT_RANGES.BURN(level), finalMult); 
                isPercent = true; 
                break;
            case 'hpRegen': 
                val = getRangeValue([1, 5], finalMult); 
                isPercent = true; 
                break;

=======
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

>>>>>>> from-new
            // Flags
            case 'firstHitShield': 
            case 'sanctifiedAura': 
                stats[stat] = 1; 
                return;
<<<<<<< HEAD
            case 'overload': 
            case 'bloodFury': 
                val = getRangeValue([5, 15], finalMult); 
                isPercent = true; 
                break;
            
            // Economy
            case 'bonusGold': 
            case 'bonusExp': 
                val = getRangeValue(STAT_RANGES.PERCENT_SMALL(level), finalMult); 
                isPercent = true; 
                break;

            default: 
                val = Math.floor(rand(1, 3) * finalMult);
        }

        // Kary za slot (np. dmg na ringu)
        if (!isImplicit && STAT_SLOT_PENALTY[type]?.[stat]) {
            val = Math.floor(val * STAT_SLOT_PENALTY[type][stat]);
=======

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
>>>>>>> from-new
        }

        // Caps (Limity)
        if (isPercent) {
            if (val > 60) val = 60;
            if (['critChance','dodgeChance'].includes(stat) && val > 30) val = 30;
            if (stat === 'blockChance' && val > 45) val = 45;
        }

        stats[stat] = Math.max(1, val);
    };

    implicit.forEach(s => applyStat(s, true));
    bonusStats.forEach(s => applyStat(s, false));

    // Naprawa widełek DMG (Min < Max)
    if (stats.damageMin && stats.damageMax) {
        if (stats.damageMin > stats.damageMax) {
            [stats.damageMin, stats.damageMax] = [stats.damageMax, stats.damageMin];
        }
        if (stats.damageMin === stats.damageMax) {
            stats.damageMax++;
        }
    }

    // 6. LOGIKA ZESTAWÓW (SETS)
    let setName: string | undefined = undefined;
    let setChance = 0;
    if (rarity === 'heroic') setChance = 0.15;
    if (rarity === 'legendary') setChance = 0.30;
    if (rarity === 'mythic') setChance = 0.50;

    if (Math.random() < setChance) {
        const sets = ITEM_SETS[profession];
        if (sets && sets.length > 0) setName = pick(sets);
    }

    // 7. NAZWA I CENA
    let baseName = 'Przedmiot';
    
    // Pobranie nazwy z puli
    if (['weapon', 'armor', 'helmet', 'shield'].includes(type)) {
        const classNames = ITEM_NAMES[profession];
        if (classNames && type in classNames) {
            const list = classNames[type as keyof typeof classNames];
            if (list) baseName = pick(list);
        }
    } else {
        const list = GENERIC_NAMES[type as keyof typeof GENERIC_NAMES];
        if (list) baseName = pick(list);
    }

    // Wykrywanie podtypu dla Frontendu (ikony)
    if (type === 'weapon' && !subtype) {
        const found = Object.keys(WEAPON_SUBTYPES).find(key => baseName.includes(key));
        if (found) subtype = WEAPON_SUBTYPES[found];
    }

    // Składanie nazwy
    let finalName = '';
    if (setName) {
        // "Hełm Smoczego Serca"
        finalName = `${baseName} ${setName.replace('Zestaw ', '')}`;
    } else {
        // "Heroiczny Miecz"
        finalName = `${pick(ADJECTIVES[rarity])} ${baseName}`;
    }

    // Obliczanie wartości (Gold)
    // Formula: (Level^2.2 + Level*15) * RarityPriceMult * ShopMult
    const baseValue = (Math.pow(level, 2.2) + (level * 15));
    const value = Math.floor(baseValue * config.priceMult * shopMultiplier);

    return {
        id: Math.random().toString(36).substr(2, 9),
        name: finalName,
        type,
        subtype: subtype,
        rarity,
        stats,
        value: Math.max(10, value),
        levelReq: level,
        classReq: profession,
        setName: setName,
        icon: 'default', // Do obsłużenia na froncie zależnie od subtype
        upgradeLevel: 0
    };
};
