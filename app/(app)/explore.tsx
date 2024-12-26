
import { StyleSheet, Image, Platform } from 'react-native';

import { CustomButton } from "@/components/ConfigButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
        <CustomButton
          text="Default Button"
          state="default"
          onPress={() => alert("Default Button Pressed")}
          style={styles.button}
        />
        <CustomButton
          text="Disabled Button"
          state="disabled"
          style={styles.button}
        />
        <CustomButton
          text="Selected Button"
          state="selected"
          onPress={() => alert("Selected Button Pressed")}
          style={styles.button}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.primaryDark,
  },
  button: { marginVertical: 10 },
});
