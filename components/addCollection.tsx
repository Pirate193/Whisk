import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import SwipeableModal from './ui/SwipableModal';

interface Props{
    open:boolean;
    onOpen: (open: boolean) => void
}

const AddCollection = ({open, onOpen}:Props) => {
    const {userId}= useAuth();
    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [emoji,setEmoji] = useState('');
    const addCollection = useMutation(api.favourites.addCollections);
    const [loading,setLoading] = useState(false);

    
    const emojis = ['📁', '❤️', '⭐', '🍕', '🍔', '🍰', '🥗', '🍜', '🍳', '🥘', '🍱', '🌮', '🍣', '🍝', '🥙', '🍲'];// doing like this for now befor installing a library for emojis 
    const handleCreate= async()=>{
        setLoading(true);
        if(!name){
                alert('Please enter a name');
                setLoading(false);
                return;
            }
        try {
            
            await addCollection({
                userId:userId!,
                name:name,
                description:description,
                emoji:emoji,
                updatedAt:Date.now(),
                recipeId:[]
            })
            setLoading(false);
            onOpen(false);
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <SwipeableModal
    visible={open}
    onClose={()=>onOpen(false)}
    height='75%'
    showHandle={true}
    closeOnBackdropPress={true}
    >
         <KeyboardAvoidingView className="flex-1" >
          <View className="flex-row items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-800">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                New Collection
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Organize your favorite recipes
              </Text>
            </View>
           
          </View>
            
          <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
            {/* Emoji Selection */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Choose an Icon
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {emojis.map((emo) => (
                  <TouchableOpacity
                    key={emo}
                    onPress={() => setEmoji(emo)}
                    className={`w-14 h-14 rounded-2xl items-center justify-center  ${
                      emoji === emo
                        ? 'bg-primary-light dark:bg-primary-dark'
                        : 'bg-secondary-light dark:bg-secondary-dark'
                    }`}
                  >
                    <Text className="text-2xl">{emo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Name Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Collection Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="p-4 rounded-xl bg-secondary-light dark:bg-secondary-dark text-gray-900 dark:text-white "
                placeholder="e.g., Quick Weeknight Meals"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
                maxLength={50}
              />
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {name.length}/50 characters
              </Text>
            </View>

            {/* Description Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Description (Optional)
              </Text>
              <TextInput
                className="p-4 rounded-xl bg-secondary-light dark:bg-secondary-dark text-gray-900 dark:text-white "
                placeholder="Add notes about this collection..."
                placeholderTextColor="#9ca3af"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
              />
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/200 characters
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <TouchableOpacity
              onPress={handleCreate}
              disabled={loading}
              className={`h-14 rounded-xl items-center justify-center ${
                loading ? 'bg-gray-300 dark:bg-gray-700' : 'bg-primary-light dark:bg-primary-dark'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-black text-base font-bold">Create Collection</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    </SwipeableModal>
  )
}

export default AddCollection