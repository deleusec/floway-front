import BackFooter from '@/components/layouts/footer/back';
import BackHeader from '@/components/layouts/header/back';
import { Colors, FontSize } from '@/constants/theme';
import { useStore } from '@/stores';
import { useCheerStore } from '@/stores/cheer';
import { router, Slot, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';

export default function CheerLayout() {
  const params = useLocalSearchParams<{ firstName?: string }>();
  const cheerStore = useCheerStore();
  const { friendName, selectedFlowId, audioUri, flows, sendEvent, reset } = cheerStore;
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

  const handleSend = async () => {
    try {
      // Vérifier qu'on a soit un audio soit un flow sélectionné
      if (!audioUri && !selectedFlowId) {
        Alert.alert('Erreur', 'Veuillez enregistrer un audio ou sélectionner un flow');
        return;
      }

      if (audioUri && selectedFlowId) {
        Alert.alert('Erreur', 'Vous ne pouvez pas envoyer un audio et un flow en même temps');
        return;
      }

      // Envoyer l'audio si on en a un
      if (audioUri) {
        try {
          console.log('[CHEER] Préparation de l\'envoi audio:', audioUri);
          
          // Déterminer le type de fichier basé sur l'URI
          const getAudioTypeFromUri = (uri: string) => {
            if (uri.includes('.mp3')) return { ext: 'mp3', type: 'audio/mp3' };
            if (uri.includes('.wav')) return { ext: 'wav', type: 'audio/wav' };
            if (uri.includes('.webm')) return { ext: 'webm', type: 'audio/webm' };
            return { ext: 'm4a', type: 'audio/m4a' }; // défaut
          };
          
          const audioType = getAudioTypeFromUri(audioUri);
          
          // Vérifier que le fichier existe et a une taille > 0
          const response = await fetch(audioUri);
          const audioBlob = await response.blob();
          const fileSize = audioBlob.size;
          
          console.log('[CHEER] Taille du fichier audio:', fileSize, 'octets');
          
          if (fileSize === 0) {
            throw new Error('Le fichier audio est vide');
          }
          
          // Dans React Native, on passe directement l'URI et les métadonnées
          const audioData = {
            uri: audioUri,
            type: audioType.type,
            name: `cheer_audio.${audioType.ext}`,
            size: fileSize,
          };
          
          console.log('[CHEER] Données audio préparées:', audioData);
          
          await sendEvent('audio', audioData);
        } catch (error) {
          console.error('[CHEER] Erreur lors de la préparation de l\'audio:', error);
          throw new Error('Impossible de préparer le fichier audio');
        }
      }
      
      // Envoyer le flow sélectionné
      if (selectedFlowId) {
        const selectedFlow = flows.find(flow => flow.id === selectedFlowId);
        if (selectedFlow) {
          await sendEvent('text', undefined, selectedFlow.text);
        }
      }

      // Retourner à l'écran principal après envoi
      Alert.alert('Succès', 'Message envoyé !', [
        { text: 'OK', onPress: () => router.push('/') }
      ]);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    }
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
            onPress: handleSend,
            variant: 'primary',
            disabled: !audioUri && !selectedFlowId, // Désactiver si rien n'est sélectionné
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
