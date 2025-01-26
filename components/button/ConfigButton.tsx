import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  text: string; // Texte du bouton
  state: 'default' | 'disabled' | 'selected'; // États du bouton
  icon?: React.ReactElement; // Icône à gauche du texte
  onPress?: () => void; // Action au clic
  style?: ViewStyle; // Style personnalisé
}

export const CustomButton: React.FC<ButtonProps> = ({ text, state, icon, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        state === 'default' && styles.defaultButton,
        state === 'disabled' && styles.disabledButton,
        state === 'selected' && styles.selectedButton,
        style,
      ]}
      onPress={onPress}
      disabled={state === 'disabled'}>
      {/* Icône à gauche */}
      <Text>{icon && icon}</Text>

      {/* Texte du bouton */}
      <Text
        style={[
          styles.buttonText,
          state === 'default' && styles.defaultText,
          state === 'disabled' && styles.disabledText,
          state === 'selected' && styles.selectedText,
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 340,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
  },
  // Style pour l'état par défaut
  defaultButton: {
    backgroundColor: Colors.dark.secondaryDark, // Fond sombre
    borderColor: Colors.light.mediumGrey, // Bordure sombre pour état par défaut
  },
  defaultText: {
    color: Colors.light.white, // Texte blanc pour l'état par défaut
    fontFamily: 'Poppins-Medium',
  },
  // Style pour l'état désactivé
  disabledButton: {
    backgroundColor: Colors.dark.secondaryDark, // Fond sombre
    borderColor: Colors.light.mediumGrey,
  },
  disabledText: {
    color: Colors.light.mediumGrey,
    fontFamily: 'Poppins-Medium', // Texte gris clair pour l'état désactivé
  },
  // Style pour l'état sélectionné
  selectedButton: {
    backgroundColor: Colors.dark.secondaryDark, // Fond sombre
    borderColor: Colors.light.primary, // Bordure verte
  },
  selectedText: {
    color: Colors.light.primary,
    fontFamily: 'Poppins-Medium',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: Colors.light.white,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default CustomButton;
