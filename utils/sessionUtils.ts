import * as Location from 'expo-location';

/**
 * Vérifier si la session peut être démarrée
 */
export const canStartSession = async (): Promise<{ canStart: boolean; error?: string }> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      return { canStart: false, error: 'Permission de localisation requise' };
    }
    return { canStart: true };
  } catch (error) {
    return { canStart: false, error: 'Erreur de vérification des permissions' };
  }
};

/**
 * Valider les données de session
 */
export const validateSessionData = (session: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!session.type || !['time', 'distance'].includes(session.type)) {
    errors.push('Type de session invalide');
  }

  if (!session.objective || session.objective <= 0) {
    errors.push('Objectif invalide');
  }

  if (session.type === 'time' && session.objective > 24 * 60 * 60) {
    errors.push('Objectif de temps trop élevé (max 24h)');
  }

  if (session.type === 'distance' && session.objective > 100) {
    errors.push('Objectif de distance trop élevé (max 100km)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Formater le temps (ms -> HH:MM:SS)
 */
export const formatTime = (timeInMs: number): string => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formater la distance (m -> km)
 */
export const formatDistance = (distanceInMeters: number): string => {
  return (distanceInMeters / 1000).toFixed(2);
};

/**
 * Formater l'allure (s -> min'sec)
 */
export const formatPace = (paceInSeconds: number): string => {
  if (paceInSeconds === 0) return "0'00";
  const minutes = Math.floor(paceInSeconds / 60);
  const seconds = Math.floor(paceInSeconds % 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formater la vitesse (km/h)
 */
export const formatSpeed = (speedInKmh: number): string => {
  if (speedInKmh === 0) return "0.0";
  return speedInKmh.toFixed(1);
};
