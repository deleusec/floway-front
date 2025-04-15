// components/session/ProgressDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ProgressDisplayProps {
  current: number;
  target: number;
  type: 'time' | 'distance';
}

export default function ProgressDisplay({ current, target, type }: ProgressDisplayProps) {
  // Calculer le pourcentage de progression (limité à 100%)
  const progressPercentage = Math.min((current / target) * 100, 100);

  // Formater l'affichage selon le type
  const formatDisplay = (value: number) => {
    if (type === 'distance') {
      return `${value.toFixed(2)} km`;
    } else {
      // Pour le temps, convertir en minutes
      return `${Math.floor(value)} min`;
    }
  };

  // Définir la couleur selon la progression
  const getProgressColor = () => {
    if (progressPercentage >= 100) return Colors.light.primary;
    if (progressPercentage >= 75) return '#FFD700'; // Or
    return Colors.light.primary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Progression</Text>
        <Text style={styles.percentage}>{Math.floor(progressPercentage)}%</Text>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>

      {/* Valeurs détaillées */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Actuel</Text>
          <Text style={styles.detailValue}>{formatDisplay(current)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Objectif</Text>
          <Text style={styles.detailValue}>{formatDisplay(target)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '500',
  },
  percentage: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: Colors.light.white,
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  detailValue: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
