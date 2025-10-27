import { api } from '@/convex/_generated/api'
import { useAuth } from '@clerk/clerk-expo'
import { FlashList } from "@shopify/flash-list"
import { useQuery } from 'convex/react'
import React from 'react'
import { Text, View } from 'react-native'
import RecipeCard from './RecipeCard'
import Loading from './ui/loading'
import NotFound from './ui/notFound'


export default function Favourites() {
    const {userId} = useAuth();
    const favourites = useQuery(api.favourites.getfavourites,{userId:userId!});
    const recipeId = favourites?.map((favourite) => favourite.recipeId);
    if(!favourites) {
      return(
        <View className='flex-1 justify-center items-center' >
          <Loading />
        </View>
      )
    }
  return (
    <View className='flex-1 pt-2 ' >
      {favourites.length === 0 && (
        <View className='flex-1 justify-center items-center' >
          <NotFound />
          <Text className='text-2xl font-bold dark:text-white' >No favourites Found  </Text>
          </View>)}
      <FlashList 
      data={favourites}
      keyExtractor={(item)=>item._id}
      renderItem={({item})=>(
         <RecipeCard id={item.recipe?._id as string}  imageUrl={item.recipe?.imageUrl} title={item.recipe?.title!} difficulty={item.recipe?.difficulty!} 
        duration={item.recipe?.totalTime!} dietaryTags={item.recipe?.dietaryTags} />
      )}
      numColumns={2}
      masonry
      showsVerticalScrollIndicator={false}
      />
      <View className='h-20' />
    </View>
  )
}