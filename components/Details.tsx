import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
    MealType:string[];
    CuisineType?:string;
    dietaryTags:string[];
}

export default function Details({description,difficulty,totalTime,servings,nutritions,MealType,CuisineType,dietaryTags}:Props) {
    const [SeeMore,setseeMore]= useState(false);

  return (
    <View className='flex-1 mx-2' >
        {/* header  */}
       <View>
        <Text className='dark:text-white'
      >{!SeeMore ? description?.slice(0,100) : description} </Text>
        <TouchableOpacity onPress={() => setseeMore(!SeeMore)} >
          <Text className='text-red-500 text-sm ' >{SeeMore ? 'See less' : 'See more'}</Text>
        </TouchableOpacity>
       </View>
        {/* mid section  */}
       <View className='flex-row gap-2 justify-around mt-2 items-center' >
        <Text className='dark:text-white' >
         <Ionicons name='time-outline' size={20} />
            {totalTime} min
        </Text>
        <Text className='dark:text-white' >
            <Ionicons name='people-outline' size={20} />
            {servings} servings
        </Text>
        <View className='bg-green-500 rounded-full p-2' >
        <Text className='dark:text-white' >
          {CuisineType}
        </Text>
        </View>

         <View
                    className={`
                    p-2 rounded-full
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

       <View  className="flex-row justify-between my-2" > 
        <View  className='flex items-center justify-center ml-2' >
            <Text className='dark:text-white' >
              <Ionicons name='flame-outline'  />  
              Kcal : {nutritions?.calories}
             </Text>
             <Text className='text-green-500' >
                Protein:{nutritions?.protein}
             </Text>
             <Text className='text-purple-500' >
                Carbs:{nutritions?.carbs}
             </Text>
             <Text className='text-red-500' >
                Fat:{nutritions?.fat}
             </Text>
        </View >
            <NutritionRings nutrition={nutritions} />
       </View>
         <View>
          <Text className='dark:text-white text-lg font-bold' > MealTypes: </Text>
             <View className='flex-row gap-2 flex-wrap mt-2' >
        {MealType.map((type)=>(
          <View key={type}
          className='p-4 bg-green-500 rounded-full' >
            <Text> {type}</Text>
            </View>
        ))}
       </View>
       <View>
        <Text className='dark:text-white text-lg font-bold' >Dietary Tags:</Text>
        <View className='flex-row gap-2 flex-wrap mb-4' >
        {dietaryTags.map((tag)=>(
          <View key={tag}
          className='p-4 bg-purple-500 rounded-full' >
            <Text> {tag}</Text>
            </View>
        ))}
         </View>
       </View>
       </View>
    </View>

  )
}