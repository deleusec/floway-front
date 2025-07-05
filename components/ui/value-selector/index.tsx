import React from 'react';
import { Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import {Colors, FontSize, Radius} from "@/theme";

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
      <Text style={styles.value}>{formatValue(value)} {label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    flex: 1
  },
  value: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  }
});
