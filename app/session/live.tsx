import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, BackHandler  } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Audio } from 'expo-av';
import SessionMetrics from '@/components/session/SessionMetrics';
import SessionControls from '@/components/session/SessionControls';
import { useSessionContext } from '@/context/SessionContext';
import TimeDisplay from '@/components/session/TimeDisplay';
import { ThemedText } from '@/components/text/ThemedText';
import SessionTarget from '@/components/session/SessionTarget';
import { PictureCard } from '@/components/ThemedPictureCard';
import { secondsToCompactReadableTime } from '@/utils/timeUtils';
import CustomModal from '@/components/modal/CustomModal';
import { calculateDistance, calculatePace, calculateCalories } from '@/utils/metricsUtils';
import { se } from 'date-fns/locale';


export default function FreeSession() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [pace, setPace] = useState(0.0);
  const [calories, setCalories] = useState(0);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<Audio.Sound | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isStopCountingDown, setIsStopCountingDown] = useState(false);

  const router = useRouter();
  const { sessionData, startSession, setSessionData } = useSessionContext();
  // Démarrage initial de la session
  useEffect(() => {
    if (sessionData) {
      startSession();
    }
  }, []);

  // Calcul des métriques
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (sessionData?.locations) {
        console.log(sessionData.locations);
        const currentDistance = calculateDistance(sessionData.locations);
        const currentPace = calculatePace(currentDistance, totalSeconds);
        const currentCalories = calculateCalories(currentDistance);

        setDistance(currentDistance);
        setPace(currentPace);
        setCalories(currentCalories);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, sessionData, totalSeconds]);

  // Main timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && !isStopCountingDown) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isStopCountingDown]);

  // Distance & Pace
  useEffect(() => {
    if (!sessionData?.run?.activation_param) return;

    const interval = setInterval(() => {
      const newQueue = [...audioQueue];

      sessionData.run?.activation_param.forEach((param: any) => {
        // Vérifie si le paramètre doit être activé
        if (
          (param.time !== undefined && param.time <= totalSeconds) ||
          (param.distance !== undefined && param.distance <= distance)
        ) {
          if (!newQueue.includes(param.audioFile)) {
            newQueue.push(param.audioFile);
          }
        }
      });

      setAudioQueue(newQueue);
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, distance, sessionData?.run, audioQueue]);

  // Audio player
  useEffect(() => {
    const playAudio = async (audioFile: string) => {
      setIsAudioPlaying(true);

      try {
        const { sound } = await Audio.Sound.createAsync({ uri: audioFile });
        setCurrentAudio(sound);
        await sound.playAsync();

        // Attend que l'audio soit terminé
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            setIsAudioPlaying(false);
            setCurrentAudio(null);
          }
        });
      } catch (error) {
        console.error('Erreur lors de la lecture audio:', error);
        setIsAudioPlaying(false);
      }
    };

    if (!isAudioPlaying && audioQueue.length > 0) {
      const nextAudio = audioQueue[0];
      setAudioQueue((prev) => prev.slice(1));
      playAudio(nextAudio);
    }
  }, [isAudioPlaying, audioQueue]);

  // Nettoyer les audios en cours
  const stopAllAudios = async () => {
    if (currentAudio) {
      try {
        await currentAudio.stopAsync();
        await currentAudio.unloadAsync();
      } catch (error) {
        console.error("Erreur lors de l'arrêt de l'audio actuel:", error);
      }
      setCurrentAudio(null);
    }
    setIsAudioPlaying(false);
    setAudioQueue([]);
  };

  const onStopPress = async () => {
    await stopAllAudios();
    console.log('sessionData', "STOPER");
    if (sessionData) {
      setSessionData({
        ...sessionData,
        metrics: {
          distance,
          pace,
          calories
        },
        time: totalSeconds,
      });
    }
    router.replace('/session/summary');
  };

  const confirmExit = async () => {
    setShowModal(false);
    await stopAllAudios();
    
    router.replace('/session');
  };

  const cancelExit = () => setShowModal(false);

  // Intercepter le bouton retour (back button)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowModal(true);
        return true; // Empêche le retour direct
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Timer */}
        <TimeDisplay time={totalSeconds} />

        {/* Metrics */}
        <SessionMetrics distance={distance} pace={pace} calories={calories} />

        {/* Session Target */}
        {(sessionData?.type === 'time' || sessionData?.type === 'distance') && (
          <View style={styles.targetSection}>
            <ThemedText style={styles.targetLabel}>Objectif de la session</ThemedText>
            <View style={styles.targetBox}>
              <SessionTarget
                type={sessionData.type}
                timeObjective={sessionData.time_objective}
                distanceObjective={sessionData.distance_objective}
              />
            </View>
          </View>
        )}

        {/* Guided Run */}
        {sessionData?.run && (
          <View style={styles.targetSection}>
            <ThemedText style={styles.targetLabel}>Course guidée</ThemedText>

            <PictureCard
              key={sessionData?.run.run.id}
              title={sessionData?.run.run.title}
              image={{ uri: 'https://picsum.photos/200' }}
              metrics={
                sessionData?.run.run.distance_objective
                  ? [`${sessionData?.run.run.distance_objective} km`]
                  : [secondsToCompactReadableTime(sessionData?.run.run.time_objective || 0)]
              }
              subtitle={sessionData?.run.run.description}
              onPress={() => {}}
            />
          </View>
        )}

        {/* Controls */}
        <SessionControls
          isRunning={isPlaying}
          onPausePress={() => setIsPlaying(!isPlaying)}
          onStopPress={onStopPress}
          onStopCountdownChange={setIsStopCountingDown} 
          style={styles.controlsContainer}
        />

        {/* Modal de confirmation */}
        <CustomModal
          visible={showModal}
          onClose={cancelExit}
          header={<ThemedText style={styles.modalHeader}>Quitter la session ?</ThemedText>}
          body={
            <ThemedText style={styles.modalBody}>
              Êtes-vous sûr de vouloir arrêter la session ? Les données actuelles seront perdues.
            </ThemedText>
          }
          cancelButton={true}
          confirmButton={true}
          cancelAction={cancelExit}
          confirmAction={confirmExit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  targetSection: {
    marginVertical: 16,
  },
  targetLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
    color: Colors.dark.white,
  },
  targetBox: {
    height: 100,
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.white,
  },
  modalBody: {
    fontSize: 16,
    color: Colors.dark.white,
    textAlign: 'center',
  },
});


