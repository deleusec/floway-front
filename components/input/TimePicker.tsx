import React from 'react';
import { StyleSheet, View } from 'react-native';
import TimeInputField from './TimeInput';

interface TimePickerProps {
  initialTime?: { heures: string; min: string; sec: string };
  onTimeChange?: (time: { heures: string; min: string; sec: string }) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  initialTime = { heures: '00', min: '00', sec: '00' },
  onTimeChange,
}) => {
  const [timeValues, setTimeValues] = React.useState(initialTime);

  const handleInputChange = (value: string, unit: 'heures' | 'min' | 'sec') => {
    const updatedTime = { ...timeValues, [unit]: value };

    setTimeValues(updatedTime);
    onTimeChange?.(updatedTime);
  };

  return (
    <View style={styles.container}>
      <TimeInputField
        placeholder="00"
        unit="heures"
        value={timeValues.heures}
        onChange={(value) => handleInputChange(value, 'heures')}
      />
      <TimeInputField
        placeholder="00"
        unit="min"
        value={timeValues.min}
        onChange={(value) => handleInputChange(value, 'min')}
      />
      <TimeInputField
        placeholder="00"
        unit="sec"
        value={timeValues.sec}
        onChange={(value) => handleInputChange(value, 'sec')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
});

export default TimePicker;
