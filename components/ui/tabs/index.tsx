import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { Colors, Spacing, FontSize, FontFamily } from '@/constants/theme';
import Text from '../text';

export interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  style,
  tabStyle,
  labelStyle,
  indicatorStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            style={[styles.tab, tabStyle]}
            onPress={() => onChange(tab.value)}
          >
            <View style={styles.tabBox}>
              <Text weight={isActive ? 'bold' : 'regular'}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  tabBox: {
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  label: {
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  labelInactive: {
    color: Colors.gray[400],
    fontWeight: 'normal',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    right: '5%',
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
});

export default Tabs;
