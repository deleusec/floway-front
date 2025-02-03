import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, BackHandler, StatusBar } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Audio } from 'expo-av';
import SessionMetrics from '@/components/session/SessionMetrics';
import { useSessionContext } from '@/context/SessionContext';
import TimeDisplay from '@/components/session/TimeDisplay';
import { ThemedText } from '@/components/text/ThemedText';
import SessionTarget from '@/components/session/SessionTarget';
import { PictureCard } from '@/components/cards/ThemedPictureCard';
import { secondsToCompactReadableTime } from '@/utils/timeUtils';
import CustomModal from '@/components/modal/CustomModal';
import { calculateDistance, calculatePace, calculateCalories } from '@/utils/metricsUtils';
import SessionContainer from '@/components/session/SessionContainer';

export default function LiveSession() {
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
  const [playedAudios, setPlayedAudios] = useState<Set<string>>(new Set());
  const [sessionEnded, setSessionEnded] = useState(false);
  const [modalText, setModalText] = useState('');

  const router = useRouter();
  const { sessionData, saveSession, startSession, setSessionData, stopLocationTracking } =
    useSessionContext();

  useEffect(() => {
    if (sessionData) {
      startSession();
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (sessionData?.locations) {
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

  const addToQueue = (audioFile: string) => {
    setAudioQueue((prevQueue) => {
      if (!prevQueue.includes(audioFile)) {
        return [...prevQueue, audioFile];
      }
      return prevQueue;
    });
  };

  useEffect(() => {
    if (!sessionData?.run?.activation_param) return;

    const interval = setInterval(() => {
      sessionData.run?.activation_param.forEach((param: any) => {
        const shouldTrigger =
          (!param.time && !param.distance) ||
          (param.time && param.time <= totalSeconds) ||
          (param.distance && param.distance <= distance);

        if (shouldTrigger && !playedAudios.has(param.audioFile)) {
          addToQueue(param.audioFile);
          setPlayedAudios((prev) => new Set(prev).add(param.audioFile));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, distance, sessionData?.run, playedAudios]);

  useEffect(() => {
    const playAudio = async (audioFile: string) => {
      setIsAudioPlaying(true);

      try {
        if (currentAudio) {
          await currentAudio.stopAsync();
          await currentAudio.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync({ uri: audioFile });
        setCurrentAudio(sound);

        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            setCurrentAudio(null);
            setIsAudioPlaying(false);
          }
        });
      } catch (error) {
        console.error('Erreur lors de la lecture audio:', error);
        setIsAudioPlaying(false);
      }
    };

    if (!isAudioPlaying && audioQueue.length > 0) {
      const [nextAudio, ...remainingQueue] = audioQueue;
      setAudioQueue(remainingQueue);
      playAudio(nextAudio);
    }
  }, [isAudioPlaying, audioQueue, currentAudio]);

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
    if (sessionData) {
      setSessionData({
        ...sessionData,
        metrics: {
          distance,
          pace,
          calories,
        },
        time: totalSeconds,
      });
    }
    stopLocationTracking();
    setSessionEnded(true);
  };

  useEffect(() => {
    if (
      sessionEnded &&
      sessionData?.metrics &&
      sessionData?.time &&
      sessionData?.metrics.distance > 0 &&
      sessionData?.metrics.pace > 0 &&
      sessionData?.metrics.calories > 0
    ) {
      saveSession()
        .then(() => {
          console.log('Session sauvegardée avec succès.');
          router.push('/session/summary');
        })
        .catch((error) => {
          console.error('Erreur lors de la sauvegarde de la session:', error);
        });
    } else if (sessionEnded) {
      setShowModal(true);
      setModalText(
        "Vous n'avez aucunes données à sauvegarder. Voulez-vous vraiment quitter la session ?",
      );
    }
  }, [sessionEnded, sessionData]);

  const confirmExit = async () => {
    setShowModal(false);
    await stopAllAudios();

    router.replace('/session');
  };

  const cancelExit = () => setShowModal(false);

  // BackHandler
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setModalText(
          'Êtes-vous sûr de vouloir arrêter la session ? Les données actuelles seront perdues.',
        );
        setShowModal(true);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  return (
    <SessionContainer
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      onStopPress={onStopPress}
      onStopCountdownChange={setIsStopCountingDown}
      location={sessionData?.locations?.[sessionData.locations.length - 1]}>
      <View style={styles.container}>
        {/* Slide bar */}
        <View style={[styles.slideBar, { marginTop: isPlaying && StatusBar.currentHeight ? 24 + StatusBar.currentHeight  : 24 }]} />
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

        {/* Modal de confirmation */}
        <CustomModal
          visible={showModal}
          onClose={cancelExit}
          header={<ThemedText style={styles.modalHeader}>Quitter la session ?</ThemedText>}
          cancelButton={true}
          confirmButton={true}
          cancelAction={cancelExit}
          confirmAction={confirmExit}>
          <ThemedText style={styles.modalBody}>
            {modalText}
          </ThemedText>
        </CustomModal>
      </View>
    </SessionContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
    paddingHorizontal: 16,
  },
  slideBar: {
    width: 150,
    height: 2,
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 24,
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
    fontSize: 14,
    color: Colors.dark.white,
    textAlign: 'center',
  },
});
