import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/text/ThemedText';
import { Tabs } from '@/components/tabs/Tabs';
import CustomModal from '@/components/modal/CustomModal';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Link } from 'expo-router';
import ThemedButton from '@/components/button/ThemedButton';
import { GuidedRunList } from '@/components/runs/GuidedRunList';
import { secondsToCompactReadableTime } from '@/utils/timeUtils';

export default function AllRunsScreen() {
  const [activeTab, setActiveTab] = useState('audio');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);

  const tabs = [
    { key: 'audio', label: 'Audio' },
    { key: 'program', label: 'Programmes' },
  ];

  const handleRunSelect = (run: any) => {
    setSelectedRun(run);
    setIsModalVisible(true);
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
          <GuidedRunList onRunSelect={handleRunSelect} />
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
