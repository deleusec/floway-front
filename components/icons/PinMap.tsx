import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const SvgPinMap = ({ size = 24, ...props }: SvgProps & { size?: number }) => (
  <Svg width={size} height={size} viewBox='0 0 32 32' fill='none' {...props}>
    <Path fill='#FAF9F7' d='M16 14.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4' />
    <Path
      fill='#FAF9F7'
      d='M16 2.667a10.667 10.667 0 0 0-10.666 10.56c0 7.306 9.4 15.44 9.8 15.786a1.334 1.334 0 0 0 1.733 0c.466-.347 9.8-8.48 9.8-15.787A10.667 10.667 0 0 0 16 2.666m0 14.666A4.667 4.667 0 1 1 16 8a4.667 4.667 0 0 1 0 9.333'
    />
  </Svg>
);
export default SvgPinMap;
