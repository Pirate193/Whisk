import { useTheme } from '@/providers/themeProvider';
import { useAuth } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Link, Redirect } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration:4000,
  fade:true,
})
const Index = () => {
   const { isSignedIn,isLoaded } = useAuth();
   const {colorScheme}=useTheme();
 

   useEffect(() => {
     if (isLoaded){
      SplashScreen.hideAsync();
     }
   }, [isLoaded])
   
  if (isSignedIn) {
    return <Redirect href={'/(tabs)/home'} />
  }

  return (
   <View className="flex-1 bg-white dark:bg-black">
      {/* Header Image */}
      
        {colorScheme === 'dark' ?(
           <View className="items-center mb-8">
          <Image
          source={require('../assets/images/ios-tinted.png')}
          style={{ width: 200, height: 200 }}
          className="rounded-3xl shadow-lg"
          contentFit="cover"
        />
            </View>
        ):(
          <View className="items-center mb-8">
          <Image
          source={require('../assets/images/ios-light.png')}
          style={{ width: 200, height: 200 }}
          className="rounded-3xl shadow-lg"
          contentFit="cover"
        />
            </View>
        )}
        
  

      {/* Welcome Text */}
      <View className="items-center mb-8 px-4">
        <Text className="text-3xl font-bold text-center text-black dark:text-white mb-2">
          Welcome to Whisk
        </Text>
        <Text className="text-lg text-center text-black dark:text-gray-300">
          Discover delicious recipes, plan your meals, and track your nutrition with ease.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-1 justify-end gap-4 mx-4">
        {/* Sign Up Button */}
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity className="bg-primary-light p-4 rounded-2xl items-center shadow-lg active:opacity-90">
            <View className="flex-row items-center">
              
              <Text className="text-black font-semibold text-lg">Get Started</Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Sign In Button */}
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity className="bg-white dark:bg-gray-700 p-4 rounded-2xl items-center border-2 border-gray-200 dark:border-gray-600 shadow-sm active:opacity-90">
            <View className="flex-row items-center">
              
              <Text className="text-gray-900 dark:text-white font-semibold text-lg">Sign In</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <View className="items-center mt-4 mx-2 mb-2">
        <Text className="text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  )
}

export default Index