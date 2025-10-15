import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  name: string;
  amount: number;
  units: string;
  notes?: string;
  index?: number;
}

export default function Ingredients({ name, amount, units, notes, index }: Props) {
  return (
    <View className='flex-row justify-between items-center bg-white rounded-lg px-4 py-3 mb-2 shadow-sm dark:bg-black'>
       
      <View className='flex-row items-start flex-1 mr-3'>
        {index !== undefined && (
          <View className='w-6 h-6 rounded-full bg-primary-light items-center justify-center mr-3 mt-0.5'>
            <Text className='text-black text-xs font-semibold '>{index}</Text>
          </View>
        )}
        
        <View className='flex-1'>
          <Text className='text-base font-semibold text-gray-900 dark:text-white'>{name}</Text>
          {notes && (
            <Text className='text-sm text-gray-500 italic mt-1 '>{notes}</Text>
          )}
        </View>
      </View>
   
      <View className='flex-row items-baseline'>
        <Text className='text-base font-bold text-blue-600'>{amount}</Text>
        <Text className='text-sm font-medium text-gray-500 ml-1'>{units}</Text>
      </View>
    </View>
  );
}