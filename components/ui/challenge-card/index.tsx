import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ChallengeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected?: boolean;
  onPress: () => void;
}

export default function ChallengeCard({
  icon,
  title,
  description,
  isSelected = false,
  onPress,
}: ChallengeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <Text style={[styles.title, isSelected && styles.selectedTitle]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#E0E7FF',
    backgroundColor: '#FAFBFF',
  },
  iconContainer: {
    marginRight: 16,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 4,
  },
  selectedTitle: {
    color: '#6366F1',
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 21,
  },
});

export type { ChallengeCardProps };
