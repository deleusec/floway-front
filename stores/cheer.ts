import { create } from 'zustand';
import flowsData from '@/assets/flows-messages.json';
import { NODE_URL } from '@/constants/env';
import { useAuth } from './auth';

interface CheerStats {
  time: number;
  distance: number;
  speed: number;
  coordinates?: number[][]; // Ajout des coordonnées pour la carte
}

interface CheerStore {
  friendName: string;
  friendId: string | null;
  stats: CheerStats | null;
  flows: { id: string; text: string }[];
  selectedFlowId: string | null;
  audioUri: string | null;
  isLoading: boolean;
  error: string | null;
  setFriend: (name: string, stats: CheerStats) => void;
  fetchFriendSession: (userId: string) => Promise<void>;
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

  pickRandomFlows: () => set({ flows: getRandomFlows(), selectedFlowId: null }),
  selectFlow: id => set({ selectedFlowId: id }),
  setAudioUri: uri => set({ audioUri: uri }),
  reset: () =>
    set({
      friendName: '',
      friendId: null,
      stats: null,
      flows: getRandomFlows(),
      selectedFlowId: null,
      audioUri: null,
      isLoading: false,
      error: null,
    }),
}));
