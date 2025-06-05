import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgHeadphoneIcon = ({ color = '#000', size = 24, ...props }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none' {...props}>
    <Path
      fill={color}
      d='M11.2.025C4.827.416 0 5.709 0 11.76v8.45C0 22.307 1.787 24 4 24h1.333C6.8 24 8 22.863 8 21.474V16.42c0-1.39-1.2-2.526-2.667-2.526H2.667v-2.16c0-4.851 3.946-9.07 9.053-9.21a9.8 9.8 0 0 1 3.658.596A9.4 9.4 0 0 1 18.5 5.02a8.8 8.8 0 0 1 2.096 2.902 8.4 8.4 0 0 1 .736 3.446v2.527h-2.666C17.2 13.895 16 15.03 16 16.42v5.053C16 22.864 17.2 24 18.667 24H20c2.213 0 4-1.693 4-3.79v-8.842C24 4.838 18.187-.405 11.2.025'
    />
  </Svg>
);
export default SvgHeadphoneIcon;
