import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';

type ButtonType = 'confirm' | 'cancel';
type ButtonSize = 'large' | 'medium' | 'small';
type ButtonState = 'default' | 'disabled' | 'loading';

interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  buttonType?: ButtonType;
  buttonSize?: ButtonSize;
  buttonState?: ButtonState;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  buttonType = 'confirm',
  buttonSize = 'large',
  buttonState = 'default',
  style,
  ...rest
}) => {
  // Gestion des couleurs en fonction du type
  const backgroundColor = buttonType === 'confirm' ? Colors.light.primary : Colors.light.white;

  const textColor = buttonType === 'confirm' ? Colors.light.primaryDark : Colors.dark.primaryDark;

  const borderColor = buttonType === 'cancel' ? Colors.light.mediumGrey : 'transparent';

  // Gestion des tailles
  const heightStyle =
    buttonSize === 'large' ? styles.large : buttonSize === 'medium' ? styles.medium : styles.small;

  // État de chargement
  const isLoading = buttonState === 'loading';

  // Opacité pour le bouton désactivé
  const opacityStyle = buttonState === 'disabled' ? { opacity: 0.5 } : {};

  return (
    <TouchableOpacity
      style={[
        styles.button,
        heightStyle,
        {
          backgroundColor,
          borderColor,
          borderWidth: buttonType === 'cancel' ? 1 : 0,
        },
        opacityStyle,
        style,
      ]}
      disabled={buttonState === 'disabled' || isLoading}
      {...rest}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
          <ActivityIndicator size="small" color={textColor} />
        </View>
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  large: {
    width: 338,
    height: 52,
  },
  medium: {
    width: 240,
    height: 45,
  },
  small: {
    width: 130,
    height: 41,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ThemedButton;
