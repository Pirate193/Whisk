import { useTheme } from '@/providers/themeProvider';
import React from 'react';
import { Pressable, Text, View } from "react-native";

const Profile = () => {
      const { colorScheme, toggleColorScheme } = useTheme();
  return (
    <View>
       <Pressable
      onPress={toggleColorScheme}
      className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg"
    >
      <Text className="text-gray-900 dark:text-white font-semibold">
        {colorScheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </Text>
    </Pressable>
    </View>
  )
}

export default Profile