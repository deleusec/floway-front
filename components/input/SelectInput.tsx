import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectInputProps {
  options: string[];
  placeholder?: string;
  status: "default" | "active" | "error" | "disabled";
}

export default function SelectInput({
  options,
  placeholder,
  status,
}: SelectInputProps) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );

  const isDisabled = status === "disabled";

  return (
    <View
      style={[
        styles.container,
        status === "error" && styles.error,
        isDisabled && styles.disabled,
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
        enabled={!isDisabled}
        style={[styles.picker, isDisabled && styles.pickerDisabled]}
      >
        {placeholder && (
          <Picker.Item label={placeholder} value="" enabled={false} />
        )}
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
      {status === "error" && (
        <Text style={styles.errorText}>Error message</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2A2D36",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  picker: {
    color: "#FFFFFF",
    backgroundColor: "#2A2D36",
  },
  pickerDisabled: {
    color: "#A5A5A5",
  },
  error: {
    borderColor: "#D13F11",
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    color: "#D13F11",
    fontSize: 12,
    marginTop: 4,
  },
});
