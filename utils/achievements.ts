import {Colors} from "@/theme";

type AchievementType = 'speed_record' | 'distance_record' | 'time_record' | 'first_run' | 'streak' | 'personal_best';

interface Achievement {
  type: AchievementType;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
}

const ACHIEVEMENT_TEMPLATES: Record<AchievementType, Achievement> = {
  speed_record: {
    type: 'speed_record',
    emoji: '🏆',
    title: 'Record de vitesse battu !',
    subtitle: 'Nouvelle meilleure vitesse atteinte ! Garde ce rythme et tu es inarrêtable.',
    color: Colors.yellow, // Or
  },
  distance_record: {
    type: 'distance_record',
    emoji: '🎯',
    title: 'Record de distance !',
    subtitle: 'Tu as couru plus loin que jamais ! Cette endurance impressionnante mérite d\'être célébrée.',
    color: '#adff9b', // Vert
  },
  time_record: {
    type: 'time_record',
    emoji: '⏱️',
    title: 'Nouveau record de temps !',
    subtitle: 'Tu as tenu plus longtemps que d\'habitude ! Ta persévérance porte ses fruits.',
    color: '#9bf7ff', // Bleu clair
  },
  first_run: {
    type: 'first_run',
    emoji: '🎉',
    title: 'Première course !',
    subtitle: 'Félicitations pour ta première course ! C\'est le début d\'une belle aventure.',
    color: '#ffc19b', // Orange
  },
  streak: {
    type: 'streak',
    emoji: '🔥',
    title: 'Série de courses !',
    subtitle: 'Tu maintiens un rythme régulier ! Cette constance va te mener loin.',
    color: '#ff9b9b', // Rouge
  },
  personal_best: {
    type: 'personal_best',
    emoji: '⭐',
    title: 'Record personnel !',
    subtitle: 'Tu as surpassé tes performances précédentes ! Continue comme ça, tu progresses bien.',
    color: '#b79bff', // Violet
  }
};

export const createAchievement = (type: AchievementType): Achievement => {
  return { ...ACHIEVEMENT_TEMPLATES[type] };
};

export const getSessionAchievements = (sessions: any[]): Map<string, Achievement> => {
  const sessionAchievements = new Map<string, Achievement>();
  const availableTypes: AchievementType[] = ['speed_record', 'distance_record', 'time_record', 'first_run', 'streak', 'personal_best'];
  const usedTypes = new Set<AchievementType>();

    // Sort sessions by actual end time (most recent first) to match display order
  const sortedSessions = [...sessions].sort((a, b) => {
    // Use last_tps_unix for precise timestamp sorting
    const timestampA = a.last_tps_unix || 0;
    const timestampB = b.last_tps_unix || 0;

    // Most recent sessions first (higher timestamp = more recent)
    return timestampB - timestampA;
  });

  // Assign achievements to sessions based on their characteristics
  sortedSessions.forEach((session, index) => {
    // Calculate if this session deserves an achievement
    let achievementType: AchievementType | null = null;

    // First session ever
    if (index === sortedSessions.length - 1) {
      achievementType = 'first_run';
    }
    // Check for records compared to previous sessions (going backwards in time)
    else {
      const laterSessions = sortedSessions.slice(0, index); // Sessions that happened after this one

      // Speed record
      if (laterSessions.every(s => session.allure > s.allure) && !usedTypes.has('speed_record')) {
        achievementType = 'speed_record';
      }
      // Distance record
      else if (laterSessions.every(s => session.distance > s.distance) && !usedTypes.has('distance_record')) {
        achievementType = 'distance_record';
      }
      // Time record
      else if (laterSessions.every(s => session.time > s.time) && !usedTypes.has('time_record')) {
        achievementType = 'time_record';
      }
      // Personal best (combination of good metrics)
      else if (!usedTypes.has('personal_best') &&
               laterSessions.length > 2 &&
               laterSessions.filter(s => session.allure >= s.allure).length >= laterSessions.length * 0.8) {
        achievementType = 'personal_best';
      }
      // Streak (every 5th session)
      else if (!usedTypes.has('streak') && (sortedSessions.length - index) % 5 === 0 && index < sortedSessions.length - 1) {
        achievementType = 'streak';
      }
    }

    // Assign achievement if one was determined
    if (achievementType && !usedTypes.has(achievementType)) {
      usedTypes.add(achievementType);
      sessionAchievements.set(session._id, createAchievement(achievementType));
    }
  });

  return sessionAchievements;
};

export const getSessionAchievement = (session: any, allSessionAchievements: Map<string, Achievement>): Achievement | null => {
  return allSessionAchievements.get(session._id) || null;
};

export type { Achievement, AchievementType };
