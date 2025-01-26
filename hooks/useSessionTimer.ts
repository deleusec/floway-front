import { SessionData } from '@/constants/SessionData';
import { useSessionContext } from '@/context/SessionContext';
import { useCallback, useEffect, useRef } from 'react';

export function useSessionTimer() {
  const {
    sessionData,
    updateCurrentMetrics,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
  } = useSessionContext();

  // Store elapsed time in milliseconds
  const elapsedTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const lastTickRef = useRef<number | null>(null);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const updateTimer = useCallback(() => {
    if (!lastTickRef.current) return;

    const now = Date.now();
    const delta = now - lastTickRef.current;
    elapsedTimeRef.current += delta;
    lastTickRef.current = now;

    const formattedTime = formatTime(elapsedTimeRef.current);

    updateCurrentMetrics({
      time: formattedTime,
      distance: sessionData?.currentMetrics?.distance || '0,00',
      pace: sessionData?.currentMetrics?.pace || '0\'00"',
      calories: sessionData?.currentMetrics?.calories || '0',
    });
  }, [sessionData?.currentMetrics, updateCurrentMetrics]);

  const startTimer = useCallback(() => {
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(updateTimer, 1000);
  }, [updateTimer]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    lastTickRef.current = null;
  }, []);

  useEffect(() => {
    if (sessionData?.status === 'running') {
      startTimer();
    } else if (sessionData?.status === 'paused') {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [sessionData?.status, startTimer, stopTimer]);

  const handlePlayPause = useCallback(() => {
    if (!sessionData) return;

    if (sessionData.status === 'running') {
      pauseSession();
    } else if (sessionData.status === 'paused') {
      resumeSession();
    } else if (sessionData.status === 'ready') {
      elapsedTimeRef.current = 0;
      startSession();
    }
  }, [sessionData?.status, pauseSession, resumeSession, startSession]);

  return {
    isRunning: sessionData?.status === 'running',
    currentMetrics: sessionData?.currentMetrics,
    handlePlayPause,
    handleStop: stopSession,
  };
}
