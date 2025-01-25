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
    paddingHorizontal: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  timeUnit: {
    fontFamily: 'Poppins-Light',
    minWidth: 80,
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 58,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.white,
    lineHeight: 64,
    includeFontPadding: false,
    textAlign: 'center',
  },
  separator: {
    fontSize: 64,
    fontWeight: '600',
    color: Colors.light.white,
    opacity: 0.7,
    lineHeight: 54,
    alignSelf: 'flex-start',
    includeFontPadding: false,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  timeLabel: {
    fontSize: 16,
    color: Colors.light.white,
    opacity: 0.7,
  },
});
