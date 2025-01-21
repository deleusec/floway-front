export interface SessionData {
  type: 'free' | 'target' | 'guided';
  target?: {
    type: 'time' | 'distance';
    time?: {
      hours: string;
      minutes: string;
      seconds: string;
    };
    distance?: number;
  };
  guidedRun?: {
    id: string;
    title: string;
    description: string;
    duration: string;
    distance?: string;
    image?: any;
  };
  currentMetrics?: {
    time: {
      hours: string;
      minutes: string;
      seconds: string;
    };
    distance: string;
    pace: string;
    calories: string;
  };
  status?: 'ready' | 'running' | 'paused' | 'completed';
  startTime?: number;
  pauseTime?: number;
  totalPauseTime?: number;
  steps?: number;
  averageHeartRate?: number;
}
