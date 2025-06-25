import { create } from 'zustand';
import { API_URL } from '@/constants/env';
import { useAuth } from './auth';

type Friend = {
  id: string;
  firstName: string;
  avatar: string;
  isRunning: boolean;
  username?: string;
  user_id?: number;
};

type FriendRequest = {
  id: string;
  firstName: string;
  avatar: string;
  request_id?: number;
  user_id?: number;
};

type LiveFriend = {
  user_id: number;
  isRunning: boolean;
  currentSession?: {
    id: number;
    startTime: string;
    distance: number;
    duration: number;
  };
};

type FriendsState = {
  friends: Friend[];
  requests: FriendRequest[];
  allUsers: FriendRequest[];
  blockedNotifications: number[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFriends: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  sendFriendRequest: (friendId: number) => Promise<void>;
  acceptFriendRequest: (requestId: number) => Promise<void>;
  declineFriendRequest: (requestId: number) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  toggleNotificationBlock: (userId: number) => Promise<void>;
  fetchNotificationSettings: () => Promise<void>;
  fetchLiveFriends: (userIds: number[]) => Promise<LiveFriend[]>;
  clearError: () => void;
};

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [
    {
      id: '1',
      firstName: 'Jean',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isRunning: true,
      user_id: 1,
    },
    {
      id: '2',
      firstName: 'Marie',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      isRunning: false,
      user_id: 2,
    },
    {
      id: '3',
      firstName: 'Pierre',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      isRunning: true,
      user_id: 3,
    },
  ],
  requests: [
    {
      id: '4',
      firstName: 'Sophie',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      request_id: 1,
    },
  ],
  allUsers: [
    {
      id: '1',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: '2',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      id: '3',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: '4',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
      id: '5',
      firstName: 'Farah',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
  ],
  blockedNotifications: [],
  isLoading: false,
  error: null,

  // Actions
  fetchFriends: async () => {
    const token = useAuth.getState().token;
    if (!token) {
      console.log('❌ Pas de token');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/list`, {
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
      console.log('✅ Amis récupérés:', data.length);
      set({ friends: data, isLoading: false });
    } catch (error) {
      console.log('❌ Erreur amis:', error instanceof Error ? error.message : 'Erreur inconnue');
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
    }
  },

  fetchRequests: async () => {
    const token = useAuth.getState().token;
    if (!token) {
      console.log('❌ Pas de token');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/list/request`, {
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
      console.log('✅ Demandes récupérées:', data.length);
      set({ requests: data, isLoading: false });
    } catch (error) {
      console.log(
        '❌ Erreur demandes:',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
    }
  },

  fetchAllUsers: async () => {
    const token = useAuth.getState().token;
    if (!token) {
      console.log('❌ Pas de token');
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Endpoint temporairement désactivé
      console.log('⚠️ Endpoint /api/users non disponible - données temporaires');
      set({ isLoading: false });
    } catch (error) {
      console.log(
        '❌ Erreur utilisateurs:',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
    }
  },

  sendFriendRequest: async (userId: number) => {
    const token = useAuth.getState().token;
    if (!token) {
      throw new Error('Pas de token');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_id: userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('✅ Demande envoyée');
      set({ isLoading: false });
    } catch (error) {
      console.log('❌ Erreur envoi:', error instanceof Error ? error.message : 'Erreur inconnue');
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
      throw error;
    }
  },

  acceptFriendRequest: async (requestId: number) => {
    const token = useAuth.getState().token;
    if (!token) {
      throw new Error('Pas de token');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: requestId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('✅ Demande acceptée');
      await get().fetchFriends();
      await get().fetchRequests();
      set({ isLoading: false });
    } catch (error) {
      console.log(
        '❌ Erreur acceptation:',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
      throw error;
    }
  },

  declineFriendRequest: async (requestId: number) => {
    const token = useAuth.getState().token;
    if (!token) {
      throw new Error('Pas de token');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: requestId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('✅ Demande refusée');
      await get().fetchRequests();
      set({ isLoading: false });
    } catch (error) {
      console.log('❌ Erreur refus:', error instanceof Error ? error.message : 'Erreur inconnue');
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
      throw error;
    }
  },

  removeFriend: async (friendId: number) => {
    const token = useAuth.getState().token;
    if (!token) {
      throw new Error('Pas de token');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ friend_id: friendId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('✅ Ami supprimé');
      await get().fetchFriends();
      set({ isLoading: false });
    } catch (error) {
      console.log(
        '❌ Erreur suppression:',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
      throw error;
    }
  },

  toggleNotificationBlock: async (userId: number) => {
    const token = useAuth.getState().token;
    if (!token) {
      console.log("🔴 toggleNotificationBlock: Pas de token d'authentification");
      throw new Error("Pas de token d'authentification");
    }

    console.log('🟡 toggleNotificationBlock: Début de la requête pour userId:', userId);
    set({ isLoading: true, error: null });

    try {
      console.log('🟡 toggleNotificationBlock: URL:', `${API_URL}/api/friend/notifications/toggle`);

      const response = await fetch(`${API_URL}/api/friend/notifications/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      console.log('🟡 toggleNotificationBlock: Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 toggleNotificationBlock: Erreur response:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('🟢 toggleNotificationBlock: Notifications basculées avec succès');
      // Recharger les paramètres de notification
      await get().fetchNotificationSettings();
      set({ isLoading: false });
    } catch (error) {
      console.log('🔴 toggleNotificationBlock: Erreur catch:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchNotificationSettings: async () => {
    const token = useAuth.getState().token;
    if (!token) {
      console.log("🔴 fetchNotificationSettings: Pas de token d'authentification");
      return;
    }

    console.log('🟡 fetchNotificationSettings: Début de la requête');
    set({ isLoading: true, error: null });

    try {
      console.log(
        '🟡 fetchNotificationSettings: URL:',
        `${API_URL}/api/friend/notifications/settings`
      );

      const response = await fetch(`${API_URL}/api/friend/notifications/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('🟡 fetchNotificationSettings: Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 fetchNotificationSettings: Erreur response:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('🟢 fetchNotificationSettings: Données reçues:', data);
      set({ blockedNotifications: data.blockedUsers || [], isLoading: false });
    } catch (error) {
      console.log('🔴 fetchNotificationSettings: Erreur catch:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchLiveFriends: async (userIds: number[]) => {
    const token = useAuth.getState().token;
    if (!token) {
      console.log("🔴 fetchLiveFriends: Pas de token d'authentification");
      return [];
    }

    console.log('🟡 fetchLiveFriends: Début de la requête pour userIds:', userIds);

    try {
      console.log('🟡 fetchLiveFriends: URL:', `${API_URL}/api/friend/live`);

      const response = await fetch(`${API_URL}/api/friend/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds }),
      });

      console.log('🟡 fetchLiveFriends: Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔴 fetchLiveFriends: Erreur response:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('🟢 fetchLiveFriends: Données reçues:', data);
      return data;
    } catch (error) {
      console.log('🔴 fetchLiveFriends: Erreur catch:', error);
      return [];
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
