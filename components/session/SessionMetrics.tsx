import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const METRICS_SCALE = SCREEN_WIDTH / 390; // Base sur iPhone 12/13/14

interface TimeUnitProps {
  value: string;
  label: string;
}

const TimeUnit = ({ value, label }: TimeUnitProps) => (
  <View style={styles.timeUnit}>
    <Text style={styles.timeValue}>{value}</Text>
    <Text style={styles.timeLabel}>{label}</Text>
  </View>
);

interface SessionMetricsProps {
  time?: {
    hours: string;
    minutes: string;
    seconds: string;
  };
  distance?: string;
  pace?: string;
  calories?: string;
}

export default function SessionMetrics({
  time = { hours: '00', minutes: '00', seconds: '00' },
  distance = '0,00',
  pace = '0\'00"',
  calories = '0',
}: SessionMetricsProps) {
  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerContainer}>
        <TimeUnit value={time.hours} label="Heures" />
        <Text style={styles.separator}>:</Text>
        <TimeUnit value={time.minutes} label="Minutes" />
        <Text style={styles.separator}>:</Text>
        <TimeUnit value={time.seconds} label="Secondes" />
      </View>

      {/* Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {distance}<Text style={styles.metricUnit}>km</Text>
          </Text>
          <Text style={styles.metricLabel}>Distance</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {pace}
          </Text>
          <Text style={styles.metricLabel}>Allure</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {calories}<Text style={styles.metricUnit}>kcal</Text>
          </Text>
          <Text style={styles.metricLabel}>Calories</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeUnit: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  timeValue: {
    color: Colors.light.white,
    fontSize: Math.min(38 * METRICS_SCALE, 42),
    fontWeight: '400',
  },
  timeLabel: {
    color: Colors.light.white,
    fontSize: 12 * METRICS_SCALE,
    opacity: 0.7,
    marginTop: 4,
  },
  separator: {
    color: Colors.light.white,
    fontSize: Math.min(38 * METRICS_SCALE, 42),
    fontWeight: '400',
    marginHorizontal: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    color: Colors.light.white,
    fontSize: Math.min(28 * METRICS_SCALE, 32),
    fontWeight: '400',
  },
  metricUnit: {
    fontSize: Math.min(16 * METRICS_SCALE, 18),
    marginLeft: 2,
  },
  metricLabel: {
    color: Colors.light.white,
    fontSize: 12 * METRICS_SCALE,
    opacity: 0.7,
    marginTop: 4,
  },
});