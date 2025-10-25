import RecipeCard from '@/components/RecipeCard';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const CollectionPage = () => {
    const { collectionId } = useLocalSearchParams();
    const collection = useQuery(api.favourites.getCollectionId,{id:collectionId as Id<'collections'>})
       
  return (
    <View className='flex-1 bg-white dark:bg-black' >
        <View>
                <Text> {collection?.name}</Text>
                {collection?.description && (
                    <Text>{collection.description} </Text>
                )}
        </View>
        {collection?.recipes === undefined ?(
            <View >
            <ActivityIndicator size='large'  />
            </View>
        ):(
            <FlashList
            data={collection.recipes}
            keyExtractor={(item)=>item._id as string}
            renderItem={({item})=>(
                <RecipeCard 
                id={item._id as string}
                imageUrl={item.imageUrl}
                title={item.title!}
                difficulty={item.difficulty!}
                duration={item.totalTime!}
                dietaryTags={item.dietaryTags}
                />
            )}
            numColumns={2}
            masonry
            
            />
        )

        }
        {collection?.recipes.length === 0 && (
            <View className='flex-1  justify-center items-center' >
                <Text>There is no recipes in this collection begin by adding recipes  </Text>
            </View>
        ) }
     
    </View>
  )
}

export default CollectionPage