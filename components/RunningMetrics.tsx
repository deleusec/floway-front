import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRunningSessionStore } from '../stores/session';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '../constants/theme';

export const RunningMetrics = () => {
  const { session } = useRunningSessionStore();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2);
  };

  const formatPace = (pace: number) => {
    if (pace === 0) return '--:--';
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (session.type === 'time') {
      return Math.min((session.metrics.time / (session.objective * 60 * 1000)) * 100, 100);
    }
    return Math.min((session.metrics.distance / (session.objective * 1000)) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {session.type === 'time'
            ? `${formatTime(session.metrics.time)} / ${formatTime(session.objective * 60 * 1000)}`
            : `${formatDistance(session.metrics.distance)} / ${session.objective} km`}
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{formatTime(session.metrics.time)}</Text>
          <Text style={styles.metricLabel}>Temps</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{formatDistance(session.metrics.distance)} km</Text>
          <Text style={styles.metricLabel}>Distance</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{formatPace(session.metrics.pace)}</Text>
          <Text style={styles.metricLabel}>Allure</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    margin: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progressText: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm,
  },
  metricValue: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textSecondary,
  },
});