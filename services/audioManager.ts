import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@/stores/auth';
import { NODE_URL } from '@/constants/env';

type AudioMessage = {
  type: 'text' | 'audio' | 'internal';
  content: string; // text pour Speech ou nom du fichier pour audio
  priority: 'high' | 'normal' | 'low'; // high = internal, normal = événements utilisateur, low = autres
};

class AudioManager {
  private queue: AudioMessage[] = [];
  private isPlaying = false;
  private currentSound: Audio.Sound | null = null;

  // Ajoute un message à la queue
  addToQueue(message: AudioMessage) {
    console.log('🎵 Audio manager - Ajout à la queue:', message);
    
    // Si c'est priorité haute (internal), on l'insère au début
    if (message.priority === 'high') {
      this.queue.unshift(message);
    } else {
      this.queue.push(message);
    }
    
    this.processQueue();
  }

  // Méthodes publiques simplifiées
  speakText(text: string, priority: 'high' | 'normal' | 'low' = 'normal') {
    this.addToQueue({
      type: 'text',
      content: text,
      priority
    });
  }

  playAudio(audioName: string, priority: 'high' | 'normal' | 'low' = 'normal') {
    this.addToQueue({
      type: 'audio',
      content: audioName,
      priority
    });
  }

  speakInternal(text: string) {
    this.addToQueue({
      type: 'internal',
      content: text,
      priority: 'high'
    });
  }

  // Traite la file d'attente
  private async processQueue() {
    if (this.isPlaying || this.queue.length === 0) return;
    
    const next = this.queue.shift();
    if (!next) return;

    console.log('🎵 Audio manager - Traitement:', next);
    this.isPlaying = true;

    try {
      if (next.type === 'text' || next.type === 'internal') {
        // Lecture texte avec Speech
        await this.speakTextMessage(next.content);
      } else if (next.type === 'audio') {
        // Lecture fichier audio
        await this.playAudioFile(next.content);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la lecture audio:', error);
    } finally {
      this.isPlaying = false;
      // Continuer avec le prochain élément
      this.processQueue();
    }
  }

  // Lecture texte avec Speech
  private async speakTextMessage(text: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Speech.speak(text, {
        language: 'fr-FR',
        onDone: () => {
          console.log('✅ Speech terminé');
          resolve();
        },
        onStopped: () => {
          console.log('⏹️ Speech arrêté');
          resolve();
        },
        onError: (error) => {
          console.error('❌ Erreur Speech:', error);
          reject(error);
        }
      });
    });
  }

  // Lecture d'un fichier audio
  private async playAudioFile(audioName: string): Promise<void> {
    try {
      console.log('🎵 Téléchargement audio:', audioName);
      
      const { token } = useAuth.getState();
      if (!token) {
        console.error('❌ Token manquant pour l\'audio');
        return;
      }

      const response = await fetch(`${NODE_URL}/auth/audio/${audioName}?authorization=${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('❌ Erreur téléchargement audio:', response.status);
        return;
      }

      const audioArrayBuffer = await response.arrayBuffer();
      const fileExtension = audioName.split('.').pop() || 'm4a';
      const tempFileName = `temp_audio_${Date.now()}.${fileExtension}`;
      const tempUri = `${FileSystem.documentDirectory}${tempFileName}`;
      
      // Convertir en base64 et sauvegarder
      const binary = new Uint8Array(audioArrayBuffer);
      let base64String = '';
      for (let i = 0; i < binary.length; i++) {
        base64String += String.fromCharCode(binary[i]);
      }
      const base64Data = btoa(base64String);
      
      await FileSystem.writeAsStringAsync(tempUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('🎵 Fichier temporaire créé:', tempUri);
      
      // Jouer l'audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: tempUri },
        { shouldPlay: true }
      );

      this.currentSound = sound;
      console.log('🎵 Lecture audio en cours');

      // Attendre la fin de la lecture
      await new Promise<void>((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log('✅ Lecture audio terminée');
            sound.unloadAsync();
            this.currentSound = null;
            // Supprimer le fichier temporaire
            FileSystem.deleteAsync(tempUri).catch(console.error);
            resolve();
          }
        });
      });
      
    } catch (error) {
      console.error('❌ Erreur lecture fichier audio:', error);
      throw error;
    }
  }

  // Stoppe tout et vide la queue
  async stop() {
    console.log('🛑 Arrêt audio manager');
    
    // Arrêter Speech
    Speech.stop();
    
    // Arrêter l'audio en cours
    if (this.currentSound) {
      try {
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      } catch (error) {
        console.error('Erreur lors de l\'arrêt de l\'audio:', error);
      }
    }
    
    // Vider la queue et réinitialiser l'état
    this.queue = [];
    this.isPlaying = false;
  }

  // Vide la queue sans arrêter la lecture en cours
  clearQueue() {
    console.log('🗑️ Vidage de la queue audio');
    this.queue = [];
  }

  // Getters pour l'état
  get playing() {
    return this.isPlaying;
  }

  get queueLength() {
    return this.queue.length;
  }
}

// Instance globale
export const audioManager = new AudioManager();

// Export de type pour TypeScript
export type { AudioMessage };