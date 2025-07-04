import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const SvgPlay = (props: SvgProps) => (
  <Svg width={61} height={61} viewBox='0 0 61 61' fill='none' {...props}>
    <Path
      fill='#FAF9F7'
      fillRule='evenodd'
      d='m24.207 12.55 25.65 15.784a2.54 2.54 0 0 1 0 4.332l-25.65 15.783a2.541 2.541 0 0 1-3.873-2.165V14.716a2.542 2.542 0 0 1 3.873-2.165'
      clipRule='evenodd'
    />
  </Svg>
);
export default SvgPlay;
