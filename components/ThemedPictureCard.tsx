import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface PictureCardProps {
  title: string; // Titre principal
  subtitle?: string; // Sous-titre (optionnel)
  metrics?: string[]; // Liste de métriques (ex : temps, distance, calories)
  image?: ImageSourcePropType; // Image à afficher
  onPress?: () => void; // Action au clic
  style?: ViewStyle; // Style personnalisé
}

export const PictureCard: React.FC<PictureCardProps> = ({
  title,
  subtitle,
  metrics,
  image,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      disabled={!onPress} // Désactive le clic si aucune action n'est fournie
    >
      {/* Image à gauche */}
      {image && <Image source={image} style={styles.image} />}

      {/* Contenu principal */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        )}
        {metrics && (
          <View style={styles.metricsContainer}>
            {metrics.map((metric, index) => (
              <Text key={index} style={styles.metric}>
                {metric}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Pour Android
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.white,
    fontFamily: "Poppins_Medium",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.lightGrey,
    fontFamily: "Poppins_Regular",
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    fontSize: 12,
    color: Colors.light.mediumGrey,
  },
});