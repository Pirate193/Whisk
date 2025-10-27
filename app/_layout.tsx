import { ThemeProvider } from "@/providers/themeProvider";
import { ToastProvider } from "@/providers/toastProvider";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from "react-error-boundary";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import '../global.css';
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
function FallbackComponent({ error }: { error: Error }) {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black p-4">
      <Text className="text-xl font-bold text-red-500 mb-4">
        Oops! Something went wrong
      </Text>
      <Text className="text-gray-700 dark:text-gray-300 text-center mb-2">
        {error.message}
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {error.stack?.slice(0, 200)}...
      </Text>
    </View>
  );
}
export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}  >
    <GestureHandlerRootView style={{ flex: 1 }} >
  <ClerkProvider tokenCache={tokenCache}
  publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
   >
    <ConvexProviderWithClerk client={convex}  useAuth={useAuth}>
     <KeyboardProvider>
      <ThemeProvider>
        <ToastProvider>
      <SafeAreaProvider>
           <SafeAreaView className="flex-1" >
          <StatusBar style='light' />
          <Stack screenOptions={{headerShown:false}} >
            <Stack.Screen name='index'/>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
      </SafeAreaView>
      </SafeAreaProvider>
      </ToastProvider>
      </ThemeProvider>
     </KeyboardProvider>
    </ConvexProviderWithClerk>
    </ClerkProvider>
   </GestureHandlerRootView>
   </ErrorBoundary>
);
}
