import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const registerForNotifications = async (): Promise<void> => {
    try {
      const token = await notificationService.registerForPushNotifications();
      setExpoPushToken(token);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des notifications:', err);
    }
  };

  useEffect(() => {
    // Écouter les notifications reçues pour les logs
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification reçue:', notification);
      console.log('DATA LOG', notification.request.content.data);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Réponse à la notification:', response);
      
      // Gérer la redirection selon le type de notification
      const data = response.notification.request.content.data;
      
      if (data && typeof data === 'object') {
        const { type, userId, firstName } = data as { type?: string; userId?: number; firstName?: string };
        
        if (type === 'friendSession' && userId) {
          console.log(`Redirection vers /cheer avec id: ${userId}, firstName: ${firstName || 'Ami'}`);
          router.push({
            pathname: '/cheer',
            params: {
              id: String(userId),
              firstName: firstName || 'ton ami',
            },
          });
        }
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    expoPushToken,
    registerForNotifications,
  };
}; 