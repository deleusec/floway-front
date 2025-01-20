import { LinearGradient } from 'expo-linear-gradient'; // Import du gradient
import BackButton from '@/components/button/BackButton';
import AudioCard from '@/components/cards/AudioCard';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { useStudioContext } from '@/context/StudioContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import ThemedButton from '@/components/button/ThemedButton';
import CustomModal from '@/components/modal/CustomModal';
import TextInputField from '@/components/input/TextInputField';
import TimeInputField from '@/components/input/TimeInput';
import DistanceInput from '@/components/input/DistanceInput';
import * as DocumentPicker from 'expo-document-picker';
import { useSession } from '@/context/ctx';
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
  const [isDeleteAudioModalVisible, setIsDeleteAudioModalVisible] = useState(false);

  const { studioData } = useStudioContext();
  const { session } = useSession();

  const { goalType, timeValues, goalDistance } = studioData;

  useEffect(() => {
    fetchAudios();
  } , []);

  const fetchAudios = async () => {
    try {
      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/audio', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setAudioList(data);
      } else {
        console.error('Failed to fetch audios. Status:', response.status);
      }
    }
    catch (error) {
      console.error('Error during audio fetch:', error);
    }
  };

  const handleImportAudio = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (file.canceled) {
        console.log('User canceled document picker');
        return;
      }

      const audioFile = file.assets[0];

      console.log('Selected file:', audioFile);

      // Téléchargez le fichier comme blob
      const response = await fetch(audioFile.uri);
      const blob = await response.blob();

      const formData = new FormData();
      console.log('Blob:', response);

      formData.append('file', blob, audioFile.name);
      formData.append('payload', JSON.stringify({ title: audioFile.name }));

      // Envoyez la requête au backend
      const responseFromApi = await fetch('https://api.floway.edgar-lecomte.fr/api/audio', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
        },
        body: formData,
      });

      if (responseFromApi.status === 201) {
        const newAudio = await responseFromApi.json();
        console.log('Audio uploaded successfully:', newAudio);

        setAudioList((prev) => [
          ...prev,
          {
            id: newAudio.id,
            title: newAudio.title,
            duration: newAudio.duration,
            start_time: newAudio.start_time,
          },
        ]);
      } else {
        console.error('Failed to upload audio. Status:', responseFromApi);
      }
    } catch (error) {
      console.error('Error during audio upload:', error);
    }
  };


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

        <ThemedText type="title" style={{ paddingHorizontal: 24 }}>
          Mes audios
        </ThemedText>
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
                onPress={() => setIsDeleteAudioModalVisible(true)}
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
              <Ionicons name="file-tray" size={20} color="white" onPress={handleImportAudio} />
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
        cancelButton
        confirmButton
        confirmAction={() => setIsCustomAudioModalVisible(false)}
        onClose={() => setIsCustomAudioModalVisible(false)}>
        <View style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalText}>
            Modifier l’audio
          </ThemedText>
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

      <CustomModal
        visible={isDeleteAudioModalVisible}
        cancelButton
        confirmButton
        confirmAction={() => setIsDeleteAudioModalVisible(false)}
        onClose={() => setIsDeleteAudioModalVisible(false)}>
        <View style={styles.modalContent}>
          <ThemedText type="default" style={styles.modalText}>
            Etes-vous sûr de vouloir supprimer cet audio ?
          </ThemedText>
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
  },
  audioListWrapper: {
    flex: 1,
  },
  audioList: {
    flexGrow: 1,
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
    paddingTop: 24,
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
    width: '100%',
  },
  modalText: {
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
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
