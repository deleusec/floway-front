import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TimeInputsProps {
  totalSeconds: number;
  onChange: (seconds: number) => void;
  status?: 'active' | 'deactivate' | 'error' | 'default';
  errorMessage?: string;
}

export default function TimeInputs({
  totalSeconds,
  onChange,
  status = 'active',
  errorMessage,
}: TimeInputsProps) {
  const [hours, setHours] = useState(() => Math.floor(totalSeconds / 3600).toString());
  const [minutes, setMinutes] = useState(() => Math.floor((totalSeconds % 3600) / 60).toString());
  const [seconds, setSeconds] = useState(() => (totalSeconds % 60).toString());

  const [focusedField, setFocusedField] = useState<'hours' | 'minutes' | 'seconds' | null>(null);

  const hourRef = useRef<TextInput>(null);
  const minuteRef = useRef<TextInput>(null);
  const secondRef = useRef<TextInput>(null);

  const updateTotalSeconds = (newHours: string, newMinutes: string, newSeconds: string) => {
    const total =
      parseInt(newHours || '0', 10) * 3600 +
      parseInt(newMinutes || '0', 10) * 60 +
      parseInt(newSeconds || '0', 10);
    onChange(total);
  };

  const handleFocus = (
    field: 'hours' | 'minutes' | 'seconds',
    setter: (v: string) => void,
    value: string,
  ) => {
    setFocusedField(field);
    if (value === '0') {
      setter('');
    }
  };

  const handleBlur = (
    field: 'hours' | 'minutes' | 'seconds',
    setter: (v: string) => void,
    value: string,
  ) => {
    setFocusedField(null);
    if (value === '') {
      setter('0');
    }
    updateTotalSeconds(
      field === 'hours' ? value : hours,
      field === 'minutes' ? value : minutes,
      field === 'seconds' ? value : seconds,
    );
  };

  const handleChange = (
    value: string,
    setter: (v: string) => void,
    max: number,
    field: 'hours' | 'minutes' | 'seconds',
    nextRef?: React.RefObject<TextInput>,
  ) => {
    let cleanValue = value.replace(/[^0-9]/g, ''); // Retirer tout caractère non numérique
    if (parseInt(cleanValue, 10) >= max) {
      cleanValue = (max - 1).toString();
    }

    setter(cleanValue);

    if (cleanValue.length === 2 && nextRef?.current) {
      nextRef.current.focus(); // Déplacer le focus si 2 chiffres
    }

    updateTotalSeconds(
      field === 'hours' ? cleanValue : hours,
      field === 'minutes' ? cleanValue : minutes,
      field === 'seconds' ? cleanValue : seconds,
    );
  };

  const containerStyles = (field: 'hours' | 'minutes' | 'seconds') => [
    styles.inputsContainer,
    focusedField === field && styles.focused,
    status === 'error' && styles.error,
  ];

  const textStyles = [styles.input, status === 'deactivate' && styles.disabledInput];

  const unitStyles = [styles.unit, status === 'deactivate' && styles.disabledUnit];

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Input des heures */}
        <TouchableWithoutFeedback onPress={() => hourRef.current?.focus()}>
          <View style={containerStyles('hours')}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={hourRef}
                placeholder="0"
                placeholderTextColor={Colors.light.mediumGrey}
                keyboardType="numeric"
                maxLength={2}
                value={hours}
                onFocus={() => handleFocus('hours', setHours, hours)}
                onBlur={() => handleBlur('hours', setHours, hours)}
                onChangeText={(value) => handleChange(value, setHours, 24, 'hours', minuteRef)}
                style={textStyles}
              />
              <Text style={unitStyles}>heures</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Input des minutes */}
        <TouchableWithoutFeedback onPress={() => minuteRef.current?.focus()}>
          <View style={containerStyles('minutes')}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={minuteRef}
                placeholder="0"
                placeholderTextColor={Colors.light.mediumGrey}
                keyboardType="numeric"
                maxLength={2}
                value={minutes}
                onFocus={() => handleFocus('minutes', setMinutes, minutes)}
                onBlur={() => handleBlur('minutes', setMinutes, minutes)}
                onChangeText={(value) => handleChange(value, setMinutes, 60, 'minutes', secondRef)}
                style={textStyles}
              />
              <Text style={unitStyles}>min</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Input des secondes */}
        <TouchableWithoutFeedback onPress={() => secondRef.current?.focus()}>
          <View style={containerStyles('seconds')}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={secondRef}
                placeholder="0"
                placeholderTextColor={Colors.light.mediumGrey}
                keyboardType="numeric"
                maxLength={2}
                value={seconds}
                onFocus={() => handleFocus('seconds', setSeconds, seconds)}
                onBlur={() => handleBlur('seconds', setSeconds, seconds)}
                onChangeText={(value) => handleChange(value, setSeconds, 60, 'seconds')}
                style={textStyles}
              />
              <Text style={unitStyles}>sec</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Affichage du message d'erreur */}
      {status === 'error' && errorMessage && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  inputsContainer: {
    backgroundColor: Colors.light.secondaryDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.secondaryDark,
    padding: 8,
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  input: {
    fontSize: 16,
    color: Colors.light.white,
    padding: 0,
    textAlign: 'right',
  },
  unit: {
    fontSize: 14,
    color: Colors.light.mediumGrey,
    marginLeft: 4,
  },
  disabledUnit: {
    color: Colors.light.mediumGrey,
  },
  disabledInput: {
    color: Colors.light.mediumGrey,
  },
  error: {
    borderColor: '#D13F11',
  },
  focused: {
    borderColor: Colors.light.primary,
  },
  errorMessage: {
    color: '#D13F11',
    fontSize: 12,
    marginTop: 4,
  },
});
