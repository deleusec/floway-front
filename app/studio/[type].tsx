import BackButton from '@/components/button/BackButton';
import AudioCard from '@/components/cards/AudioCard';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { useStudioContext } from '@/context/StudioContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function StudioByType() {
  const navigation = useLocalSearchParams();
  const { studioData } = useStudioContext();
  const { goalType, timeValues, goalDistance } = studioData;
  console.log(navigation);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <BackButton />
          </View>
          <View style={styles.iconContainer}>
            <TabBarIcon name="information-circle-outline" color={Colors.dark.primary} />
          </View>
        </View>

        <ThemedText type="title">Mes audios</ThemedText>
        <ThemedText type="legend" style={styles.audiosEmpty}>
          Aucun audio n’a été ajouté. Créez ou importez le votre en cliquant ci-dessous !
        </ThemedText>
        <AudioCard id={1} title="Audio 1" duration={120} start_time={"00:00:00"} />
      </ScrollView>
      <View style={styles.timelineContainer}>
        {/* Player */}
        <Text>{goalType}</Text>
        <Text>{timeValues.heures} h {timeValues.min} min {timeValues.sec} sec</Text>
        <Text>{goalDistance}</Text>

        <View style={styles.controls}>
          <Ionicons name="trash-outline" size={20} color="white" />
          <Ionicons name="create-outline" size={20} color="white" />
          <Ionicons name="play" size={24} color="white" />
          <Ionicons name="mic-outline" size={20} color="white" />
          <Ionicons name="save-outline" size={20} color="white" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  scrollContainer: {
    flexGrow: 2,
    padding: 24,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audiosEmpty: {
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  timelineContainer: {
    flexGrow: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.dark.secondaryDark,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  timelineWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  graduation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  graduationText: {
    fontSize: 12,
    color: 'white',
  },
  timeline: {
    height: 4,
    backgroundColor: 'white',
    width: '100%',
    position: 'relative',
    borderRadius: 2,
  },
  cursor: {
    position: 'absolute',
    top: -16,
    width: 24,
    height: 24,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cursorText: {
    fontSize: 10,
    color: 'white',
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
