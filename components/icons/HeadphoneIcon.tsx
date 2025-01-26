import HeadphoneActiveSvg from '@/assets/icons/headphone-active.svg';
import HeadphoneWhiteSvg from '@/assets/icons/headphone-white.svg';
import HeadphoneSvg from '@/assets/icons/headphone.svg';

interface HeadphoneIconProps {
  state: 'selected' | 'default' | 'disabled';
  fill?: string;
  style?: any;
  width?: number;
  height?: number;
}

export default function HeadphoneIcon({ state, style, width, height }: HeadphoneIconProps) {
  return (
    <>
      {state === 'selected' && <HeadphoneActiveSvg width={width} height={height} style={style} />}
      {state === 'default' && <HeadphoneWhiteSvg width={width} height={height} style={style} />}
      {state === 'disabled' && <HeadphoneSvg width={width} height={height} style={style} />}
    </>
  );
}
