import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TimeInputFieldProps {
  placeholder: string;
  status?: 'active' | 'deactivate' | 'error';
  unit: 'heures' | 'min' | 'sec';
  value: string;
  onChange: (newValue: string) => void;
}

export default function TimeInputField({
  placeholder,
  status = 'active',
  unit,
  value,
  onChange,
}: TimeInputFieldProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleTextChange = (newValue: string) => {
    const cleanValue = newValue.replace(/^0+/, ''); // Nettoie les zéros initiaux

    if (/^\d{0,2}$/.test(cleanValue)) {
      const numValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10);
      const isValid = unit === 'heures' ? true : numValue < 60;

      if (isValid) {
        if (cleanValue === '') {
          onChange('00'); // Si vide, on retourne "00"
        } else if (cleanValue.length === 1) {
          onChange(`0${cleanValue}`); // Ajoute un zéro pour les valeurs à un seul chiffre
        } else {
          onChange(cleanValue); // Retourne la valeur nettoyée
        }
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Quand on focus, si la valeur est "00", on la vide
    if (value === '00') {
      onChange('');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Quand on quitte le champ, si vide, remettre "00"
    if (value === '') {
      onChange('00');
    }
    // Si un seul chiffre, ajouter le zéro devant
    else if (value.length === 1) {
      onChange(`0${value}`);
    }
  };

  const containerStyles = [
    styles.container,
    status === 'deactivate' && styles.deactivate,
    status === 'error' && styles.error,
    isFocused && styles.focused,
  ];

  const textStyles = [styles.input, status === 'deactivate' && styles.disabledInput];

  const unitStyles = [styles.unit, status === 'deactivate' && styles.disabledUnit];

  return (
    <View style={containerStyles}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.light.mediumGrey}
          keyboardType="numeric"
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          style={textStyles}
          editable={status !== 'deactivate'}
          maxLength={2}
        />
        <Text style={unitStyles}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.secondaryDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  deactivate: {
    opacity: 0.5,
    backgroundColor: Colors.light.secondaryDark,
  },
  error: {
    borderColor: Colors.light.error,
    borderWidth: 1,
  },
  focused: {
    borderColor: Colors.light.primary,
  },
  input: {
    fontSize: 16,
    color: Colors.light.white,
    padding: 0,
    textAlign: 'right',
    minWidth: 30,
  },
  disabledInput: {
    color: Colors.light.mediumGrey,
  },
  unit: {
    fontSize: 14,
    color: Colors.light.mediumGrey,
    marginLeft: 4,
    opacity: 0.8,
  },
  disabledUnit: {
    opacity: 0.5,
  },
});
