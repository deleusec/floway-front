import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TextInputFieldProps {
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  status?: 'default' | 'error' | 'success' | 'disabled';
  value?: string;
  onChange?: (newValue: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: any;
  errorMessage?: string;
}

const BORDER_COLORS = {
  default: Colors.light.secondaryDark,
  error: '#D13F11',
  success: '#91DC5C',
  disabled: '#5A5A5A',
};

export default function TextInputField({
  label,
  placeholder = '',
  multiline = false,
  status = 'default',
  value,
  onChange,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  style,
  errorMessage,
  ...rest
}: TextInputFieldProps) {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          { borderColor: BORDER_COLORS[status] },
          multiline && styles.multilineContainer,
        ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.light.mediumGrey}
          keyboardType={keyboardType}
          editable={status !== 'disabled'}
          multiline={multiline}
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          textAlignVertical={multiline ? 'top' : 'center'} // Alignement spécifique pour `multiline`
          {...rest}
        />
      </View>
      {status === 'error' && errorMessage && (
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
    paddingVertical: 14,
    justifyContent: 'center',
  },
  multilineContainer: {
    paddingVertical: 10,
  },
  input: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.light.white,
    padding: 0,
  },
  multilineInput: {
    minHeight: 100,
    paddingVertical: 8,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.light.white,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  errorMessage: {
    color: '#D13F11',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
});
