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
  const [activeTab,setActiveTab] = useState<'Today'|'MealPlan'|'Logs'>('Today')
    const {userId}= useAuth()
    const MealPlans = useQuery(api.mealplan.getMealplan,{userId:userId as string})
    const [openModal,setOpenModal] = useState(false)
   
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
        <View className='flex-1 relative ' >
          { activeTab === 'Today' &&(
            <View >
            <Today />
           
            </View>
          )}
         { activeTab === 'MealPlan' &&(
           <View className='flex-1 relative ' >
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
        )}
        {  activeTab === 'Logs' && (
          <LogsComponent />
        ) }
        </View>
       
    </View>
  )
}

export default Logs