import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgTrashProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgTrash = ({ width = 16, height = 17, color = '#EB6564' }: SvgTrashProps) => (
  <Svg width={width} height={height} fill='none'>
    <Path
      fill={color}
      d='M4 13.167c0 .733.6 1.333 1.334 1.333h5.333c.733 0 1.333-.6 1.333-1.333v-8H4zm8.667-10h-2.333L9.667 2.5H6.334l-.667.667H3.334V4.5h9.333z'
    />
  </Svg>
);
export default SvgTrash;
