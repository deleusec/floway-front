import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TimeInputsProps {
  totalSeconds: number;
  onChange: (seconds: number) => void;
  status?: 'active' | 'deactivate' | 'error';
}

export default function TimeInputs({
  totalSeconds,
  onChange,
  status = 'active',
}: TimeInputsProps) {
  const [hours, setHours] = useState(() =>
    Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0'),
  );
  const [minutes, setMinutes] = useState(() =>
    Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0'),
  );
  const [seconds, setSeconds] = useState(() => (totalSeconds % 60).toString().padStart(2, '0'));

  const [focusedField, setFocusedField] = useState<'hours' | 'minutes' | 'seconds' | null>(null);

  const minuteRef = useRef<TextInput>(null);
  const secondRef = useRef<TextInput>(null);

  const handleFocus = (field: 'hours' | 'minutes' | 'seconds', setter: (value: string) => void, value: string) => {
    setFocusedField(field);
    if (value === '00') {
      setter('');
    }
  };

  const handleBlur = (field: 'hours' | 'minutes' | 'seconds', setter: (value: string) => void, value: string) => {
    if (focusedField === field) {
      setFocusedField(null);
    }
    if (value === '' || value === '0') {
      setter('00');
    } else if (value.length === 1) {
      setter(value.padStart(2, '0'));
    }
    updateTotalSeconds();
  };

  const handleNextField = (value: string, max: number, nextRef: React.RefObject<TextInput>) => {
    if (parseInt(value, 10) >= max) {
      value = (max - 1).toString();
    }
    if (value.length === 2 && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const updateTotalSeconds = () => {
    const total = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    onChange(total);
  };

  const containerStyles = (field: 'hours' | 'minutes' | 'seconds') => [
    styles.container,
    focusedField === field && styles.focused,
  ];

  const textStyles = [
    styles.input,
    status === 'deactivate' && styles.disabledInput,
  ];

  const unitStyles = [
    styles.unit,
    status === 'deactivate' && styles.disabledUnit,
  ];

  return (
    <View style={styles.wrapper}>
      <View style={containerStyles('hours')}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="00"
            placeholderTextColor={Colors.light.mediumGrey}
            keyboardType="numeric"
            maxLength={2}
            value={hours}
            onFocus={() => handleFocus('hours', setHours, hours)}
            onBlur={() => handleBlur('hours', setHours, hours)}
            onChangeText={(value) => {
              setHours(value.replace(/[^0-9]/g, ''));
              handleNextField(value, 24, minuteRef);
            }}
            style={textStyles}
          />
          <Text style={unitStyles}>heures</Text>
        </View>
      </View>
      <View style={containerStyles('minutes')}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={minuteRef}
            placeholder="00"
            placeholderTextColor={Colors.light.mediumGrey}
            keyboardType="numeric"
            maxLength={2}
            value={minutes}
            onFocus={() => handleFocus('minutes', setMinutes, minutes)}
            onBlur={() => handleBlur('minutes', setMinutes, minutes)}
            onChangeText={(value) => {
              setMinutes(value.replace(/[^0-9]/g, ''));
              handleNextField(value, 60, secondRef);
            }}
            style={textStyles}
          />
          <Text style={unitStyles}>min</Text>
        </View>
      </View>
      <View style={containerStyles('seconds')}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={secondRef}
            placeholder="00"
            placeholderTextColor={Colors.light.mediumGrey}
            keyboardType="numeric"
            maxLength={2}
            value={seconds}
            onFocus={() => handleFocus('seconds', setSeconds, seconds)}
            onBlur={() => handleBlur('seconds', setSeconds, seconds)}
            onChangeText={(value) => setSeconds(value.replace(/[^0-9]/g, ''))}
            style={textStyles}
          />
          <Text style={unitStyles}>sec</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  container: {
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
  focused: {
    borderColor: Colors.light.primary,
  },
});
