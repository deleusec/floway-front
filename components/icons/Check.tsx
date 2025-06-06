import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgCheckProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgCheck = ({ width = 24, height = 24, color = '#fff' }: SvgCheckProps) => (
  <Svg width={width} height={height} viewBox="0 0 26 20" fill="none">
    <Path
      fill={color}
      d="M20.285 6.709a1 1 0 0 0-1.414-1.418l-8.18 8.18-3.18-3.18a1 1 0 1 0-1.414 1.418l3.887 3.886a1 1 0 0 0 1.414 0l8.887-8.886z"
    />
  </Svg>
);

export default SvgCheck;
