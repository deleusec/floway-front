import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { useAuth } from '@/stores/auth';
import { useSpeechManager } from '@/hooks/useSpeechManager';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useSessionAnimations } from '@/hooks/useSessionAnimations';
import { formatTime, formatDistance, formatPace } from '@/utils/sessionUtils';

// Import de vos icônes SVG
import SvgUserTalk from '@/components/icons/UserTalk';
import SvgPlay from '@/components/icons/Play';
import SvgPause from '@/components/icons/Pause';
import SvgPinMap from '@/components/icons/PinMap';
import SvgStopIcon from '@/components/icons/StopIcon';

export default function SessionScreen() {
  const router = useRouter();
  const {
    session,
    stopSession,
    saveSession,
    pauseSession,
    resumeSession,
    updateLocation,
    updateMetrics,
  } = useRunningSessionStore();
  const { user, token, getUserAndTokenFromStorage } = useAuth();
  const { speak } = useSpeechManager();
  const lastAnnouncedKm = useRef(0);

  // États locaux
  const [showMap, setShowMap] = useState(false);

  // Hooks personnalisés
  const { hasPermission, error: locationError } = useLocationTracking({
    isActive: session.isActive,
    isPaused: session.isPaused,
    startTime: session.startTime,
    onLocationUpdate: updateLocation,
    onMetricsUpdate: updateMetrics,
  });

  const { metricsHeight, mapOpacity, animateToPause, animateToResume } = useSessionAnimations();

  // Effets
  useEffect(() => {
    if (!session.isActive) {
      router.replace('/session/start');
    } else {
      speak({
        type: 'info',
        text: 'Début de la séance',
        priority: 1,
      });
    }
  }, [session.isActive]);

  useEffect(() => {
    if (!session.isActive) return;

    const currentKm = Math.floor(session.metrics.distance / 1000);
    if (currentKm > lastAnnouncedKm.current) {
      const paceMinutes = Math.floor(session.metrics.pace / 60);
      const paceSeconds = Math.floor(session.metrics.pace % 60);

      speak({
        type: 'info',
        text: `${currentKm} kilomètres parcourus. Allure moyenne : ${paceMinutes} minutes et ${paceSeconds} secondes au kilomètre.`,
        priority: 2,
      });

      lastAnnouncedKm.current = currentKm;
    }
  }, [session.metrics.distance, session.isActive]);

  // Vérifier si c'est une course libre
  // Une course libre peut être détectée par un objectif de 0 ou un type spécifique
  const isFreeRun =
    session.objective === 0 ||
    session.type === 'free' ||
    (!session.type && session.objective === 0);

  // Calculs et formatage
  const getProgressPercentage = () => {
    if (isFreeRun) return 0;

    if (session.type === 'time') {
      return Math.min((session.metrics.time / (session.objective * 1000)) * 100, 100);
    } else if (session.type === 'distance') {
      return Math.min((session.metrics.distance / (session.objective * 1000)) * 100, 100);
    }
    return 0;
  };

  const formatObjective = () => {
    if (isFreeRun) return '';

    if (session.type === 'time') {
      return formatTime(session.objective * 1000);
    } else if (session.type === 'distance') {
      return `${session.objective.toFixed(2)} km`;
    }
    return '';
  };

  const getSessionTitle = () => {
    if (isFreeRun) return 'Course libre';

    return session.type === 'time'
      ? 'Mode minuterie'
      : session.type === 'distance'
        ? 'Mission kilomètres'
        : 'Course libre';
  };

  const formattedMetrics = {
    time: formatTime(session.metrics.time),
    distance: formatDistance(session.metrics.distance),
    pace: formatPace(session.metrics.pace),
  };

  // Gestion des actions
  const togglePause = () => {
    if (!session.isPaused) {
      pauseSession();
      animateToPause();
    } else {
      resumeSession();
      animateToResume();
    }
  };

  const handleRightButtonPress = () => {
    if (session.isPaused) {
      handleStopSession();
    } else {
      setShowMap(!showMap);
    }
  };

  const handleStopSession = () => {
    Alert.alert('Arrêter la course', 'Êtes-vous sûr de vouloir arrêter la course ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Arrêter',
        style: 'destructive',
        onPress: async () => {
          try {
            let currentUser = user;
            let currentToken = token;
            if (!currentUser || !currentToken) {
              const { user: storedUser, token: storedToken } = await getUserAndTokenFromStorage();
              currentUser = storedUser;
              currentToken = storedToken;
            }
            if (currentUser && currentToken) {
              await saveSession(currentToken, currentUser.id);
            }
            stopSession();
            router.replace('/session/start');
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder la session');
          }
        },
      },
    ]);
  };

  const handleMicPress = () => {
    console.log('Mic button pressed');
  };

  // Affichage des erreurs
  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec titre et barre de progression conditionnelle */}
      <View style={styles.header}>
        <Text style={styles.title}>{getSessionTitle()}</Text>

        {/* Barre de progression - seulement si ce n'est pas une course libre */}
        {!isFreeRun && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {session.type === 'time' ? formattedMetrics.time : formattedMetrics.distance} /{' '}
              {formatObjective()}
            </Text>
          </View>
        )}
      </View>

      {/* Mode carte pur */}
      {showMap && !session.isPaused ? (
        <View style={styles.mapContainerFull}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Carte en cours de chargement...</Text>
          </View>
        </View>
      ) : (
        /* Animation pause */
        <>
          {/* Carte qui descend du haut en mode pause */}
          <Animated.View
            style={[
              styles.pauseMapContainer,
              {
                opacity: mapOpacity,
                flex: metricsHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>Carte en cours de chargement...</Text>
            </View>
          </Animated.View>

          {/* Zone métriques qui se transforme */}
          <Animated.View
            style={[
              styles.metricsContainer,
              {
                flex: metricsHeight,
                borderTopLeftRadius: session.isPaused ? 20 : 0,
                borderTopRightRadius: session.isPaused ? 20 : 0,
                paddingBottom: session.isPaused ? 24 : 0,
                backgroundColor: session.isPaused ? '#fff' : '#F5F5F7',
                shadowOpacity: session.isPaused ? 0.1 : 0,
                shadowOffset: session.isPaused ? { width: 0, height: -4 } : { width: 0, height: 0 },
                shadowRadius: session.isPaused ? 12 : 0,
                elevation: session.isPaused ? 8 : 0,
                paddingTop: session.isPaused ? 8 : 0,
              },
            ]}>
            {!session.isPaused ? (
              /* Mode normal : métriques GROSSES et CENTRÉES */
              <>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>TEMPS</Text>
                  <Text style={styles.metricValue}>{formattedMetrics.time}</Text>
                </View>

                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>ALLURE (min/km)</Text>
                  <Text style={styles.metricValue}>{formattedMetrics.pace}</Text>
                </View>

                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>DISTANCE (km)</Text>
                  <Text style={styles.metricValue}>{formattedMetrics.distance}</Text>
                </View>
              </>
            ) : (
              /* Mode pause : drawer compact */
              <>
                <View style={styles.drawerHandle} />
                <Text style={styles.pauseTitle}>Course en pause</Text>

                <View style={styles.pauseMetricsRow}>
                  <View style={styles.pauseMetricItem}>
                    <Text style={styles.pauseMetricValue}>{formattedMetrics.time}</Text>
                    <Text style={styles.pauseMetricLabel}>Temps</Text>
                  </View>
                  <View style={styles.pauseMetricItem}>
                    <Text style={styles.pauseMetricValue}>{formattedMetrics.distance} km</Text>
                    <Text style={styles.pauseMetricLabel}>Distance</Text>
                  </View>
                  <View style={styles.pauseMetricItem}>
                    <Text style={styles.pauseMetricValue}>{formattedMetrics.pace}</Text>
                    <Text style={styles.pauseMetricLabel}>Allure</Text>
                  </View>
                </View>

                <View style={styles.pauseControlsContainer}>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.secondaryButton]}
                    onPress={handleMicPress}
                    activeOpacity={0.8}>
                    <SvgUserTalk size={24} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, styles.primaryButton]}
                    onPress={togglePause}
                    activeOpacity={0.8}>
                    <SvgPlay width={32} height={32} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, styles.stopButton]}
                    onPress={handleRightButtonPress}
                    activeOpacity={0.8}>
                    <SvgStopIcon width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </>
      )}

      {/* Boutons de contrôle - seulement si pas en pause */}
      {!session.isPaused && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleMicPress}
            activeOpacity={0.8}>
            <SvgUserTalk size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={togglePause}
            activeOpacity={0.8}>
            <SvgPause size={28} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              showMap ? styles.primaryLocationButton : styles.secondaryButton,
            ]}
            onPress={handleRightButtonPress}
            activeOpacity={0.8}>
            <SvgPinMap size={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricsContainer: {
    paddingHorizontal: 24,
  },
  metric: {
    alignItems: 'center',
    marginVertical: 28,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  metricValue: {
    fontSize: 56,
    fontWeight: '900',
    color: '#000',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  pauseMapContainer: {
    backgroundColor: '#F5F5F7',
  },
  mapContainerFull: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginBottom: 16,
    marginTop: 8,
  },
  pauseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  pauseMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  pauseMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  pauseMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  pauseMetricLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  pauseControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'transparent',
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    width: 72,
    height: 72,
    borderRadius: 36,
    shadowOpacity: 0.25,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  primaryLocationButton: {
    backgroundColor: '#6366F1',
    shadowOpacity: 0.25,
    elevation: 6,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    shadowOpacity: 0.25,
    elevation: 6,
  },
});
