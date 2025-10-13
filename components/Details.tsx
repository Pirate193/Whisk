import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
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
        <Text>{description}</Text>
       </View>
        {/* mid section  */}
       <View className='flex-row gap-2 justify-around mt-2' >
        <Text>
         <Ionicons name='time-outline' size={20} />
            {totalTime} min
        </Text>
        <Text>
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
                   <Text >{difficulty}</Text>
         </View>
       </View>
       {/* render progress chat   */}
       {nutritions && (
          <View className='flex flex-row justify-between' >
            {Object.entries(nutritions).map(([key,value])=>(
                <AnimatedCircularProgress
                key={key as keyof typeof nutritions}
                size={70}
                width={7}
                fill={getFill(value)}
                tintColor='#00ff00'
                backgroundColor='#3d5875'
                >
                    {()=>(
                        <Text>
                            {Math.round(value)}
                            {key === 'calories'?'':'g'}
                        </Text>
                    )}
                </AnimatedCircularProgress>
                
            ))}
        </View>
       )}
       
    </View>
  )
}