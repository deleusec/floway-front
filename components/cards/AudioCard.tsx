import { Colors } from '@/constants/Colors';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../text/ThemedText';

interface AudioCardProps {
  id: number;
  title: string;
  duration: number;
  start_time: string;
  onPress?: () => void;
  isSelected?: boolean;
}

export default function AudioCard({ id, title, duration, start_time, onPress, isSelected = false }: AudioCardProps) {
  return (
    <Pressable style={[styles.card, isSelected && styles.cardSelected]} onPress={onPress} >
      <View style={styles.cardHeader}>
        <View style={styles.idCircle}>
          <ThemedText type="default" style={styles.idText}>{id}</ThemedText>
        </View>
        <ThemedText type="default">{title}</ThemedText>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <ThemedText type="default" style={styles.detailLabel}>Durée </ThemedText>
          <ThemedText type="default" style={styles.detailValue}>{duration} sec</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText type="default" style={styles.detailLabel}>Début à </ThemedText>
          <ThemedText type="default" style={styles.detailValue}>{start_time}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    shadowColor: Colors.dark.primaryDark,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.dark.secondaryDark,
  },
  cardSelected: {
    borderWidth: 1,
    borderColor: Colors.dark.primary,

    shadowColor: Colors.dark.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLabel: {
    color: Colors.dark.white,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16,
  },
  detailValue: {
    color: Colors.dark.white,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
  },
  idCircle: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primaryDark,
  },
  idText: {
    color: Colors.dark.white,
    fontSize: 12,
    lineHeight: 14,
  },
});
