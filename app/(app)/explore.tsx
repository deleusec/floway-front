import React from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import TimeInputField from "@/components/input/TimeInput";

export default function TimeInputDemo() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>TimeInputField Component Demo</Text>

      <Text style={styles.sectionTitle}>Active Inputs</Text>
      <View style={styles.row}>
        <TimeInputField placeholder="00" unit="heures" />
        <TimeInputField placeholder="00" unit="min" />
        <TimeInputField placeholder="00" unit="sec" />
      </View>

      <Text style={styles.sectionTitle}>Disabled Inputs</Text>
      <View style={styles.row}>
        <TimeInputField placeholder="00" unit="heures" status="deactivate" />
        <TimeInputField placeholder="00" unit="min" status="deactivate" />
        <TimeInputField placeholder="00" unit="sec" status="deactivate" />
      </View>

      <Text style={styles.sectionTitle}>Error State</Text>
      <View style={styles.row}>
        <TimeInputField placeholder="00" unit="heures" status="error" />
        <TimeInputField placeholder="00" unit="min" status="error" />
        <TimeInputField placeholder="00" unit="sec" status="error" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E24",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "white",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 15,
  },
});
