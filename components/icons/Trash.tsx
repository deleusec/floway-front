import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import {Colors} from "@/theme";

const SvgTrash = ({ color = Colors.black, size = 24, ...props }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none' {...props}>
    <Path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
          fill={color}/>
  </Svg>
);

export default SvgTrash;
