import { LinearGradient } from 'expo-linear-gradient'; // Import du gradient
import BackButton from '@/components/button/BackButton';
import AudioCard from '@/components/cards/AudioCard';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { useStudioContext } from '@/context/StudioContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import ThemedButton from '@/components/button/ThemedButton';
import CustomModal from '@/components/modal/CustomModal';
import TextInputField from '@/components/input/TextInputField';
import TimeInputField from '@/components/input/TimeInput';
import DistanceInput from '@/components/input/DistanceInput';

interface Audio {
  id: number;
  title: string;
  duration: number;
  start_time: string;
}

export default function StudioByType() {
  const [audioList, setAudioList] = useState<Audio[]>([]);
  const [playerState, setPlayerState] = useState<'playing' | 'paused'>('paused');
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [isCustomAudioModalVisible, setIsCustomAudioModalVisible] = useState(false);

  const navigation = useLocalSearchParams();
  const { studioData } = useStudioContext();

  const { type } = navigation;
  const { goalType, timeValues, goalDistance } = studioData;

  useEffect(() => {
    setAudioList([
      {
        id: 1,
        title: 'Audio 1',
        duration: 120,
        start_time: '00:00:00',
      },
      {
        id: 2,
        title: 'Audio 2',
        duration: 180,
        start_time: '00:02:00',
      },
      {
        id: 3,
        title: 'Audio 3',
        duration: 240,
        start_time: '00:05:00',
      },
      {
        id: 4,
        title: 'Audio 4',
        duration: 300,
        start_time: '00:09:00',
      },
      {
        id: 5,
        title: 'Audio 5',
        duration: 360,
        start_time: '00:14:00',
      },
      {
        id: 6,
        title: 'Audio 6',
        duration: 420,
        start_time: '00:20:00',
      },
      {
        id: 7,
        title: 'Audio 7',
        duration: 480,
        start_time: '00:27:00',
      },
      {
        id: 8,
        title: 'Audio 8',
        duration: 540,
        start_time: '00:35:00',
      },
      {
        id: 9,
        title: 'Audio 9',
        duration: 600,
        start_time: '00:44:00',
      },
      {
        id: 10,
        title: 'Audio 10',
        duration: 660,
        start_time: '00:54:00',
      },
    ]);
  }, []);

  const handleSubmit = () => {
    console.log('Submit');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View>
            <BackButton />
          </View>
          <View style={styles.infoIcon}>
            <TabBarIcon name="information-circle-outline" color={Colors.dark.primary} />
          </View>
        </View>

        <ThemedText type="title">Mes audios</ThemedText>
        <View style={styles.audioListWrapper}>
          <LinearGradient
            colors={[Colors.dark.primaryDark, 'transparent']}
            style={styles.topGradient}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.audioList}
            contentContainerStyle={styles.audioListContent}>
            <View style={styles.audioListContent}>
              {audioList.length > 0 ? (
                audioList.map((audio) => (
                  <AudioCard
                    key={audio.id}
                    id={audio.id}
                    title={audio.title}
                    duration={audio.duration}
                    start_time={audio.start_time}
                    isSelected={selectedAudio === audio.id}
                    onPress={() => setSelectedAudio(audio.id === selectedAudio ? null : audio.id)}
                  />
                ))
              ) : (
                <ThemedText type="legend" style={styles.emptyMessage}>
                  Aucun audio n’a été ajouté. Créez ou importez le votre en cliquant ci-dessous !
                </ThemedText>
              )}
            </View>
          </ScrollView>
          <LinearGradient
            colors={['transparent', Colors.dark.primaryDark]}
            style={styles.bottomGradient}
          />
        </View>
      </View>
      <View style={styles.timelineSection}>
        {/* Player */}
        <View style={styles.actionBarContainer}>
          <View style={styles.actionBar}>
            <View style={styles.actionBarElement}>
              <Ionicons
                name="trash"
                size={20}
                color="white"
                style={[selectedAudio === null && { opacity: 0.4 }]}
              />
              <Ionicons
                name="create"
                size={20}
                color="white"
                style={[selectedAudio === null && { opacity: 0.4 }]}
                onPress={() => setIsCustomAudioModalVisible(true)}
              />
            </View>
            <View style={styles.actionBarElement}>
              <Ionicons name="play-back" size={20} color="white" />
              {playerState === 'playing' ? (
                <Ionicons
                  name="pause"
                  size={24}
                  color="white"
                  onPress={() => setPlayerState('paused')}
                />
              ) : (
                <Ionicons
                  name="play"
                  size={24}
                  color="white"
                  onPress={() => setPlayerState('playing')}
                />
              )}
              <Ionicons name="play-forward" size={20} color="white" />
            </View>
            <View style={styles.actionBarElement}>
              <Ionicons name="mic" size={20} color="white" />
              <Ionicons name="file-tray" size={20} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerButtonWrapper}>
            <ThemedButton
              title="Sauvegarder"
              buttonSize="medium"
              buttonType="confirm"
              buttonState="default"
              onPress={() => handleSubmit()}
            />
          </View>
        </View>
      </View>

      <CustomModal
        visible={isCustomAudioModalVisible}
        cancelButton={true}
        confirmButton={true}
        confirmAction={() => setIsCustomAudioModalVisible(false)}
        onClose={() => setIsCustomAudioModalVisible(false)}>
        <View style={styles.modalContent}>
          <View style={styles.modalInputGroup}>
            <ThemedText type="default">Titre</ThemedText>
            <TextInputField placeholder="Titre de l’audio" value={''} onChange={() => {}} />
          </View>
          <View style={styles.modalInputGroup}>
            <ThemedText type="default">Lancement de l'audio à</ThemedText>
            {goalType === 'Temps' ? (
              <View style={styles.timeInputFields}>
                <TimeInputField
                  placeholder="00"
                  unit="heures"
                  value={timeValues.heures}
                  onChange={() => {}}
                />
                <TimeInputField
                  placeholder="00"
                  unit="min"
                  value={timeValues.min}
                  onChange={() => {}}
                />
                <TimeInputField
                  placeholder="00"
                  unit="sec"
                  value={timeValues.sec}
                  onChange={() => {}}
                />
              </View>
            ) : (
              <DistanceInput
                placeholder={'0.00'}
                status={'default'}
                unit={'km'}
                value={goalDistance}
                onChange={() => {}}
              />
            )}
          </View>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.dark.primaryDark,
  },
  mainContent: {
    flex: 5,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  audioListWrapper: {
    flex: 1,
  },
  audioList: {
    flexGrow: 1,
  },
  audioListContent: {
    paddingBottom: 30,
    paddingTop: 10,
    gap: 10,
  },
  topGradient: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    zIndex: 10,
  },
  bottomGradient: {
    position: 'absolute',
    pointerEvents: 'none',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  timelineSection: {
    flex: 3,
    justifyContent: 'flex-start',
    backgroundColor: Colors.dark.primaryDark,
  },
  actionBarContainer: {
    paddingHorizontal: 24,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.secondaryDark,
    padding: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionBarElement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    zIndex: 10,
  },
  footerButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 16,
    width: '100%',
  },
  modalInputGroup: {
    marginBottom: 20,
    gap: 6,
  },
  timeInputFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
});
