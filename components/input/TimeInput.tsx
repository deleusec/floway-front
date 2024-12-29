import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

interface TimeInputFieldProps {
  placeholder: string;
  status?: "active" | "deactivate" | "error";
  unit: "heures" | "min" | "sec";
}

export default function TimeInputField({
  placeholder,
  status = "active",
  unit,
}: TimeInputFieldProps) {
  const [value, setValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleTextChange = (newValue: string) => {
    // Limite l'entrée à des nombres entre 0 et 59
    if (/^\d{0,2}$/.test(newValue)) {
      const numValue = parseInt(newValue, 10);
      if (!isNaN(numValue) && (unit === "heures" || numValue < 60)) {
        setValue(newValue);
      } else if (newValue === "") {
        setValue("");
      }
    }
  };

  const containerStyles = [
    styles.container,
    status === "deactivate" && styles.deactivate,
    status === "error" && styles.error,
    isFocused && styles.focused,
  ];

  return (
    <View style={containerStyles}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        keyboardType="numeric"
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={handleTextChange}
        style={[styles.input, status === "deactivate" && styles.disabledInput]}
        editable={status !== "deactivate"}
      />
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2D36",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  deactivate: {
    borderColor: "#5A5A5A",
  },
  error: {
    borderColor: "#D13F11",
  },
  focused: {
    borderColor: "#C0FC95",
  },
  input: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  disabledInput: {
    color: "#5A5A5A",
  },
  unit: {
    fontSize: 14,
    color: "#A5A5A5",
    marginLeft: 5,
  },
});
