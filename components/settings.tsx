import SwipeableModal from '@/components/ui/SwipableModal';
import { useTheme } from '@/providers/themeProvider';
import { useClerk } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from "react-native";

interface Props {
  open: boolean;
  onOpen: (open: boolean) => void;
}

export default function Settings({ open, onOpen }: Props) {
  const { colorScheme, toggleColorScheme } = useTheme();
   const { signOut } = useClerk()

   const handlesignout  = async()=>{
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.log(error);
    }
   }

  return (
    <SwipeableModal
      visible={open}
      onClose={() => onOpen(false)} 
      height="90%" 
      showHandle={true}
      closeOnBackdropPress={true}
    
    >
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-4 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </Text>
        </View>

        {/* Theme Setting */}
        <View className="py-6 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Appearance
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Theme
            </Text>
            <Pressable
              onPress={toggleColorScheme}
              className="bg-secondary-light dark:bg-secondary-dark px-4 py-2 rounded-lg flex-row items-center"
            >
              {colorScheme === 'dark' ? (
                <>
                  <Ionicons name="moon" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Dark</Text>
                </>
              ) : (
                <>
                  <Ionicons name="sunny" size={20} color="black" />
                  <Text className="text-gray-900 ml-2 font-medium">Light</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
        {/* sign out button */}
        <View className="py-6 border-b border-gray-200 dark:border-gray-800 flex-row items-center justify-between" >
        <Text className='dark:text-white' >Sign Out </Text> 
        <Pressable onPress={handlesignout} >
          <Ionicons name="log-out-outline" size={20} color={
            colorScheme === 'dark' ? 'white' : 'black'
          } />
        </Pressable>
        </View>

        {/* Additional Settings Examples */}
        <View className="py-6 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Preferences
          </Text>
          <Pressable className="flex-row items-center justify-between py-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Notifications
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
          <Pressable className="flex-row items-center justify-between py-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Language
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>

        <View className="py-6">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            About
          </Text>
          <Pressable className="flex-row items-center justify-between py-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Privacy Policy
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
          <Pressable className="flex-row items-center justify-between py-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Terms of Service
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
          <View className="py-3">
            <Text className="text-xs text-gray-400 dark:text-gray-500">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SwipeableModal>
  );
}