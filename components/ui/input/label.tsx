import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

const InputLabel: React.FC<TextProps> = ({ children, style, ...rest }) => (
  <Text style={[styles.label, style]} {...rest}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
});

export default InputLabel;
