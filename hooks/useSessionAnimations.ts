import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

export const useSessionAnimations = () => {
  // Valeurs animées
  const metricsHeight = useRef(new Animated.Value(1)).current; // 1 = plein écran, 0 = drawer
  const mapOpacity = useRef(new Animated.Value(0)).current; // 0 = invisible, 1 = visible

  // Animation vers le mode pause
  const animateToPause = useCallback(() => {
    Animated.parallel([
      // Réduction de la zone métrique
      Animated.timing(metricsHeight, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
      // Apparition de la carte
      Animated.timing(mapOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [metricsHeight, mapOpacity]);

  // Animation vers le mode normal
  const animateToResume = useCallback(() => {
    Animated.parallel([
      // Expansion de la zone métrique
      Animated.timing(metricsHeight, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }),
      // Disparition de la carte
      Animated.timing(mapOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [metricsHeight, mapOpacity]);

  // Réinitialiser les animations
  const resetAnimations = useCallback(() => {
    metricsHeight.setValue(1);
    mapOpacity.setValue(0);
  }, [metricsHeight, mapOpacity]);

  return {
    // Valeurs animées
    metricsHeight,
    mapOpacity,

    // Fonctions d'animation
    animateToPause,
    animateToResume,
    resetAnimations,
  };
};
