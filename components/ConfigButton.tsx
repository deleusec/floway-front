import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface ButtonProps {
  text: string; // Texte du bouton
  state: "default" | "disabled" | "selected"; // États du bouton
  icon?: ImageSourcePropType; // Icône à afficher
  onPress?: () => void; // Action au clic
  style?: ViewStyle; // Style personnalisé
}

export const CustomButton: React.FC<ButtonProps> = ({
  text,
  state,
  icon,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        state === "disabled" && styles.disabledButton,
        state === "selected" && styles.selectedButton,
        style,
      ]}
      onPress={onPress}
      disabled={state === "disabled"}
    >
      {/* Icône à gauche */}
      {icon && <Image source={icon} style={styles.icon} />}

      {/* Texte du bouton */}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Pour Android
  },
  disabledButton: {
    backgroundColor: Colors.light.lightGrey,
    cursor: "not-allowed",
    opacity: 0.6,
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: Colors.light.primaryDark, // Bordure pour l'état sélectionné
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.light.white,
    fontFamily: "Poppins-Medium",
  },
});

export default CustomButton;
