import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const SvgPause = ({ size = 24, ...props }: SvgProps & { size?: number }) => (
  <Svg width={size} height={size} viewBox='0 0 24 27' fill='none' {...props}>
    <Path
      fill='#FAF9F7'
      d='M18.546 27q-.878 0-1.53-.673-.652-.672-.652-1.577V2.25q0-.905.652-1.577Q17.668 0 18.546 0h3.272q.877 0 1.53.673Q24 1.345 24 2.25v22.5q0 .905-.652 1.577-.652.673-1.53.673zM2.182 27q-.877 0-1.53-.673Q0 25.655 0 24.75V2.25Q0 1.345.652.673 1.305 0 2.182 0h3.273q.876 0 1.529.673.652.672.652 1.577v22.5q0 .905-.652 1.577-.652.673-1.53.673z'
    />
  </Svg>
);
export default SvgPause;
