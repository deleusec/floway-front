import TargetActiveSvg from '@/assets/icons/target-active.svg';
import TargetSvg from '@/assets/icons/target.svg';

interface TargetIconProps {
  state: 'selected' | 'default';
  style?: any;
  width?: number;
  height?: number;
}

export default function TargetIcon({ state, style, width, height }: TargetIconProps) {
  return (
    <>
      {state === 'selected' ? (
        <TargetActiveSvg width={width} height={height} style={style} />
      ) : (
        <TargetSvg width={width} height={height} style={style} />
      )}
    </>
  );
}
