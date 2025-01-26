import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, ScrollView } from 'react-native';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import { Colors } from '@/constants/Colors';
import { useSessionContext } from '@/context/SessionContext';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { router } from 'expo-router';
import { GuidedRunList } from '@/components/runs/GuidedRunList';

export default function GuidedRunSelection() {
  const { setSessionData } = useSessionContext();
  const [selectedRun, setSelectedRun] = useState<any | null>(null);

  const handleRunSelect = (run: any) => {
    setSelectedRun(run);
  };

  const handleStart = () => {
    if (selectedRun) {
      setSessionData({
        type: 'guided',
        status: 'ready',
        guidedRun: {
          id: selectedRun.id,
          title: selectedRun.title,
          description: selectedRun.description,
          duration: selectedRun.time_objective || 'Inconnu',
        },
        currentMetrics: {
          time: { hours: '00', minutes: '00', seconds: '00' },
          distance: '0,00',
          pace: '0\'00"',
          calories: '0',
        },
        id: '',
        startTime: 0,
        totalPauseTime: 0,
        locations: [],
      });
      router.push('/session/selected-guided');
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <BackButton onPress={() => router.back()} />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sélectionne une run guidée</Text>
            <TabBarIcon name="information-circle-outline" color={Colors.dark.primary} />
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          <GuidedRunList onRunSelect={handleRunSelect} enableSelection={true} />
        </ScrollView>

        {/* Start Button */}
        <View style={styles.startButtonContainer}>
          <ThemedButton
            title="Commencer"
            buttonSize="medium"
            buttonType="confirm"
            buttonState={selectedRun ? 'default' : 'disabled'}
            disabled={!selectedRun}
            onPress={handleStart}
          />
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
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.white,
  },
  content: {
    flex: 1,
  },
  startButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
