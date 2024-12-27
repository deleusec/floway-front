
import { StyleSheet, Image, Platform } from 'react-native';

import { ThemedButton } from "@/components/ThemedButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Bouton Large */}
      <ThemedButton
        title="Créer un compte"
        buttonSize="large"
        buttonState="default"
      />

      {/* Bouton Large désactivé */}
      <ThemedButton
        title="Créer un compte"
        buttonSize="large"
        buttonState="disabled"
      />

      {/* Bouton Large avec chargement */}
      <ThemedButton
        title="Créer un compte"
        buttonSize="large"
        buttonState="loading"
      />

      {/* Bouton Medium */}
      <ThemedButton title="Suivant" buttonSize="medium" buttonState="default" />

      {/* Bouton Small */}
      <ThemedButton title="Suivant" buttonSize="small" buttonState="default" />

      {/* Bouton Small Cancel */}
      <ThemedButton
        title="Annuler"
        buttonSize="small"
        buttonType="cancel"
        buttonState="default"
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
