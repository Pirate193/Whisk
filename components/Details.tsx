import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import NutritionRings from './NutritionRings';
interface Props{
    description?:string,
    difficulty?:string,
    totalTime?:number,
    servings?:number,
    nutritions?:{
        calories:number,
        carbs:number,
        fat:number,
        protein:number,
    },

}

export default function Details({description,difficulty,totalTime,servings,nutritions}:Props) {
    
    const max = 100; 
    const getFill = (value: number) => Math.min((value / max) * 100, 100);
  return (
    <View>
        {/* header  */}
       <View>
        <Text className='dark:text-white' >{description}</Text>
       </View>
        {/* mid section  */}
       <View className='flex-row gap-2 justify-around mt-2' >
        <Text className='dark:text-white' >
         <Ionicons name='time-outline' size={20} />
            {totalTime} min
        </Text>
        <Text className='dark:text-white' >
            <Ionicons name='people-outline' size={20} />
            {servings} servings
        </Text>
         <View
                    className={`
                    px-3 py-1 rounded-2xl
                    ${difficulty === 'easy' 
                      ? 'bg-green-500' 
                      : difficulty === 'medium'
                      ? 'bg-yellow-200'
                      : 'bg-red-400'
                    }
                  `}
                    >
                   <Text  >{difficulty}</Text>
         </View>
       </View>
       
       <View  className="flex-row justify-between" > 
        <View  className='flex items-center justify-center ml-2' >
            <Text className='dark:text-white' >
              <Ionicons name='flame-outline'  />  
              Kcal : {nutritions?.calories}
             </Text>
             <Text className='text-green-400' >
                Protein:{nutritions?.protein}
             </Text>
             <Text className='text-yellow-200' >
                Carbs:{nutritions?.carbs}
             </Text>
             <Text className='text-red-400' >
                Fat:{nutritions?.fat}
             </Text>
        </View >
            <NutritionRings nutrition={nutritions} />
       </View>

      
    </View>

  )
}