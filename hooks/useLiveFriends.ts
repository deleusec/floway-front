import { useState, useEffect, useRef } from 'react';
import { useFriendsStore } from '@/stores/friends';

export const useLiveFriends = (pollingInterval = 5000) => {
  const [liveFriends, setLiveFriends] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { friends, fetchLiveFriends, blockedNotifications } = useFriendsStore();

  // Récupérer les IDs des amis qui ne sont pas bloqués
  const getActiveFriendIds = () => {
    return friends
      .filter(friend => friend.user_id && !blockedNotifications.includes(friend.user_id))
      .map(friend => friend.user_id!);
  };

  // Polling pour les amis en direct
  const poll = async () => {
    try {
      const friendIds = getActiveFriendIds();
      if (friendIds.length > 0) {
        const liveData = await fetchLiveFriends(friendIds);
        setLiveFriends(liveData);
      }
    } catch (error) {
      console.error('Erreur lors du polling des amis en direct:', error);
    }
  };

  // Démarrer le polling
  useEffect(() => {
    // Première vérification immédiate
    poll();

    // Puis toutes les X secondes
    intervalRef.current = setInterval(poll, pollingInterval);

    // Nettoyer à la destruction du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [friends, blockedNotifications]);

  // Mettre à jour les amis avec leur statut en direct
  const getFriendsWithLiveStatus = () => {
    return friends.map(friend => ({
      ...friend,
      isRunning: liveFriends.some(live => live.user_id === friend.user_id),
    }));
  };

  return {
    liveFriends,
    getFriendsWithLiveStatus,
  };
};
