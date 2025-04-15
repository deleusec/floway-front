import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '@/constants/theme';

const InputError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <Text style={styles.error}>{message}</Text> : null;

const styles = StyleSheet.create({
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
});

export default InputError;
