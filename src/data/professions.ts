import { Profession, BaseStats } from '../types';

export const PROFESSIONS: Record<Profession, {
  name: string;
  role: string;
  description: string;
  primaryStat: keyof BaseStats;
  baseStats: BaseStats;
  growth: BaseStats; // Stat gain per level (simplified)
  passive: string;
}> = {
  mage: {
    name: 'Mag',
    role: 'Burst Magic DPS',
    description: 'Potężny mag rażący wrogów zaklęciami z dystansu.',
    primaryStat: 'intelligence',
    baseStats: { strength: 2, dexterity: 4, intelligence: 10, vitality: 4 },
    growth: { strength: 0, dexterity: 1, intelligence: 3, vitality: 1 },
    passive: 'Mistrz Eteru: Obrażenia magiczne skalują się o 170% Inteligencji',
  },
  warrior: {
    name: 'Wojownik',
    role: 'Tank / Bruiser',
    description: 'Wytrzymały wojownik walczący w pierwszej linii.',
    primaryStat: 'strength',
    baseStats: { strength: 10, dexterity: 4, intelligence: 2, vitality: 8 },
    growth: { strength: 3, dexterity: 1, intelligence: 0, vitality: 2 },
    passive: 'Żelazna Skóra: Obrażenia fizyczne skalują się o 180% Siły',
  },
  assassin: {
    name: 'Zabójca',
    role: 'DPS / Krytyki',
    description: 'Szybki zabójca polegający na unikach i ciosach krytycznych.',
    primaryStat: 'dexterity',
    baseStats: { strength: 4, dexterity: 10, intelligence: 2, vitality: 4 },
    growth: { strength: 1, dexterity: 3, intelligence: 0, vitality: 1 },
    passive: 'Cień: 1% szansy na trafienie krytyczne za każdy punkt Zręczności',
  },
  cleric: {
    name: 'Kleryk',
    role: 'Support / Hybrid',
    description: 'Święty wojownik leczący się podczas walki.',
    primaryStat: 'intelligence', // Hybrid usually but scaling with INT for dmg mostly
    baseStats: { strength: 4, dexterity: 2, intelligence: 8, vitality: 6 },
    growth: { strength: 1, dexterity: 0, intelligence: 2, vitality: 2 },
    passive: 'Modlitwa: Regeneruje 2% Max HP co turę',
  },
};
