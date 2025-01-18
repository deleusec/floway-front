import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { TabBarIcon } from "./navigation/TabBarIcon";

export default function AppMenu() {
  return (
    <View style={styles.container}>
      {/* Wave Background */}
      <View style={styles.wave}>
        <Image source={require("@/assets/images/wave.png")} />
      </View>

      {/* Home Link */}
      <View style={styles.navLinkContainer}>
        <Link href="/" style={styles.navLink}>
          <Image source={require("@/assets/images/home-active.png")} />
        </Link>
      </View>

      {/* Play Button */}
      <View style={styles.playButtonContainer}>
        <Link href="/start" style={styles.playButton}>
          <Image source={require("@/assets/images/play-button.png")} />
        </Link>
      </View>

      {/* All Runs Link */}
      <View style={styles.navLinkContainer}>
        <Link href="/all-runs" style={styles.navLink}>
          <Image source={require("@/assets/images/headphone.png")} />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.secondaryDark,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 90,
  },
  navLinkContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navLink: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  playButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateY: -5 }],
  },
  playButton: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    bottom: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
