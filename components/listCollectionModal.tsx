import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useToast } from '@/providers/toastProvider';
import { useAuth } from '@clerk/clerk-expo';
import { FlashList } from '@shopify/flash-list';
import { useMutation, useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import SwipeableModal from './ui/SwipableModal';

interface Props{
    open:boolean;
    onOpen: (open: boolean) => void
    recipeId:Id<'recipes'>
}

const ListCollectionModal = ({open, onOpen,recipeId}:Props) => {
    const {userId}= useAuth();
    const collections = useQuery(api.favourites.getcollections,{userId:userId as string});
    const [seleectedId,setSelectedId]= useState('');
    const addrecipe = useMutation(api.favourites.addRecipetoCollection);
    const {success,error}= useToast();
    useEffect(()=>{
        if(seleectedId){
            handleaddrecipe()
        }
    },[seleectedId])
    const handleaddrecipe = async () => {
        try {
            await addrecipe({
                userId:userId as string,
                collectionId:seleectedId as Id<'collections'>,
                recipeId:recipeId
            })
            onOpen(false)
            success('Success','Recipe added to collection');
        } catch (err) {
            console.log(err);
            error('Error','Something went wrong. Please try again.');
        }
    }
  return (
    <SwipeableModal
    visible={open}
    onClose={() => onOpen(false)}
    height='40%'
    showHandle={true}
    closeOnBackdropPress={true}
    >
         <View className='flex-1' >
            {collections === undefined ? (
        <View className='flex-1 justify-center items-center' >
          <ActivityIndicator size='large' color='yellow' />
        </View>
      ):(
        <FlashList
        data={collections}
        keyExtractor={(item)=>item._id}
        renderItem={({item})=>(
          <TouchableOpacity className='flex-row gap-2 bg-secondary-light mt-2 mx-2 p-4  rounded-lg
        dark:bg-secondary-dark   'onPress={()=>{
            setSelectedId(item._id)
          
        }
        } >
            <View className='bg-primary-light p-2 rounded-lg' >
              <Text className='text-2xl' >{item.emoji}</Text>
            </View>
            <View >
              <Text className='text-xl font-bold dark:text-white' >{item.name} </Text>
              {item.description &&(<Text>{item.description}</Text>)}
              <Text className='text-sm text-gray-500 dark:text-gray-400' >
                {item.recipeIds.length} recipes
              </Text>
            </View>
          </TouchableOpacity>
        )}
        />
      )}
         </View>
    </SwipeableModal>
  )
}

export default ListCollectionModal