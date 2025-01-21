import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface DistanceInputProps {
  placeholder?: string; // Placeholder par défaut
  status: 'default' | 'error' | 'disabled'; // États possibles
  unit?: string; // Unité à afficher (par défaut "km");
  value?: number; // Valeur du champ
  onChange?: (newValue: number) => void; // Callback de changement de valeur
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
  value,
  onChange,
}: DistanceInputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isDisabled = status === 'disabled';
  const borderColor = isFocused ? Colors.light.primary : BORDER_COLORS[status];

  return (
    <View>
      <View
        style={[
          styles.container,
          { borderColor },
          isDisabled && styles.disabledContainer,
        ]}>
        <TextInput
          style={[styles.input, isDisabled && styles.inputDisabled]}
          value={value?.toString()}
          onChangeText={(newValue) => {
            if (newValue === '') {
              onChange?.(0);
            } else {
              const numValue = parseFloat(newValue);
              if (!isNaN(numValue)) {
                onChange?.(numValue);
              }
            }
          }}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.mediumGrey}
          keyboardType="numeric"
          editable={!isDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Text style={[styles.unit, isDisabled && styles.inputDisabled]}>{unit}</Text>
      </View>
      {status === 'error' && (
        <Text style={styles.errorMessage}>Veuillez corriger cette valeur.</Text>
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
    paddingVertical: 14,
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
