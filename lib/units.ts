import { UnitPreference } from './types';

export const KG_TO_LBS = 2.20462262;
export const LBS_TO_KG = 0.45359237;
export const CM_TO_INCH = 0.393700787;
export const INCH_TO_CM = 2.54;
export const GRAMS_TO_OZ = 0.0352739619;
export const OZ_TO_GRAMS = 28.3495231;

export function kgToLbs(kg: number, decimals: number = 1): number {
  return Number((kg * KG_TO_LBS).toFixed(decimals));
}

export function lbsToKg(lbs: number, decimals: number = 1): number {
  return Number((lbs * LBS_TO_KG).toFixed(decimals));
}

export function cmToFtIn(cm: number): { feet: number; inches: number } {
  const totalInches = cm * CM_TO_INCH;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function ftInToCm(feet: number, inches: number): number {
  const totalInches = Number(feet) * 12 + Number(inches);
  return Math.round(totalInches * INCH_TO_CM);
}

export function gramsToOz(grams: number, decimals: number = 1): number {
  return Number((grams * GRAMS_TO_OZ).toFixed(decimals));
}

export function ozToGrams(oz: number, decimals: number = 0): number {
  return Number((oz * OZ_TO_GRAMS).toFixed(decimals));
}

export function formatWeight(weightKg: number, unit: UnitPreference): string {
  if (unit === 'imperial') {
    return `${kgToLbs(weightKg)} lbs`;
  }
  return `${Number(weightKg).toFixed(1)} kg`;
}

export function formatHeight(heightCm: number, unit: UnitPreference): string {
  if (unit === 'imperial') {
    const { feet, inches } = cmToFtIn(heightCm);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(heightCm)} cm`;
}
