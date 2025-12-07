import { Profession } from '../types';
import { PROFESSIONS } from '../data/professions';

/**
 * Zwraca polską nazwę klasy z dużej litery
 */
export const getProfessionName = (profession: Profession): string => {
  return PROFESSIONS[profession].name;
};

/**
 * Zwraca polską nazwę klasy (alias dla getProfessionName)
 */
export const getProfessionLabel = (profession: Profession | string): string => {
  if (profession in PROFESSIONS) {
    return PROFESSIONS[profession as Profession].name;
  }
  return profession; // Fallback jeśli nie rozpoznano
};

