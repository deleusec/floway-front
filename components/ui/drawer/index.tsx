import React, { useRef, useEffect, useState } from 'react';
import { Modal, View, StyleSheet, Pressable, Animated, Dimensions, Platform, PanResponder, PanResponderGestureState } from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  percent?: number;
  mode?: 'fit' | 'fixed' | 'percent';
  style?: any;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DRAG_DISMISS_THRESHOLD = 0.25;

const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  children,
  height,
  percent,
  mode = 'fixed',
  style,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  let drawerHeight: number;
  if (mode === 'fit') {
    drawerHeight = Math.min(contentHeight, SCREEN_HEIGHT * 0.9);
  } else if (mode === 'percent' && percent) {
    drawerHeight = SCREEN_HEIGHT * percent;
  } else if (mode === 'fixed' && height) {
    drawerHeight = typeof height === 'string' && height.endsWith('%')
      ? SCREEN_HEIGHT * (parseFloat(height) / 100)
      : Number(height) || SCREEN_HEIGHT * 0.45;
  } else {
    drawerHeight = SCREEN_HEIGHT * 0.45;
  }

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = useState(false);
  const [fitReady, setFitReady] = useState(mode !== 'fit');

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState: PanResponderGestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderGrant: () => {
        setDragging(true);
        dragY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setDragging(false);
        if (gestureState.dy > drawerHeight * DRAG_DISMISS_THRESHOLD) {
          Animated.spring(translateY, {
            toValue: drawerHeight,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (mode === 'fit' && contentHeight > 0 && visible) {
      translateY.setValue(drawerHeight);
      setFitReady(true);
    }
  }, [mode, contentHeight, drawerHeight, visible, translateY]);

  useEffect(() => {
    if (mode === 'fit' && !fitReady) return;
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: drawerHeight,
          useNativeDriver: true,
          bounciness: 0,
        }),
      ]).start(() => setIsMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, backdropOpacity, translateY, drawerHeight, fitReady, mode]);

  const drawerTranslateY = Animated.add(translateY, dragY);

  if ((mode === 'fit' && (!fitReady || !contentHeight)) || (!isMounted && !visible)) return null;

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.drawer,
          mode === 'fit' ? { maxHeight: SCREEN_HEIGHT * 0.9 } : { height: drawerHeight },
          { transform: [{ translateY: drawerTranslateY }] },
          style,
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleContainer}>
          <Animated.View
            style={[
              styles.handle,
              dragging && { opacity: 0.5, transform: [{ scaleX: 1.2 }] },
            ]}
          />
        </View>
        <View
          style={mode === 'fit' ? { flexGrow: 0 } : { flex: 1 }}
          onLayout={mode === 'fit' ? (e) => setContentHeight(e.nativeEvent.layout.height) : undefined}
        >
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 2,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gray[400],
    marginBottom: Spacing.sm,
  },
});

export default Drawer;