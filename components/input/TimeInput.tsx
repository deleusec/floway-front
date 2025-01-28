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
    const cleanValue = newValue.replace(/[^0-9]/g, ''); // Retirer tout caractère non numérique

    if (cleanValue.length <= 2) {
      const numericValue = cleanValue === '' ? '' : parseInt(cleanValue, 10);
      const isValid = unit === 'heures' || (typeof numericValue === 'number' && numericValue < 60);

      if (isValid) {
        onChange(cleanValue);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value === '00') {
      onChange(''); // Effacer `00` au focus
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value === '' || value === '0') {
      onChange('00'); // Remettre `00` si vide ou invalide
    } else if (value.length === 1) {
      onChange(`0${value}`); // Ajouter un zéro devant si un seul chiffre
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
          placeholderTextColor={Colors.dark.mediumGrey}
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
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.secondaryDark,
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
    backgroundColor: Colors.dark.secondaryDark,
  },
  error: {
    borderColor: Colors.dark.error,
    borderWidth: 1,
  },
  focused: {
    borderColor: Colors.dark.primary,
  },
  input: {
    fontSize: 16,
    color: Colors.dark.white,
    padding: 0,
    textAlign: 'right',
    minWidth: 30,
  },
  disabledInput: {
    color: Colors.dark.mediumGrey,
  },
  unit: {
    fontSize: 14,
    color: Colors.dark.mediumGrey,
    marginLeft: 4,
    opacity: 0.8,
  },
  disabledUnit: {
    opacity: 0.5,
  },
});
