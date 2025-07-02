import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '@/constants/theme';

interface ValueSelectorProps {
  label: string;
  value: number;
  onPress?: (e: GestureResponderEvent) => void;
}

export default function ValueSelector({ label, value, onPress }: ValueSelectorProps) {
  // Formatage de la valeur
  const formatValue = (val: number) => val.toString().padStart(2, '0');

  return (
    <TouchableOpacity
      style={styles.selector}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.value}>
        {formatValue(value)} {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    minWidth: 90,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  value: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: '#6E6E6E',
    textAlign: 'center',
  },
});
