
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from 'convex/react'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

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
  const [isended, setIsEnded] = useState(false);
  const deleteMealPlan = useMutation(api.mealplan.deleteMealplan)
  useEffect(()=>{
    compareDates();
  },[])
  const compareDates = ()=>{
    const today = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if(today > end){
      setIsEnded(true);
    }
  }
  const rightActions = () => (
    <TouchableOpacity
      onPress={async () => {
        await deleteMealPlan({ id: id as Id<'mealPlans'> });
        
      }}
      className="bg-red-500 justify-center items-center w-20 h-full rounded-r-2xl"
    >
      <Ionicons name="trash" size={24} color="white" />
    </TouchableOpacity>
  );
   
  return (
    <Swipeable renderRightActions={rightActions} >
     <TouchableOpacity className='flex-row justify-between bg-secondary-light dark:bg-secondary-dark p-2 rounded-2xl mx-2 mt-2'
    
      onPress={()=>router.push({pathname:'/mealplan/[mealplanId]',params:{mealplanId:id}})} >
       <View>
        <Text className='text-lg font-bold dark:text-white' >{title}
          {isended && <Text className="ml-2 text-xs font-semibold text-red-500 bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                Ended
              </Text>}
        </Text>
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
    </Swipeable>
  )
}