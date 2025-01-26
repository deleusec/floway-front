import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, ScrollView } from 'react-native';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import { Colors } from '@/constants/Colors';
import { useSessionContext } from '@/context/SessionContext';
import { PictureCard } from '@/components/ThemedPictureCard';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { router } from 'expo-router';

interface GuidedRun {
  id: string;
  title: string;
  metrics: string[];
  description: string;
  image: any;
}

export default function GuidedRunSelection() {
  const { updateGuidedRun, setSessionData } = useSessionContext();
  const [selectedRun, setSelectedRun] = useState<string | null>(null);

  const guidedRuns: GuidedRun[] = [
    {
      id: '1',
      title: 'Premier run',
      metrics: ['5km'],
      description: 'Une run de récupération sur 5km pour débuter',
      image: require('@/assets/images/start.jpg'),
    },
    {
      id: '2',
      title: 'Course en forêt',
      metrics: ['10km'],
      description: 'Un run de 10km en forêt pour mieux progresser',
      image: require('@/assets/images/start.jpg'),
    },
    {
      id: '3',
      title: 'Teste ton endurance',
      metrics: ['30min'],
      description: 'Apprends à évaluer ton endurance en courant',
      image: require('@/assets/images/start.jpg'),
    },
    {
      id: '4',
      title: 'Boost ton énergie avec Clara',
      metrics: ['20min'],
      description: 'Rejoins Clara pour une session dynamique',
      image: require('@/assets/images/start.jpg'),
    },
  ];

  const handleRunSelect = (runId: string) => {
    setSelectedRun(runId);
  };

  const handleStart = () => {
    if (selectedRun) {
      const selectedRunData = guidedRuns.find((run) => run.id === selectedRun);
      if (selectedRunData) {
        setSessionData({
          type: 'guided',
          status: 'ready',
          guidedRun: {
            id: selectedRunData.id,
            title: selectedRunData.title,
            description: selectedRunData.description,
            duration: selectedRunData.metrics[0],
          },
          currentMetrics: {
            time: { hours: '00', minutes: '00', seconds: '00' },
            distance: '0,00',
            pace: '0\'00"',
            calories: '0',
          },
        });
        router.push('/session/selectedGuided');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sélectionne une run guidée</Text>
          <TabBarIcon name="information-circle-outline" color={Colors.dark.primary} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {guidedRuns.map((run) => (
          <PictureCard
            key={run.id}
            title={run.title}
            metrics={run.metrics}
            subtitle={run.description}
            image={run.image}
            onPress={() => handleRunSelect(run.id)}
            isSelected={selectedRun === run.id}
          />
        ))}
      </ScrollView>

      {/* Bouton Commencer */}
      <View style={styles.startButtonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="large"
          buttonType="confirm"
          buttonState="default"
          onPress={handleStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  header: {
    padding: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  startButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
});
