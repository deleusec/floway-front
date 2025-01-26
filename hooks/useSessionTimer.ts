// hooks/useSessionTimer.ts
import { useRef, useCallback, useEffect } from 'react';
import { useSessionContext } from '../context/SessionContext';
import { SessionData } from '../constants/SessionData';

export function useSessionTimer() {
  const { sessionData, setSessionData } = useSessionContext();

  const elapsedTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const lastTickRef = useRef<number | null>(null);
  const lastTimeValuesRef = useRef({
    hours: '00',
    minutes: '00',
    seconds: '00',
    totalSeconds: 0,
  });

  const updateTimer = useCallback(() => {
    if (!lastTickRef.current || !sessionData) return;

    const now = Date.now();
    const delta = now - lastTickRef.current;
    elapsedTimeRef.current += delta;
    lastTickRef.current = now;

    const totalSeconds = Math.floor(elapsedTimeRef.current / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const newTimeValues = {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      totalSeconds,
    };

    lastTimeValuesRef.current = newTimeValues;

    const updatedSession: SessionData = {
      ...sessionData,
      currentMetrics: {
        ...sessionData.currentMetrics,
        time: newTimeValues,
      },
    };

    setSessionData(updatedSession);
  }, [sessionData, setSessionData]);

  const startTimer = useCallback(() => {
    if (!sessionData) return;

    const updatedSession: SessionData = {
      ...sessionData,
      currentMetrics: {
        ...sessionData.currentMetrics,
        time: lastTimeValuesRef.current,
      },
    };

    setSessionData(updatedSession);

    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(updateTimer, 1000);
  }, [sessionData, updateTimer, setSessionData]);

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
    } else if (sessionData?.status === 'ready') {
      elapsedTimeRef.current = 0;
      lastTimeValuesRef.current = {
        hours: '00',
        minutes: '00',
        seconds: '00',
        totalSeconds: 0,
      };
    }

    return () => {
      stopTimer();
    };
  }, [sessionData?.status, startTimer, stopTimer]);

  return {
    isRunning: sessionData?.status === 'running',
    currentMetrics: sessionData?.currentMetrics,
    elapsedTime: elapsedTimeRef.current,
  };
}
