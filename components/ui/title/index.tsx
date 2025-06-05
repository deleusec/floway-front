import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors, FontFamily, FontSize } from '@/constants/theme';

type Props = TextProps & {
  level?: 1 | 2 | 3;
  color?: keyof typeof Colors;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
};

const fontSizeMap = {
  1: FontSize.xxl, // 28
  2: FontSize.md, // 16
  3: FontSize.lg, // 20
};

const fontWeightMap = {
  1: FontFamily.semiBold,
  2: FontFamily.semiBold,
  3: FontFamily.medium,
};

const Title: React.FC<Props> = ({
  children,
  level = 1,
  color = 'textPrimary',
  align = 'left',
  style,
  ...rest
}) => {
  const fontSize = fontSizeMap[level];
  const fontFamily = fontWeightMap[level];
  const rawColor = Colors[color];
  const textColor = typeof rawColor === 'string' ? rawColor : Colors.textPrimary;

  return (
    <Text
      style={[
        {
          fontSize,
          fontFamily,
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

export default Title;
