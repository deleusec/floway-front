import React, { useRef, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import { useCheerStore } from '@/stores/cheer';
import { Colors, Spacing, FontSize, FontFamily, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import CheerMicButton from '@/components/ui/button/mic';

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}h${s < 10 ? '0' : ''}${s}`;
}

export default function CheerScreen() {
  const { friendName, stats, flows, selectedFlowId, selectFlow, audioUri, setAudioUri, reset } =
    useCheerStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const displayStats = stats || {
    time: 5340,
    distance: 10200,
    speed: 6.7,
    mapImageUrl:
      'https://static-maps.yandex.ru/1.x/?lang=fr_FR&ll=-3.45,48.78&z=12&l=map&pl=c:FF0000FF,w:5,-3.45,48.78,-3.47,48.80,-3.48,48.81',
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Carte + stats */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: displayStats.mapImageUrl }}
          style={styles.mapImg}
          resizeMode='cover'
        />
        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Ionicons name='time' size={12} color={Colors.textPrimary} />
            <Text style={styles.statText}>
              {Math.floor(displayStats.time / 60)}h
              {(displayStats.time % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name='location' size={12} color={Colors.textPrimary} />
            <Text style={styles.statText}>{(displayStats.distance / 1000).toFixed(1)} km</Text>
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
    flex: 1
  },
  mapContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg
  },
  mapImg: {
    width: '100%',
    height: 140,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
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
    fontFamily: FontFamily.medium,
  },
  or: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600'
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
    borderColor: '#F1F1F1'
  },
  flowBtnSelected: {
    backgroundColor: Colors.primary + '1A',
    borderColor: Colors.primary,
  },
  flowText: {
    color: Colors.gray["700"],
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
    fontFamily: FontFamily.medium,
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
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
});
