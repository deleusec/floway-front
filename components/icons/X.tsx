import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgXProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgX = ({ width = 24, height = 24, color = '#6E6E6E' }: SvgXProps) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M12 13.41l5.3 5.3a1 1 0 0 0 1.42-1.42l-5.3-5.3 5.3-5.3A1 1 0 0 0 17.3 5.3l-5.3 5.3-5.3-5.3A1 1 0 0 0 5.3 6.7l5.3 5.3-5.3 5.3a1 1 0 1 0 1.42 1.42l5.3-5.3z"
    />
  </Svg>
);

export default SvgX;
