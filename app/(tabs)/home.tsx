import AiModal from "@/components/Aimodal";
import RecipeCard from "@/components/RecipeCard";
import { api } from "@/convex/_generated/api";

import { useQuery } from "convex/react";
import { FlatList, Text, View } from "react-native";

export default function Home() {
  const recipes = useQuery(api.recipe.getRecipes,{limit:50});
  const user = useQuery(api.users.getCurrentUser);
  return (
    <View className="flex-1   bg-white dark:bg-black  relative" >
      <View>
         <Text className="text-3xl dark:text-white" > Welcome </Text>
      </View>
      <FlatList
       data={recipes}
       keyExtractor={(item)=>item._id}
       renderItem={({item})=>(
        <RecipeCard id={item._id}  imageUrl={item.imageUrl} title={item.title} difficulty={item.difficulty} duration={item.totalTime} dietaryTags={item.dietaryTags} />
       )}
      
      />
      <View className=" absolute bottom-6 right-6" >
       <AiModal />
      </View>
    </View>
  );
}
