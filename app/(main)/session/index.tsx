import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { useAuth } from '@/stores/auth';
import { useSpeechManager } from '@/hooks/useSpeechManager';

// Import de vos icônes SVG
import SvgUserTalk from '@/components/icons/UserTalk';
import SvgPlay from '@/components/icons/Play';
import SvgPause from '@/components/icons/Pause';
import SvgPinMap from '@/components/icons/PinMap';
import SvgStopIcon from '@/components/icons/StopIcon';

export default function SessionScreen() {
  const router = useRouter();
  const { session, stopSession, saveSession, pauseSession, resumeSession } =
    useRunningSessionStore();
  const { user, token, getUserAndTokenFromStorage } = useAuth();
  const { speak } = useSpeechManager();
  const lastAnnouncedKm = useRef(0);

  // États
  const [isPaused, setIsPaused] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    console.log('Session state changed:', { isActive: session.isActive });

    if (!session.isActive) {
      router.replace('/session/start');
    } else {
      console.log('Attempting to speak start message');
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

  // Formatage du temps
  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Formatage de l'allure (min/km)
  const formatPace = (paceInSeconds: number) => {
    if (paceInSeconds === 0) return "0'00";
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}'${seconds.toString().padStart(2, '0')}`;
  };

  // Formatage de la distance
  const formatDistance = (distanceInMeters: number) => {
    return (distanceInMeters / 1000).toFixed(2);
  };

  // Calcul du pourcentage de progression
  const getProgressPercentage = () => {
    if (session.type === 'time') {
      return Math.min((session.metrics.time / (session.objective * 1000)) * 100, 100);
    } else if (session.type === 'distance') {
      return Math.min((session.metrics.distance / (session.objective * 1000)) * 100, 100);
    }
    return 0;
  };

  // Formatage de l'objectif
  const formatObjective = () => {
    if (session.type === 'time') {
      return formatTime(session.objective * 1000);
    } else if (session.type === 'distance') {
      return `${session.objective.toFixed(2)} km`;
    }
    return '';
  };

  // Gestion de la pause
  const togglePause = () => {
    if (!isPaused) {
      // Mettre en pause
      pauseSession?.();
      setIsPaused(true);
    } else {
      // Reprendre
      resumeSession?.();
      setIsPaused(false);
    }
  };

  // Gestion du bouton droit
  const handleRightButtonPress = () => {
    if (isPaused) {
      // En pause : arrêter la session
      handleStopSession();
    } else {
      // Basculer entre vue métriques et carte
      setShowMap(!showMap);
    }
  };

  // Arrêt de session
  const handleStopSession = () => {
    Alert.alert('Arrêter la course', 'Êtes-vous sûr de vouloir arrêter la course ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
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

  return (
    <View style={styles.container}>
      {/* Header avec titre et barre de progression */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {session.type === 'time'
            ? 'Mode minuterie'
            : session.type === 'distance'
              ? 'Mission kilomètres'
              : 'Course libre'}
        </Text>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {session.type === 'time'
              ? formatTime(session.metrics.time)
              : formatDistance(session.metrics.distance)}{' '}
            / {formatObjective()}
          </Text>
        </View>
      </View>

      {!showMap ? (
        isPaused ? (
          /* Vue pause - carte + drawer en bas */
          <View style={styles.pauseContainer}>
            <View style={styles.pauseMapArea}>
              <Text style={styles.pauseMapText}>Carte en cours de chargement...</Text>
            </View>

            {/* Drawer qui englobe métriques + boutons */}
            <View style={styles.pauseDrawer}>
              <View style={styles.drawerHandle} />

              <Text style={styles.pauseTitle}>Course en pause</Text>

              {/* Métriques dans le drawer */}
              <View style={styles.pauseMetricsRow}>
                <View style={styles.pauseMetricItem}>
                  <Text style={styles.pauseMetricValue}>{formatTime(session.metrics.time)}</Text>
                  <Text style={styles.pauseMetricLabel}>Temps</Text>
                </View>
                <View style={styles.pauseMetricItem}>
                  <Text style={styles.pauseMetricValue}>
                    {formatDistance(session.metrics.distance)} km
                  </Text>
                  <Text style={styles.pauseMetricLabel}>Distance</Text>
                </View>
                <View style={styles.pauseMetricItem}>
                  <Text style={styles.pauseMetricValue}>{formatPace(session.metrics.pace)}</Text>
                  <Text style={styles.pauseMetricLabel}>Allure</Text>
                </View>
              </View>

              {/* Boutons dans le même drawer */}
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
                  <SvgPlay width={28} height={28} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlButton, styles.stopButton]}
                  onPress={handleRightButtonPress}
                  activeOpacity={0.8}>
                  <SvgStopIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* Vue métriques normale */
          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>TEMPS</Text>
              <Text style={styles.metricValue}>{formatTime(session.metrics.time)}</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>ALLURE (min/km)</Text>
              <Text style={styles.metricValue}>{formatPace(session.metrics.pace)}</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>DISTANCE (km)</Text>
              <Text style={styles.metricValue}>{formatDistance(session.metrics.distance)}</Text>
            </View>
          </View>
        )
      ) : (
        /* Vue carte */
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Carte en cours de chargement...</Text>
          </View>

          {/* Métriques en bas de la carte */}
          <View style={styles.mapMetrics}>
            <View style={styles.mapMetricItem}>
              <Text style={styles.mapMetricValue}>{formatTime(session.metrics.time)}</Text>
              <Text style={styles.mapMetricLabel}>Temps</Text>
            </View>
            <View style={styles.mapMetricItem}>
              <Text style={styles.mapMetricValue}>
                {formatDistance(session.metrics.distance)} km
              </Text>
              <Text style={styles.mapMetricLabel}>Distance</Text>
            </View>
            <View style={styles.mapMetricItem}>
              <Text style={styles.mapMetricValue}>{formatPace(session.metrics.pace)}</Text>
              <Text style={styles.mapMetricLabel}>Allure</Text>
            </View>
          </View>
        </View>
      )}

      {/* Boutons de contrôle - seulement si pas en pause */}
      {!isPaused && (
        <View style={styles.controlsContainer}>
          {/* Bouton micro */}
          <TouchableOpacity
            style={[styles.controlButton, showMap ? styles.lightButton : styles.secondaryButton]}
            onPress={handleMicPress}
            activeOpacity={0.8}>
            <SvgUserTalk size={24} />
          </TouchableOpacity>

          {/* Bouton play/pause central */}
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={togglePause}
            activeOpacity={0.8}>
            <SvgPause size={28} />
          </TouchableOpacity>

          {/* Bouton droit (pin/stop) */}
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
  // Vue métriques
  metricsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F7',
  },
  metric: {
    alignItems: 'center',
    marginVertical: 24,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#000',
    fontVariant: ['tabular-nums'],
  },
  // Vue carte
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    margin: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  mapMetrics: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  mapMetricItem: {
    alignItems: 'center',
  },
  mapMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  mapMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Boutons de contrôle
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
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
  lightButton: {
    backgroundColor: '#F9FAFB',
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
  // Vue pause
  pauseContainer: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    position: 'relative',
  },
  pauseMapArea: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    margin: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseMapText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  pauseDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
  },
  pauseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  pauseMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  pauseMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  pauseMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
    fontVariant: ['tabular-nums'],
  },
  pauseMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  pauseControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
});
