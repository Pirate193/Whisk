
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface MealPlanProps{
   id:string,
   title:string,
   description?:string,
   startDate:string,
   endDate:string,
   totalRecipes:number,
   isActive:boolean,
   completedMeals:number
}

export default function MealPlan({id,title,description,startDate,endDate,totalRecipes,isActive,completedMeals}:MealPlanProps) {


  return (
     <TouchableOpacity className='flex-row justify-between bg-secondary-light dark:bg-secondary-dark p-2 rounded-2xl mx-2 mt-2'
      onPress={()=>router.push({pathname:'/mealplan/[mealplanId]',params:{mealplanId:id}})} >
       <View>
        <Text className='text-lg font-bold dark:text-white' >{title}</Text>
        {description && <Text className='text-sm text-gray-500 dark:text-gray-400' >{description}</Text>}
        <View className='flex-row justify-between gap-2'>
          <Text className='dark:text-white' >StartDate:{startDate} </Text>
          <Text className='dark:text-white' >EndDate:{endDate}</Text>
        </View>
        <View className='flex-row justify-between gap-2' >
          <Text className='dark:text-white' >TotalRecipes:{totalRecipes}</Text>
          <Text className='dark:text-white' >CompletedMeals:{completedMeals}</Text>
        </View>
       </View>
       <View className='items-center justify-center' >
        {isActive ?(
          <TouchableOpacity>
            <Ionicons name='checkmark-circle-outline' size={20} color='green' />
          </TouchableOpacity>
        ):(
          <TouchableOpacity>
            <Ionicons name='close-circle-outline' size={20} color='red' />
          </TouchableOpacity>
        )}
        
       </View>
     </TouchableOpacity>
  )
}