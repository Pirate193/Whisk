import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import NutritionRings from './NutritionRings';

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
    <View   >
      <Text className='text-2xl font-bold text-gray-900 dark:text-white' >{formatDate()} </Text>
      <View className='flex-row justify-between  mb-6 ' >
        <View >
             
             <Text  className="text-gray-700 dark:text-gray-300" > Calories Taken:{todaysNutrition?.calories}</Text>
             <Text  className="text-gray-700 dark:text-gray-300"> Carbs Taken:{todaysNutrition?.carbs}</Text>
             <Text  className="text-gray-700 dark:text-gray-300"> Fat Taken:{todaysNutrition?.fat}</Text>
             <Text  className="text-gray-700 dark:text-gray-300"> Protein Taken:{todaysNutrition?.protein}</Text>
        </View>
        <View>
        <NutritionRings nutrition={todaysNutrition} />
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
            <View key={index} className='mx-2 mb-2 ' >
                <View className='flex-row gap-2 ml-2 items-center' >
                <Ionicons
                      name={
                        meal.mealType === "breakfast"
                          ? "cafe-outline"
                          : meal.mealType  === "lunch"
                            ? "restaurant-outline"
                            : meal.mealType  === "dinner"
                              ? "restaurant-outline"
                              : "cafe-outline"
                      }
                      size={20}
                      className='dark:bg-white'
                    />
                    <Text className=' dark:text-white' >{meal.mealType}</Text>
                </View>
                {meal.recipe && (
                <TouchableOpacity className='bg-secondary-light flex-row justify-between py-4 px-2 rounded-lg dark:bg-secondary-dark ' 
                 onPress={()=>router.push({pathname:'/[recipeId]',params:{recipeId:meal.recipeId}})}  >
                  <Image
                    source={meal.recipe.imageUrl}
                    style={{width:50,height:50,borderRadius:12}}
                    />
                   <View className='flex-1 '>
                    
                   <Text numberOfLines={3} className='text-base font-medium dark:text-white'  > {meal.recipe.title} </Text>
                   </View>
                      <View
                       className={`
                        px-3 py-1 rounded-2xl 
                        ${meal.recipe.difficulty === 'easy' 
                          ? 'bg-green-500' 
                          : meal.recipe.difficulty === 'medium'
                          ? 'bg-yellow-200'
                          : 'bg-red-400'
                        }
                      `}
                      >
                      <Text className='text-base font-normal' > {meal.recipe.difficulty} </Text>
                      </View>
                </TouchableOpacity>
                )}
                
            </View>
        ))
      ):(
          <View className='flex-1 justify-center items-center mt-8' >
            <Text className='dark:text-gray-400 text-base' > No meals found begin by creating a meal plan</Text>
          </View>    
      ) }
       
    </View>
  )
}