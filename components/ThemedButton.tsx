import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

type ButtonType = 'confirm' | 'cancel';
type ButtonSize = 'large' | 'medium' | 'small';

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
                                                            title,
                                                            buttonType = 'confirm',
                                                            buttonSize = 'large',
                                                            style,
                                                            ...rest
                                                          }) => {
  const backgroundColor = buttonType === 'confirm'
    ? useThemeColor({ light: Colors.light.primary, dark: Colors.dark.primary }, 'primary')
    : useThemeColor({ light: Colors.light.secondaryDark, dark: Colors.dark.secondaryDark }, 'secondaryDark');

  const textColor = buttonType === 'confirm'
    ? useThemeColor({ light: Colors.light.primaryDark, dark: Colors.dark.primaryDark }, 'primaryDark')
    : useThemeColor({ light: Colors.light.white, dark: Colors.dark.white }, 'white');

  const heightStyle = buttonSize === 'large'
    ? styles.large
    : buttonSize === 'medium'
      ? styles.medium
      : styles.small;

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, heightStyle, styles.button, style]}
      {...rest}
    >
      <Text style={[{ color: textColor }, styles.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  large: {
    height: 52,
  },
  medium: {
    height: 45,
  },
  small: {
    height: 35,
  },
});
