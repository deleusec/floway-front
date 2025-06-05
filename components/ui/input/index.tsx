import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, FontSize, FontFamily, Radius, Spacing } from '@/constants/theme';

interface Props extends TextInputProps {
  containerStyle?: ViewStyle;
}

const Input: React.FC<Props> = ({ containerStyle, style, ...props }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput placeholderTextColor='#707070' style={[styles.input, style]} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: Colors.textPrimary,
  },
});

export default Input;

export { SearchInput } from './search';
