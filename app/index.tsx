import { useTheme } from '@/providers/themeProvider';
import { useAuth } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Link, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { colorScheme } = useTheme();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for auth to load
        if (isLoaded) {
          // Simulate minimum splash time (optional)
          await new Promise(resolve => setTimeout(resolve, 1000));
          setAppReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [isLoaded]);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Show loading while auth is not ready
  if (!isLoaded || !appReady) {
    return (
      <View className='bg-white dark:bg-black flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#e1e65c" />
        <Text className='text-gray-400 dark:text-gray-400 mt-4'>
          Loading...
        </Text>
      </View>
    );
  }

  // Redirect if signed in
  if (isSignedIn) {
    return <Redirect href={'/(tabs)/home'} />;
  }

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center px-4">
      {/* Header Image */}
      <View className="items-center mb-8">
        <Image
          source={
            colorScheme === 'dark'
              ? require('../assets/images/ios-tinted.png')
              : require('../assets/images/ios-light.png')
          }
          style={{ width: 200, height: 200 }}
          className="rounded-3xl shadow-lg"
          contentFit="cover"
        />
      </View>

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
      <View className="gap-4 mt-8">
        {/* Sign Up Button */}
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity className="bg-primary-light p-4 rounded-2xl items-center shadow-lg active:opacity-90">
            <Text className="text-black font-semibold text-lg">Get Started</Text>
          </TouchableOpacity>
        </Link>

        {/* Sign In Button */}
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity className="bg-white dark:bg-gray-700 p-4 rounded-2xl items-center border-2 border-gray-200 dark:border-gray-600 shadow-sm active:opacity-90">
            <Text className="text-gray-900 dark:text-white font-semibold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <View className="items-center mt-8">
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default Index;