import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/text/ThemedText';
import { PictureCard } from '@/components/cards/ThemedPictureCard';
import { useAuth } from '@/context/ctx';
import { secondsToCompactReadableTime } from '@/utils/timeUtils';
import ShadowTopSvg from '@/assets/icons/shadow-top.svg';
import ShadowBottomSvg from '@/assets/icons/shadow-bottom.svg';

interface Run {
  id: number;
  title: string;
  time_objective?: number;
  distance_objective?: number;
  is_buyable: boolean;
  price?: number | null;
  user_id: number;
  description: string;
  image_url: string;
}

interface GuidedRunListProps {
  onRunSelect: (run: Run) => void;
  enableSelection?: boolean;
  shadowBottom?: boolean;
  shadowTop?: boolean;
}

export const GuidedRunList: React.FC<GuidedRunListProps> = ({
  onRunSelect,
  enableSelection = false,
  shadowBottom = true,
  shadowTop = true,
}) => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    fetchRuns();
  }, []);

  const handleRunSelect = (run: Run) => {
    onRunSelect(run);
    setSelectedRun(run);
  };

  const fetchRuns = async () => {
    try {
      const response = await fetch('https://api.floway.edgar-lecomte.fr/api/run', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const runsWithImages = await Promise.all(
          data.runs.map(async (run: any) => {
            const imageResponse = await fetch('https://picsum.photos/200');
            return { ...run, image_url: imageResponse.url };
          }),
        );
        setRuns(runsWithImages);
      } else {
        console.error('Failed to fetch runs');
      }
    } catch (error) {
      console.error('Error fetching runs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunDelete = async (run: Run) => {
    try {
      const response = await fetch(`https://api.floway.edgar-lecomte.fr/api/run/${run.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setRuns(runs.filter((r) => r.id !== run.id));
      } else {
        console.error('Failed to delete run');
      }

      return response;
    } catch (error) {
      console.error('Error deleting run:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.white} />
      </View>
    );
  }

  if (runs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText type="legend" style={styles.emptyText}>
          Vous ne possédez aucune audio. Créez en une nouvelle en cliquant sur le bouton ci-dessous.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {shadowTop && <ShadowTopSvg style={styles.topGradient} />}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {runs.map((run) => (
            <PictureCard
              isSelected={enableSelection && selectedRun?.id === run.id}
              key={run.id}
              title={run.title}
              image={{ uri: run.image_url }}
              metrics={[secondsToCompactReadableTime(run.time_objective || 0)]}
              subtitle={run.description}
              onPress={() => handleRunSelect(run)}
              onDelete={() => handleRunDelete(run)}
            />
          ))}
        </View>
      </ScrollView>
      {shadowBottom && <ShadowBottomSvg style={styles.bottomGradient} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    width: '100%',
    pointerEvents: 'none',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    width: '100%',
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
  },
});
