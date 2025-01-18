import BackButton from "@/components/button/BackButton";
import ThemedButton from "@/components/button/ThemedButton";
import DistanceInput from "@/components/input/DistanceInput";
import SelectInput from "@/components/input/SelectInput";
import TextInputField from "@/components/input/TextInputField";
import TimeInputField from "@/components/input/TimeInput";
import { ThemedText } from "@/components/text/ThemedText";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function CreateRunScreen() {
  const [goalType, setGoalType] = useState<string>("Temps");

  useEffect(() => {
    console.log("Goal type changed to", goalType);
  }, [goalType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView pour gérer le clavier */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Contenu défilable */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.backButton}>
            <BackButton onPress={() => console.log("Retour")} />
          </View>

          <View style={styles.header}>
            <ThemedText type="title">Créer ma Run Guidée</ThemedText>
          </View>

          <View style={styles.field}>
            <ThemedText type="default">Titre de la Run</ThemedText>
            <TextInputField placeholder="Ma première Run guidée" />
          </View>

          <View style={styles.field}>
            <ThemedText type="default">Type de l'objectif</ThemedText>
            <View style={{ gap: 20 }}>
              <SelectInput
                options={["Temps", "Distance"]}
                onValueChange={setGoalType}
                value={goalType}
              />
              {goalType === "Temps" ? (
                <View style={styles.row}>
                  <TimeInputField placeholder="00" unit="heures" />
                  <TimeInputField placeholder="00" unit="min" />
                  <TimeInputField placeholder="00" unit="sec" />
                </View>
              ) : (
                <DistanceInput
                  placeholder={"0.00"}
                  status={"default"}
                  unit={"km"}
                />
              )}
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText type="default">Description de la Run</ThemedText>
            <TextInputField
              placeholder="Une petite description de ma Run guidée"
              multiline
            />
          </View>
        </ScrollView>

        {/* Bouton "Suivant" */}
        <View style={styles.footer}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ThemedButton
            title="Suivant"
            buttonSize="medium"
            buttonType="confirm"
            buttonState="default"
            onPress={() => console.log("Suivant")}
          />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 80, 
  },
  backButton: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  field: {
    gap: 6,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 24,
    right: 24,
    zIndex: 10,
  },
});
