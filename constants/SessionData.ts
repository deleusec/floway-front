export interface Coordinates {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude?: number;
  accuracy?: number;
  speed?: number;
}

export interface SessionSummary {
  startDate: string;
  endDate: string;
  totalDistance: number;
  averagePace: string;
  totalCalories: number;
  totalSteps?: number;
  averageHeartRate?: number;
  elevationGain?: number;
}

export interface SessionData {
  // Basic session information
  id: string;
  type: 'free' | 'target' | 'guided';
  status: 'ready' | 'running' | 'paused' | 'completed';
  name?: string;

  // Timing information
  startTime: number;
  endTime?: number;
  pauseTime?: number;
  totalPauseTime: number;

  // Target-specific data
  target?: {
    type: 'time' | 'distance';
    time?: {
      hours: string;
      minutes: string;
      seconds: string;
    };
    distance?: number;
  };

  // Guided run specific data
  guidedRun?: {
    id: string;
    title: string;
    description: string;
    duration: string;
    distance?: string;
    image?: any;
  };

  // Real-time metrics
  currentMetrics: {
    time: {
      hours: string;
      minutes: string;
      seconds: string;
    };
    distance: string;
    pace: string;
    calories: string;
    currentSpeed?: number;
    instantPace?: string;
    steps?: number;
    heartRate?: number;
  };

  // Location tracking
  locations: Coordinates[];
  currentLocation?: Coordinates;
  bounds?: {
    northEast: Coordinates;
    southWest: Coordinates;
  };

  // Session summary (populated when session is completed)
  summary?: SessionSummary;
}
