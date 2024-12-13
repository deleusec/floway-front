import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { PictureCard } from "@/components/ThemedPictureCard";// Réutilise ton composant générique de carte
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Section utilisateur */}
      <View style={styles.userSection}>
        <View style={styles.userInfo}>
          <Image
            source={require("@/assets/images/start.jpg")} // Exemple d'image utilisateur
            style={styles.userImage}
          />
          <View>
            <Text style={styles.greeting}>Bonjour Corentin</Text>
            <Text style={styles.readyText}>Prêt à courir ?</Text>
          </View>
        </View>
        <View style={styles.settingsIcon}>
          <Image
            source={require("@/assets/images/start.jpg")} // Remplace par ton icône
            style={styles.icon}
          />
        </View>
      </View>

      {/* Section statistique */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Cette semaine...</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Tu as parcouru</Text>
            <Text style={styles.statValue}>18 km</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Tu as brûlé</Text>
            <Text style={styles.statValue}>2478 kcal</Text>
          </View>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Tu as démarré</Text>
          <Text style={styles.statValue}>8 sessions</Text>
        </View>
      </View>

      {/* Section courses récentes */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Courses récentes</Text>
        <PictureCard
          title="Hier, course de 7km"
          metrics={["45 min", "232kcal", "5'10''"]}
          image={require("@/assets/images/start.jpg")} // Exemple d'image
        />
        <PictureCard
          title="Hier, course de 7km"
          metrics={["45 min", "232kcal", "5'10''"]}
          image={require("@/assets/images/start.jpg")} // Exemple d'image
        />
        <PictureCard
          title="Hier, course de 7km"
          metrics={["45 min", "232kcal", "5'10''"]}
          image={require("@/assets/images/start.jpg")} // Exemple d'image
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: Colors.dark.primaryDark,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    fontFamily: "Poppins-Light",
    color: Colors.light.mediumGrey,
  },
  readyText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: Colors.light.white,
  },
  settingsIcon: {
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.light.white,
  },
  statsSection: {
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: Colors.light.white,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 24,
  },
  statBlock: {},
  statValue: {
    fontSize: 26,
    fontFamily: "Poppins-SemiBold",
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: Colors.light.lightGrey,
  },
  recentSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.light.white,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
});
