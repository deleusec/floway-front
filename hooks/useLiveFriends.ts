import { useState, useEffect, useRef } from 'react';
import { useFriendsStore } from '@/stores/friends';

// Amis fictifs pour la démonstration
const fakeFriends = [
  {
    id: 9991,
    first_name: 'Thomas',
    last_name: 'Martin',
    username: 'thomas_martin',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isRunning: true,
  },
  {
    id: 9992,
    first_name: 'Emma',
    last_name: 'Dubois',
    username: 'emma_dubois',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isRunning: false,
  },
  {
    id: 9993,
    first_name: 'Lucas',
    last_name: 'Bernard',
    username: 'lucas_bernard',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isRunning: true,
  },
  {
    id: 9994,
    first_name: 'Chloé',
    last_name: 'Petit',
    username: 'chloe_petit',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isRunning: false,
  },
  {
    id: 9995,
    first_name: 'Hugo',
    last_name: 'Moreau',
    username: 'hugo_moreau',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isRunning: true,
  },
];

export const useLiveFriends = (pollingInterval = 5000) => {
  const [liveFriends, setLiveFriends] = useState<any[]>([]);
  const [fakeFriendsStatus, setFakeFriendsStatus] = useState(fakeFriends);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fakeStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { friends, fetchLiveFriends, blockedNotifications } = useFriendsStore();

  // Récupérer les IDs des amis qui ne sont pas bloqués
  const getActiveFriendIds = () => {
    return friends
      .filter(friend => friend.id && !blockedNotifications.includes(friend.id))
      .map(friend => friend.id!);
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

  // Changer aléatoirement le statut des amis fictifs
  const updateFakeFriendsStatus = () => {
    setFakeFriendsStatus(prev =>
      prev.map(friend => ({
        ...friend,
        isRunning: Math.random() > 0.6, // 40% de chance d'être en train de courir
      }))
    );
  };

  // Démarrer le polling
  useEffect(() => {
    // Première vérification immédiate
    poll();

    // Puis toutes les X secondes
    intervalRef.current = setInterval(poll, pollingInterval);

    // Changer le statut des amis fictifs toutes les 30 secondes
    fakeStatusIntervalRef.current = setInterval(updateFakeFriendsStatus, 30000);

    // Nettoyer à la destruction du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (fakeStatusIntervalRef.current) {
        clearInterval(fakeStatusIntervalRef.current);
        fakeStatusIntervalRef.current = null;
      }
    };
  }, [friends, blockedNotifications]);

  // Mettre à jour les amis avec leur statut en direct
  const getFriendsWithLiveStatus = () => {
    // Combiner les vrais amis avec les amis fictifs
    const allFriends = [...friends, ...fakeFriendsStatus];

    return allFriends.map(friend => ({
      ...friend,
      isRunning:
        liveFriends.some(live => live.user_id === friend.id) ||
        (fakeFriendsStatus.some(fake => fake.id === friend.id) && friend.isRunning),
    }));
  };

  return {
    liveFriends,
    getFriendsWithLiveStatus,
  };
};
