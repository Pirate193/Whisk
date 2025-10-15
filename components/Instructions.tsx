import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
  stepNumber: number;
  instruction: string;
  duration?: number;
  imageUrl?: string;
}

export default function Instructions({ stepNumber, instruction, duration, imageUrl }: Props) {
  return (
    <View className='bg-white rounded-xl p-4 mb-4 shadow-sm dark:bg-black'>
      <View className='flex-row items-center justify-between mb-3'>
        <View className='flex-row items-center'>
          <View className='w-8 h-8 rounded-full bg-emerald-500 items-center justify-center mr-3'>
            <Text className='text-white text-sm font-bold  '>{stepNumber}</Text>
          </View>
          <Text className='text-lg font-bold text-gray-900 dark:text-white '>Step {stepNumber}</Text>
        </View>
        
        {duration && (
          <View className='bg-amber-50 px-3 py-1.5 rounded-full flex-row items-center'>
            <Text className='text-amber-700 text-xs font-semibold'>
                <Ionicons name='time-outline' size={14} />
                 {duration} min</Text>
          </View>
        )}
      </View>

      {/* Instruction text */}
      <Text className='text-base text-gray-700 leading-6 mb-3 dark:text-white'>
        {instruction}
      </Text>

      {/* Optional image */}
      {imageUrl && (
        <View className='mt-2 rounded-lg overflow-hidden'>
          <Image 
            source={{ uri: imageUrl }}
            className='w-full h-48'
            resizeMode='cover'
          />
        </View>
      )}
    </View>
  );
}