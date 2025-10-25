import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SwipeableModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string | number; // '50%', '75%', '90%', or absolute number like 400
  showHandle?: boolean; // Show the drag handle at top
  backgroundColor?: string;
  closeOnBackdropPress?: boolean;
}

export default function SwipeableModal({
  visible,
  onClose,
  children,
  height = '90%',
  showHandle = true,

  closeOnBackdropPress = true,
}: SwipeableModalProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastGestureDy = useRef(0);
  
  // Calculate modal height
  const getModalHeight = () => {
    if (typeof height === 'string' && height.includes('%')) {
      const percentage = parseInt(height) / 100;
      return SCREEN_HEIGHT * percentage;
    }
    return typeof height === 'number' ? height : SCREEN_HEIGHT * 0.9;
  };

  const modalHeight = getModalHeight();

  // Pan responder for swipe gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical swipes
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow downward swipes
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          lastGestureDy.current = gestureState.dy;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = modalHeight * 0.3; // 30% of modal height
        
        if (gestureState.dy > swipeThreshold || gestureState.vy > 0.5) {
          // Close modal if swiped down more than threshold or with high velocity
          closeModal();
        } else {
          // Snap back to open position
          Animated.spring(translateY, {
            toValue: 0,
            velocity: gestureState.vy,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Open animation
  useEffect(() => {
    if (visible) {
      openModal();
    }
  }, [visible]);

  const openModal = () => {
    Animated.spring(translateY, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: modalHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      // Reset position after closing
      translateY.setValue(SCREEN_HEIGHT);
    });
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={closeModal}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View className="flex-1">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={closeOnBackdropPress ? closeModal : undefined}>
          <View className="flex-1 bg-black/50" />
        </TouchableWithoutFeedback>

        {/* Modal Content */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: modalHeight,
            transform: [{ translateY }],
          
          }}
          className="rounded-t-3xl bg-white dark:bg-black"
        >
          {/* Drag Handle */}
          {showHandle && (
            <View {...panResponder.panHandlers} className="items-center py-3">
              <View className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            </View>
          )}

          {/* Content */}
          <View className="flex-1" style={{ overflow: 'hidden' }}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}