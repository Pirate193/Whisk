import Collections from '@/components/collections';
import Favourites from '@/components/favourites';
import Settings from '@/components/settings';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
      const {userId}= useAuth();
      const user = useQuery(api.users.getUser,{userId:userId!});
      const [activeTab, setActiveTab] = useState<'Favourites'|'Collections'>('Favourites');
      const [openModal,setOpenModal] = useState(false);

  return (
    <View className='flex-1 bg-background-light dark:bg-background-dark' >
      <View className='flex-row mt-4 gap-4 items-center mx-2' >
        <View>
          <Image
          source={user?.avatarUrl}
          style={{width:100,height:100,borderRadius:50}}
          />
        </View>
        <View>
          <Text className='text-lg dark:text-white' >{user?.username}</Text>
          <Text className='text-sm text-gray-500 dark:text-gray-400' >{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Ionicons name='settings-outline' size={30} />
        </TouchableOpacity>
      </View>
      
      <View>
        <Text> cookingSkillLevel: {user?.cookingSkillLevel} </Text>
      </View>
      <View className='flex-row justify-around mt-2'>
        {['Favourites','Collections'].map((tab)=>(
          <TouchableOpacity key={tab} onPress={()=>setActiveTab(tab as 'Favourites' | 'Collections')} 
            className={` justify-center rounded-full px-2 py-2 
            ${activeTab === tab ? 'bg-background-dark text-white dark:bg-background-light ':'bg-secondary-light  dark:bg-background-dark '} `}
            >
                <Text className={` ${ activeTab === tab ? 'text-white dark:text-black ':'text-black dark:text-white'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Favourites' &&(
          <Favourites />
      )}
      {activeTab === 'Collections' &&(
      
          <Collections />
       
      )}
      <Settings open={openModal} onOpen={setOpenModal} />
    </View>
  )
}

export default Profile