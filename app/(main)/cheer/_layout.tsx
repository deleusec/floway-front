import BackFooter from '@/components/layouts/footer/back';
import BackHeader from '@/components/layouts/header/back';
import { Colors, FontSize } from '@/constants/theme';
import { useCheerStore } from '@/stores/cheer';
import { Slot, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function CheerLayout() {
  const params = useLocalSearchParams<{ firstName?: string }>();
  const cheerStore = useCheerStore();
  const { friendName, reset } = cheerStore;

  // Utiliser le prénom des paramètres en priorité
  const displayName = params.firstName || friendName || 'ton ami';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <BackHeader
        text={`Encourage ${displayName}`}
        onClose={reset}
        icon='💪'
        iconSize={FontSize.xl}
        iconColor={Colors.textPrimary}
      />
      {/* Content */}
      <Slot />
      {/* Footer */}
      <BackFooter
        actions={[
          {
            label: 'Annuler',
            onPress: reset,
            variant: 'outline',
          },
          {
            label: 'Envoyer',
            onPress: () => {},
            variant: 'primary',
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});
