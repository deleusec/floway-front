import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgEyeProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgEye = ({ width = 16, height = 17, color = '#000' }: SvgEyeProps) => (
  <Svg width={width} height={height} fill='none'>
    <Path
      fill={color}
      d='M8 6.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 5.333a3.333 3.333 0 1 1 0-6.667 3.333 3.333 0 0 1 0 6.667M8 3.5c-3.333 0-6.18 2.073-7.333 5 1.153 2.927 4 5 7.333 5s6.18-2.073 7.333-5c-1.153-2.927-4-5-7.333-5'
    />
  </Svg>
);
export default SvgEye;
