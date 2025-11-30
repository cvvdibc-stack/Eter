BEGIN;

-- Function to update monster stats and loot
-- We will run a series of UPDATE statements

-- LEVEL 1
UPDATE monsters SET stats = '{"hp": 50, "maxHp": 50, "damageMin": 1, "damageMax": 4, "defense": 2, "attackSpeed": 70}', 
loot_table = '{"common": 85, "unique": 15, "hero": 0, "legendary": 0, "goldMin": 2, "goldMax": 5, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_1';

-- LEVEL 2
UPDATE monsters SET stats = '{"hp": 65, "maxHp": 65, "damageMin": 2, "damageMax": 5, "defense": 3, "attackSpeed": 70}', 
loot_table = '{"common": 85, "unique": 15, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_2';

-- LEVEL 3
UPDATE monsters SET stats = '{"hp": 81, "maxHp": 81, "damageMin": 4, "damageMax": 7, "defense": 5, "attackSpeed": 70}', 
loot_table = '{"common": 85, "unique": 15, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_3';

-- LEVEL 4
UPDATE monsters SET stats = '{"hp": 98, "maxHp": 98, "damageMin": 5, "damageMax": 8, "defense": 6, "attackSpeed": 70}', 
loot_table = '{"common": 85, "unique": 15, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_4';

-- LEVEL 5
UPDATE monsters SET stats = '{"hp": 115, "maxHp": 115, "damageMin": 6, "damageMax": 11, "defense": 8, "attackSpeed": 70}', 
loot_table = '{"common": 80, "unique": 20, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_5';

-- LEVEL 6
UPDATE monsters SET stats = '{"hp": 138, "maxHp": 138, "damageMin": 7, "damageMax": 12, "defense": 9, "attackSpeed": 70}', 
loot_table = '{"common": 80, "unique": 20, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_6';

-- LEVEL 7
UPDATE monsters SET stats = '{"hp": 160, "maxHp": 160, "damageMin": 8, "damageMax": 13, "defense": 10, "attackSpeed": 70}', 
loot_table = '{"common": 80, "unique": 20, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_7';

-- LEVEL 8
UPDATE monsters SET stats = '{"hp": 188, "maxHp": 188, "damageMin": 10, "damageMax": 14, "defense": 12, "attackSpeed": 70}', 
loot_table = '{"common": 80, "unique": 20, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_8';

-- LEVEL 9
UPDATE monsters SET stats = '{"hp": 219, "maxHp": 219, "damageMin": 11, "damageMax": 16, "defense": 13, "attackSpeed": 70}', 
loot_table = '{"common": 80, "unique": 20, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_9';

-- LEVEL 10
UPDATE monsters SET stats = '{"hp": 275, "maxHp": 275, "damageMin": 12, "damageMax": 18, "defense": 15, "attackSpeed": 70}', 
loot_table = '{"common": 80, "unique": 20, "hero": 0, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_10';

-- LEVEL 11
UPDATE monsters SET stats = '{"hp": 306, "maxHp": 306, "damageMin": 13, "damageMax": 19, "defense": 15, "attackSpeed": 70}', 
loot_table = '{"common": 70, "unique": 20, "hero": 10, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_11';

-- LEVEL 12
UPDATE monsters SET stats = '{"hp": 338, "maxHp": 338, "damageMin": 14, "damageMax": 20, "defense": 16, "attackSpeed": 70}', 
loot_table = '{"common": 70, "unique": 20, "hero": 10, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_12';

-- LEVEL 13
UPDATE monsters SET stats = '{"hp": 375, "maxHp": 375, "damageMin": 15, "damageMax": 21, "defense": 18, "attackSpeed": 70}', 
loot_table = '{"common": 70, "unique": 20, "hero": 10, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_13';

-- LEVEL 14
UPDATE monsters SET stats = '{"hp": 419, "maxHp": 419, "damageMin": 17, "damageMax": 23, "defense": 19, "attackSpeed": 70}', 
loot_table = '{"common": 65, "unique": 20, "hero": 15, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_14';

-- LEVEL 15
UPDATE monsters SET stats = '{"hp": 462, "maxHp": 462, "damageMin": 18, "damageMax": 25, "defense": 20, "attackSpeed": 70}', 
loot_table = '{"common": 65, "unique": 20, "hero": 15, "legendary": 0, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_15';

-- LEVEL 16
UPDATE monsters SET stats = '{"hp": 512, "maxHp": 512, "damageMin": 19, "damageMax": 26, "defense": 21, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_16';

-- LEVEL 17
UPDATE monsters SET stats = '{"hp": 562, "maxHp": 562, "damageMin": 20, "damageMax": 29, "defense": 23, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_17';

-- LEVEL 18
UPDATE monsters SET stats = '{"hp": 619, "maxHp": 619, "damageMin": 22, "damageMax": 30, "defense": 25, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_18';

-- LEVEL 19
UPDATE monsters SET stats = '{"hp": 675, "maxHp": 675, "damageMin": 23, "damageMax": 32, "defense": 27, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_19';

-- LEVEL 20
UPDATE monsters SET stats = '{"hp": 750, "maxHp": 750, "damageMin": 24, "damageMax": 36, "defense": 30, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_20';

-- LEVEL 21
UPDATE monsters SET stats = '{"hp": 825, "maxHp": 825, "damageMin": 25, "damageMax": 37, "defense": 32, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_21';

