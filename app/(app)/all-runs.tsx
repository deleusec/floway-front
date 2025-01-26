import { SafeAreaView, Text, StyleSheet, ScrollView, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/text/ThemedText';
import { Tabs } from '@/components/tabs/Tabs';
import { PictureCard } from '@/components/ThemedPictureCard';
import CustomModal from '@/components/modal/CustomModal';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Link } from 'expo-router';
import ThemedButton from '@/components/button/ThemedButton';
import { useSession } from '@/context/ctx';
import { secondsToCompactReadableTime } from '@/utils/timeUtils';

interface Run {
  id: number;
  title: string;
  time_objective?: number;
  distance_objective?: number;
  is_buyable: boolean;
  price?: number | null;
  user_id: number;
  description: string;
  image_url: string;
}

export default function AllRunsScreen() {
  const [activeTab, setActiveTab] = useState('audio');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const [audioRuns, setAudioRuns] = useState<Run[]>([]);

  const { session } = useSession();

  const tabs = [
    { key: 'audio', label: 'Audio' },
    { key: 'program', label: 'Programmes' },
  ];

  useEffect(() => {
    fetchAudioRuns();
  }, []);

  const fetchAudioRuns = async () => {
    try {
      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/run', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        const runsWithImages = await Promise.all(
          data.runs.map(async (run: any) => {
            const imageResponse = await fetch('https://picsum.photos/200');
            return { ...run, image_url: imageResponse.url };
          }),
        );

        setAudioRuns(runsWithImages);
      }
    } catch (error) {
      console.error('Error fetching audio runs:', error);
    }
  };

  const handleRunSelect = (run: Run) => {
    setSelectedRun(run);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
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
          <View style={styles.content}>
            {audioRuns.length > 0 ? (
              audioRuns.map((run) => (
                <PictureCard
                  key={run.title}
                  title={run.title}
                  image={{ uri: run.image_url }}
                  metrics={[secondsToCompactReadableTime(run.time_objective || 0)]}
                  subtitle={run.description}
                  onPress={() => handleRunSelect(run)}
                />
              ))
            ) : (
              <ThemedText type="legend" style={styles.contentText}>
                Vous ne possédez aucune audio. Créez en une nouvelle en cliquant sur le bouton
                ci-dessous.
              </ThemedText>
            )}
          </View>
        ) : (
          <View style={styles.content}>
            <ThemedText type="legend" style={styles.contentText}>
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
              title="Lancer la session"
              buttonSize="medium"
              buttonType="confirm"
              onPress={() => setIsModalVisible(false)}
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
      </ScrollView>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  content: {
    marginTop: 16,
    flex: 1,
    alignItems: 'center',
  },
  contentText: {
    padding: 16,
    textAlign: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
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
