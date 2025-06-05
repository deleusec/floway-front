import * as React from 'react';
import Svg, { Mask, Path, G } from 'react-native-svg';
const SvgPlayIcon = ({ color = '#000', size = 24, ...props }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none' {...props}>
    <Mask
      id='play-icon_svg__a'
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits='userSpaceOnUse'
      style={{
        maskType: 'luminance',
      }}>
      <Path
        fill='#fff'
        stroke='#fff'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Z'
      />
      <Path
        fill='#000'
        stroke='#000'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9.8 12V8.19l3.3 1.905L16.4 12l-3.3 1.905-3.3 1.905z'
      />
    </Mask>
    <G mask='url(#play-icon_svg__a)'>
      <Path fill={color} d='M-1.2-1.2h26.4v26.4H-1.2z' />
    </G>
  </Svg>
);
export default SvgPlayIcon;
