import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AddCollection from './addCollection';
import Loading from './ui/loading';
import NotFound from './ui/notFound';

const Collections = () => {
  const [openModal, setOpenModal] = useState(false);
  const {userId} = useAuth();
  const [loading,setLoading] = useState(false);
  const collections = useQuery(api.favourites.getcollections,{userId:userId!});
 
  return (
    <View className='flex-1 relative' >
      {collections === undefined ? (
        <View className='flex-1 justify-center items-center' >
          <Loading />
        </View>
      ):(
        <FlashList
        data={collections}
        keyExtractor={(item)=>item._id}
        renderItem={({item})=>(
          <TouchableOpacity className='flex-row gap-2 bg-secondary-light mt-2 mx-2 p-4  rounded-lg
        dark:bg-secondary-dark   'onPress={()=>router.push({pathname:'/collection/[collectionId]',params:{collectionId:item._id}})} >
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
      {collections?.length === 0 &&(
        <View className='flex-1 justify-center items-center' >
        <NotFound />
        <Text className='text-2xl font-bold dark:text-white' >No Collections Found</Text>
      </View>)}
      <TouchableOpacity onPress={() => setOpenModal(true)}
      className='bg-black p-4 flex justify-center items-center absolute h-14 w-14 rounded-full
      bottom-24 right-8 dark:bg-secondary-dark '  >
       <Ionicons name='add' size={24} color="white" />
      </TouchableOpacity>
      <AddCollection open={openModal} onOpen={setOpenModal} />
    </View>
  )
}

export default Collections