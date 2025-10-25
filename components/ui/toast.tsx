import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  SlideInUp,
  SlideOutUp
} from 'react-native-reanimated';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  variant = 'default',
  onDismiss,
}: ToastProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { 
          border: 'border-l-green-500', 
          icon: '✓',
          iconBg: 'bg-green-100 dark:bg-green-900',
          iconColor: 'text-green-600 dark:text-green-400'
        };
      case 'error':
        return { 
          border: 'border-l-red-500', 
          icon: '✕',
          iconBg: 'bg-red-100 dark:bg-red-900',
          iconColor: 'text-red-600 dark:text-red-400'
        };
      case 'warning':
        return { 
          border: 'border-l-amber-500', 
          icon: '⚠',
          iconBg: 'bg-amber-100 dark:bg-amber-900',
          iconColor: 'text-amber-600 dark:text-amber-400'
        };
      default:
        return { 
          border: 'border-l-blue-500', 
          icon: 'ℹ',
          iconBg: 'bg-blue-100 dark:bg-blue-900',
          iconColor: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      entering={SlideInUp.duration(300).springify()}
      exiting={SlideOutUp.duration(200)}
      className={`flex-row items-start justify-between mx-4 mt-6 p-4 rounded-xl bg-white dark:bg-slate-900 border-l-4 ${variantStyles.border} shadow-lg`}
    >
      <View className="flex-1 flex-row items-start">
        <View className={`w-6 h-6 mr-3 items-center justify-center rounded-full ${variantStyles.iconBg}`}>
          <Text className={`text-base ${variantStyles.iconColor}`}>
            {variantStyles.icon}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">
            {title}
          </Text>
          {description && (
            <Text className="text-xs text-slate-600 dark:text-slate-400 leading-[18px]">
              {description}
            </Text>
          )}
        </View>
      </View>
      <Pressable
        onPress={() => onDismiss(id)}
        className="p-1 ml-2 active:opacity-50"
      >
        <Text className="text-sm text-slate-400 dark:text-slate-500">✕</Text>
      </Pressable>
    </Animated.View>
  );
}