import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '@/constants/theme';

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
      activeOpacity={0.7}>
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
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  selectedCard: {
    borderColor: 'transparent',
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#624AF6',
    marginBottom: Spacing.xs,
  },
  selectedTitle: {
    color: '#624AF6',
  },
  description: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#000',
    lineHeight: 20,
    opacity: 0.7,
  },
});

export type { ChallengeCardProps };
