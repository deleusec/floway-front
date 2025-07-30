import { create } from 'zustand';
import flowsData from '@/assets/flows-messages.json';
import { NODE_URL } from '@/constants/env';
import { useAuth } from './auth';
import { IEvent } from '@/types';

interface CheerStats {
  time: number;
  distance: number;
  speed: number;
  coordinates?: number[][]; // Ajout des coordonnées pour la carte
}

interface AudioData {
  uri: string;
  type: string;
  name: string;
  size?: number;
}

interface CheerStore {
  friendName: string;
  friendId: string | null;
  sessionId: string | null; // Ajout pour stocker l'ID de session
  stats: CheerStats | null;
  flows: { id: string; text: string }[];
  selectedFlowId: string | null;
  audioUri: string | null;
  isLoading: boolean;
  error: string | null;
  setFriend: (name: string, stats: CheerStats) => void;
  fetchFriendSession: (userId: string) => Promise<void>;
  sendEvent: (eventType: 'audio' | 'text', audioData?: AudioData, textContent?: string) => Promise<void>;
  pickRandomFlows: () => void;
  selectFlow: (id: string) => void;
  setAudioUri: (uri: string | null) => void;
  reset: () => void;
}

function getRandomFlows() {
  const all = flowsData.messages.filter(f => f.text && f.text.length > 0);
  const shuffled = all.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

const getAuthToken = () => {
  return useAuth.getState().token;
};

export const useCheerStore = create<CheerStore>((set, get) => ({
  friendName: '',
  friendId: null,
  sessionId: null,
  stats: null,
  flows: getRandomFlows(),
  selectedFlowId: null,
  audioUri: null,
  isLoading: false,
  error: null,

  setFriend: (name, stats) => set({ friendName: name, stats }),

  fetchFriendSession: async (userId: string) => {
    try {
      set({ isLoading: true, error: null, friendId: userId });
      const token = getAuthToken();

      const response = await fetch(`${NODE_URL}/last/user/session/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('[CHEER] Retour API:', data);

      // Transformer les données de l'API en format CheerStats
      const stats: CheerStats = {
        time: data.time || 0, // En secondes
        distance: (data.distance || 0) * 1000, // Convertir km en mètres
        speed: data.allure ? 60 / data.allure : 0, // Convertir allure (min/km) en vitesse (km/h)
        coordinates: data.tps || [], // Utiliser data.tps directement
      };

      console.log('[CHEER] Stats transformées:', stats);

      set({
        stats,
        sessionId: data.id || data._id || null, // Récupérer l'ID de session
        isLoading: false,
        friendName: data.title ? data.title.split(' ')[0] || `Ami ${userId}` : `Ami ${userId}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors de la récupération des données';
      set({ error: errorMessage, isLoading: false });
      console.error('Erreur fetchFriendSession:', error);
    }
  },

  sendEvent: async (eventType: 'audio' | 'text', audioData?: AudioData, textContent?: string) => {
    try {
      const { sessionId } = get();
      const token = getAuthToken();

      if (!sessionId) {
        throw new Error('Aucune session trouvée');
      }

      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const formData = new FormData();
      formData.append('event_type', eventType);
      formData.append('session_id', sessionId);

      if (eventType === 'audio' && audioData) {
        // Dans React Native, FormData accepte directement un objet avec uri, type et name
        formData.append('audio_file', {
          uri: audioData.uri,
          type: audioData.type,
          name: audioData.name,
        } as any);
        
        console.log('[CHEER] FormData audio créé:', {
          uri: audioData.uri,
          type: audioData.type,
          name: audioData.name,
          size: audioData.size,
          sessionId: sessionId
        });
      } else if (eventType === 'text' && textContent) {
        formData.append('text_content', textContent);
      } else {
        throw new Error('Données d\'événement manquantes');
      }

      console.log('[CHEER] Envoi vers:', `${NODE_URL}/auth/event`);
      console.log('[CHEER] Headers d\'autorisation:', token ? 'Présent' : 'Manquant');
      
      // Debug: Afficher le contenu du FormData
      console.log('[CHEER] Contenu FormData:');
      for (let [key, value] of formData.entries()) {
        if (key === 'audio_file') {
          console.log(`  ${key}:`, typeof value === 'object' ? JSON.stringify(value) : value);
        } else {
          console.log(`  ${key}:`, value);
        }
      }
      
      const response = await fetch(`${NODE_URL}/auth/event`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Ne pas définir Content-Type, laissons FormData gérer cela
        },
        body: formData,
      });

      console.log('[CHEER] Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[CHEER] Erreur détaillée:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('[CHEER] Événement envoyé avec succès');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'envoi de l\'événement';
      set({ error: errorMessage });
      console.error('Erreur sendEvent:', error);
      throw error;
    }
  },

  pickRandomFlows: () => set({ flows: getRandomFlows(), selectedFlowId: null }),
  selectFlow: id => set(state => ({ 
    selectedFlowId: id,
    // Désélectionner l'audio si un flow est sélectionné
    audioUri: id ? null : state.audioUri
  })),
  setAudioUri: uri => set({ audioUri: uri }),
  reset: () =>
    set({
      friendName: '',
      friendId: null,
      sessionId: null,
      stats: null,
      flows: getRandomFlows(),
      selectedFlowId: null,
      audioUri: null,
      isLoading: false,
      error: null,
    }),
}));
