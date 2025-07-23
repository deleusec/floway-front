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
import { useCheerStore } from '@/stores/cheer';
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Récupérer les données de l'ami au chargement de la page
  useEffect(() => {
    if (params.id) {
      fetchFriendSession(params.id);
      // Si on a le prénom en paramètre, on peut l'utiliser immédiatement
      if (params.firstName) {
        // Optionnel : mettre à jour le store avec le prénom
        console.log('[CHEER] Prénom reçu:', params.firstName);
      }
    }
  }, [params.id, params.firstName, fetchFriendSession]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const displayStats = stats || {
    time: 5340,
    distance: 10200,
    speed: 6.7,
    coordinates: [],
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(t => {
        if (t >= 30) {
          stopRecording();
          return t;
        }
        return t + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setAudioUri('mock://audio');
  };

  const handlePlay = () => {
    alert('Lecture audio (mock)');
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
        <CheerMicButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={stopRecording}
          audioUri={audioUri || undefined}
          duration={recordingTime}
          onPlay={handlePlay}
          onDelete={handleDelete}
        />
        {isRecording && <Text style={styles.recordingTime}>{recordingTime}s</Text>}
      </View>
      <Text style={styles.or}>ou</Text>
      {/* Flows */}
      <Text style={styles.sectionTitle}>Lâche un Flow</Text>
      <View style={styles.flowsList}>
        {flows.map(flow => (
          <TouchableOpacity
            key={flow.id}
            style={[styles.flowBtn, selectedFlowId === flow.id && styles.flowBtnSelected]}
            onPress={() => selectFlow(flow.id)}>
            <Text style={[styles.flowText, selectedFlowId === flow.id && styles.flowTextSelected]}>
              {flow.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  recordingTime: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: '500',
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
  flowText: {
    color: Colors.gray['700'],
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  flowTextSelected: {
    color: Colors.textPrimary,
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
