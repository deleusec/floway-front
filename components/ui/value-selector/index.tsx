import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';

interface ValueSelectorProps {
  label: string;
  value: number;
  onPress?: (e: GestureResponderEvent) => void;
}

export default function ValueSelector({ label, value, onPress }: ValueSelectorProps) {
  // Formatage de la valeur
  const formatValue = (val: number) => val.toString().padStart(2, '0');

  return (
    <TouchableOpacity style={styles.selector} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.value}>{formatValue(value)}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 90,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
