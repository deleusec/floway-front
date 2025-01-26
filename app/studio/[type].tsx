import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/button/BackButton';
import AudioCard from '@/components/cards/AudioCard';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { useStudioContext } from '@/context/StudioContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import ThemedButton from '@/components/button/ThemedButton';
import CustomModal from '@/components/modal/CustomModal';
import TextInputField from '@/components/input/TextInputField';
import DistanceInput from '@/components/input/DistanceInput';
import * as DocumentPicker from 'expo-document-picker';
import { useSession } from '@/context/ctx';
import { Audio } from 'expo-av';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useRef } from 'react';
import TimeInputs from '@/components/input/TimeInputs';
import InformationCircleIcon from '@/assets/icons/information-circle.svg';
import AudioListStudio from '@/components/studio/AudioListStudio';

interface AudioProps {
  id: number;
  audio_id: number;
  title: string;
  duration: string;
  localPath?: string;
  start_time?: number;
  start_distance?: number;
}

export default function StudioByType() {
  // Gestion des audios
  const [audioList, setAudioList] = useState<AudioProps[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioProps | null>(null);
  const [audioCounter, setAudioCounter] = useState(1);

  // Gestion du lecteur audio
  const [playerState, setPlayerState] = useState<'playing' | 'paused'>('paused');

  // Gestion des informations de l'audio
  const [modalAudioTitle, setModalAudioTitle] = useState('');
  const [modalAudioStartTime, setModalAudioStartTime] = useState(0);
  const [modalAudioStartDistance, setModalAudioStartDistance] = useState(0);

  // Gestion des modales
  const [isAudioEditModalVisible, setIsAudioEditModalVisible] = useState(false);
  const [isDeleteAudioModalVisible, setIsDeleteAudioModalVisible] = useState(false);
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false);

  // Enregistrement audio
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState<any>();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [waveLevels, setWaveLevels] = useState<number[]>([0]);
  const waveWidth = useSharedValue(10);
  const waveformScrollRef = useRef<ScrollView>(null);

  const { studioData } = useStudioContext();
  const { session } = useSession();

  const { title, description, goalType, goalTime, goalDistance } = studioData;

  const openAudioEditModal = (audio: AudioProps) => {
    setSelectedAudio(audio);
    setModalAudioTitle(audio.title);
    setModalAudioStartTime(audio.start_time ?? 0);
    setModalAudioStartDistance(audio.start_distance ?? 0);
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

      console.log('Selected audio:', audioFile.uri);
      await uploadAudio(audioFile.uri);
    } catch (error) {
      console.error('Error during audio upload:', error);
    }
  };

  const startRecording = async () => {
    try {
      if (permissionResponse && permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecordingInstance(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Démarrer le timer
      setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording && status.metering) {
          setWaveLevels((prevLevels) => {
            const updatedLevels = [...prevLevels, Math.max(0, (status.metering ?? 0) + 100)];
            setTimeout(() => {
              waveformScrollRef.current?.scrollToEnd({ animated: true });
            }, 50);

            return updatedLevels;
          });
        }
      }, 100);

      const interval = setInterval(async () => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recordingInstance) return;

    console.log('Stopping recording...');
    setIsRecording(false);

    clearInterval(timerInterval!);
    setTimerInterval(null);

    await recordingInstance.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    setWaveLevels([0]); // Réinitialise les ondes
    waveWidth.value = 10; // Réinitialise la largeur

    const uri = recordingInstance.getURI();
    setRecordingInstance(null);
    console.log('Recording stopped. File URI:', uri);

    await uploadAudio(uri);

    return uri;
  };

  const cancelRecording = async () => {
    if (!recordingInstance) return;

    console.log('Cancelling recording...');
    setIsRecording(false);

    clearInterval(timerInterval!);
    setTimerInterval(null);

    await recordingInstance.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    setWaveLevels([0]); // Réinitialise les ondes
    waveWidth.value = 10; // Réinitialise la largeur

    setRecordingInstance(null);
    console.log('Recording cancelled');
  };

  const uploadAudio = async (uri: string) => {
    try {
      let uriParts = uri.split('.');
      let fileType = uriParts[uriParts.length - 1];
      const formData = new FormData();

      formData.append('file', {
        uri,
        name: `recording.${fileType}`,
        type: `audio/x-${fileType}`,
      } as any);

      formData.append('payload', JSON.stringify({ title: 'Nouvel audio' }));

      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/audio', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const jsonResponse = await response.json();
      if (response.ok) {
        console.log('Audio uploaded successfully:', jsonResponse);
        handleAudioResponse(uri, jsonResponse);
      } else {
        console.error('Failed to upload audio:', jsonResponse);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const handleAudioResponse = (localUri: string, backendData: any) => {
    const newAudio = createAudioEntry(localUri, backendData);
    setAudioList((prev) => [...prev, newAudio]);
    setAudioCounter((prev) => prev + 1);
  };

  const createAudioEntry = (localUri: string, backendData: any): AudioProps => {
    const { id, title, duration } = backendData;
    return {
      id: audioCounter,
      audio_id: id,
      title,
      duration: Math.round(duration).toString(),
      localPath: localUri,
      start_time: 0,
      start_distance: 0,
    };
  };

  // Lors de la confirmation
  const handleEditConfirm = () => {
    setAudioList((prev) =>
      prev.map((audio) =>
        audio.id === selectedAudio?.id
          ? {
              ...audio,
              title: modalAudioTitle,
              start_time: modalAudioStartTime,
              start_distance: modalAudioStartDistance,
            }
          : audio,
      ),
    );
    setIsAudioEditModalVisible(false);
  };

  const handleMicPress = async () => {
    setIsRecordingModalVisible(true);
    await startRecording();
  };

  const handleConfirm = async () => {
    await stopRecording();
    setIsRecordingModalVisible(false);
  };

  const handleCancel = async () => {
    await cancelRecording();
    setIsRecordingModalVisible(false);
  };

  const handleDeleteAudio = async () => {
    if (!selectedAudio) return;
    setAudioList((prev) => prev.filter((audio) => audio.id !== selectedAudio.id));
    setIsDeleteAudioModalVisible(false);
  };
  const handleSubmit = async () => {
    try {
      const audioParams = audioList.map((audio) => ({
        audio_id: audio.audio_id,
        time: audio.start_time ? audio.start_time.toFixed(1) : null,
        distance: audio.start_distance ? audio.start_distance.toFixed(1) : null,
      }));

      if (audioParams.length === 0) {
        console.error('Audio parameters are required.');
        return;
      }

      const payload = {
        audio_params: audioParams,
        title: title || "Default Title",
        description: description || "Default Description",
        time_objective: goalType === 'Temps' ? goalTime : null,
        distance_objective: goalType === 'Distance' ? goalDistance : null,
        price: null,
      };

      console.log('Payload envoyé :', payload);

      // Envoyer au backend
      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/run', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`, // Assurez-vous que la session est valide
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Run guidé créé avec succès:', jsonResponse);
        // Ajouter une redirection ou un message de succès
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la création du run guidé:', errorData);
      }
    } catch (error) {
      console.error('Erreur réseau ou logique:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View>
            <BackButton />
          </View>
          <View style={styles.infoIcon}>
            <InformationCircleIcon />
          </View>
        </View>

        {/* Audio list */}
        <ThemedText type="title" style={{ paddingHorizontal: 24 }}>
          Mes audios
        </ThemedText>
        <View style={styles.audioListWrapper}>
          <AudioListStudio audioList={audioList} selectedAudio={selectedAudio} openAudioEditModal={openAudioEditModal} goalType={goalType} />
        </View>
      </View>
      <View style={styles.timelineSection}>
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
                onPress={() => setIsAudioEditModalVisible(true)}
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
              <Ionicons name="mic" size={20} color="white" onPress={handleMicPress} />
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
        visible={isAudioEditModalVisible}
        cancelButton
        confirmButton
        confirmAction={() => handleEditConfirm()}
        onClose={() => setIsAudioEditModalVisible(false)}>
        <View style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalText}>
            Modifier l’audio
          </ThemedText>
          <View style={styles.modalInputGroup}>
            <ThemedText type="default">Titre</ThemedText>
            <TextInputField
              placeholder="Titre de l’audio"
              value={modalAudioTitle}
              onChange={setModalAudioTitle}
            />
          </View>
          <View style={styles.modalInputGroup}>
            <ThemedText type="default">Lancement de l'audio à</ThemedText>
            <View style={styles.timeInputFields}>
              {goalType === 'Temps' ? (
                <TimeInputs
                  totalSeconds={modalAudioStartTime}
                  onChange={(seconds) => setModalAudioStartTime(seconds)}
                />
              ) : (
                <DistanceInput
                  placeholder="00"
                  unit="km"
                  status="default"
                  value={modalAudioStartDistance}
                  onChange={setModalAudioStartDistance}
                />
              )}
            </View>
          </View>
        </View>
      </CustomModal>

      <CustomModal
        visible={isDeleteAudioModalVisible}
        cancelButton
        confirmButton
        confirmAction={() => handleDeleteAudio()}
        onClose={() => setIsDeleteAudioModalVisible(false)}>
        <View style={styles.modalContent}>
          <ThemedText type="default" style={styles.modalText}>
            Etes-vous sûr de vouloir supprimer cet audio ?
          </ThemedText>
        </View>
      </CustomModal>

      {/* Modale d'enregistrement */}
      <CustomModal
        visible={isRecordingModalVisible}
        cancelButton
        confirmButton
        confirmAction={handleConfirm}
        onClose={() => {
          handleCancel();
        }}>
        <View style={styles.recordingContainer}>
          <View style={styles.recordingHeader}>
            <Text style={styles.recIndicator}>
              <View style={styles.recDot} /> REC
            </Text>
            <Text style={styles.timer}>
              {`00:${recordingDuration < 10 ? '0' : ''}${recordingDuration}`}
            </Text>
          </View>

          {/* Placeholder pour les ondes sonores */}
          <View style={styles.waveform}>
            <ScrollView
              ref={waveformScrollRef} // Lier la référence
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ width: '100%', height: '100%' }}>
              <Animated.View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                {waveLevels.map((level, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      height: Math.max(level, 10),
                      width: 1,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      marginHorizontal: 1,
                    }}
                  />
                ))}
              </Animated.View>
            </ScrollView>
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
  recordingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  recIndicator: {
    backgroundColor: Colors.dark.secondaryDark,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    color: Colors.dark.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.primary,
    marginRight: 5,
  },
  timer: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  waveform: {
    height: 70,
    width: '100%',
    backgroundColor: Colors.light.secondaryDark,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
});
