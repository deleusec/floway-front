import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/text/ThemedText";
import { Tabs } from "@/components/tabs/Tabs";
import { PictureCard } from "@/components/ThemedPictureCard";

interface Run {
  title: string;
  metrics: string[];
  image: any;
  onPress: () => void;
}

export default function AllRunsScreen() {
  const [activeTab, setActiveTab] = React.useState("audio");
  const [audioRuns, setAudioRuns] = React.useState<Run[]>([]);
  const [programs, setPrograms] = React.useState<Run[]>([]);

  const tabs = [
    { key: "audio", label: "Audio" },
    { key: "program", label: "Programmes" },
  ];

  React.useEffect(() => {
    // Récupérer les runs audio de l'utilisateur
    // Remplace par ta logique de récupération des runs audio
    setAudioRuns([
      {
        title: "Course matinale",
        metrics: ["45 min", "232kcal", "5'10''"],
        image: require("@/assets/images/start.jpg"),
        onPress: () => {},
      },
      {
        title: "Course du soir",
        metrics: ["30 min", "150kcal", "4'50''"],
        image: require("@/assets/images/start.jpg"),
        onPress: () => {},
      },
    ]);
  }, []);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={{ color: "white" }}>
            Mes runs guidées
          </ThemedText>
          <Image source={require("@/assets/images/add.png")} />
        </View>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenu en fonction de l'onglet actif */}
        {activeTab === "audio" ? (
          <View style={styles.content}>
            {audioRuns.length > 0 ? (
              audioRuns.map((run) => (
                <PictureCard
                  key={run.title}
                  title={run.title}
                  metrics={run.metrics}
                  image={run.image}
                  onPress={run.onPress}
                />
              ))
            ) : (
              <ThemedText type="legend" style={styles.contentText}>
                Vous ne possédez aucune audio. Créez en une nouvelle en cliquant
                sur le bouton ci-dessous.
              </ThemedText>
            )}
          </View>
        ) : (
          <View style={styles.content}>
            {programs.length > 0 ? (
              <View>
                {/* TODO: Afficher les programmes de l'utilisateur */}
              </View>
            ) : (
              <ThemedText type="legend" style={styles.contentText}>
                Vous ne possédez aucun programme. Créez en un nouveau en
                cliquant sur le bouton ci-dessous.
              </ThemedText>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: Colors.dark.primaryDark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  content: {
    marginTop: 16,
    flex: 1,
    alignItems: "center",
  },
  contentText: {
    padding: 16,
    textAlign: "center",
  },
});
