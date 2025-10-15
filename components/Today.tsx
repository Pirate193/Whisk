import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function Today() {
    const {userId}= useAuth();
    const date = new Date().toISOString().split('T')[0];
    const todaysMeals = useQuery(api.mealplan.getMealplanByDate,
      userId ?{userId,date}:'skip')
    const todaysNutrition = useQuery(api.meallogs.getDailyNutritionSummary,userId ?{userId,date}:'skip')

     const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };
  return (
    <View  >
      <View>
        <View>
             <Text className='text-2xl font-bold text-gray-900 dark:text-white' >{formatDate()} </Text>
             <Text> Calories Taken:{todaysNutrition?.calories}</Text>
             <Text> Carbs Taken:{todaysNutrition?.carbs}</Text>
             <Text> Fat Taken:{todaysNutrition?.fat}</Text>
             <Text> Protein Taken:{todaysNutrition?.protein}</Text>
        </View>
      
      </View>

      { todaysMeals === undefined ? (
       <View className='bg-white dark:bg-gray-900 rounded-2xl p-8 items-center'>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text className='text-gray-500 dark:text-gray-400 mt-4'>
                Loading meals...
              </Text>
            </View>
      ):todaysMeals && todaysMeals.length > 0 ? (
        todaysMeals.map((meal,index)=>(
            <View key={index} >
                <View>
                    <Text>{meal.mealType}</Text>
                </View>
                {meal.recipe && (
                   <TouchableOpacity>
                      <Text> {meal.recipe.title} </Text>
                      <Text> {meal.recipe.difficulty} </Text>
                </TouchableOpacity>
                )}
                
            </View>
        ))
      ):(
          <View>
            <Text> No meals found begin by creating a meal plan</Text>
          </View>    
      ) }
       
    </View>
  )
}