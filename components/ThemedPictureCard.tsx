import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface PictureCardProps {
  title: string; // Titre principal
  subtitle?: string; // Sous-titre (optionnel)
  metrics?: string[]; // Liste de métriques (ex : temps, distance, calories)
  image?: ImageSourcePropType; // Image à afficher
  onPress?: () => void; // Action au clic
  style?: ViewStyle; // Style personnalisé
  isSelected?: boolean; // Indique si la carte est sélectionnée
}

export const PictureCard: React.FC<PictureCardProps> = ({
  title,
  subtitle,
  metrics,
  image,
  onPress,
  style,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.selectedCard, // Appliquer le style sélectionné
        style,
      ]}
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
          <View
            style={[
              styles.metricsContainer,
              subtitle
                ? styles.metricsContainerWithSubtitle
                : styles.metricsContainerWithoutSubtitle,
            ]}>
            {metrics.map((metric, index) => (
              <Text
                key={index}
                style={[subtitle ? styles.metricWithSubtitle : styles.metricWithoutSubtitle]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Pour Android
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: Colors.light.primary, // Bordure verte pour l'état sélectionné
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 64,
  },
  title: {
    fontSize: 16,
    color: Colors.light.white,
    fontFamily: 'Poppins-Medium',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.lightGrey,
    fontFamily: 'Poppins-Regular',
  },
  metricsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metricsContainerWithSubtitle: {
    justifyContent: 'flex-start', // Alignement à gauche si un subtitle est présent
    gap: 12,
  },
  metricsContainerWithoutSubtitle: {
    gap: 22,
    color: Colors.light.white,
  },
  metricWithoutSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.white,
  },
  metricWithSubtitle: {
    fontSize: 12,
    color: Colors.light.mediumGrey,
  },
});
