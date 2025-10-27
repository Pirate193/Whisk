import MealPlan from "@/components/MealPlan";
import CreateMealPlan from "@/components/mealplan/createmealplan";
import NotFound from '@/components/ui/notFound';
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const MealPlanPage = () => {
    const {userId}= useAuth()
    const MealPlans = useQuery(api.mealplan.getMealplan,{userId:userId as string})
    const [openModal,setOpenModal] = useState(false)


    return (
        <View className='flex-1 relative bg-white dark:bg-black ' >
            <View className='p-4 border-b border-gray-200 dark:border-gray-800 ' >
                <Text className={'text-3xl dark:text-white font-bold '} >Meal Plans  </Text>
                <Text className='text-lg dark:text-gray-500' >total plans:{MealPlans?.length} </Text>

            </View>
            {MealPlans?.length === 0 && (
                <View className='flex-1 justify-center items-center' >
                    <NotFound />
                    <Text className='text-2xl font-bold dark:text-white' >No meal Plans Found  </Text>
                </View>
            )}

            <FlashList
                data={MealPlans}
                keyExtractor={(item)=>item._id}
                renderItem={({item})=>(
                    <MealPlan id={item._id} title={item.name} startDate={item.startDate}
                              endDate={item.endDate} isActive={item.isActive} totalRecipes={item.totalRecipes} completedMeals={item.completedMeals} />
                )}
            />
            <TouchableOpacity className='bg-black absolute bottom-20 right-8 p-4 rounded-full h-16 w-16 items-center
            justify-center dark:bg-white ' onPress={()=> setOpenModal(true)} >
                <Text className='text-white dark:text-black text-2xl' >+</Text>
            </TouchableOpacity>
            <CreateMealPlan open={openModal} onOpen={setOpenModal}  />
        </View>
  )
}

export default MealPlanPage