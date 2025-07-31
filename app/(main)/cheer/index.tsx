import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useCheerStore } from '@/stores/cheer';

// Configuration d'enregistrement
const RECORDING_OPTIONS = {
  // Option 1: M4A (recommandé - meilleure compatibilité)
  m4a: {
    android: {
      extension: '.m4a',
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/webm;codecs=opus',
      bitsPerSecond: 128000,
    },
  },
  // Option 2: WAV (plus gros mais plus compatible)
  wav: {
    android: {
      extension: '.wav',
      outputFormat: Audio.AndroidOutputFormat.DEFAULT,
      audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
      sampleRate: 44100,
      numberOfChannels: 2,
    },
    ios: {
      extension: '.wav',
      outputFormat: Audio.IOSOutputFormat.LINEARPCM,
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/wav',
      bitsPerSecond: 128000,
    },
  }
};
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import CheerMicButton from '@/components/ui/button/mic';
import { useLocalSearchParams } from 'expo-router';
import SessionMap from '@/components/ui/session-map';

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDistance(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters.toFixed(0)} m`;
}

export default function CheerScreen() {
  const params = useLocalSearchParams<{ id?: string; firstName?: string }>();
  const {
    friendName,
    stats,
    flows,
    selectedFlowId,
    selectFlow,
    audioUri,
    setAudioUri,
    reset,
    fetchFriendSession,
    isLoading,
    error,
  } = useCheerStore();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recording = useRef<Audio.Recording | null>(null);

  // Récupérer les données de l'ami au chargement de la page
  useEffect(() => {
    if (params.id) {
      fetchFriendSession(params.id);
    }
  }, [params.id, params.firstName, fetchFriendSession]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [{ text: 'OK' }]);
    }
  }, [error]);

  // Nettoyer l'enregistrement au démontage du composant
  useEffect(() => {
    return () => {
      if (recording.current) {
        console.log('[CHEER] Nettoyage de l\'enregistrement au démontage');
        recording.current.stopAndUnloadAsync().catch(console.error);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const displayStats = stats || {
    time: 5340,
    distance: 10200,
    speed: 6.7,
    coordinates: [],
  };

  const startRecording = async () => {
    try {
      console.log('[CHEER] Demande de permission pour l\'enregistrement...');
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'autorisation du microphone est nécessaire pour enregistrer un audio.');
        return;
      }

      console.log('[CHEER] Préparation de l\'enregistrement...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Utiliser M4A par défaut (changer en 'wav' pour tester WAV)
      const selectedFormat: 'm4a' | 'wav' = 'm4a';
      const recordingOptions = RECORDING_OPTIONS[selectedFormat];
      
      console.log(`[CHEER] Enregistrement en format: ${selectedFormat}`);
      
      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
      
      recording.current = newRecording;
      setIsRecording(true);
      setRecordingTime(0);
      
      console.log('[CHEER] Enregistrement démarré');

      // Timer pour compter les secondes et arrêter après 30s
      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          if (t >= 30) {
            stopRecording();
            return t;
          }
          return t + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('[CHEER] Erreur lors du démarrage de l\'enregistrement:', error);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording.current) {
        console.log('[CHEER] Aucun enregistrement en cours');
        return;
      }

      console.log('[CHEER] Arrêt de l\'enregistrement...');
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);

      await recording.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.current.getURI();
      recording.current = null;
      
      if (uri) {
        console.log('[CHEER] Enregistrement sauvegardé:', uri);
        setAudioUri(uri);
        // Désélectionner le flow si un audio est enregistré
        if (selectedFlowId) {
          selectFlow('');
        }
      } else {
        console.error('[CHEER] Aucun URI d\'enregistrement disponible');
        Alert.alert('Erreur', 'Erreur lors de la sauvegarde de l\'enregistrement');
      }

    } catch (error) {
      console.error('[CHEER] Erreur lors de l\'arrêt de l\'enregistrement:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'arrêt de l\'enregistrement');
    }
  };

  const handlePlay = async () => {
    if (!audioUri) {
      Alert.alert('Erreur', 'Aucun audio à lire');
      return;
    }

    try {
      console.log('[CHEER] Lecture de l\'audio:', audioUri);
      setIsPlaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      await sound.playAsync();
      
      // Nettoyer après la lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('[CHEER] Lecture terminée');
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('[CHEER] Erreur lors de la lecture:', error);
      setIsPlaying(false);
      Alert.alert('Erreur', 'Impossible de lire l\'audio');
    }
  };

  const handleDelete = () => {
    setAudioUri(null);
    setRecordingTime(0);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size='large' color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textSecondary }}>
          Chargement des données...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Carte + stats */}
      <View style={styles.mapContainer}>
        <View style={styles.mapCard}>
          <SessionMap
            coordinates={displayStats.coordinates || []}
            height={140}
            style={styles.mapStyle}
          />
        </View>

        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Ionicons name='time' size={12} color={Colors.textPrimary} />
            <Text style={styles.statText}>{formatTime(displayStats.time)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name='location' size={12} color={Colors.textPrimary} />
            <Text style={styles.statText}>{formatDistance(displayStats.distance)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name='speedometer' size={12} color={Colors.textPrimary} />
            <Text style={styles.statText}>{displayStats.speed.toFixed(1)} km/h</Text>
          </View>
        </View>
      </View>

      {/* Vocal */}
      <Text style={styles.sectionTitle}>Envoie lui un vocal pour le booster !</Text>
      <View style={styles.voiceContainer}>
        {!audioUri ? (
          // Mode enregistrement
          <>
            <CheerMicButton
              isRecording={isRecording}
              onStart={startRecording}
              onStop={stopRecording}
              audioUri={audioUri || undefined}
              duration={recordingTime}
              onPlay={handlePlay}
              onDelete={handleDelete}
            />
          </>
        ) : (
          // Mode relecture avec carte audio
          <View style={[styles.audioCard, isPlaying && styles.audioCardPlaying]}>
            <View style={styles.audioInfo}>
              <Ionicons name="mic" size={24} color={Colors.primary} />
              <View style={styles.audioDetails}>
                <Text style={styles.audioTitle}>Audio</Text>
              </View>
            </View>
            <View style={styles.audioActions}>
              <TouchableOpacity style={styles.audioBtn} onPress={handlePlay} disabled={isPlaying}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.audioBtn} onPress={handleDelete}>
                <Ionicons name="trash" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.or}>ou</Text>
      {/* Flows */}
      <Text style={[styles.sectionTitle, audioUri && styles.sectionDisabled]}>Lâche un Flow</Text>
      <View style={styles.flowsList}>
        {flows.map(flow => (
          <TouchableOpacity
            key={flow.id}
            style={[
              styles.flowBtn, 
              selectedFlowId === flow.id && styles.flowBtnSelected,
              audioUri && styles.flowBtnDisabled
            ]}
            disabled={!!audioUri}
            onPress={() => !audioUri && selectFlow(flow.id)}>
            <Text style={[
              styles.flowText, 
              selectedFlowId === flow.id && styles.flowTextSelected,
              audioUri && styles.flowTextDisabled
            ]}>
              {flow.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {audioUri && (
        <Text style={styles.disabledHint}>
          Supprimez l'audio pour sélectionner un flow
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  mapCard: {
    width: '100%',
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapStyle: {
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
  },
  statsBox: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    position: 'absolute',
    bottom: -20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionDisabled: {
    color: Colors.textSecondary,
    opacity: 0.6,
  },
  voiceContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  micBtn: {
    width: 100,
    height: 100,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  micBtnActive: {
    backgroundColor: Colors.error,
  },
  audioCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioCardPlaying: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioDetails: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  audioTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  audioDuration: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  audioActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  audioBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  or: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  flowsList: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  flowBtn: {
    borderRadius: Radius.full,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  flowBtnSelected: {
    backgroundColor: Colors.primary + '1A',
    borderColor: Colors.primary,
  },
  flowBtnDisabled: {
    opacity: 0.6
  },
  flowText: {
    color: Colors.gray['700'],
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  flowTextSelected: {
    color: Colors.textPrimary,
  },
  flowTextDisabled: {
    color: Colors.textSecondary,
  },
  disabledHint: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.primary,
    fontWeight: '500',
    fontSize: FontSize.md,
  },
  sendBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  sendText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSize.md,
  },
});
