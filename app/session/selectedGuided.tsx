import React, { useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { PictureCard } from '@/components/ThemedPictureCard';
import { ThemedText } from '@/components/ThemedText';

export default function GuidedSession() {
  const router = useRouter();
  const { sessionData, clearSession, setSessionData } = useSessionContext();
  const { isRunning, currentMetrics, handlePlayPause, handleStop } = useSessionTimer();

  // Initialiser la session et vérifier la run guidée
  useEffect(() => {
    if (!sessionData?.guidedRun) {
      router.replace('/session/guide');
      return;
    }

    // Initialiser l'état de la session si pas déjà fait
    if (!sessionData.status) {
      setSessionData({
        ...sessionData,
        status: 'ready',
        currentMetrics: {
          time: { hours: '00', minutes: '00', seconds: '00' },
          distance: '0,00',
          pace: '0\'00"',
          calories: '0',
        },
      });
    }
  }, [sessionData?.guidedRun, router]);

  const onStopPress = () => {
    handleStop();
    clearSession();
    router.replace('/');
  };

  // En cas d'absence de données de session, rediriger
  if (!sessionData?.guidedRun) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SessionMetrics
        time={currentMetrics?.time}
        distance={currentMetrics?.distance}
        pace={currentMetrics?.pace}
        calories={currentMetrics?.calories}
      />

      {/* Section run guidée */}
      <View style={styles.guidedSection}>
        <ThemedText style={styles.guidedLabel}>Run Guidée</ThemedText>
        <PictureCard
          title={sessionData.guidedRun.title}
          metrics={[sessionData.guidedRun.duration]}
          subtitle={sessionData.guidedRun.description}
          image={require('@/assets/images/start.jpg')}
          isSelected={false}
          onPress={() => {}} // Désactivé pendant la session
        />
      </View>

      <SessionControls
        isRunning={isRunning}
        onPausePress={handlePlayPause}
        onStopPress={onStopPress}
        style={styles.controlsContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  guidedSection: {
    padding: 24,
  },
  guidedLabel: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
  },
});
