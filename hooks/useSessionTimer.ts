// hooks/useSessionTimer.ts
import { useEffect, useRef, useCallback } from 'react';
import { useSessionContext } from '@/context/SessionContext';

export function useSessionTimer() {
  const {
    sessionData,
    updateCurrentMetrics,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  } = useSessionContext();

  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const formatTime = (totalSeconds: number) => ({
    hours: Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0'),
    minutes: Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    seconds: (totalSeconds % 60).toString().padStart(2, '0'),
  });

  useEffect(() => {
    if (sessionData?.status === 'running') {
      intervalRef.current = setInterval(() => {
        const startTime = sessionData.startTime || 0;
        const totalPauseTime = sessionData.totalPauseTime || 0;
        const elapsedSeconds = Math.floor((Date.now() - startTime - totalPauseTime) / 1000);

        updateCurrentMetrics({
          time: formatTime(elapsedSeconds),
          distance: sessionData.currentMetrics?.distance || '0,00',
          pace: sessionData.currentMetrics?.pace || '0\'00"',
          calories: sessionData.currentMetrics?.calories || '0',
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionData?.status, updateCurrentMetrics]);

  const handlePlayPause = useCallback(() => {
    if (!sessionData) return;

    if (sessionData.status === 'ready' || !sessionData.status) {
      startSession();
    } else if (sessionData.status === 'running') {
      pauseSession();
    } else if (sessionData.status === 'paused') {
      resumeSession();
    }
  }, [sessionData?.status, startSession, pauseSession, resumeSession]);

  const handleStop = useCallback(() => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
    }
    stopSession();
  }, [stopSession]);

  return {
    isRunning: sessionData?.status === 'running',
    currentMetrics: sessionData?.currentMetrics,
    handlePlayPause,
    handleStop,
  };
}
