import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import AddCollection from './addCollection';

const Collections = () => {
  const [openModal, setOpenModal] = useState(false);
  const {userId} = useAuth();
  const [loading,setLoading] = useState(false);
  const collections = useQuery(api.favourites.getcollections,{userId:userId!});
  return (
    <View className='flex-1 relative' >
      {collections === undefined ? (
        <View className='flex justify-center items-center' >
          <ActivityIndicator />
        </View>
      ):(
        <FlashList
        data={collections}
        keyExtractor={(item)=>item._id}
        renderItem={({item})=>(
          <TouchableOpacity className='flex-row gap-2 bg-secondary-light mt-2 mx-2 p-4  rounded-lg
           'onPress={()=>router.push({pathname:'/collection/[collectionId]',params:{collectionId:item._id}})} >
            <View className='bg-primary-light p-2 rounded-lg' >
              <Text className='text-2xl' >{item.emoji}</Text>
            </View>
            <View >
              <Text className='text-lg font-bold' >{item.name} </Text>
              {item.description &&(<Text>{item.description}</Text>)}
            </View>
          </TouchableOpacity>
        )}
        />
      )}
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