-- LEVEL 22
UPDATE monsters SET stats = '{"hp": 900, "maxHp": 900, "damageMin": 26, "damageMax": 40, "defense": 34, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_22';

-- LEVEL 23
UPDATE monsters SET stats = '{"hp": 975, "maxHp": 975, "damageMin": 28, "damageMax": 42, "defense": 36, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_23';

-- LEVEL 24
UPDATE monsters SET stats = '{"hp": 1075, "maxHp": 1075, "damageMin": 29, "damageMax": 46, "defense": 38, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_24';

-- LEVEL 25
UPDATE monsters SET stats = '{"hp": 1175, "maxHp": 1175, "damageMin": 30, "damageMax": 48, "defense": 40, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 25, "hero": 12, "legendary": 3, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_25';

-- LEVEL 26
UPDATE monsters SET stats = '{"hp": 1275, "maxHp": 1275, "damageMin": 31, "damageMax": 52, "defense": 42, "attackSpeed": 70}', 
loot_table = '{"common": 50, "unique": 25, "hero": 15, "legendary": 3, "tytanic": 0.4, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_26';

-- LEVEL 27
UPDATE monsters SET stats = '{"hp": 1375, "maxHp": 1375, "damageMin": 32, "damageMax": 54, "defense": 44, "attackSpeed": 70}', 
loot_table = '{"common": 50, "unique": 25, "hero": 15, "legendary": 3, "tytanic": 0.4, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_27';

-- LEVEL 28
UPDATE monsters SET stats = '{"hp": 1475, "maxHp": 1475, "damageMin": 34, "damageMax": 56, "defense": 46, "attackSpeed": 70}', 
loot_table = '{"common": 50, "unique": 25, "hero": 15, "legendary": 3, "tytanic": 0.4, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_28';

-- LEVEL 29
UPDATE monsters SET stats = '{"hp": 1625, "maxHp": 1625, "damageMin": 36, "damageMax": 60, "defense": 48, "attackSpeed": 70}', 
loot_table = '{"common": 50, "unique": 25, "hero": 15, "legendary": 3, "tytanic": 0.4, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'monster_29';

-- LEVEL 30 BOSS
UPDATE monsters SET stats = '{"hp": 1875, "maxHp": 1875, "damageMin": 38, "damageMax": 66, "defense": 50, "attackSpeed": 70}', 
loot_table = '{"common": 50, "unique": 20, "hero": 15, "legendary": 3, "tytanic": 0.4, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "tytanic_loot": {"mage": "tytan_mage_1", "cleric": "tytan_cleric_1", "warrior": "tytan_warrior_1", "assassin": "tytan_assassin_1"}, "expMultiplier": 6, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}, "rarity": {"common": 50, "unique": 20, "heroic": 15, "legendary": 3, "tytanic": 0.4}}' 
WHERE id = 'monster_30';

-- DUNGEON BOSS 1
UPDATE monsters SET stats = '{"hp": 350, "maxHp": 350, "damageMin": 17, "damageMax": 26, "defense": 20, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 20, "hero": 15, "legendary": 3, "talisman": 1, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "tytanic_loot": {"mage": "tytan_mage_1", "cleric": "tytan_cleric_1", "warrior": "tytan_warrior_1", "assassin": "tytan_assassin_1"}, "expMultiplier": 6, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'boss_dungeon_1';

-- DUNGEON BOSS 2
UPDATE monsters SET stats = '{"hp": 612, "maxHp": 612, "damageMin": 30, "damageMax": 46, "defense": 33, "attackSpeed": 70}', 
loot_table = '{"common": 60, "unique": 20, "hero": 15, "legendary": 3, "talisman": 1.5, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "tytanic_loot": {"mage": "tytan_mage_1", "cleric": "tytan_cleric_1", "warrior": "tytan_warrior_1", "assassin": "tytan_assassin_1"}, "expMultiplier": 6, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'boss_dungeon_2';

-- DUNGEON BOSS 3
UPDATE monsters SET stats = '{"hp": 1150, "maxHp": 1150, "damageMin": 38, "damageMax": 54, "defense": 44, "attackSpeed": 70}', 
loot_table = '{"common": 55, "unique": 20, "hero": 15, "legendary": 3, "talisman": 2, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "tytanic_loot": {"mage": "tytan_mage_1", "cleric": "tytan_cleric_1", "warrior": "tytan_warrior_1", "assassin": "tytan_assassin_1"}, "expMultiplier": 6, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}}' 
WHERE id = 'boss_dungeon_3';

-- DUNGEON BOSS 4
UPDATE monsters SET stats = '{"hp": 2125, "maxHp": 2125, "damageMin": 48, "damageMax": 72, "defense": 55, "attackSpeed": 70}', 
loot_table = '{"common": 50, "unique": 25, "hero": 15, "legendary": 3, "mythic": 0.4, "talisman": 4, "legends": {"mage": "leg_mage_1", "cleric": "leg_cleric_1", "warrior": "leg_warrior_1", "assassin": "leg_assassin_1"}, "tytanic_loot": {"mage": "tytan_mage_1", "cleric": "tytan_cleric_1", "warrior": "tytan_warrior_1", "assassin": "tytan_assassin_1"}, "expMultiplier": 6, "level_gate": {"unique": 1, "heroic": 11, "legendary": 16, "tytanic": 26}, "rarity": {"common": 50, "unique": 25, "heroic": 15, "legendary": 3, "tytanic": 0.4}}' 
WHERE id = 'boss_dungeon_4';

COMMIT;

