type AchievementType = 'speed_record' | 'distance_record' | 'time_record' | 'first_run' | 'streak' | 'personal_best';

interface Achievement {
  type: AchievementType;
  emoji: string;
  title: string;
  subtitle: string;
}

const ACHIEVEMENT_TEMPLATES: Record<AchievementType, Achievement> = {
  speed_record: {
    type: 'speed_record',
    emoji: '🏆',
    title: 'Record de vitesse battu !',
    subtitle: 'Nouvelle meilleure vitesse atteinte ! Garde ce rythme et tu es inarrêtable.'
  },
  distance_record: {
    type: 'distance_record',
    emoji: '🎯',
    title: 'Record de distance !',
    subtitle: 'Tu as couru plus loin que jamais ! Cette endurance impressionnante mérite d\'être célébrée.'
  },
  time_record: {
    type: 'time_record',
    emoji: '⏱️',
    title: 'Nouveau record de temps !',
    subtitle: 'Tu as tenu plus longtemps que d\'habitude ! Ta persévérance porte ses fruits.'
  },
  first_run: {
    type: 'first_run',
    emoji: '🎉',
    title: 'Première course !',
    subtitle: 'Félicitations pour ta première course ! C\'est le début d\'une belle aventure.'
  },
  streak: {
    type: 'streak',
    emoji: '🔥',
    title: 'Série de courses !',
    subtitle: 'Tu maintiens un rythme régulier ! Cette constance va te mener loin.'
  },
  personal_best: {
    type: 'personal_best',
    emoji: '⭐',
    title: 'Record personnel !',
    subtitle: 'Tu as surpassé tes performances précédentes ! Continue comme ça, tu progresses bien.'
  }
};

export const createAchievement = (type: AchievementType): Achievement => {
  return { ...ACHIEVEMENT_TEMPLATES[type] };
};

export const getSessionAchievements = (sessions: any[]): Map<string, Achievement> => {
  const sessionAchievements = new Map<string, Achievement>();
  const availableTypes: AchievementType[] = ['speed_record', 'distance_record', 'time_record', 'first_run', 'streak', 'personal_best'];
  const usedTypes = new Set<AchievementType>();

  const sortedSessions = [...sessions].sort((a, b) => new Date(a.reference_day).getTime() - new Date(b.reference_day).getTime());

  sortedSessions.forEach((session, index) => {
    const sessionHash = session._id ? session._id.slice(-1) : index.toString();
    const hashNumber = parseInt(sessionHash, 16) || index;

    if (hashNumber % 3 === 0 && usedTypes.size < availableTypes.length) {
      const availableAchievements = availableTypes.filter(type => !usedTypes.has(type));

      if (availableAchievements.length > 0) {
        const selectedType = availableAchievements[hashNumber % availableAchievements.length];
        usedTypes.add(selectedType);
        sessionAchievements.set(session._id, createAchievement(selectedType));
      }
    }
  });

  return sessionAchievements;
};

export const getSessionAchievement = (session: any, allSessionAchievements: Map<string, Achievement>): Achievement | null => {
  return allSessionAchievements.get(session._id) || null;
};

export type { Achievement, AchievementType };
