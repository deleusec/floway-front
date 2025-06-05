import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgAddFriendProps {
  width?: number;
  height?: number;
  color?: string;
}

const SvgAddFriend = ({
  width = 24,
  height = 24,
  color = '#624AF6',
  ...props
}: SvgAddFriendProps) => (
  <Svg width={width} height={height} viewBox='0 0 24 24' fill='none' {...props}>
    <Path
      fill={color}
      d='M10.8 2.4a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6M4.81 13.2a2.4 2.4 0 0 0-2.41 2.4c0 2.03 1 3.56 2.562 4.556C6.5 21.136 8.574 21.6 10.8 21.6q.74 0 1.452-.069A6.58 6.58 0 0 1 10.8 17.4c0-1.596.566-3.06 1.508-4.2zm12.59 9.6a5.4 5.4 0 1 0 0-10.8 5.4 5.4 0 0 0 0 10.8m0-8.4a.6.6 0 0 1 .6.6v1.8h1.8a.6.6 0 0 1 0 1.2H18v1.8a.6.6 0 0 1-1.2 0V18H15a.6.6 0 0 1 0-1.2h1.8V15a.6.6 0 0 1 .6-.6'
    />
  </Svg>
);
export default SvgAddFriend;
