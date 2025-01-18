import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/text/ThemedText';
import { Colors } from '@/constants/Colors';

interface Tab {
  key: string;
  label: string;
}

export const Tabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (key: string) => void;
}) => {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab: Tab) => (
        <View
          key={tab.key}
          style={[styles.tabItem, activeTab === tab.key ? styles.activeTab : undefined]}
          onTouchEnd={() => setActiveTab(tab.key)}>
          <ThemedText
            type="small"
            style={activeTab === tab.key ? { color: 'black' } : { color: Colors.dark.mediumGrey }}>
            {tab.label}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 8,
  },
  tabItem: {
    flex: 1,
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
    color: 'white',
  },
  activeTab: {
    backgroundColor: 'white',
    color: 'black',
  },
});
