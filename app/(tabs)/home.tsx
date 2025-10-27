import AiModal from "@/components/Aimodal";
import NutritionRings from "@/components/NutritionRings";
import Loading from "@/components/ui/loading";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const recipes = useQuery(api.recipe.getRecipes, { limit: 20 });
  const { userId } = useAuth();
  const user = useQuery(api.users.getUser, { userId: userId as string });
  
  const date = new Date().toISOString().split("T")[0];
  const todaysMeals = useQuery(
    api.mealplan.getMealplanByDate,
    userId ? { userId, date } : "skip"
  );
  const todaysNutrition = useQuery(
    api.meallogs.getDailyNutritionSummary,
    userId ? { userId, date } : "skip"
  );

  const formatDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };
  if( !todaysMeals || !todaysNutrition){
    return(
        <View className="flex-1 justify-center items-center bg-white dark:bg-black" >
          <Loading />
        </View>
    )
  }

  return (
    <View className="flex-1 bg-white dark:bg-black relative">
    <ScrollView
      className="flex-1  "
      showsVerticalScrollIndicator={false}
    >
      {/* header  */}
      <View>
        <Text className="text-3xl dark:text-white"> Welcome 
        <Text className="dark:text-white text-xl"> {user?.username} </Text>
        </Text>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white" >Today {formatDate()} </Text>
      </View>
      {/* today stats  */}
      <View className="flex-row justify-between  mb-6 px-2 ">
        <View className="flex-1 justify-center">
          <Text className="text-gray-700 dark:text-gray-300">
           
            Calories Taken:{todaysNutrition?.calories}
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            
            Carbs Taken:{todaysNutrition?.carbs}
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            
            Fat Taken:{todaysNutrition?.fat}
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            
            Protein Taken:{todaysNutrition?.protein}
          </Text>
        </View>
        <View className="flex-1">
          <NutritionRings nutrition={todaysNutrition} />
        </View>
      </View>

      {/* we are showing recipes from meal plan here  */}
      <Text className="text-xl ml-2 font-bold text-gray-900 dark:text-white">
        Todays Meal
      </Text>
        {todaysMeals.length === 0 && (
            <View className='flex items-center'>
                <LottieView
                source={require('../../assets/animations/empty.json')}
                autoPlay={true}
                loop={true}
                style={{height:100,width:100}}
                />
                <Text className='dark:text-secondary-light text-center text-sm '>Looks like you havent
                    add meals today begin by adding meals to mealplan</Text>
            </View>
        )}

      {todaysMeals && todaysMeals.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="flex-row mx-2 mt-2  "
        >
          {todaysMeals.map((meal) => (
            <View key={meal.mealType} className="px-2 w-40 ">
              <View className="flex-row">
                <Ionicons
                  name={
                    meal.mealType === "breakfast"
                      ? "cafe-outline"
                      : meal.mealType === "lunch"
                        ? "restaurant-outline"
                        : meal.mealType === "dinner"
                          ? "restaurant-outline"
                          : "cafe-outline"
                  }
                  size={20}
                  color='#e1e65c'
                />
                <Text className="dark:text-white">{meal.mealType}</Text>
              </View>
              <TouchableOpacity
                className=""
                onPress={() =>
                  router.push({
                    pathname: "/[recipeId]",
                    params: { recipeId: meal.recipeId },
                  })
                }
              >
                <Image
                  source={meal.recipe?.imageUrl}
                  style={{ width: "100%", height: 100, borderRadius: 25 }}
                />
                <View className="">
                  <Text
                    numberOfLines={2}
                    className="dark:text-white
                    "
                  >
                    {meal.recipe?.title}
                  </Text>
                  <View
                    className={`
                                px-3 py-1 rounded-2xl
                                ${
                                  meal.recipe?.difficulty === "easy"
                                    ? "bg-green-500"
                                    : meal.recipe?.difficulty === "medium"
                                      ? "bg-yellow-200"
                                      : "bg-red-400"
                                }
                              `}
                  >
                    <Text>{meal.recipe?.difficulty}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      {/* recomendations */}
      <View className="mt-2 ml-2">
        <Text className="dark:text-white font-bold">Reccomendations:</Text>
         {recipes === undefined && (
          <View className="flex-1 items-center justify-center" >
            <ActivityIndicator size='large' color='yellow' />
          </View>
        )}
        <FlashList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="px-2 w-40">
              <TouchableOpacity
                className=""
                onPress={() =>
                  router.push({
                    pathname: "/[recipeId]",
                    params: { recipeId: item._id },
                  })
                }
              >
                <Image
                  source={item.imageUrl}
                  style={{ width: "100%", height: 100, borderRadius: 25 }}
                />
                <View className="">
                  <Text
                    numberOfLines={2}
                    className="dark:text-white
                    "
                  >
                    {item.title}
                  </Text>
                  <View
                    className={`
                                px-3 py-1 rounded-2xl
                                ${
                                  item.difficulty === "easy"
                                    ? "bg-green-500"
                                    : item.difficulty === "medium"
                                      ? "bg-yellow-200"
                                      : "bg-red-400"
                                }
                              `}
                  >
                    <Text>{item.difficulty}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* bottom spacing */}
      <View className="h-24" />
     
    </ScrollView>
     <AiModal />
    </View>
  );
}

{
  /* <View className='absolute bottom-24 right-4 z-50'>
               <TouchableOpacity 
                 onPress={() => ref.current?.present() } 
                 className=' rounded-full p-4 shadow-lg bg-black'
               >
                 <Ionicons name='sparkles' size={24} color="white" />
               </TouchableOpacity>
        </View>
     <Ai ref={ref} /> */
}
