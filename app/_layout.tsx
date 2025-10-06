import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import '../global.css';
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
export default function RootLayout() {
  return (
  <ClerkProvider tokenCache={tokenCache} >
    <ConvexProviderWithClerk client={convex}  useAuth={useAuth}>
      <SafeAreaProvider>
           <SafeAreaView className="flex-1" >
          <StatusBar style="dark" />
          <Stack screenOptions={{headerShown:false}} />
      </SafeAreaView>
      </SafeAreaProvider>
    </ConvexProviderWithClerk>
 
    </ClerkProvider>
  
);
}
