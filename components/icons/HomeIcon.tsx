import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgHomeIcon = ({ color = '#000', size = 24, ...props }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none' {...props}>
    <Path
      fill={color}
      d='M1 21.257V8.914q0-.65.293-1.234.293-.583.807-.96L10.35.549A2.65 2.65 0 0 1 12 0q.929 0 1.65.549L21.9 6.72q.515.377.809.96.293.583.291 1.234v12.343q0 1.131-.808 1.938A2.65 2.65 0 0 1 20.25 24h-4.125q-.585 0-.979-.395a1.33 1.33 0 0 1-.396-.976V15.77q0-.583-.396-.976a1.34 1.34 0 0 0-.979-.395h-2.75q-.585 0-.979.395a1.33 1.33 0 0 0-.396.976v6.858q0 .582-.396.977-.396.396-.979.394H3.75a2.65 2.65 0 0 1-1.941-.805A2.64 2.64 0 0 1 1 21.257'
    />
  </Svg>
);
export default SvgHomeIcon;
