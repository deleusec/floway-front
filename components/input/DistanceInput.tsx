import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Colors } from "@/constants/Colors";

interface DistanceInputProps {
  placeholder?: string; // Placeholder par défaut
  status: "default" | "focused" | "error" | "disabled"; // États possibles
  unit?: string; // Unité à afficher (par défaut "km")
}

export default function DistanceInput({
  placeholder = "0.00", // Valeur par défaut du placeholder
  status,
  unit = "km", // Unité par défaut
}: DistanceInputProps) {
  const [value, setValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isDisabled = status === "disabled";

  return (
    <View
      style={[
        styles.container,
        status === "error" && styles.error,
        isFocused && styles.focused,
        isDisabled && styles.disabled,
      ]}
    >
      <TextInput
        style={[styles.input, isDisabled && styles.inputDisabled]}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        keyboardType="numeric"
        editable={!isDisabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Text style={[styles.unit, isDisabled && styles.inputDisabled]}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.secondaryDark,
    borderWidth: 1,
    borderColor: "#4F4F4F",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: "100%",
  },
  focused: {
    borderColor: Colors.light.primary,
  },
  error: {
    borderColor: Colors.light.error,
  },
  disabled: {
    backgroundColor: "#2A2D3699",
  },
  input: {
    flex: 1,
    color: Colors.light.white,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  inputDisabled: {
    color: Colors.light.mediumGrey,
  },
  unit: {
    fontSize: 14,
    color: Colors.light.white,
    marginLeft: 8,
    fontFamily: "Poppins-Medium",
  },
});
