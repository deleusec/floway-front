import React, { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../stores/auth';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { expoPushToken, registerForNotifications } = useNotifications();
  const { isAuthenticated, sendPushTokenToBackend } = useAuth();

  useEffect(() => {
    // Enregistrer pour les notifications quand l'utilisateur est connecté
    if (isAuthenticated) {
      registerForNotifications();
    }
  }, [isAuthenticated, registerForNotifications]);

  useEffect(() => {
    // Envoyer le token au backend quand on l'obtient
    if (expoPushToken && isAuthenticated) {
      sendPushTokenToBackend(expoPushToken);
    }
  }, [expoPushToken, isAuthenticated, sendPushTokenToBackend]);

  return <>{children}</>;
}; 