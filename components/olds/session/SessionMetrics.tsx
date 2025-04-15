import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const METRICS_SCALE = SCREEN_WIDTH / 390; // Base iPhone 12/13/14

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
      <View style={styles.metricsContainer}>
        {/* Distance */}
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {distance.toFixed(2)}
            <Text style={styles.metricUnit}> km</Text>
          </Text>
          <Text style={styles.metricLabel}>Distance</Text>
        </View>

        {/* Allure */}
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {pace.toFixed(1)}
            <Text style={styles.metricUnit}> min/km</Text>
          </Text>
          <Text style={styles.metricLabel}>Allure</Text>
        </View>

        {/* Calories */}
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>
            {calories}
            <Text style={styles.metricUnit}> kcal</Text>
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
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    color: Colors.light.white,
    fontSize: Math.min(28 * METRICS_SCALE, 32),
    fontWeight: '500',
  },
  metricUnit: {
    fontSize: Math.min(14 * METRICS_SCALE, 18),
    marginLeft: 4,
    opacity: 0.8,
  },
  metricLabel: {
    color: Colors.light.white,
    fontSize: 14 * METRICS_SCALE,
    opacity: 0.7,
    marginTop: 2,
  },
});
