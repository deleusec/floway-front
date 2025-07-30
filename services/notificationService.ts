import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class ExpoNotificationService {
  private readonly projectId = "322043eb-a978-4c6d-a7d7-f504a68dddef";

  /**
   * Demande les permissions et récupère le token Expo push
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn('Les push notifications ne fonctionnent que sur un appareil physique');
      return null;
    }

    try {
      // Vérifier les permissions existantes
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Demander les permissions si pas encore accordées
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission refusée pour les notifications push');
        return null;
      }

      // Configuration Android spécifique
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#624AF6',
        });
      }

      // Récupérer le token
      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: this.projectId,
      });

      return pushToken.data;

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des push notifications:', error);
      return null;
    }
  }
}

// Instance singleton du service
export const notificationService = new ExpoNotificationService(); 