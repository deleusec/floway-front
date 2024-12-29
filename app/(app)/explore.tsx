import React from "react";
import { View, StyleSheet } from "react-native";
import DistanceInput from "@/components/input/DistanceInput";

export default function App() {
  return (
    <View style={styles.container}>
      <DistanceInput status="default" />
      <DistanceInput status="focused" />
      <DistanceInput status="error" />
      <DistanceInput status="disabled" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    gap:20
  },
});
