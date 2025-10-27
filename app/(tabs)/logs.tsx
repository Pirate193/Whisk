import LogsComponent from '@/components/Logs'
import MealPlan from '@/components/MealPlan'
import CreateMealPlan from '@/components/mealplan/createmealplan'
import Today from '@/components/Today'
import { api } from '@/convex/_generated/api'
import { useAuth } from '@clerk/clerk-expo'
import { FlashList } from '@shopify/flash-list'
import { useQuery } from 'convex/react'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
const Logs = () => {

    const {userId}= useAuth()

   
  return (
    <View className='flex-1 bg-white dark:bg-black' >
        <View className='p-4 ' >
          <Text className='text-3xl  dark:text-white ' >Logs </Text>
          <Text className='dark:text-white ' >Track your Meals And Progress </Text>
        </View>
          <LogsComponent />
    </View>
  )
}

export default Logs