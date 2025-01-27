// metricsUtils.ts
import { LocationData } from '@/constants/SessionData';

/**
 * Calcule la distance totale parcourue
 * @param {LocationData[]} locations - Liste des points de localisation
 * @returns {number} Distance en kilomètres
 */
export function calculateDistance(locations: LocationData[]): number {
  if (locations.length < 2) return 0;

  let distance = 0;
  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i - 1];
    const curr = locations[i];

    // Calcul basique de la distance entre deux points
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = ((curr.latitude - prev.latitude) * Math.PI) / 180;
    const dLon = ((curr.longitude - prev.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((prev.latitude * Math.PI) / 180) *
        Math.cos((curr.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c;
  }

  return Number(distance.toFixed(3));
}

/**
 * Calcule l'allure en minutes par kilomètre
 * @param {number} distance - Distance en kilomètres
 * @param {number} totalSeconds - Temps total en secondes
 * @returns {number} Allure en minutes par kilomètre
 */
export function calculatePace(distance: number, totalSeconds: number): number {
  if (distance === 0) return 0;

  const timeMinutes = totalSeconds / 60;
  return Number((timeMinutes / distance).toFixed(2));
}

/**
 * Estime les calories brûlées basé sur la distance
 * @param {number} distance - Distance en kilomètres
 * @returns {number} Calories estimées
 */
export function calculateCalories(distance: number): number {
  const CALORIES_PER_KM = 60; // Estimation moyenne pour la course à pied
  return Math.round(distance * CALORIES_PER_KM);
}
