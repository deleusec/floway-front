import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRunningSessionStore } from '@/stores/session';
import { useAuth } from '@/stores/auth';
import { useSpeechManager } from '@/hooks/useSpeechManager';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useSessionAnimations } from '@/hooks/useSessionAnimations';
import { FreeMap } from '@/components/ui/map/session-map';
import { formatTime, formatDistance, formatPace } from '@/utils/sessionUtils';

// Import de vos icônes SVG
import SvgUserTalk from '@/components/icons/UserTalk';
import SvgPlay from '@/components/icons/Play';
import SvgPause from '@/components/icons/Pause';
import SvgPinMap from '@/components/icons/PinMap';
import SvgStopIcon from '@/components/icons/StopIcon';
import { Colors, FontSize, Radius, Spacing } from '@/theme';
import { useStore } from '@/stores';
import SvgX from "@/components/icons/X";
import { mqttService } from '@/services/mqttService';

export default function SessionScreen() {
  const router = useRouter();
  const {
    session,
    stopSession,
    pauseSession,
    resumeSession,
    startAutoSaveSession,
    stopAutoSaveSession,
  } = useRunningSessionStore();
  const { user, token } = useAuth();
  const { speak } = useSpeechManager();
  const lastAnnouncedKm = useRef(0);

  // États locaux
  const [showMap, setShowMap] = useState(false);

  // Hooks personnalisés - logique métier séparée
  const {
    error: locationError,
    mapRegion,
  } = useLocationTracking({
    isActive: session.isActive,
    isPaused: session.isPaused,
    startTime: session.startTime,
  });

  const { metricsHeight, mapOpacity, animateToPause, animateToResume } = useSessionAnimations();
  const { setBackgroundColor } = useStore()

  useEffect(() => {
    setBackgroundColor(Colors.white)
  }, []);


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
    if (session.isActive && user && token) {
      startAutoSaveSession(token, user.id);
    } else {
      stopAutoSaveSession();
    }
    return () => {
      stopAutoSaveSession();
    };
  }, [session.isActive, user, token]);

  // MQTT connection management
  useEffect(() => {
    if (session.isActive && user) {
      // Connect to MQTT when session starts
      mqttService.connect().then((connected) => {
        if (connected) {
          console.log('✅ MQTT connected for session');
        } else {
          console.warn('⚠️ Failed to connect to MQTT for session');
        }
      }).catch((error) => {
        console.error('❌ MQTT connection error:', error);
      });
    }

    return () => {
      // Disconnect MQTT when component unmounts or session ends
      if (!session.isActive) {
        mqttService.disconnect();
        console.log('🔌 MQTT disconnected from session');
      }
    };
  }, [session.isActive, user]);

  // Annonces vocales des kilomètres
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

  // Logique métier - calculs et formatage
  const isFreeRun = session.type === 'free';

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

  // Gestionnaires d'événements
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
            stopAutoSaveSession();
            stopSession();
            router.push('/session/recap');
          } catch (error) {
            Alert.alert('Erreur', "Impossible d'arrêter la session");
          }
        },
      },
    ]);
  };

  const handleMicPress = () => {
    console.log('Mic button pressed');
  };

  // Déterminer quel mode d'affichage utiliser
  const shouldShowFullMap = showMap && !session.isPaused;
  const shouldShowPauseMap = session.isPaused;

  // Gestion des erreurs
  if (locationError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{locationError}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec titre et barre de progression conditionnelle */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{getSessionTitle()}</Text>
          <TouchableOpacity onPress={handleStopSession}>
            <SvgX width={24} height={24} color='#444444' />
          </TouchableOpacity>
        </View>

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

      {/* Mode carte pur - UNE SEULE INSTANCE */}
      {shouldShowFullMap ? (
        <FreeMap
          locations={session.locations}
          mapRegion={mapRegion}
          style={styles.mapContainerFull}
          isVisible={true}
        />
      ) : (
        /* Mode normal avec métriques et carte optionnelle en pause */
        <>
          {/* Carte qui descend du haut en mode pause - TOUJOURS PRESENTE */}
          <Animated.View
            style={[
              styles.pauseMapContainer,
              {
                opacity: mapOpacity,
                flex: metricsHeight.interpolate({
                  inputRange: [0.7, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}>
            {shouldShowPauseMap && (
              <FreeMap
                locations={session.locations}
                mapRegion={mapRegion}
                style={styles.pauseMapContent}
                isVisible={true}
              />
            )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 22,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progressText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metricsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  metric: {
    alignItems: 'center',
    marginVertical: 24,
  },
  metricLabel: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.gray['500'],
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 58,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center',
  },
  pauseMapContainer: {
    backgroundColor: Colors.background,
  },
  pauseMapContent: {
    flex: 1,
  },
  mapContainerFull: {
    flex: 1,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
    marginBottom: 40,
    marginTop: 8,
  },
  pauseMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 45,
  },
  pauseMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  pauseMetricValue: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  pauseMetricLabel: {
    fontSize: FontSize.sm,
    color: Colors.gray['500'],
    fontWeight: '600',
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: 20,
    paddingBottom: Spacing.lg,
  },
  controlButton: {
    width: 62,
    height: 62,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    width: 85,
    height: 85,
    borderRadius: Radius.full,
  },
  secondaryButton: {
    backgroundColor: Colors.gray['600'],
  },
  primaryLocationButton: {
    backgroundColor: Colors.primary,
  },
  stopButton: {
    backgroundColor: Colors.error,
  },
});
