import { Colors } from '@/constants/Colors';
import React, { useRef } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

interface WaveformProps {
  waveLevels: number[];
}

const Waveform: React.FC<WaveformProps> = ({ waveLevels }) => {
  const waveformScrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.waveform}>
      <ScrollView
        ref={waveformScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%', height: '100%' }}
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
      >
        {waveLevels.map((level, index) => (
          <Animated.View
            key={index}
            style={{
              height: Math.max(level, 10),
              width: 2,
              backgroundColor: 'white',
              borderRadius: 2,
              marginHorizontal: 1,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  waveform: {
    height: 70,
    width: '100%',
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
});

export default Waveform;
