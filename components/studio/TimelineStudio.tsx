// Je vais intégrer la timeline dans le ScrollView horizontal en fonction de goalTime ou goalDistance.
// Les audios seront affichés sous la timeline, positionnés en fonction de leur start_time ou start_distance.

import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

interface TimelineProps {
  goalType: string;
  goalTime: number;
  goalDistance: number;
  audioList: Audio[];
  selectedAudio: Audio | null;
  onSelectAudio: (audio: Audio | null) => void;
}

interface Audio {
  id: number;
  audio_id: number;
  title: string;
  duration: string;
  localPath?: string;
  start_time?: number;
  start_distance?: number;
}

const TimelineStudio = ({
  goalType,
  goalTime,
  goalDistance,
  audioList,
  selectedAudio,
  onSelectAudio,
}: TimelineProps) => {
  const timelineLength = goalType === 'Temps' ? goalTime : goalDistance * 1000; // conversion km -> m
  const interval =
    timelineLength > 600 ? Math.ceil(timelineLength / 600) * 60 : Math.ceil(timelineLength / 10); // Intervalles en minutes si > 10 min

  const timelineMarkers = Array.from(
    { length: Math.ceil(timelineLength / interval) + 1 },
    (_, index) => index * interval,
  );

  const handleAudioSelect = (id: number) => {
    if (onSelectAudio) {
      onSelectAudio(audioList.find((audio) => audio.id === id) as Audio);
    }
  };

  const handleDeselectAudio = () => {
    if (onSelectAudio) {
      onSelectAudio(null);
    }
  };


  return (
    <ScrollView horizontal style={styles.editorContainer} showsHorizontalScrollIndicator={false}>
      <Pressable style={styles.timelineContainer} onPress={handleDeselectAudio}>
        <View style={styles.timelineContent}>
          {/* Marqueurs de la timeline */}
          <View style={styles.markersContainer}>
            {timelineMarkers.map((marker, index) => (
              <View key={index} style={styles.markerWrapper}>
                <View style={styles.markerLine} />
                <Text style={styles.markerText}>
                  {goalType === 'Temps'
                    ? marker >= 60
                      ? `${Math.floor(marker / 60)}min`
                      : `${marker}s`
                    : `${(marker / 1000).toFixed(1)} km`}
                </Text>
              </View>
            ))}
          </View>

          {/* Placement des audios sous la timeline */}
          <View style={styles.audioContainer}>
            {audioList.map((audio) => {
              const position =
                ((audio.start_time || (audio.start_distance ?? 0) * 1000) / timelineLength) * 100;
              const isSelected = selectedAudio && selectedAudio.id === audio.id;
              const duration = parseInt(audio.duration, 10);
              const width = (duration / timelineLength) * 100;

              return (
                <TouchableOpacity
                  key={audio.id}
                  style={[
                    styles.audioItem,
                    {
                      left: `${position}%`,
                      width: `${width}%`,
                      opacity: isSelected ? 1 : 0.3,
                      shadowColor: isSelected ? 'green' : 'transparent',
                    },
                    isSelected && styles.selectedAudioItem,
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAudioSelect(audio.id);
                  }}>
                  <Text style={styles.audioTitle}>{audio.id}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  timelineContainer: {
    paddingVertical: 10,
  },
  timelineContent: {
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  markersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
    marginRight: 40,
  },
  markerLine: {
    width: 2,
    height: 10,
    backgroundColor: 'white',
    marginBottom: 4,
  },
  markerText: {
    color: 'white',
    fontSize: 12,
  },
  audioContainer: {
    position: 'relative',
    height: 40,
    marginTop: 10,
  },
  audioItem: {
    position: 'absolute',
    backgroundColor: Colors.dark.white,
    padding: 6,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  selectedAudioItem: {
    shadowColor: 'green',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  audioTitle: {
    color: Colors.dark.primaryDark,
    fontSize: 10,
  },
});

export default TimelineStudio;
