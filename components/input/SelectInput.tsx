import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';

interface SelectInputProps {
  options: string[];
  placeholder?: string;
  status?: 'active' | 'error' | 'disabled';
  onValueChange?: (value: string) => void;
  value?: string;
  label?: string;
}

export default function SelectInput({
  options,
  placeholder = 'Sélectionner',
  status = 'active',
  onValueChange,
  value,
  label,
}: SelectInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(value || '');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleValueChange = (itemValue: string) => {
    setSelectedValue(itemValue);
    if (onValueChange) {
      onValueChange(itemValue);
    }
    if (Platform.OS === 'ios') {
      setIsPickerVisible(false);
    }
  };

  const containerStyles = [
    styles.container,
    status === 'disabled' && styles.disabled,
    status === 'error' && styles.error,
  ];

  const renderIOSPicker = () => (
    <View>
      <Pressable
        style={containerStyles}
        onPress={() => status !== 'disabled' && setIsPickerVisible(true)}>
        <Text
          style={[
            styles.selectedText,
            status === 'disabled' && styles.disabledText,
            !selectedValue && styles.placeholderText,
          ]}>
          {selectedValue || placeholder}
        </Text>
        <AntDesign
          name="down"
          size={20}
          color={status === 'disabled' ? Colors.light.mediumGrey : Colors.light.white}
        />
      </Pressable>
      {isPickerVisible && (
        <View style={styles.pickerModalIOS}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={handleValueChange}
            enabled={status !== 'disabled'}
            style={styles.pickerIOS}>
            <Picker.Item label={placeholder} value="" color={Colors.light.mediumGrey} />
            {options.map((option, index) => (
              <Picker.Item key={index} label={option} value={option} color={Colors.light.white} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );

  const renderAndroidPicker = () => (
    <View style={containerStyles}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
        enabled={status !== 'disabled'}
        style={styles.pickerAndroid}
        dropdownIconColor={status === 'disabled' ? Colors.light.mediumGrey : Colors.light.white}>
        <Picker.Item label={placeholder} value="" color={Colors.light.mediumGrey} />
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} color={Colors.light.primaryDark} />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      {Platform.OS === 'ios' ? renderIOSPicker() : renderAndroidPicker()}
      {status === 'error' && <Text style={styles.errorText}>Error message</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    backgroundColor: Colors.light.secondaryDark,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    borderColor: Colors.light.error,
    borderWidth: 2,
  },
  selectedText: {
    color: Colors.light.white,
    fontSize: 16,
  },
  placeholderText: {
    color: Colors.light.mediumGrey,
  },
  disabledText: {
    color: Colors.light.mediumGrey,
  },
  pickerAndroid: {
    width: '100%',
    height: 50,
    color: Colors.light.white,
  },
  pickerIOS: {
    width: '100%',
    backgroundColor: Colors.light.secondaryDark,
  },
  pickerModalIOS: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.secondaryDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    color: Colors.light.white,
    marginBottom: 8,
    fontSize: 14,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: 4,
  },
});
