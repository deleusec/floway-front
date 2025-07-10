import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {Colors, FontSize, Radius} from "@/theme";

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
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCard: {
    borderColor: Colors.primary,
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
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  selectedTitle: {
    color: Colors.primary,
  },
  description: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 21,
  },
});

export type { ChallengeCardProps };
