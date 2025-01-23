import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

interface TimeDisplayProps {
  hours: string;
  minutes: string;
  seconds: string;
}

export default function TimeDisplay({ hours, minutes, seconds }: TimeDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.timeUnit}>
          <ThemedText style={styles.timeValue}>{hours}</ThemedText>
          <ThemedText style={styles.timeLabel}>Heures</ThemedText>
        </View>
        <ThemedText style={styles.separator}>:</ThemedText>
        <View style={styles.timeUnit}>
          <ThemedText style={styles.timeValue}>{minutes}</ThemedText>
          <ThemedText style={styles.timeLabel}>Minutes</ThemedText>
        </View>
        <ThemedText style={styles.separator}>:</ThemedText>
        <View style={styles.timeUnit}>
          <ThemedText style={styles.timeValue}>{seconds}</ThemedText>
          <ThemedText style={styles.timeLabel}>Secondes</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: 4,
    flex: 1,
  },
  timeValue: {
    fontSize: 64,
    fontWeight: '600',
    color: Colors.light.white,
    lineHeight: 84,
    includeFontPadding: false,
    textAlign: 'center',
  },
  separator: {
    fontSize: 64,
    fontWeight: '600',
    color: Colors.light.white,
    opacity: 0.7,
    lineHeight: 84,
    alignSelf: 'flex-start',
    includeFontPadding: false,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  timeLabel: {
    fontSize: 16,
    color: Colors.light.white,
    opacity: 0.7,
    marginTop: 8,
  },
});
