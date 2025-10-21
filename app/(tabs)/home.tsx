import Ai from "@/components/Ai";
import RecipeCard from "@/components/RecipeCard";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";

import { useQuery } from "convex/react";
import { useCallback, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const recipes = useQuery(api.recipe.getRecipes,{limit:20});
  const user = useQuery(api.users.getCurrentUser);
  const ref = useRef<BottomSheetModal>(null);
    const handleSnapPress = useCallback((index: number) => {
      ref.current?.snapToIndex(index);
    }, []);
  return (
    <View className="flex-1   bg-white dark:bg-black  relative" >
      <View>
         <Text className="text-3xl dark:text-white" > Welcome </Text>
      </View>
      <FlashList
       data={recipes}
       keyExtractor={(item)=>item._id}
       renderItem={({item})=>(
        <RecipeCard id={item._id}  imageUrl={item.imageUrl} title={item.title} difficulty={item.difficulty} duration={item.totalTime} dietaryTags={item.dietaryTags} />

       )}
      
      />
      
   
       <View className='absolute bottom-24 right-4 z-50'>
               <TouchableOpacity 
                 onPress={() => ref.current?.present() } 
                 className=' rounded-full p-4 shadow-lg bg-black'
               >
                 <Ionicons name='sparkles' size={24} color="white" />
               </TouchableOpacity>
        </View>
     <Ai ref={ref} />
    </View>
  );
}
