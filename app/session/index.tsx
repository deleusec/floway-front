// screens/session/index.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import { CustomButton } from '@/components/button/ConfigButton';
import { ThemedText } from '@/components/text/ThemedText';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { GuidedRunList } from '@/components/runs/GuidedRunList';
import TimeInputs from '@/components/input/TimeInputs';
import SelectInput from '@/components/input/SelectInput';
import DistanceInput from '@/components/input/DistanceInput';
import { useSessionContext } from '@/context/SessionContext';
import ButterflyIcon from '@/components/icons/ButterflyIcon';
import TargetIcon from '@/components/icons/TargetIcon';
import HeadphoneIcon from '@/components/icons/HeadphoneIcon';

type SessionStep = 'selection' | 'target-config' | 'guide-selection';
type SessionType = 'free' | 'target' | 'guide';
type GoalType = 'Temps' | 'Distance';

export default function SessionScreen() {
  const { initializeSession } = useSessionContext();
  const [currentStep, setCurrentStep] = useState<SessionStep>('selection');
  const [selectedSession, setSelectedSession] = useState<SessionType>('free');

  // Target specific state
  const [goalType, setGoalType] = useState<GoalType>('Temps');
  const [timeValues, setTimeValues] = useState<number>(0);
  const [goalDistance, setGoalDistance] = useState<number>(0);

  // Guide specific state
  const [selectedRun, setSelectedRun] = useState<any | null>(null);

  const handleSessionSelect = (session: SessionType) => {
    setSelectedSession(session);
  };

  const handleContinue = () => {
    switch (selectedSession) {
      case 'free':
        initializeSession('free');
        router.push('/session/live');
        break;
      case 'target':
        setCurrentStep('target-config');
        break;
      case 'guide':
        setCurrentStep('guide-selection');
        break;
    }
  };

  const handleTargetStart = () => {
    if (goalType === 'Temps') {
      initializeSession('time', timeValues);
    } else {
      initializeSession('distance', goalDistance);
    }
    router.push('/session/live');
  };

  const handleGuideStart = () => {
    if (selectedRun) {
      initializeSession('run', undefined, selectedRun.id);
    }
  };

  const renderSelectionStep = () => (
    <>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.title}>Choisis une session</Text>
      </View>

      <View style={styles.sessionButtonsContainer}>
        <CustomButton
          text="Session libre"
          state={selectedSession === 'free' ? 'selected' : 'default'}
          onPress={() => handleSessionSelect('free')}
          style={styles.sessionButton}
          icon={
            <ButterflyIcon
              state={selectedSession === 'free' ? 'selected' : 'default'}
              width={24}
              height={24}
            />
          }
        />
        <CustomButton
          text="Session avec objectif"
          state={selectedSession === 'target' ? 'selected' : 'default'}
          onPress={() => handleSessionSelect('target')}
          style={styles.sessionButton}
          icon={
            <TargetIcon
              state={selectedSession === 'target' ? 'selected' : 'default'}
              width={24}
              height={24}
            />
          }
        />
        <CustomButton
          text="Session avec run guidée"
          state={selectedSession === 'guide' ? 'selected' : 'default'}
          onPress={() => handleSessionSelect('guide')}
          style={styles.sessionButton}
          icon={
            <HeadphoneIcon
              state={selectedSession === 'guide' ? 'selected' : 'default'}
              width={24}
              height={24}
            />
          }
        />
      </View>

      <View style={styles.startButtonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="medium"
          buttonType="confirm"
          buttonState="default"
          onPress={handleContinue}
        />
      </View>
    </>
  );

  const renderTargetConfig = () => (
    <>
      <View style={styles.headerContainer}>
        <BackButton onPress={() => setCurrentStep('selection')} />
        <ThemedText type="title" style={styles.title}>
          Définis ton objectif
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <ThemedText type="default">Type de l'objectif</ThemedText>
          <View style={styles.selectContainer}>
            <SelectInput
              options={['Temps', 'Distance']}
              onValueChange={(value) => setGoalType(value as GoalType)}
              value={goalType}
              hidePlaceholder
            />
            {goalType === 'Temps' ? (
              <TimeInputs totalSeconds={timeValues} onChange={setTimeValues} status="active" />
            ) : (
              <DistanceInput
                value={goalDistance}
                onChange={setGoalDistance}
                unit="km"
                status="default"
              />
            )}
          </View>
        </View>
      </View>

      <View style={styles.startButtonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="medium"
          buttonType="confirm"
          onPress={handleTargetStart}
        />
      </View>
    </>
  );

  const renderGuideSelection = () => (
    <>
      <BackButton onPress={() => setCurrentStep('selection')} />
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sélectionne une run guidée</Text>
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView style={styles.listContainer}>
          <GuidedRunList onRunSelect={setSelectedRun} enableSelection={true} />
        </ScrollView>
      </View>

      <View style={styles.startButtonContainer}>
        <ThemedButton
          title="Commencer"
          buttonSize="medium"
          buttonType="confirm"
          buttonState={selectedRun ? 'default' : 'disabled'}
          disabled={!selectedRun}
          onPress={handleGuideStart}
        />
      </View>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'selection':
        return renderSelectionStep();
      case 'target-config':
        return renderTargetConfig();
      case 'guide-selection':
        return renderGuideSelection();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{renderCurrentStep()}</View>
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
  headerContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginTop: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  listContainer: {
    flex: 1,
  },
  sessionButtonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
    paddingBottom: 32,
  },
  sessionButton: {
    width: '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    gap: 6,
    marginBottom: 20,
  },
  selectContainer: {
    gap: 20,
  },
  buttonContainer: {
    padding: 24,
  },
  startButton: {
    width: '100%',
  },
  startButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
