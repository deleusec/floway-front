import { Colors } from '@/constants/Colors';
import { Link, usePathname } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeActiveIcon from '@/assets/icons/home-active.svg';
import HomeIcon from '@/assets/icons/home.svg';
import HeadphoneActiveIcon from '@/assets/icons/headphone-active.svg';
import HeadphoneIcon from '@/assets/icons/headphone.svg';
import StartButtonIcon from '@/assets/icons/start-button.svg';
import ShadowBottomSvg from '@/assets/icons/shadow-bottom.svg';

export default function AppMenu() {
  const pathname = usePathname();
  return (
    <View style={styles.container}>
      {/* Wave Background */}
      <View style={styles.wave}>
        <Image source={require('@/assets/images/wave.png')} />
      </View>
      <ShadowBottomSvg style={styles.bottomGradient} />

      {/* Home Link */}
      <View style={styles.navLinkContainer}>
        <Link href="/" style={styles.navLink}>
          {pathname === '/' ? (
            <HomeActiveIcon width={32} height={32} />
          ) : (
            <HomeIcon width={32} height={32} />
          )}
        </Link>
        {pathname === '/' && (
          <LinearGradient colors={['#C0FC95', '#91DC5C']} style={styles.activeIndicator} />
        )}
      </View>

      {/* Play Button */}
      <View style={styles.playButtonContainer}>
        <Link href="/session" style={styles.playButton}>
          <StartButtonIcon width={64} height={64} />
        </Link>
      </View>

      {/* All Runs Link */}
      <View style={styles.navLinkContainer}>
        <Link href="/all-runs" style={styles.navLink}>
          {pathname === '/all-runs' ? (
            <HeadphoneActiveIcon width={32} height={32} />
          ) : (
            <HeadphoneIcon width={32} height={32} />
          )}
        </Link>
        {pathname === '/all-runs' && (
          <LinearGradient colors={['#C0FC95', '#91DC5C']} style={styles.activeIndicator} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.secondaryDark,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
  },
  navLinkContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navLink: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 30,
  },
  playButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -5 }],
    zIndex: 2,
  },
  playButton: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  wave: {
    position: 'absolute',
    bottom: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  bottomGradient: {
    position: 'absolute',
    pointerEvents: 'none',
    bottom: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
