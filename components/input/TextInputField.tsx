import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { Colors } from "@/constants/Colors";

interface TextInputFieldProps {
  placeholder?: string;
  multiline?: boolean;
  status?: "default" | "focused" | "error" | "success" | "disabled";
}

const BORDER_COLORS = {
  default: "#3A3A3A",
  focused: "#C0FC95",
  error: "#D13F11",
  success: "#91DC5C",
  disabled: "#5A5A5A",
};

export default function TextInputField({
  placeholder = "0.00",
  multiline = false,
  status = "default",
}: TextInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Appliquer la couleur selon le statut ou le focus
  const borderColor = isFocused
    ? BORDER_COLORS["focused"]
    : BORDER_COLORS[status];

  return (
    <View style={[styles.container, { borderColor }]}>
      
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A5A5A5"
        keyboardType="numeric"
        editable={status !== "disabled"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        style={styles.input}
      />
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
    justifyContent: "center",
  },
  input: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: Colors.light.white,
  },
});
