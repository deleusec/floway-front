import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import TextInputField from "@/components/input/TextInputField"; // Remplace par le chemin réel


export default function TextInputFieldDemo() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TextInputField Component Demo</Text>

      <View style={styles.exampleContainer}>
        <Text style={styles.subtitle}>Default</Text>
        <TextInputField placeholder="0.00" status="default" />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subtitle}>Focused</Text>
        <TextInputField placeholder="0.00" status="focused" />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subtitle}>Error</Text>
        <TextInputField placeholder="Entre un texte" status="error" />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subtitle}>Success</Text>
        <TextInputField placeholder="0.00" status="success" />
      </View>

      <View style={styles.exampleContainer}>
        <Text style={styles.subtitle}>Disabled</Text>
        <TextInputField placeholder="0.00" status="disabled" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E24", // Arrière-plan de la page
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  exampleContainer: {
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 5,
  },
});
