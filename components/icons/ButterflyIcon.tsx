import ButterflyActiveSvg from '@/assets/icons/butterfly-active.svg';
import ButterflySvg from '@/assets/icons/butterfly.svg';

interface ButterflyIconProps {
  state: 'selected' | 'default';
  style?: any;
  width?: number;
  height?: number;
}

export default function ButterflyIcon({ state, style, width, height }: ButterflyIconProps) {
  return (
    <>
      {state === 'selected' ? (
        <ButterflyActiveSvg width={width} height={height} style={style} />
      ) : (
        <ButterflySvg width={width} height={height} style={style} />
      )}
    </>
  );
}
