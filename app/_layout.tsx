import { ThemeProvider } from "@/providers/themeProvider";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import '../global.css';
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
  <ClerkProvider tokenCache={tokenCache} >
    <ConvexProviderWithClerk client={convex}  useAuth={useAuth}>
     <BottomSheetModalProvider>
      <ThemeProvider>
      <SafeAreaProvider>
           <SafeAreaView className="flex-1" >
          <StatusBar style="dark" />
          <Stack screenOptions={{headerShown:false}} />
      </SafeAreaView>
      </SafeAreaProvider>
      </ThemeProvider>
      </BottomSheetModalProvider>
    </ConvexProviderWithClerk>
    </ClerkProvider>
   </GestureHandlerRootView>
);
}
