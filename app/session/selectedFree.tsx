// screens/session/FreeSession.tsx
import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, Pressable } from 'react-native';
import SessionMetrics from '@/components/session/SessionMetrics';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useSessionContext } from '@/context/SessionContext';

export default function FreeSession() {
  const router = useRouter();
  const { clearSession } = useSessionContext();
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    time: { hours: '00', minutes: '00', seconds: '00' },
    distance: '0,00',
    pace: '0\'00"',
    calories: '0',
  });

  const handlePausePress = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleStopPress = useCallback(() => {
    clearSession();
    router.replace('/');
  }, [clearSession, router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Métriques de la session */}
      <SessionMetrics
        time={sessionStats.time}
        distance={sessionStats.distance}
        pace={sessionStats.pace}
        calories={sessionStats.calories}
      />

      {/* Contrôles */}
      <View style={styles.controlsContainer}>
        {/* Bouton Pause/Reprendre */}
        <Pressable style={styles.pauseButton} onPress={handlePausePress}>
          <MaterialIcons
            name={isPaused ? 'play-arrow' : 'pause'}
            size={32}
            color={Colors.light.white}
          />
        </Pressable>

        {/* Bouton Stop */}
        <Pressable style={styles.stopButton} onPress={handleStopPress}>
          <MaterialIcons name="stop" size={24} color={Colors.light.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  pauseButton: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  stopButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.secondaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
