import AiModal from '@/components/Aimodal';
import Details from '@/components/Details';
import Ingredients from '@/components/Ingredients';
import Instructions from '@/components/Instructions';
import ListCollectionModal from '@/components/listCollectionModal';
import LogModal from '@/components/logmodal';
import Ratings from '@/components/Ratings';
import { Button } from '@/components/ui/Button';
import LoadingRecipe from '@/components/ui/loadingRecipe';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useTheme } from '@/providers/themeProvider';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RecipePage() {
    const {recipeId} = useLocalSearchParams();
    const {userId} = useAuth();
    const recipeIdString =typeof recipeId === "string" ? recipeId : recipeId?.[0] ?? "";
    const recipe = useQuery(api.recipe.getRecipe,{recipeId:recipeIdString as Id<"recipes">})
    const favourites = useMutation(api.favourites.addfavourite)
    
    const isfavourite = useQuery(api.favourites.getfavourite,{userId:userId!,recipeId:recipeIdString as Id<"recipes">})
    const {colorScheme}=useTheme();
    useEffect(() => {
        if(isfavourite){
            setLiked(true)
        }
      
    },[isfavourite])
   
    const [liked, setLiked] = useState(false);
    const [activeTab,setActiveTab] = useState<'Details'|'Ingredients'|'Instructions'|'Ratings'>('Details')
    const recipeData= { // this is for the ai contex 
        title: recipe?.title as string,
        ingredients: recipe?.ingredients as any[],
        instructions: recipe?.instruction as any[],
        nutrition: recipe?.nutrition as any,
        difficulty: recipe?.difficulty as string,
        totalTime: recipe?.totalTime as number
    }
    const handlelike = async () => { //handle like 
        await favourites({userId:userId!,recipeId:recipeIdString as Id<"recipes">});
    }
    const Ref = useRef<BottomSheet>(null);
    const [openModal,setOpenModal] = useState(false); //opening the ai modal
    //saving to collections
    const [openCollectionModal,setOpenCollectionModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Simulate loading for 2 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
    if (!recipe || loading){
        return(
        <View className='flex-1 bg-background-light dark:bg-background-dark 
        justify-center items-center' >
            <LoadingRecipe />
            <Text className='text-lg dark:text-white' > Loading Deliciousness..</Text>
        </View>
        )
    }
  return (
    <View className='flex-1 bg-background-light dark:bg-background-dark' >

        {/* header */}
       <View className='flex-row justify-between px-2  ' >
        <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name='chevron-back-outline' size={32} color={
                colorScheme === 'dark' ? 'white':'black'
            }   />
        </TouchableOpacity>
        <View className='flex-1 items-center' >
             <Text className='text-2xl font-bold dark:text-white'numberOfLines={1} >{recipe?.title} </Text>
        </View>
           {colorScheme === 'dark' ?(
             <TouchableOpacity onPress={handlelike}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} color={liked ? 'red' : 'white'}  size={32} />
           </TouchableOpacity>
           ):(
             <TouchableOpacity onPress={handlelike}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} color={liked ? 'red' : 'black'}  size={32} />
           </TouchableOpacity>
           )}
           
        </View> 
        <View className='relative' >
            <Image
            source={recipe?.imageUrl}  
            style={{width:'100%',height:250,borderRadius:12}}
            contentFit='cover'
            />
            <TouchableOpacity
            className='absolute bottom-2 right-6'
            onPress={()=>setOpenCollectionModal(true)} >
                <Ionicons name='bookmark-outline' size={24} color='white' />
            </TouchableOpacity>
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
            <FlashList
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
                <View className='flex-1' >
                <FlashList
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
              
            <Button onPress={()=>setOpenModal(true)} className='dark:bg-secondary-dark'  >Log </Button>
                 <LogModal open={openModal} onOpen={setOpenModal} recipeId={recipeIdString} nutrition={recipe?.nutrition} />
             </View>

            )
        }
        {
            activeTab === 'Ratings' && (
               
                <Ratings recipeId={recipeIdString as Id<'recipes'>} />
               
            
                
            )
        }

       </View>
       <AiModal recipeId={recipeIdString as Id<'recipes'>} recipeData={recipeData} />
       <ListCollectionModal open={openCollectionModal} onOpen={setOpenCollectionModal}
       recipeId={recipeId as Id<'recipes'>} />
    </View>
  )
} 