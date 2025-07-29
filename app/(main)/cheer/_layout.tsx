import BackFooter from '@/components/layouts/footer/back';
import BackHeader from '@/components/layouts/header/back';
import { Colors, FontSize } from '@/constants/theme';
import { useStore } from '@/stores';
import { useCheerStore } from '@/stores/cheer';
import { router, Slot, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function CheerLayout() {
  const params = useLocalSearchParams<{ firstName?: string }>();
  const cheerStore = useCheerStore();
  const { friendName, reset } = cheerStore;
  const { setBackgroundColor } = useStore()

  useEffect(() => {
    setBackgroundColor(Colors.white)
  }, []);

  // Utiliser le prénom des paramètres en priorité
  const displayName = params.firstName || friendName || 'ton ami';

  const handleClose = () => {
    reset();
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <BackHeader
        text={`Encourage ${displayName}`}
        onClose={handleClose}
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
            onPress: handleClose,
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
