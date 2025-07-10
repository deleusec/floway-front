import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgPlusProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgPlus = (props: SvgPlusProps) => (
  <Svg width={24} height={24} viewBox='0 0 14 14' fill='none' {...props}>
    <Path
      fill='#fff'
      d='M6.13 7.745H.868a.72.72 0 0 1-.523-.226.7.7 0 0 1-.229-.52.7.7 0 0 1 .229-.518.72.72 0 0 1 .523-.226h5.264V1.038a.7.7 0 0 1 .228-.519.72.72 0 0 1 .524-.226q.295 0 .523.226a.7.7 0 0 1 .229.519v5.217h5.263q.296 0 .524.226A.7.7 0 0 1 13.65 7a.7.7 0 0 1-.228.519.72.72 0 0 1-.524.226H7.635v5.217a.7.7 0 0 1-.229.519.72.72 0 0 1-.523.226.72.72 0 0 1-.524-.226.7.7 0 0 1-.228-.52z'
    />
  </Svg>
);
export default SvgPlus;
