import { useCallback, useState, useEffect } from 'react';
import { audioManager } from '@/services/audioManager';

export function useSpeechManager() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [queueLength, setQueueLength] = useState(0);

  // Mettre à jour l'état depuis le gestionnaire global
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying(audioManager.playing);
      setQueueLength(audioManager.queueLength);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Méthodes publiques simplifiées
  const speakText = useCallback((text: string, priority: 'high' | 'normal' | 'low' = 'normal') => {
    audioManager.speakText(text, priority);
  }, []);

  const playAudio = useCallback((audioName: string, priority: 'high' | 'normal' | 'low' = 'normal') => {
    audioManager.playAudio(audioName, priority);
  }, []);

  const speakInternal = useCallback((text: string) => {
    audioManager.speakInternal(text);
  }, []);

  // Contrôles
  const stop = useCallback(async () => {
    await audioManager.stop();
  }, []);

  const clearQueue = useCallback(() => {
    audioManager.clearQueue();
  }, []);

  // Méthode legacy pour compatibilité
  const speak = useCallback((message: { type: string; text: string; priority?: number }) => {
    const priority = message.priority === 1 ? 'high' : 'normal';
    speakText(message.text, priority);
  }, [speakText]);

  return {
    // Nouvelles méthodes unifiées
    speakText,
    playAudio,
    speakInternal,
    
    // Contrôles
    stop,
    clearQueue,
    
    // État
    isPlaying,
    queueLength,
    
    // Méthode legacy pour compatibilité
    speak,
  };
}