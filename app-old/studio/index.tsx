import BackButton from '@/components/button/BackButton';
import ThemedButton from '@/components/button/ThemedButton';
import DistanceInput from '@/components/input/DistanceInput';
import SelectInput from '@/components/input/SelectInput';
import TextInputField from '@/components/input/TextInputField';
import TimeInputs from '@/components/input/TimeInputs';
import { ThemedText } from '@/components/olds/text/ThemedText';
import { Colors } from '@/constants/Colors';
import { useStudioContext } from '@/context/StudioContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export default function CreateRun() {
  const [title, setTitle] = useState<string>('');
  const [goalType, setGoalType] = useState<'Temps' | 'Distance'>('Temps');
  const [timeValues, setTimeValues] = useState<number>(0);
  const [goalDistance, setGoalDistance] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { setStudioData } = useStudioContext();

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Le titre est requis.';
    if (!description.trim()) newErrors.description = 'La description est requise.';

    if (goalType === 'Temps' && timeValues <= 0) {
      newErrors.goal = 'Le temps doit être supérieur à 0.';
    } else if (goalType === 'Distance' && goalDistance <= 0) {
      newErrors.goal = 'La distance doit être supérieure à 0.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateFields()) return;

    const data = {
      title,
      goalType,
      goalTime: timeValues,
      goalDistance,
      description,
    };

    setStudioData(data);

    // Redirection vers la page /studio/editor
    router.push({
      pathname: `/studio/editor`,
    });
  };

  useEffect(() => {
    if (errors.title || errors.goal || errors.description) {
      validateFields();
    }
  }, [title, goalType, timeValues, goalDistance, description]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* KeyboardAvoidingView pour gérer le clavier */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Contenu défilable */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.backButtonContainer}>
            <BackButton />
          </View>

          <View style={styles.headerContainer}>
            <ThemedText type="title">Créer ma Run Guidée</ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="default">Titre de la Run</ThemedText>
            <TextInputField
              placeholder="Ma première Run guidée"
              value={title}
              onChange={setTitle}
              status={errors.title ? 'error' : 'default'}
              errorMessage={errors.title}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="default">Type de l'objectif</ThemedText>
            <View style={styles.selectContainer}>
              <SelectInput
                options={['Temps', 'Distance']}
                onValueChange={(value) => setGoalType(value as 'Temps' | 'Distance')}
                value={goalType}
                hidePlaceholder
              />
              {goalType === 'Temps' ? (
                <TimeInputs
                  totalSeconds={timeValues}
                  onChange={(seconds) => {
                    console.log(seconds);

                    setTimeValues(seconds);
                  }}
                  status={errors.goal ? 'error' : 'default'}
                  errorMessage={errors.goal}
                />
              ) : (
                <DistanceInput
                  value={goalDistance}
                  onChange={setGoalDistance}
                  unit="km"
                  status={errors.goal ? 'error' : 'default'}
                  errorMessage={errors.goal}
                />
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="default">Description de la Run</ThemedText>
            <TextInputField
              placeholder="Une petite description de ma Run guidée"
              multiline
              value={description}
              onChange={setDescription}
              status={errors.description ? 'error' : 'default'}
              errorMessage={errors.description}
            />
          </View>

          {/* Bouton "Suivant" */}
          <View style={styles.footerContainer}>
            <View style={styles.buttonWrapper}>
              <ThemedButton
                title="Suivant"
                buttonSize="medium"
                buttonType="confirm"
                buttonState="default"
                onPress={() => handleNext()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 80,
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 20,
  },
  selectContainer: {
    gap: 20,
  },
  timeFields: {
    gap: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
