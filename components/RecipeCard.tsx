import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface RecipeCardProps{
    id:string,
    imageUrl?:string,
    title:string,
    difficulty:string,
    duration:number,
    dietaryTags?:string[]
}

const RecipeCard = ({id,imageUrl,title,difficulty,duration,dietaryTags}:RecipeCardProps) => {

  return (
    <TouchableOpacity className='bg-secondary-light  mb-2 flex-1 rounded-xl  dark:bg-secondary-dark' onPress={()=>router.push({pathname:'/[recipeId]',params:{recipeId:id}})} >
        <View className='relative ' >
            <Image
            source={imageUrl}
            style={{width:'100%',height:160,borderRadius:12}}
            className='rounded-2xl'
            contentFit='cover'
            />
        <View className='flex flex-row justify-between absolute bottom-2 ml-2' >
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
         <View className='bg-text-dark px-2  ml-2 justify-center rounded-full '  >
             <Text className='text-base' >{duration} min </Text>
        </View>
        </View>
    </View>
      <View className='mt-2' >
        <Text className='text-base text-text-light dark:text-text-dark' 
        numberOfLines={2}>{title} </Text>
       </View>
       { dietaryTags && dietaryTags.length > 0 && (
        <View className='flex flex-row flex-wrap' >
            {dietaryTags.slice(0,3).map((tags)=>(
                <View key={tags} className='gap-2 rounded-full bg-primary-light px-2 mt-2 dark:bg-primary-dark ' >
                    <Text className='text-text-light ' >{tags}</Text>
                </View>
            ))}
         </View>   
       )}
      
    </TouchableOpacity>
  )
}

export default RecipeCard