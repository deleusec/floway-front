import { useRef, useCallback } from 'react';
import * as Speech from 'expo-speech';

type SpeechMessage = {
  type: 'info' | 'motivation' | 'alert';
  text: string;
  priority?: number;
};

export function useSpeechManager() {
  const queue = useRef<SpeechMessage[]>([]);
  const isSpeaking = useRef(false);

  // Lance la lecture d'un message
  const speak = useCallback((message: SpeechMessage) => {
    console.log('Speech manager received message:', message);
    queue.current.push(message);
    processQueue();
  }, []);

  // Traite la file d'attente
  const processQueue = useCallback(() => {
    if (isSpeaking.current || queue.current.length === 0) return;
    const next = queue.current.shift();
    if (!next) return;

    console.log('Processing speech queue, speaking:', next.text);
    isSpeaking.current = true;

    Speech.speak(next.text, {
      language: 'fr-FR',
      onDone: () => {
        console.log('Speech completed');
        isSpeaking.current = false;
        processQueue();
      },
      onStopped: () => {
        console.log('Speech stopped');
        isSpeaking.current = false;
        processQueue();
      },
      onError: (error) => {
        console.error('Speech error:', error);
        isSpeaking.current = false;
        processQueue();
      }
    });
  }, []);

  // Stoppe la lecture en cours et vide la file
  const stop = useCallback(() => {
    console.log('Stopping speech');
    Speech.stop();
    isSpeaking.current = false;
    queue.current = [];
  }, []);

  // Vide la file d'attente (sans stopper la lecture en cours)
  const clearQueue = useCallback(() => {
    console.log('Clearing speech queue');
    queue.current = [];
  }, []);

  return {
    speak,
    stop,
    clearQueue,
    isSpeaking: isSpeaking.current,
    queue: queue.current,
  };
}
