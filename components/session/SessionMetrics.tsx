import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const METRICS_SCALE = SCREEN_WIDTH / 390; // Base sur iPhone 12/13/14
interface SessionMetricsProps {
  distance?: number;
  pace?: number;
  calories?: number;
}

export default function SessionMetrics({
  distance = 0.0,
  pace = 0.0,
  calories = 0,
}: SessionMetricsProps) {
  return (
    <View style={styles.container}>
      {/* Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <View>
            <Text style={styles.metricValue}>
              {distance}
              <Text style={styles.metricUnit}> km</Text>
            </Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {pace}
            <Text style={styles.metricUnit}> min/km</Text>
          </Text>
          <Text style={styles.metricLabel}>Allure</Text>
        </View>

        <View style={styles.metricItem}>
          <View>
            <Text style={styles.metricValue}>
              {calories}
              <Text style={styles.metricUnit}> kcal</Text>
            </Text>
            <Text style={styles.metricLabel}>Calories</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
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
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: Colors.light.white,
    fontSize: Math.min(28 * METRICS_SCALE, 32),
    fontWeight: '400',
  },
  metricUnit: {
    fontSize: Math.min(14 * METRICS_SCALE, 18),
    marginLeft: 2,
  },
  metricLabel: {
    color: Colors.light.white,
    fontSize: 16 * METRICS_SCALE,
    opacity: 0.7,
    marginTop: 4,
  },
});
