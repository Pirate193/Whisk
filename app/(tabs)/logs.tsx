import MealPlan from '@/components/MealPlan'
import Today from '@/components/Today'
import { api } from '@/convex/_generated/api'
import { useAuth } from '@clerk/clerk-expo'
import { useQuery } from 'convex/react'
import React, { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
const Logs = () => {
  const [activeTab,setActiveTab] = useState<'Today'|'MealPlan'|'Logs'>('Today')
    const {userId}= useAuth()
    const MealPlans = useQuery(api.mealplan.getMealplan,{userId:userId as string})
   
  return (
    <View className='flex-1 bg-white dark:bg-black' >
        <View>
          <Text className='text-lg dark:text-white' >Logs </Text>
          <Text className='dark:text-white' > Track your Meals And Progress </Text>
        </View>
        <View className='flex-row justify-around mt-2'>
         {['Today','MealPlan','Logs'].map((tab)=>(
           <TouchableOpacity key={tab} onPress={()=>setActiveTab(tab as 'Today' | 'MealPlan'|'Logs')} 
             className={` justify-center rounded-full px-2 py-2 
             ${activeTab === tab ? 'bg-background-dark text-white dark:bg-background-light ':'bg-secondary-light  dark:bg-background-dark '} `}
             >
                 <Text className={` ${ activeTab === tab ? 'text-white dark:text-black ':'text-black dark:text-white'}`}>{tab}</Text>
           </TouchableOpacity>
         ))}
        </View  >
        <View>
          { activeTab === 'Today' &&(
            <View >
            <Today />
           
            </View>
          )}
         { activeTab === 'MealPlan' &&(
            <FlatList
            data={MealPlans}
            keyExtractor={(item)=>item._id}
            renderItem={({item})=>(
              <MealPlan id={item._id} title={item.name} startDate={item.startDate} 
              endDate={item.endDate} isActive={item.isActive} totalRecipes={item.totalRecipes} completedMeals={item.completedMeals} />
            )}
            />
        )}
        {  activeTab === 'Logs' && (
           <Text >Logs</Text>
        ) }
        </View>
       
    </View>
  )
}

export default Logs