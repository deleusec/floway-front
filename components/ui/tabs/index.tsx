import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, FontSize } from '@/constants/theme';
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
              <Text
                weight={isActive ? 'semiBold' : 'regular'}
                style={[
                  styles.label,
                  { color: isActive ? Colors.textPrimary : Colors.gray[500] },
                  labelStyle,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={[styles.indicator, indicatorStyle]} />}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabBox: {
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  label: {
    fontSize: FontSize.sm,
  },
  indicator: {
    position: 'absolute',
    bottom: -1,
    left: '5%',
    right: '5%',
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
});

export default Tabs;
