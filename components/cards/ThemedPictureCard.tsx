import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import {GestureHandlerRootView, PanGestureHandler, State} from 'react-native-gesture-handler';
import {Colors} from '@/constants/Colors';
import TrashSvg from '@/assets/icons/trash.svg';

interface PictureCardProps {
  title: string;
  subtitle?: string;
  metrics?: string[];
  image?: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
  isSelected?: boolean;
  onDelete?: () => void;
}

export const PictureCard: React.FC<PictureCardProps> = ({
  title,
  subtitle,
  metrics,
  image,
  onPress,
  style,
  isSelected = false,
  onDelete,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const swipeThreshold = -80;
  const maxSwipe = -90;
  const minSwipe = 0;

  const handleGestureEvent = Animated.event([{nativeEvent: {translationX: translateX}}], {
    useNativeDriver: false,
  });

  const handleStateChange = ({nativeEvent}: any) => {
    if (!onDelete) return;

    if (nativeEvent.state === State.END) {
      const velocity = nativeEvent.velocityX;
      const translation = nativeEvent.translationX;

      if (translation < swipeThreshold || velocity < -500) {
        // Swipe validé avec effet de rebond doux
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: maxSwipe,
            speed: 10,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();
      } else {
        // Swipe insuffisant → retour à 0
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: minSwipe,
            speed: 12,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      {/* Bouton poubelle en arrière-plan */}
      {onDelete && (
        <Animated.View style={[styles.deleteContainer, {opacity}]}>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <TrashSvg width={24} height={24}/>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Carte interactive avec swipe */}
      {onDelete ? (
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleStateChange}
          activeOffsetX={[-10, 10]}
          failOffsetY={[-10, 10]}
        >
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [
                  {
                    translateX: translateX.interpolate({
                      inputRange: [maxSwipe, 0],
                      outputRange: [maxSwipe, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard, style]}
              onPress={onPress}
              disabled={!onPress}>
              {/* Image à gauche */}
              {image ? (
                <Image source={image} style={styles.image}/>
              ) : (
                <Image src="https://picsum.photos/200/300" style={styles.image}/>
              )}

              {/* Contenu principal */}
              <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Text>
                {subtitle && (
                  <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
                    {subtitle}
                  </Text>
                )}
                {metrics && (
                  <View
                    style={[
                      styles.metricsContainer,
                      subtitle
                        ? styles.metricsContainerWithSubtitle
                        : styles.metricsContainerWithoutSubtitle,
                    ]}>
                    {metrics.map((metric, index) => (
                      <Text
                        key={index}
                        style={[
                          subtitle ? styles.metricWithSubtitle : styles.metricWithoutSubtitle,
                        ]}>
                        {metric}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      ) : (
        <TouchableOpacity
          style={[
            styles.card,
            isSelected && styles.selectedCard, // Appliquer le style sélectionné
            style,
          ]}
          onPress={onPress}
          disabled={!onPress} // Désactive le clic si aucune action n'est fournie
        >
          {/* Image à gauche */}
          {image ? (
            <Image source={image} style={styles.image}/>
          ) : (
            <Image src="https://picsum.photos/200/300" style={styles.image}/>
          )}
          {/* Contenu principal */}
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
                {subtitle}
              </Text>
            )}
            {metrics && (
              <View
                style={[
                  styles.metricsContainer,
                  subtitle
                    ? styles.metricsContainerWithSubtitle
                    : styles.metricsContainerWithoutSubtitle,
                ]}>
                {metrics.map((metric, index) => (
                  <Text
                    key={index}
                    style={[subtitle ? styles.metricWithSubtitle : styles.metricWithoutSubtitle]}>
                    {metric}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
  },
  deleteContainer: {
    position: 'absolute',
    backgroundColor: Colors.dark.error + '30',
    borderRadius: 16,
    right: 16,
    top: '50%',
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{translateY: '-50%'}],
    zIndex: 0,
  },
  deleteButton: {
    padding: 12,
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.secondaryDark,
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.secondaryDark,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: 64,
  },
  title: {
    fontSize: 16,
    color: Colors.light.white,
    fontFamily: 'Poppins-Medium',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.lightGrey,
    fontFamily: 'Poppins-Regular',
  },
  metricsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metricsContainerWithSubtitle: {
    justifyContent: 'flex-start',
    gap: 12,
  },
  metricsContainerWithoutSubtitle: {
    gap: 22,
    color: Colors.light.white,
  },
  metricWithoutSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.white,
  },
  metricWithSubtitle: {
    fontSize: 12,
    color: Colors.light.mediumGrey,
  },
});
