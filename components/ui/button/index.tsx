import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '@/constants/theme';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'error';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonState = 'default' | 'disabled' | 'loading';
type ButtonWidth = 'full' | 'fit';
type ButtonRounded = keyof typeof Radius;
const disabledBackgroundColor = Colors.border;
const disabledTextColor = Colors.gray["500"];


interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  width?: ButtonWidth;
  rounded?: ButtonRounded;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'large',
  state = 'default',
  width = 'full',
  rounded = 'full',
  style,
  ...rest
}) => {
  const isLoading = state === 'loading';
  const isDisabled = state === 'disabled' || isLoading || rest.disabled;

  const backgroundColor =
    isDisabled
      ? disabledBackgroundColor
      : variant === 'primary'
        ? Colors.primary
        : variant === 'outline'
          ? Colors.white
          : variant === 'error'
            ? 'transparent'
            : 'transparent';

  const textColor =
    isDisabled
      ? disabledTextColor
      : variant === 'primary'
        ? Colors.white
        : variant === 'error'
          ? Colors.error
          : Colors.textPrimary;

  const borderStyle =
    variant === 'outline'
      ? { borderWidth: 1, borderColor: Colors.border }
      : variant === 'error'
        ? { borderWidth: 1, borderColor: Colors.error }
        : {};

  const widthStyle: ViewStyle = width === 'full' ? { width: '100%' } : { alignSelf: 'flex-start' };

  const heightStyle = sizeStyles[size];
  const borderRadius = { borderRadius: Radius[rounded] };

  const ButtonContent = () => (
    <View style={isLoading ? styles.loadingContainer : undefined}>
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      {isLoading && <ActivityIndicator size='small' color={textColor} style={{ marginLeft: 8 }} />}
    </View>
  );

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        styles.base,
        heightStyle,
        widthStyle,
        borderRadius,
        { backgroundColor },
        borderStyle,
        style,
      ]}
      {...rest}>
      <ButtonContent />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const sizeStyles = StyleSheet.create({
  small: {
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
  },
  medium: {
    height: 45,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
  },
  large: {
    height: 52,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
  },
});

export default Button;
