import { create } from 'zustand';
import { API_URL } from '@/constants/env';
import { useAuth } from './auth';

export type Friend = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  isRunning?: boolean;
  avatar?: string;
};

type FriendRequest = {
  request_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  avatar?: string;
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

type UserSearchResult = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  request_id: number | null;
  friend_status: 'friend' | 'waiting' | 'need_response' | 'none';
};

type FriendsState = {
  friends: Friend[];
  requests: FriendRequest[];
  allUsers: FriendRequest[];
  blockedNotifications: number[];
  isLoading: boolean;
  error: string | null;
  searchResults: UserSearchResult[];
  loadingSearch: boolean;
  errorSearch: string | null;

  // Actions
  fetchFriends: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  sendFriendRequest: (friendId: number) => Promise<void>;
  acceptFriendRequest: (requestId: number) => Promise<void>;
  declineFriendRequest: (requestId: number) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  toggleNotificationBlock: (userId: number) => Promise<void>;
  fetchNotificationSettings: () => Promise<void>;
  fetchLiveFriends: (userIds: number[]) => Promise<LiveFriend[]>;
  clearError: () => void;
  searchUsers: (query: string) => Promise<void>;
};

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  requests: [],
  allUsers: [],
  blockedNotifications: [],
  isLoading: false,
  error: null,
  searchResults: [],
  loadingSearch: false,
  errorSearch: null,

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

      // Transformer les données de l'API au format attendu
      const transformedFriends = data.map((friend: any) => ({
        id: friend.id,
        first_name: friend.first_name,
        last_name: friend.last_name,
        username: friend.username,
        isRunning: friend.isRunning || false,
        avatar:
          friend.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${friend.first_name} ${friend.last_name}`
          )}`,
      }));

      set({ friends: transformedFriends, isLoading: false });
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

      // Transformer les données de l'API au format attendu
      const transformedRequests = data.map((request: any) => ({
        request_id: request.request_id,
        user_id: request.user_id,
        first_name: request.first_name,
        last_name: request.last_name,
        username: request.username,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${request.first_name} ${request.last_name}`
        )}`,
      }));

      set({ requests: transformedRequests, isLoading: false });
    } catch (error) {
      console.log(
        '❌ Erreur demandes:',
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

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/notification/block/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      console.log('✅ Paramètre de notification mis à jour');

      // Recharger les paramètres de notification pour synchroniser l'état
      await get().fetchNotificationSettings();
      set({ isLoading: false });
    } catch (error) {
      console.log(
        '❌ Erreur toggle notification:',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
      throw error;
    }
  },

  fetchNotificationSettings: async () => {
    const token = useAuth.getState().token;
    if (!token) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/friend/notification/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('message erreur', response.status);
      if (response.status === 404) {
        console.log('🔴 fetchNotificationSettings: Pas de config trouvée');
        // Pas de config trouvée, on considère qu'il n'y a aucun blocage
        set({ blockedNotifications: [], isLoading: false });
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      // data est un tableau d'objets { id, user, friend, isNotificationBlock }
      // On extrait les id des amis pour lesquels isNotificationBlock est true
      const blocked = Array.isArray(data)
        ? data
            .filter((item: any) => item.isNotificationBlock && item.friend && item.friend.id)
            .map((item: any) => item.friend.id)
        : [];
      set({ blockedNotifications: blocked, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur inconnue', isLoading: false });
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

  searchUsers: async (query: string) => {
    const token = useAuth.getState().token;
    if (!token) {
      set({ errorSearch: 'Pas de token', loadingSearch: false });
      return;
    }
    set({ loadingSearch: true, errorSearch: null });
    try {
      const response = await fetch(
        `${API_URL}/api/user/search?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
      const data: UserSearchResult[] = await response.json();
      console.log('Résultat API /api/user/search:', data);
      set({ searchResults: data, loadingSearch: false });
    } catch (error) {
      set({
        errorSearch: error instanceof Error ? error.message : 'Erreur inconnue',
        loadingSearch: false,
      });
    }
  },
}));
