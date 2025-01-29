import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/text/ThemedText';
import { Tabs } from '@/components/tabs/Tabs';
import CustomModal from '@/components/modal/CustomModal';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Link, router } from 'expo-router';
import ThemedButton from '@/components/button/ThemedButton';
import { GuidedRunList } from '@/components/runs/GuidedRunList';
import { secondsToCompactReadableTime } from '@/utils/timeUtils';
import { useAuth } from '@/context/ctx';
import * as FileSystem from 'expo-file-system';
import { useSessionContext } from '@/context/SessionContext';

export default function AllRunsScreen() {
  const [activeTab, setActiveTab] = useState('audio');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { authToken } = useAuth();
  const { initializeSession } = useSessionContext();

  const tabs = [
    { key: 'audio', label: 'Audio' },
    { key: 'program', label: 'Programmes' },
  ];

  const handleRunSelect = (run: any) => {
    setSelectedRun(run);
    setIsModalVisible(true);
  };

  const handleStartRun = async () => {
    if (!selectedRun) return;

    setIsLoading(true);

    try {
      // Récupération des détails de la run
      const runResponse = await fetch(
        `https://api.floway.edgar-lecomte.fr/api/run/${selectedRun.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!runResponse.ok) {
        console.error('Failed to fetch run details');
        return;
      }

      const runData = await runResponse.json();

      // Préchargement des audios
      const activationParamsWithAudio = await Promise.all(
        runData.activation_param.map(async (param: any) => {
          try {
            const audioResponse = await fetch(
              `https://api.floway.edgar-lecomte.fr/api/audio/${param.audio_id}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              },
            );

            if (!audioResponse.ok) {
              console.error(`Failed to fetch audio for ID: ${param.audio_id}`);
              return { ...param, audioFile: null };
            }

            // Déterminer l'extension du fichier audio
            const contentType = audioResponse.headers.get('Content-Type');
            const extension = contentType?.split('/')[1] || 'mp3';

            // Chemin local pour sauvegarder l'audio
            const localPath = `${FileSystem.documentDirectory}audio_${param.audio_id}.${extension}`;

            // Télécharger et sauvegarder
            const audioData = await audioResponse.blob();
            const base64Audio = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
              reader.onerror = reject;
              reader.readAsDataURL(audioData);
            });

            await FileSystem.writeAsStringAsync(localPath, base64Audio, {
              encoding: FileSystem.EncodingType.Base64,
            });

            return { ...param, audioFile: localPath };
          } catch (error) {
            console.error(`Error downloading audio ID ${param.audio_id}:`, error);
            return { ...param, audioFile: null };
          }
        }),
      );

      runData.activation_param = activationParamsWithAudio;

      console.log('Préchargement terminé:', runData);

      setIsModalVisible(false);
      initializeSession('run', undefined, runData);
      router.push('/session/live');
    } catch (error) {
      console.error('Error during guided run start:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={{ color: 'white' }}>
            Mes runs guidées
          </ThemedText>
          <Link href="/studio">
            <TabBarIcon name="add-circle-outline" color="white" size={28} />
          </Link>
        </View>

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'audio' ? (
          <View style={styles.listContainer}>
            <GuidedRunList onRunSelect={handleRunSelect} shadowBottom={false} />
          </View>
        ) : (
          <View style={styles.emptyProgramContainer}>
            <ThemedText type="legend" style={styles.emptyProgramText}>
              Vous ne possédez aucun programme. Créez en un nouveau en cliquant sur le bouton
              ci-dessous.
            </ThemedText>
          </View>
        )}
        <CustomModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          bordered
          cross
          footer={
            <ThemedButton
              title={isLoading ? 'Chargement...' : 'Commencer'}
              buttonSize="medium"
              buttonType="confirm"
              buttonState={isLoading ? 'loading' : 'default'}
              onPress={() => handleStartRun()}
            />
          }>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              {selectedRun && (
                <Image source={{ uri: selectedRun.image_url }} style={styles.image} />
              )}

              <View style={styles.modalHeader}>
                <ThemedText type="default" style={styles.modalTitle}>
                  {selectedRun?.title}
                </ThemedText>
                {selectedRun?.time_objective && (
                  <Text style={styles.metric}>
                    Temps: {secondsToCompactReadableTime(selectedRun.time_objective)}
                  </Text>
                )}
                {selectedRun?.distance_objective && (
                  <Text style={styles.metric}>Distance: {selectedRun.distance_objective} km</Text>
                )}
              </View>
            </View>

            {selectedRun?.description && (
              <Text style={styles.modalSubtitle}>{selectedRun.description}</Text>
            )}
          </View>
        </CustomModal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  listContainer: {
    flex: 1,
    paddingTop: 4,
  },
  emptyProgramContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyProgramText: {
    textAlign: 'center',
  },
  modal: {
    gap: 16,
    width: '100%',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 16,
    color: Colors.light.white,
    fontFamily: 'Poppins-Medium',
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.light.lightGrey,
    fontFamily: 'Poppins-Regular',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  modalMetricsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metric: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.white,
    marginRight: 8,
  },
});
