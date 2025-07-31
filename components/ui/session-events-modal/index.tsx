import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import SvgX from '@/components/icons/X';
import SvgPlayIcon from '@/components/icons/PlayIcon';
import SvgUsersIcon from '@/components/icons/UsersIcon';
import SvgFlowayIcon from '@/components/icons/FlowayIcon';
import { useSpeechManager } from '@/hooks/useSpeechManager';
import { IEvent } from '@/types';

// Interface pour les événements avec friend amélioré
interface EventWithFriend extends IEvent {
  friend?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface SessionEventsModalProps {
  visible: boolean;
  onClose: () => void;
  events: IEvent[];
}

const SessionEventsModal: React.FC<SessionEventsModalProps> = ({
  visible,
  onClose,
  events,
}) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const { playAudio } = useSpeechManager();

  // Fonction pour lire un fichier audio via le gestionnaire unifié
  const playAudioFile = async (audioName: string) => {
    console.log('🎵 SessionEvents - Demande de lecture audio:', audioName);
    
    // Utiliser le gestionnaire audio unifié avec priorité normale
    playAudio(audioName, 'normal');
    
    // Pour les indicateurs visuels, on simule les états
    setLoadingAudio(audioName);
    
    // Simuler un délai pour l'indicateur de chargement
    setTimeout(() => {
      setLoadingAudio(null);
      setPlayingAudio(audioName);
      
      // Réinitialiser l'état après un délai (estimation)
      setTimeout(() => {
        setPlayingAudio(null);
      }, 5000); // 5 secondes par défaut, peut être ajusté
    }, 1000);
  };

  // Fonction pour arrêter l'audio
  const stopAudio = async () => {
    console.log('🛑 SessionEvents - Arrêt audio demandé');
    setPlayingAudio(null);
    setLoadingAudio(null);
  };

  // Fonction pour gérer le clic sur une card audio
  const handleAudioCardPress = async (audioName: string) => {
    if (playingAudio === audioName) {
      // Si cet audio est en cours de lecture, l'arrêter
      await stopAudio();
    } else {
      // Sinon, le lire
      await playAudioFile(audioName);
    }
  };

  // Fonction pour rendre un événement
  const renderEvent = (event: EventWithFriend, index: number) => {
    const isAudioPlaying = event.type === 'audio' && event.audio_name && playingAudio === event.audio_name;
    const isAudioLoading = event.type === 'audio' && event.audio_name && loadingAudio === event.audio_name;
    
    const getEventIcon = () => {
      switch (event.type) {
        case 'audio':
          if (isAudioLoading) {
            return <ActivityIndicator size="small" color="#624AF6" />;
          }
          if (isAudioPlaying) {
            return <SvgPlayIcon color="#624AF6" size={20} />;
          }
          return <SvgPlayIcon color="#5E5E5E" size={20} />;
        case 'text':
          return <SvgUsersIcon color="#5E5E5E" size={20} />;
        case 'internal':
          return <SvgFlowayIcon color="#5E5E5E" size={20} />;
        default:
          return <SvgFlowayIcon color="#5E5E5E" size={20} />;
      }
    };

    const getEventText = () => {
      const friendName = event.friend ? `${event.friend.first_name} ${event.friend.last_name}` : '';
      
      switch (event.type) {
        case 'audio':
          return (
            <Text style={styles.eventText}>
              <Text style={styles.friendName}>{friendName}</Text> t'a envoyé un audio
            </Text>
          );
        case 'text':
          return (
            <Text style={styles.eventText}>
              <Text style={styles.friendName}>{friendName}</Text> t'a dit : {event.text_content}
            </Text>
          );
        case 'internal':
          return <Text style={styles.eventText}>{event.text_content}</Text>;
        default:
          return <Text style={styles.eventText}>{event.text_content}</Text>;
      }
    };

    const handlePress = () => {
      if (event.type === 'audio' && event.audio_name) {
        handleAudioCardPress(event.audio_name);
      }
    };

    const cardStyle = [
      styles.eventCard,
      (isAudioPlaying || isAudioLoading) && styles.eventCardPlaying,
      event.type === 'audio' && event.audio_name && styles.eventCardClickable,
    ];

    return (
      <TouchableOpacity 
        key={index} 
        style={cardStyle}
        onPress={handlePress}
        disabled={event.type !== 'audio' || !event.audio_name || !!isAudioLoading}
        activeOpacity={event.type === 'audio' && event.audio_name && !isAudioLoading ? 0.7 : 1}
      >
        <View style={styles.eventIcon}>
          {getEventIcon()}
        </View>
        <View style={styles.eventContent}>
          {getEventText()}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mes flows</Text>
          <TouchableOpacity onPress={onClose}>
            <SvgX width={24} height={24} color='#444444' />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {events && events.length > 0 ? (
            <View style={styles.eventsList}>
              {events.map((event: IEvent, index: number) => renderEvent(event, index))}
            </View>
          ) : (
            <View style={styles.eventsPlaceholder}>
              <Text style={styles.placeholderText}>Aucun flow pour cette session</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  eventsList: {
    gap: 20,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 18,
  },
  eventCardClickable: {
    // Style pour les cards audio cliquables
  },
  eventCardPlaying: {
    borderColor: '#624AF6', // Primary color
    borderWidth: 2,
  },
  eventIcon: {
    marginRight: Spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  friendName: {
    fontWeight: '600',
    color: '#624AF6', // Primary color
  },
  eventsPlaceholder: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default SessionEventsModal;