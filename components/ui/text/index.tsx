import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { Colors, FontFamily, FontSize } from '@/constants/theme';

type Props = TextProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: keyof typeof Colors;
  weight?: keyof typeof FontFamily;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
};

const Text: React.FC<Props> = ({
  children,
  size = 'md',
  color = 'textPrimary',
  weight = 'regular',
  align = 'left',
  style,
  ...rest
}) => {
  return (
    <RNText
      style={[
        {
          fontSize: FontSize[size],
          color: Colors[color],
          fontFamily: FontFamily[weight],
          textAlign: align,
        },
        style,
      ]}
      {...rest}>
      {children}
    </RNText>
  );
};

export default Text;
