import { create } from 'zustand';
import { API_URL, NODE_URL } from '@/constants/env';
import { useAuth } from './auth';

export type Friend = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  isRunning?: boolean;
  avatar?: string;
  notification_block?: number; // 1 = bloqué, 0 = non bloqué
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
  blockedNotifications: number[]; // On peut garder ça pour la compatibilité
  searchResults: UserSearchResult[];
  isLoading: boolean;
  error: string | null;
  loadingSearch: boolean;
  errorSearch: string | null;
  isPolling: boolean;

  fetchFriends: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  sendFriendRequest: (friendId: number) => Promise<void>;
  acceptFriendRequest: (requestId: number) => Promise<void>;
  declineFriendRequest: (requestId: number) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  toggleNotificationBlock: (userId: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  clearError: () => void;
  fetchLiveFriends: (userIds: number[]) => Promise<LiveFriend[]>;
};

let pollingInterval: NodeJS.Timeout | null = null;

const getAuthToken = () => {
  const token = useAuth.getState().token;
  if (!token) throw new Error("Pas de token d'authentification");
  return token;
};

const createDefaultAvatar = (firstName: string, lastName: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(`${firstName} ${lastName}`)}`;
};

const transformFriendData = (friendData: any): Friend => ({
  id: friendData.id,
  first_name: friendData.first_name,
  last_name: friendData.last_name,
  username: friendData.username,
  isRunning: friendData.isRunning || false,
  avatar: friendData.avatar || createDefaultAvatar(friendData.first_name, friendData.last_name),
  notification_block: friendData.notification_block || 0,
});

const transformRequestData = (requestData: any): FriendRequest => ({
  request_id: requestData.request_id,
  user_id: requestData.user_id,
  first_name: requestData.first_name,
  last_name: requestData.last_name,
  username: requestData.username,
  avatar: createDefaultAvatar(requestData.first_name, requestData.last_name),
});

const apiFetchFriends = async (): Promise<Friend[]> => {
  const token = getAuthToken();
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
  return data.map(transformFriendData);
};

const apiFetchRunningSessions = async (): Promise<number[]> => {
  const token = getAuthToken();
  const response = await fetch(`${NODE_URL}/auth/friend/session`, {
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

  if (Array.isArray(data)) {
    const runningUserIds = data.filter(item => item.user_id).map(item => item.user_id);

    console.log('📊 Sessions actives trouvées:', runningUserIds);
    return runningUserIds;
  }

  console.log('⚠️ Format de données inattendu pour les sessions:', data);
  return [];
};

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  requests: [],
  allUsers: [],
  blockedNotifications: [],
  searchResults: [],
  isLoading: false,
  error: null,
  loadingSearch: false,
  errorSearch: null,
  isPolling: false,

  fetchFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      const friends = await apiFetchFriends();
      set({ friends, isLoading: false });

      try {
        console.log('🔄 Mise à jour immédiate des statuts de course...');
        const runningUserIds = await apiFetchRunningSessions();

        const updatedFriends = friends.map(friend => ({
          ...friend,
          isRunning: runningUserIds.includes(friend.id),
        }));

        set({ friends: updatedFriends });
        console.log('✅ Statuts de course initialisés:', runningUserIds.length, 'amis en course');
      } catch (sessionError) {
        console.warn('⚠️ Erreur lors de la mise à jour des statuts de course:', sessionError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchRequests: async () => {
    try {
      const token = getAuthToken();
      set({ isLoading: true, error: null });

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
      const requests = data.map(transformRequestData);
      set({ requests, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
    }
  },

  sendFriendRequest: async (userId: number) => {
    try {
      const token = getAuthToken();
      set({ isLoading: true, error: null });

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

      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  acceptFriendRequest: async (requestId: number) => {
    try {
      const token = getAuthToken();
      set({ isLoading: true, error: null });

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

      await get().fetchFriends();
      await get().fetchRequests();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  declineFriendRequest: async (requestId: number) => {
    try {
      const token = getAuthToken();
      set({ isLoading: true, error: null });

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

      await get().fetchRequests();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeFriend: async (friendId: number) => {
    try {
      const token = getAuthToken();
      set({ isLoading: true, error: null });

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

      await get().fetchFriends();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  toggleNotificationBlock: async (userId: number) => {
    try {
      const token = getAuthToken();
      set({ isLoading: true, error: null });

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

      // Rafraîchir la liste des amis au lieu de fetchNotificationSettings
      await get().fetchFriends();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  searchUsers: async (query: string) => {
    try {
      const token = getAuthToken();
      set({ loadingSearch: true, errorSearch: null });

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
      set({ searchResults: data, loadingSearch: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      set({ errorSearch: errorMessage, loadingSearch: false });
    }
  },

  startPolling: () => {
    const state = get();

    if (state.isPolling || pollingInterval) return;

    set({ isPolling: true });
    state.fetchFriends();

    pollingInterval = setInterval(async () => {
      const currentState = get();
      if (!currentState.isPolling) return;

      try {
        console.log(
          '🔄 Polling - Vérification des sessions actives...',
          new Date().toLocaleTimeString()
        );

        const runningUserIds = await apiFetchRunningSessions();

        const currentlyRunning = currentState.friends
          .filter(friend => friend.isRunning)
          .map(friend => friend.id);
        const newlyRunning = runningUserIds.filter(id => !currentlyRunning.includes(id));
        const stoppedRunning = currentlyRunning.filter(id => !runningUserIds.includes(id));

        if (newlyRunning.length > 0) {
          console.log('🏃‍♀️ Nouveaux coureurs:', newlyRunning);
        }
        if (stoppedRunning.length > 0) {
          console.log('🛑 Arrêt de course:', stoppedRunning);
        }

        const updatedFriends = currentState.friends.map(friend => ({
          ...friend,
          isRunning: runningUserIds.includes(friend.id),
        }));

        set({ friends: updatedFriends });
        console.log(
          '✅ Polling - Statuts mis à jour:',
          runningUserIds.length,
          'amis en course sur',
          currentState.friends.length,
          'amis total'
        );
      } catch (error) {
        console.warn('❌ Erreur lors du polling des sessions:', error);
      }
    }, 15000);
  },

  stopPolling: () => {
    set({ isPolling: false });
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  },

  clearError: () => {
    set({ error: null, errorSearch: null });
  },

  fetchLiveFriends: async (userIds: number[]) => {
    try {
      const token = getAuthToken();

      const response = await fetch(`${API_URL}/api/friend/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Erreur lors de la récupération des amis en direct:', error);
      return [];
    }
  },
}));
