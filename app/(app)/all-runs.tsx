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

interface Run {
  title: string;
  metrics: string[];
  description: string;
  image: any;
}

export default function AllRunsScreen() {
  const [activeTab, setActiveTab] = useState('audio');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const [audioRuns, setAudioRuns] = useState<Run[]>([]);

  const tabs = [
    { key: 'audio', label: 'Audio' },
    { key: 'program', label: 'Programmes' },
  ];

  useEffect(() => {
    setAudioRuns([
      {
        title: 'Course matinale',
        metrics: ['45 min'],
        description: 'Course matinale pour bien démarrer la journée',
        image: require('@/assets/images/start.jpg'),
      },
      {
        title: 'Course du soir',
        metrics: ['30 min'],
        description: 'Course du soir pour se détendre',
        image: require('@/assets/images/start.jpg'),
      },
    ]);
  }, []);

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
                  metrics={run.metrics}
                  subtitle={run.description}
                  image={run.image}
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
            {selectedRun && selectedRun.image && (
              <Image source={selectedRun.image} style={styles.image} />
            )}

            <View style={styles.modalHeader}>
              <ThemedText type="default" style={styles.modalTitle}>
                {selectedRun?.title}
              </ThemedText>
              {selectedRun?.metrics && (
                <View style={styles.modalMetricsContainer}>
                  {selectedRun.metrics.map((metric, index) => (
                    <Text key={index} style={styles.metric}>
                      {metric}
                    </Text>
                  ))}
                </View>
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
  // Modal styles
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
