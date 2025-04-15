import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';

interface StopCountdownProps {
  isVisible: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export default function StopCountdown({ isVisible, onCancel, onComplete }: StopCountdownProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isVisible) {
      setCountdown(3);
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          // Utilisation de setTimeout pour éviter la mise à jour pendant le rendu
          setTimeout(() => {
            onComplete();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.container}>
          <Text style={styles.title}>Arrêt de la session en cours</Text>
          <Text style={styles.subtitle}>Relâchez le bouton pour annuler</Text>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: Colors.light.white,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.light.white,
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 32,
  },
  countdown: {
    color: Colors.light.white,
    fontSize: 64,
    fontWeight: 'bold',
  },
});
