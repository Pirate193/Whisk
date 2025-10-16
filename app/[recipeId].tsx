import AiModal from '@/components/Aimodal';
import Details from '@/components/Details';
import Ingredients from '@/components/Ingredients';
import Instructions from '@/components/Instructions';
import LogMealButton from '@/components/LogMealButton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RecipePage() {
    const {recipeId} = useLocalSearchParams();
    const recipeIdString =typeof recipeId === "string" ? recipeId : recipeId?.[0] ?? "";
    const recipe = useQuery(api.recipe.getRecipe,{recipeId:recipeIdString as Id<"recipes">})
    const [activeTab,setActiveTab] = useState<'Details'|'Ingredients'|'Instructions'|'Ratings'>('Details')
    const recipeData= {
        title: recipe?.title as string,
        ingredients: recipe?.ingredients as any[],
        instructions: recipe?.instruction as any[],
        nutrition: recipe?.nutrition as any,
        difficulty: recipe?.difficulty as string,
        totalTime: recipe?.totalTime as number
    }
  return (
    <View className='flex-1 bg-background-light dark:bg-background-dark' >

        {/* header */}
       <View className='flex-row justify-between px-2  ' >
        <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name='chevron-back-outline' size={32}   />
        </TouchableOpacity>
        <View>
             <Text className='text-2xl font-bold dark:text-white'numberOfLines={1} >{recipe?.title} </Text>
        </View>
           <TouchableOpacity>
            <Ionicons name='heart-outline' size={32} />
           </TouchableOpacity>
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
            <ScrollView>
           <Details
           description={recipe?.description}
           difficulty={recipe?.difficulty}
           totalTime={recipe?.totalTime}
           servings={recipe?.servings}
           nutritions={recipe?.nutrition}
           />
           </ScrollView>
        ) 
        }
        { activeTab === 'Ingredients' && (
            <FlatList
            data={recipe?.ingredients}
            keyExtractor={(item,index)=>`${item}-${index}`}
            renderItem={({item,index})=>(
                <Ingredients
                index={index+1}
                name={item.name}
                amount={item.amount}
                units={item.unit}
                notes={item.notes}
                />
            )}
            
            />
        )

        }
        {
            activeTab ==='Instructions' && (
                <View>
                <FlatList 
                data={recipe?.instruction}
                keyExtractor={(item)=>`${item.stepNumber}`}
                renderItem={({item})=>(
                    <Instructions stepNumber={item.stepNumber}
                    instruction={item.instruction}
                    duration={item.duration}
                    imageUrl={item.imageUrl}
                    />
                    
                )}
                />
                 <LogMealButton recipeId={recipeIdString} nutrition={recipe?.nutrition} />
                </View>

            )
        }
        {
            activeTab === 'Ratings' && (
                <View>
                <Text> Ratings </Text>
               
                </View>
                
            )
        }

       </View>
       <AiModal recipeId={recipeIdString as Id<'recipes'>} recipeData={recipeData} />
     
    </View>
  )
} 