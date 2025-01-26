import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
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
  hidePlaceholder?: boolean;
}

export default function SelectInput({
  options,
  placeholder = 'Sélectionner',
  status = 'active',
  onValueChange,
  value,
  label,
  hidePlaceholder = false,
}: SelectInputProps) {
  const [selectedValue, setSelectedValue] = useState<string>(value || '');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    if (hidePlaceholder && !selectedValue && options.length > 0) {
      const defaultValue = options[0];
      setSelectedValue(defaultValue);
      onValueChange?.(defaultValue);
    }
  }, [hidePlaceholder, options]);

  const handleValueChange = (itemValue: string) => {
    setSelectedValue(itemValue);
    if (onValueChange) {
      onValueChange(itemValue);
    }
    setIsPickerVisible(false);
  };

  const containerStyles = [
    styles.container,
    status === 'disabled' && styles.disabled,
    status === 'error' && styles.error,
  ];

  const renderIOSPicker = () => (
    <>
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
      <Modal visible={isPickerVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
            <Picker
              selectedValue={selectedValue}
              onValueChange={handleValueChange}
              style={styles.pickerIOS}>
              {!hidePlaceholder && (
                <Picker.Item label={placeholder} value="" color={Colors.dark.mediumGrey} />
              )}
              {options.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} color={Colors.light.white} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </>
  );

  const renderCustomAndroidPicker = () => (
    <>
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
      <Modal visible={isPickerVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.androidModalContent}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable style={styles.androidOption} onPress={() => handleValueChange(item)}>
                  <Text
                    style={[
                      styles.androidOptionText,
                      { color: item === selectedValue ? Colors.light.primary : Colors.light.white },
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              )}
              ListHeaderComponent={
                !hidePlaceholder ? (
                  <Pressable style={styles.androidOption} onPress={() => handleValueChange('')}>
                    <Text style={[styles.androidOptionText, { color: Colors.dark.mediumGrey }]}>
                      {placeholder}
                    </Text>
                  </Pressable>
                ) : null
              }
            />
            <TouchableOpacity
              style={[styles.closeButton, { alignSelf: 'center', marginTop: 10 }]}
              onPress={() => setIsPickerVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      {Platform.OS === 'ios' ? renderIOSPicker() : renderCustomAndroidPicker()}
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.secondaryDark,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: Colors.light.secondaryDark,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  pickerIOS: {
    width: '100%',
    backgroundColor: Colors.light.secondaryDark,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.light.white,
    fontSize: 16,
  },
  androidModalContent: {
    backgroundColor: Colors.light.secondaryDark,
    padding: 16,
    borderRadius: 12,
  },
  androidOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.mediumGrey,
  },
  androidOptionText: {
    color: Colors.light.white,
    fontSize: 16,
  },
});
