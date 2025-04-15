import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import { CustomButton } from '@/components/button/ConfigButton';
import { ThemedText } from '@/components/olds/text/ThemedText';
import { GuidedRunList } from '@/components/olds/runs/GuidedRunList';
import TimeInputs from '@/components/input/TimeInputs';
import SelectInput from '@/components/input/SelectInput';
import DistanceInput from '@/components/input/DistanceInput';
import { useSessionContext } from '@/context/SessionContext';
import ButterflyIcon from '@/components/icons/ButterflyIcon';
import TargetIcon from '@/components/icons/TargetIcon';
import HeadphoneIcon from '@/components/icons/HeadphoneIcon';
import { useAuth } from '@/context/AuthContext';
import * as FileSystem from 'expo-file-system';

type SessionStep = 'selection' | 'target-config' | 'guide-selection';
type SessionType = 'free' | 'target' | 'guide';
type GoalType = 'Temps' | 'Distance';

export default function SessionScreen() {
  const [currentStep, setCurrentStep] = useState<SessionStep>('selection');
  const [selectedSession, setSelectedSession] = useState<SessionType>('free');
  const [goalType, setGoalType] = useState<GoalType>('Temps');
  const [timeValues, setTimeValues] = useState<number>(0);
  const [goalDistance, setGoalDistance] = useState<number>(0);
  const [selectedRun, setSelectedRun] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { authToken } = useAuth();
  const { initializeSession } = useSessionContext();

  const handleSessionSelect = (session: SessionType) => setSelectedSession(session);

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

  const handleGuideStart = async () => {
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
        console.error('Failed to fetch run');
        return;
      }

      const runData = await runResponse.json();

      // Télécharger les fichiers audio et les ajouter à `activation_param`
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

            // Récupérer le type MIME et définir l'extension
            const contentType = audioResponse.headers.get('Content-Type');

            let extension = 'mp3';
            if (contentType?.includes('mp4')) {
              extension = 'm4a';
            } else if (contentType?.includes('x-m4a')) {
              extension = 'm4a';
            }

            // Chemin local pour sauvegarder l'audio
            const localPath = `${FileSystem.documentDirectory}audio_${param.audio_id}.${extension}`;

            // Télécharger et sauvegarder l'audio localement
            const audioBlob = await audioResponse.blob();
            const reader = new FileReader();

            await new Promise((resolve, reject) => {
              reader.onloadend = async () => {
                try {
                  const base64Data = reader.result?.toString().split(',')[1] || '';
                  await FileSystem.writeAsStringAsync(localPath, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                  });
                  resolve(null);
                } catch (err) {
                  reject(err);
                }
              };
              reader.onerror = reject;
              reader.readAsDataURL(audioBlob);
            });
            return { ...param, audioFile: localPath };
          } catch (error) {
            console.error(`Error fetching audio ID ${param.audio_id}:`, error);
            return { ...param, audioFile: null };
          }
        }),
      );

      // Intégrer les audios préchargés dans `runData`
      runData.activation_param = activationParamsWithAudio;

      console.log('Préchargement des audios terminé:', runData);

      // Initialiser la session et rediriger
      initializeSession('run', undefined, runData);
      router.push('/session/live');
    } catch (error) {
      console.error('Erreur lors du préchargement des audios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelectionStep = () => (
    <>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <ThemedText style={styles.title}>Choisis une session</ThemedText>
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
      <View style={styles.header}>
        <BackButton onPress={() => setCurrentStep('selection')} />
        <ThemedText style={styles.title}>Définis ton objectif</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Type de l'objectif</ThemedText>
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
      <View style={styles.header}>
        <BackButton onPress={() => setCurrentStep('selection')} />
        <ThemedText style={styles.title}>Sélectionne une run guidée</ThemedText>
      </View>

      <View style={styles.content}>
        <GuidedRunList onRunSelect={setSelectedRun} enableSelection={true} />
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.container}>{renderCurrentStep()}</View>
      </KeyboardAvoidingView>
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
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.white,
    marginTop: 16,
  },
  content: {
    flex: 1,
    gap: 32,
    paddingBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
    gap: 8,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: Colors.light.white,
  },
  selectContainer: {
    gap: 20,
    width: '100%',
  },
  startButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
