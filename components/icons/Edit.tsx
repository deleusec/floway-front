import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgEdit = props => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} fill='none' {...props}>
    <Path
      fill='#444'
      d='M21.73 2.269a2.625 2.625 0 0 0-3.711 0l-1.157 1.157 3.712 3.712L21.73 5.98a2.625 2.625 0 0 0 0-3.712m-2.217 5.93L15.8 4.487l-8.4 8.4A5.25 5.25 0 0 0 6.08 15.1l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32z'
    />
    <Path
      fill='#444'
      d='M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 1 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 1 0 0-1.5z'
    />
  </Svg>
);
export default SvgEdit;
