import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  PanResponder,
  BackHandler,
  StatusBar,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onClosed?: () => void; // Callback appelé après la fermeture complète
  children: React.ReactNode;
  height?: number;
  maxHeight?: number;
  enableDrag?: boolean;
  enableBackdropDismiss?: boolean;
  snapToContent?: boolean;
  style?: any;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAG_DISMISS_THRESHOLD = 0.3;
const ANIMATION_DURATION = 300;

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  onClosed,
  children,
  height,
  maxHeight = SCREEN_HEIGHT * 0.9,
  enableDrag = true,
  enableBackdropDismiss = true,
  snapToContent = false,
  style,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isMountedRef = useRef(false);

  // Calculate sheet height
  let sheetHeight: number;
  if (snapToContent && contentHeight > 0) {
    sheetHeight = Math.min(contentHeight + 80, maxHeight); // 80px for handle + padding
  } else if (height) {
    sheetHeight = Math.min(height, maxHeight);
  } else {
    sheetHeight = SCREEN_HEIGHT * 0.5;
  }

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const dragY = useRef(new Animated.Value(0)).current;

  // Pan responder for drag gestures - uniquement sur le handle
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enableDrag,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy, dx } = gestureState;
        return enableDrag && 
               dy > 5 && // Mouvement vers le bas
               Math.abs(dy) > Math.abs(dx); // Principalement vertical
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        dragY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        
        if (gestureState.dy > sheetHeight * DRAG_DISMISS_THRESHOLD) {
          // Close the sheet
          closeWithAnimation();
        } else {
          // Snap back to open position
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const closeWithAnimation = useCallback(() => {
    if (!isMountedRef.current) return; // Éviter les mises à jour si déjà fermé
    
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isMountedRef.current) {
        setIsMounted(false);
        isMountedRef.current = false;
        dragY.setValue(0);
        onClose();
        // Appeler onClosed après la fermeture complète avec un petit délai pour éviter les conflits
        if (onClosed) {
          setTimeout(onClosed, 50);
        }
      }
    });
  }, [backdropOpacity, translateY, sheetHeight, onClose, dragY, onClosed]);

  const openWithAnimation = useCallback(() => {
    setIsMounted(true);
    isMountedRef.current = true;
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [backdropOpacity, translateY]);

  // Handle visible prop changes
  useEffect(() => {
    if (visible && !isMounted) {
      openWithAnimation();
    } else if (!visible && isMounted) {
      closeWithAnimation();
    }
  }, [visible, isMounted, openWithAnimation, closeWithAnimation]);

  // Handle Android back button
  useEffect(() => {
    const onBackPress = () => {
      if (visible && isMounted) {
        closeWithAnimation();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [visible, isMounted, closeWithAnimation]);

  // Handle content height measurement
  const onContentLayout = useCallback((event: any) => {
    if (snapToContent) {
      const { height: measuredHeight } = event.nativeEvent.layout;
      setContentHeight(measuredHeight);
    }
  }, [snapToContent]);

  const combinedTranslateY = Animated.add(translateY, dragY);

  if (!isMounted && !visible) {
    return null;
  }

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      onRequestClose={closeWithAnimation}
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.4)" barStyle="light-content" />
      <View style={StyleSheet.absoluteFill}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable 
            style={StyleSheet.absoluteFill} 
            onPress={enableBackdropDismiss ? closeWithAnimation : undefined}
          />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              transform: [{ translateY: combinedTranslateY }],
            },
            style,
          ]}
        >
          {/* Handle */}
          {enableDrag && (
            <View 
              style={styles.handleContainer}
              {...panResponder.panHandlers} // PanResponder uniquement sur le handle
            >
              <Animated.View
                style={[
                  styles.handle,
                  isDragging && { opacity: 0.6, transform: [{ scaleX: 1.1 }] },
                ]}
              />
            </View>
          )}

          {/* Content */}
          <View
            style={[styles.content, !enableDrag && { paddingTop: Spacing.lg }]}
            onLayout={onContentLayout}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg, // Plus de padding pour une zone de touch plus grande
    paddingHorizontal: Spacing.xl, // Zone tactile plus large horizontalement
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gray[400],
  },
  content: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg, // Safe area bottom
  },
});

export default BottomSheet;