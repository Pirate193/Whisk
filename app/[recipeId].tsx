import Details from '@/components/Details';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function RecipePage() {
    const {recipeId} = useLocalSearchParams();
    const recipeIdString =
    typeof recipeId === "string" ? recipeId : recipeId?.[0] ?? "";
    const recipe = useQuery(api.recipe.getRecipe,{recipeId:recipeIdString as Id<"recipes">})
    const [activeTab,setActiveTab] = useState<'Details'|'Ingredients'|'Instructions'|'Ratings'>('Details')
  return (
    <View className='flex-1 bg-background-light dark:bg-background-dark' >

        {/* header */}
       <View>
         <Text>{recipe?.title} </Text>
        </View> 
        <View>
            <Image
            source={recipe?.imageUrl}  
            style={{width:'100%',height:250,borderRadius:12}}
            contentFit='cover'
            />
        </View>
        <View className='flex-row justify-around mt-2' >
            {['Details','Ingredients','Instructions','Ratings'].map((tab)=>(
                <TouchableOpacity key={tab} onPress={()=>setActiveTab(tab as 'Details'|'Ingredients'|'Instructions'|'Ratings')} 
                className={` justify-center rounded-full px-2 py-2 
                ${activeTab === tab ? 'bg-background-dark text-white dark:bg-background-light ':'bg-secondary-light  dark:bg-background-dark '} `}
                >
                  <Text className={` ${ activeTab === tab ? 'text-white dark:text-black ':'text-black dark:text-white'}`}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
       <View className="flex-1">
        { activeTab ==='Details' &&
        (
           <Details
           description={recipe?.description}
           difficulty={recipe?.difficulty}
           totalTime={recipe?.totalTime}
           servings={recipe?.servings}
           nutritions={recipe?.nutrition}
           />
        ) 
        }
        { activeTab === 'Ingredients' && (
            <Text> Ingredients </Text>
        )

        }
        {
            activeTab ==='Instructions' && (
                <Text> Instructions </Text>

            )
        }
        {
            activeTab === 'Ratings' && (
                <Text> Ratings </Text>

            )
        }

       </View>
     
    </View>
  )
} 