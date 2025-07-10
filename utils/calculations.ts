/**
 * Calcule la distance entre deux points géographiques en utilisant la formule de Haversine
 * @param lat1 Latitude du premier point
 * @param lon1 Longitude du premier point
 * @param lat2 Latitude du deuxième point
 * @param lon2 Longitude du deuxième point
 * @returns Distance en mètres
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
}

/**
 * Calcule l'allure en secondes par kilomètre
 * @param distance Distance en mètres
 * @param time Temps en millisecondes
 * @returns Allure en secondes par kilomètre
 */
export function calculatePace(distance: number, time: number): number {
  if (distance === 0 || time === 0) return 0;
  // Retourne l'allure en secondes par kilomètre
  return time / 1000 / (distance / 1000);
}

/**
 * Convertit l'allure (s/km) en vitesse (km/h)
 * @param paceInSeconds Allure en secondes par kilomètre
 * @returns Vitesse en kilomètres par heure
 */
export function paceToSpeed(paceInSeconds: number): number {
  if (paceInSeconds === 0) return 0;
  // Vitesse = 3600 / allure_en_secondes
  return 3600 / paceInSeconds;
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * @param str1 Première chaîne
 * @param str2 Deuxième chaîne
 * @returns Distance de Levenshtein (0 = identique, plus le nombre est grand, plus c'est différent)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  // Initialiser la première ligne et colonne
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // Remplir la matrice
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // suppression
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calcule un score de similarité basé sur la distance de Levenshtein
 * @param str1 Première chaîne
 * @param str2 Deuxième chaîne
 * @returns Score entre 0 et 1 (1 = identique, 0 = complètement différent)
 */
export function similarityScore(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
}

/**
 * Recherche floue dans une liste d'objets
 * @param items Liste d'objets à rechercher
 * @param searchTerm Terme de recherche
 * @param fieldName Nom du champ à rechercher dans chaque objet
 * @param threshold Seuil de similarité minimum (0-1, défaut: 0.3)
 * @returns Liste filtrée et triée par score de similarité
 */
export function fuzzySearch<T>(
  items: T[],
  searchTerm: string,
  fieldName: keyof T,
  threshold: number = 0.3
): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  const results = items
    .map(item => {
      const fieldValue = String(item[fieldName]);
      const score = similarityScore(fieldValue, searchTerm);
      return { item, score };
    })
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);

  return results;
}
