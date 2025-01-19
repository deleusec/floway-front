import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const textColor = buttonType === 'confirm' ? Colors.light.primaryDark : Colors.dark.primaryDark;
  const borderColor = buttonType === 'cancel' ? Colors.light.mediumGrey : 'transparent';

  const heightStyle =
    buttonSize === 'large' ? styles.large : buttonSize === 'medium' ? styles.medium : styles.small;

  const isLoading = buttonState === 'loading';
  const opacityStyle = buttonState === 'disabled' ? { opacity: 0.5 } : {};

  const ButtonContent = () =>
    isLoading ? (
      <View style={styles.loadingContainer}>
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        <ActivityIndicator size="small" color={textColor} />
      </View>
    ) : (
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    );

  return (
    <TouchableOpacity style={[style]} disabled={buttonState === 'disabled' || isLoading} {...rest}>
      {buttonType === 'confirm' ? (
        <LinearGradient
          colors={['#C0FC95', '#91DC5C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.button, heightStyle, opacityStyle]}>
          <ButtonContent />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.button,
            heightStyle,
            {
              backgroundColor: Colors.light.white,
              borderColor,
              borderWidth: 1,
            },
            opacityStyle,
          ]}>
          <ButtonContent />
        </View>
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
    width: '100%',
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
