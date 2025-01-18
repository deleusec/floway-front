import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "@/constants/Colors";

export default function BackButton({ onPress, title = "Retour" } : { onPress: () => void, title?: string }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-back" size={14} color="black" />
      </View>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.secondaryDark, 
    borderRadius: 100,
    padding: 10,
    alignSelf: "flex-start", 
  },
  iconContainer: {
    backgroundColor: "white",
    width: 18,
    height: 18,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
