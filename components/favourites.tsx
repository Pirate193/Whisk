import { api } from '@/convex/_generated/api'
import { useAuth } from '@clerk/clerk-expo'
import { FlashList } from "@shopify/flash-list"
import { useQuery } from 'convex/react'
import React from 'react'
import { View } from 'react-native'
import RecipeCard from './RecipeCard'


export default function Favourites() {
    const {userId} = useAuth();
    const favourites = useQuery(api.favourites.getfavourites,{userId:userId!});
    const recipeId = favourites?.map((favourite) => favourite.recipeId);
  return (
    <View className='flex-1' >
      <FlashList 
      data={favourites}
      keyExtractor={(item)=>item._id}
      renderItem={({item})=>(
         <RecipeCard id={item.recipe?._id as string}  imageUrl={item.recipe?.imageUrl} title={item.recipe?.title!} difficulty={item.recipe?.difficulty!} 
        duration={item.recipe?.totalTime!} dietaryTags={item.recipe?.dietaryTags} />
      )}
      numColumns={2}
      masonry
      />
    </View>
  )
}