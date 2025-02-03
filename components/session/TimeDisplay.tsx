import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { secondsToTimeObject } from '@/utils/timeUtils';

interface TimeDisplayProps {
  time: number;
}

export default function TimeDisplay({ time }: TimeDisplayProps) {

  const { hours, minutes, seconds } = secondsToTimeObject(time);

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.timeUnit}>
          <ThemedText style={styles.timeValue}>{hours.toString().padStart(2, '0')}</ThemedText>
          <ThemedText style={styles.timeLabel}>Heures</ThemedText>
        </View>
        <ThemedText style={styles.separator}>:</ThemedText>
        <View style={styles.timeUnit}>
          <ThemedText style={styles.timeValue}>{minutes.toString().padStart(2, '0')}</ThemedText>
          <ThemedText style={styles.timeLabel}>Minutes</ThemedText>
        </View>
        <ThemedText style={styles.separator}>:</ThemedText>
        <View style={styles.timeUnit}>
          <ThemedText style={styles.timeValue}>{seconds.toString().padStart(2, '0')}</ThemedText>
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
    fontWeight: '300',
  },
});
