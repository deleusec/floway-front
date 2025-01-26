import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { secondsToTimeObject } from '@/utils/timeUtils';

interface SessionTargetProps {
  type: 'time' | 'distance';
  timeObjective?: number;
  distanceObjective?: number;
}

export default function SessionTarget({ type, timeObjective, distanceObjective }: SessionTargetProps) {
  if (type === 'time' && timeObjective !== undefined) {
    const { hours, minutes, seconds } = secondsToTimeObject(timeObjective);

    return (
      <View style={styles.targetContent}>
        <View style={styles.timeContainer}>
          <TimeUnit label="Heures" value={hours.toString().padStart(2, '0')} />
          <Separator />
          <TimeUnit label="Minutes" value={minutes.toString().padStart(2, '0')} />
          <Separator />
          <TimeUnit label="Secondes" value={seconds.toString().padStart(2, '0')} />
        </View>
      </View>
    );
  }

  if (type === 'distance' && distanceObjective !== undefined) {
    return (
      <View style={styles.targetContent}>
        <ThemedText style={styles.distanceValue}>{distanceObjective} km</ThemedText>
      </View>
    );
  }

  return null;
}

const TimeUnit = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.timeUnit}>
    <ThemedText style={styles.timeValue}>{value}</ThemedText>
    <ThemedText style={styles.timeLabel}>{label}</ThemedText>
  </View>
);

const Separator = () => <ThemedText style={styles.separator}>:</ThemedText>;

const styles = StyleSheet.create({
  targetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  distanceValue: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.light.white,
    lineHeight: 38,
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
  },
  timeValue: {
    fontSize: 38,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.white,
    textAlign: 'center',
    lineHeight: 38,
  },
  separator: {
    fontSize: 38,
    fontWeight: '600',
    color: Colors.light.white,
    opacity: 0.7,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 16,
    color: Colors.light.white,
    opacity: 0.7,
  },
});
