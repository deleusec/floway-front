import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
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