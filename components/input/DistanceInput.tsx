import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface DistanceInputProps {
  placeholder?: string;
  status: 'default' | 'error' | 'disabled';
  unit?: string;
  value?: number;
  onChange?: (newValue: number) => void;
  errorMessage?: string;
}

const BORDER_COLORS = {
  default: Colors.light.secondaryDark,
  error: '#D13F11',
  disabled: '#5A5A5A',
};

export default function DistanceInput({
  placeholder = '0.00',
  status = 'default',
  unit = 'km',
  value = 0,
  onChange,
  errorMessage = 'Valeur invalide',
}: DistanceInputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value.toFixed(2));

  const isDisabled = status === 'disabled';
  const borderColor = isFocused ? Colors.light.primary : BORDER_COLORS[status];

  const handleInputChange = (newValue: string) => {
    // Remplace les virgules par des points pour gérer les décimales
    const formattedValue = newValue.replace(',', '.');

    // Valider la valeur comme un nombre flottant
    if (formattedValue === '' || formattedValue === '.') {
      setInputValue(formattedValue); // Permet d'afficher "." temporairement
      onChange?.(0);
      return;
    }

    const numValue = parseFloat(formattedValue);

    if (!isNaN(numValue)) {
      setInputValue(formattedValue);
      onChange?.(numValue);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (inputValue === '0.00') {
      setInputValue(''); // Supprime "0.00" lorsqu'on entre dans le champ
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue === '' || inputValue === '.') {
      setInputValue('0.00'); // Remettre la valeur par défaut
      onChange?.(0);
    } else {
      setInputValue(parseFloat(inputValue).toFixed(2)); // Fixer à deux décimales
    }
  };

  return (
    <View>
      <View style={[styles.container, { borderColor }, isDisabled && styles.disabledContainer]}>
        <TextInput
          style={[styles.input, isDisabled && styles.inputDisabled]}
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.mediumGrey}
          keyboardType="decimal-pad"
          editable={!isDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Text style={[styles.unit, isDisabled && styles.inputDisabled]}>{unit}</Text>
      </View>
      {status === 'error' && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.secondaryDark,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledContainer: {
    backgroundColor: '#2A2D3699',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.white,
    padding: 0,
  },
  inputDisabled: {
    color: Colors.light.mediumGrey,
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.light.white,
    marginLeft: 8,
  },
  errorMessage: {
    color: '#D13F11',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
});
