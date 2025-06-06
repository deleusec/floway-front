import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgHorizontalDotsProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgHorizontalDots = ({ width = 24, height = 24, color = '#5E5E5E' }: SvgHorizontalDotsProps) => (
  <Svg width={width} height={height} fill='none'>
    <Path
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2'
    />
  </Svg>
);
export default SvgHorizontalDots;
