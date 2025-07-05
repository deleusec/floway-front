import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const SvgStopIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill='none' {...props}>
    <Path
      fill='#fff'
      d='M2.667 24q-1.1 0-1.883-.783A2.57 2.57 0 0 1 0 21.333V2.667q0-1.1.784-1.883A2.57 2.57 0 0 1 2.667 0h18.666q1.101 0 1.884.784.784.784.783 1.883v18.666a2.57 2.57 0 0 1-.783 1.884 2.56 2.56 0 0 1-1.884.783z'
    />
  </Svg>
);
export default SvgStopIcon;
