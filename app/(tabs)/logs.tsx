import Today from '@/components/Today'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Logs = () => {
  const [activeTab,setActiveTab] = useState<'Today'|'MealPlan'|'Logs'>('Today')
   
  return (
    <View className='flex-1 bg-white dark:bg-black' >
        <View>
          <Text>Logs </Text>
          <Text> Track your Meals And Progress </Text>
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
           <View>
            <Text>MealPl sedfwdean</Text>
            </View>
        )}
        {  activeTab === 'Logs' && (
           <Text >Logs</Text>
        ) }
        </View>
       
    </View>
  )
}

export default Logs