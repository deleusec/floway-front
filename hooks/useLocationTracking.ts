import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { calculateDistance, calculatePace } from '@/utils/calculations';
import { useRunningSessionStore } from '@/stores/session';

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RunningMetrics {
  distance: number;
  pace: number;
  steps: number;
  calories: number;
  time: number;
}

interface UseLocationTrackingProps {
  isActive: boolean;
  isPaused: boolean;
  startTime: number | null;
}

export const useLocationTracking = ({
  isActive,
  isPaused,
  startTime,
}: UseLocationTrackingProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState<any>(null);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const metricsInterval = useRef<NodeJS.Timeout | null>(null);
  const lastLocation = useRef<LocationPoint | null>(null);
  const currentMetrics = useRef<RunningMetrics>({
    distance: 0,
    pace: 0,
    steps: 0,
    calories: 0,
    time: 0,
  });

  // Actions du store
  const { updateLocation, updateMetrics } = useRunningSessionStore();

  // Demander les permissions
  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
      }
      return status === 'granted';
    } catch (err) {
      setError('Erreur lors de la demande de permission');
      return false;
    }
  }, []);

  // Démarrer le tracking de localisation
  const startLocationTracking = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        location => {
          const currentTime = Date.now();
          const newLocation: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: currentTime,
          };

          console.log('📍 [useLocationTracking] Nouveau point GPS:', {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            timestampAbsolu: currentTime,
            timestampRelatif: newLocation.timestamp,
            startTime: startTime,
            tempsEcoule: startTime ? `${Math.floor(newLocation.timestamp / 1000)}s` : 'N/A',
          });

          // Calculer la distance depuis le dernier point
          let distanceIncrement = 0;
          if (lastLocation.current) {
            distanceIncrement = calculateDistance(
              lastLocation.current.latitude,
              lastLocation.current.longitude,
              newLocation.latitude,
              newLocation.longitude
            );

            // Protection contre les distances aberrantes (> 500m en 1 seconde = 1800km/h !)
            const maxReasonableDistance = 500; // 500 mètres max entre deux points
            if (distanceIncrement > maxReasonableDistance) {
              console.log('⚠️ [GPS] Distance aberrante détectée et ignorée:', {
                distance: distanceIncrement,
                from: lastLocation.current,
                to: newLocation,
              });
              distanceIncrement = 0; // Ignorer cette distance
            }
          }

          // Mettre à jour les métriques locales
          currentMetrics.current.distance += distanceIncrement;
          lastLocation.current = newLocation;

          // Mettre à jour la région de la carte
          const newRegion = {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          setMapRegion(newRegion);

          // Notifier le store (sans setLocations)
          updateLocation(newLocation);
        }
      );
    } catch (err) {
      setError('Erreur lors du démarrage du tracking');
    }
  }, [hasPermission, requestPermissions, updateLocation, startTime]);

  // Démarrer la mise à jour des métriques
  const startMetricsUpdate = useCallback(() => {
    if (!startTime) return;

    metricsInterval.current = setInterval(() => {
      const currentTime = Date.now() - startTime;
      const newMetrics: RunningMetrics = {
        ...currentMetrics.current,
        time: currentTime,
        pace: calculatePace(currentMetrics.current.distance, currentTime),
      };

      currentMetrics.current = newMetrics;
      updateMetrics(newMetrics);
    }, 1000);
  }, [startTime, updateMetrics]);

  // Arrêter le tracking
  const stopTracking = useCallback(() => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    if (metricsInterval.current) {
      clearInterval(metricsInterval.current);
      metricsInterval.current = null;
    }
    lastLocation.current = null;
    currentMetrics.current = {
      distance: 0,
      pace: 0,
      steps: 0,
      calories: 0,
      time: 0,
    };
  }, []);

  // Gérer les changements d'état
  useEffect(() => {
    if (isActive && !isPaused && hasPermission) {
      startLocationTracking();
      startMetricsUpdate();
    } else if (isPaused) {
      // En pause : arrêter le tracking mais garder les métriques
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
      if (metricsInterval.current) {
        clearInterval(metricsInterval.current);
        metricsInterval.current = null;
      }
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [isActive, isPaused, hasPermission]);

  // Demander les permissions au montage
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return {
    hasPermission,
    error,
    mapRegion,
    requestPermissions,
  };
};
