import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import InformationCircleIcon from '@/assets/icons/information-circle.svg';
import { Colors } from "@/constants/Colors";

type TooltipSize = 'small' | 'medium' | 'large';
type TooltipPosition = 'left' | 'center' | 'right';

type MeasureCallback = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void;

interface TooltipProps {
  message: string;
  title?: string;
  size?: TooltipSize;
  position?: TooltipPosition;
}

interface Position {
  x: number;
  y: number;
}

const SIZES: Record<TooltipSize, number> = {
  small: 150,
  medium: 250,
  large: 350,
};

const TooltipContent: React.FC<{
  message: string;
  title?: string;
  width: number;
  position: TooltipPosition;
  tooltipPosition: Position;
  onClose: () => void;
}> = ({ message, title, width, position, tooltipPosition, onClose }) => {
  const getPosition = () => ({
    position: 'absolute' as const,
    top: tooltipPosition.y + 28,
    left: position === 'left' ? tooltipPosition.x :
      position === 'right' ? tooltipPosition.x - width + 24 :
        tooltipPosition.x - (width / 2) + 12
  });

  const getTriangleMargin = () => ({
    marginLeft: position === 'left' ? 8 :
      position === 'right' ? width - 20 :
        (width / 2) - 8
  });

  return (
    <Modal transparent visible onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.tooltipContainer, getPosition()]}>
          <View style={[styles.triangle, getTriangleMargin()]} />
          <View style={[styles.messageContainer, { width }]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const Tooltip: React.FC<TooltipProps> = ({
                                           message,
                                           title,
                                           size = 'medium',
                                           position = 'center'
                                         }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<Position>({ x: 0, y: 0 });
  // @ts-ignore
  const iconRef = useRef<TouchableOpacity>(null);

  const measureIcon = () => {
    const measure: MeasureCallback = (_x, _y, _width, _height, pageX, pageY) => {
      setTooltipPosition({ x: pageX, y: pageY });
    };

    iconRef.current?.measure(measure);
  };

  const handleOpenTooltip = () => {
    measureIcon();
    setShowTooltip(true);
  };

  const handleCloseTooltip = () => setShowTooltip(false);

  return (
    <View>
      <TouchableOpacity
        ref={iconRef}
        onPress={handleOpenTooltip}
        style={styles.iconContainer}
      >
        <InformationCircleIcon />
      </TouchableOpacity>

      {showTooltip && (
        <TooltipContent
          message={message}
          title={title}
          width={SIZES[size]}
          position={position}
          tooltipPosition={tooltipPosition}
          onClose={handleCloseTooltip}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tooltipContainer: {
    zIndex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.light.primary,
    alignSelf: 'flex-start',
  },
  messageContainer: {
    backgroundColor: Colors.light.primaryDark,
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  message: {
    color: Colors.light.mediumGrey,
    fontSize: 12,
  },
  title: {
    color: Colors.light.white,
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Tooltip;
