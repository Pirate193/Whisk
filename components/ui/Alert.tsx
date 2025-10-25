import React from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'destructive';
  closeOnBackdropPress?: boolean;
}

export default function AlertDialog({
  visible,
  onClose,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Continue',
  onConfirm,
  variant = 'default',
  closeOnBackdropPress = true,
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-4">
        {/* Backdrop */}
        <TouchableWithoutFeedback
          onPress={closeOnBackdropPress ? onClose : undefined}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="absolute inset-0 bg-black/50"
          />
        </TouchableWithoutFeedback>

        {/* Dialog Content */}
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-2xl"
        >
          {/* Title */}
          <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </Text>

          {/* Description */}
          {description && (
            <Text className="text-sm text-slate-600 dark:text-slate-400 leading-5 mb-6">
              {description}
            </Text>
          )}

          {/* Actions */}
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 py-3 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 active:opacity-70"
              onPress={onClose}
            >
              <Text className="text-sm font-semibold text-slate-900 dark:text-white text-center">
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              className={`flex-1 py-3 px-4 rounded-lg active:opacity-70 ${
                variant === 'destructive'
                  ? 'bg-red-500 dark:bg-red-600'
                  : 'bg-slate-900 dark:bg-white'
              }`}
              onPress={handleConfirm}
            >
              <Text
                className={`text-sm font-semibold text-center ${
                  variant === 'destructive'
                    ? 'text-white'
                    : 'text-white dark:text-slate-900'
                }`}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}