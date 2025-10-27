import Collections from '@/components/collections';
import Favourites from '@/components/favourites';
import Settings from '@/components/settings';
import UpdateProfile from '@/components/updateProfileModal';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/providers/themeProvider';
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
      const {colorScheme} = useTheme();
      const [openUpdateModal,setOpenUpdateModal] = useState(false);
       const getSkillLevelIcon = (level?: string) => {
        switch(level) {
          case 'beginner': return 'star-outline';
          case 'intermediate': return 'star-half-outline';
          case 'expert': return 'star';
          default: return 'help-outline';
        }
      };

      const getSkillLevelColor = (level?: string) => {
        switch(level) {
          case 'beginner': return 'text-green-500';
          case 'intermediate': return 'text-yellow-500';
          case 'expert': return 'text-orange-500';
          default: return 'text-gray-500';
        }
      };
  return (
    <View className='flex-1 bg-background-light dark:bg-background-dark' >
      <View className='flex-row mt-4 gap-4 items-center mx-2' >
        <View>
          <Image
          source={user?.imageurl || "https://via.placeholder.com/120"}
          style={{width:100,height:100,borderRadius:50}}
          />
        </View>
        <View>
          <Text className='text-lg dark:text-white' >{user?.username}</Text>
          <Text className='text-sm text-gray-500 dark:text-gray-400' >{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={() => setOpenUpdateModal(true)}>
          <Ionicons name='pencil-outline' size={24} 
          color={colorScheme==='dark'?'white':'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpenModal(true)} 
        className='absolute top-2 right-2' >
          <Ionicons name='settings-outline' size={24} color={
            colorScheme === 'dark' ? 'white':'black'
          } />
        </TouchableOpacity>
      </View>
      
        {/* Cooking Skill Badge */}
          <View className='items-center mb-6'>
            <View className='bg-secondary-light dark:bg-secondary-dark rounded-full px-6 py-3 flex-row items-center gap-2 shadow-sm'>
              <Ionicons 
                name={getSkillLevelIcon(user?.cookingSkillLevel)} 
                size={20} 
                className={getSkillLevelColor(user?.cookingSkillLevel)}
              />
              <Text className={`font-semibold capitalize ${getSkillLevelColor(user?.cookingSkillLevel)}`}>
                {user?.cookingSkillLevel || 'Beginner'} Chef
              </Text>
            </View>
          </View>

                {/* Stats Grid */}
          <View className='mx-2' >
         

          {/* Daily Targets Card */}
          {user?.dailyTargets && (
            <View className='bg-secondary-light dark:bg-secondary-dark rounded-2xl p-4 mb-6 shadow-sm'>
              <View className='flex-row items-center mb-3'>
                <Ionicons name='nutrition-outline' size={20} color='#e1e65c' />
                <Text className='text-base font-semibold text-gray-900 dark:text-white ml-2'>
                  Daily Nutrition Targets
                </Text>
              </View>
              
              <View className='flex-row justify-around'>
                <View className='items-center'>
                  <Text className='text-xl font-bold text-orange-500'>
                    {user.dailyTargets.calories}
                  </Text>
                  <Text className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Calories
                  </Text>
                </View>

                <View className='items-center'>
                  <Text className='text-xl font-bold text-green-500'>
                    {user.dailyTargets.protein}g
                  </Text>
                  <Text className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Protein
                  </Text>
                </View>

                <View className='items-center'>
                  <Text className='text-xl font-bold text-yellow-500'>
                    {user.dailyTargets.carbs}g
                  </Text>
                  <Text className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Carbs
                  </Text>
                </View>

                <View className='items-center'>
                  <Text className='text-xl font-bold text-red-500'>
                    {user.dailyTargets.fat}g
                  </Text>
                  <Text className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Fat
                  </Text>
                </View>
              </View>
            </View>
          )}

      
     
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
      <UpdateProfile open={openUpdateModal} onOpen={setOpenUpdateModal} />
    </View>
  )
}

export default Profile