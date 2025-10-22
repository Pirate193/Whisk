import AddRecipeToMealPlan from "@/components/mealplan/addMeal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function MealPlanPage() {
  const { mealplanId } = useLocalSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completed, setcompleted] = useState(false);
  const date = Date.now();
  const completeMeals = useMutation(api.mealplan.markMealCompleted);
  const mealplan = useQuery(api.mealplan.getMealplanById, {
    mealPlanId: mealplanId as Id<"mealPlans">,
  });
  
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const handleCompleteMeal = async () => {
    try {
      setcompleted(true);
      await completeMeals({ mealPlanId: mealplanId as Id<"mealPlans"> });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* header */}
      <View>
        <Text className="text-lg font-bold dark:text-white">
          {mealplan?.name}
        </Text>
        {mealplan?.description && (
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {mealplan?.description}
          </Text>
        )}
        <View className="flex-row justify-between">
          <View>
            <Text className="dark:text-white">
              StartDate: {mealplan?.startDate}
            </Text>
            <Text className="dark:text-white">
              EndDate: {mealplan?.endDate}
            </Text>
          </View>

          <View>
            <Text className="dark:text-white">
              TotalRecipes: {mealplan?.totalRecipes}
            </Text>
            <Text className="dark:text-white">
              CompletedMeals: {mealplan?.completedMeals}
            </Text>
          </View>
        </View>
      </View>

      {/* mealPlan */}
     
      <FlatList
        data={mealplan?.mealswithRecipes}
        keyExtractor={(item) => `${item.recipeId}_${item.date}_${item.mealType}`}
        renderItem={({ item }) => (
          <View>
            <Text>{item.date} </Text>
            <View className="mx-2" >
            <View className="flex-row gap-2 ml-2 items-center">
              <Ionicons
                name={
                  item.mealType === "breakfast"
                    ? "cafe-outline"
                    : item.mealType === "lunch"
                      ? "restaurant-outline"
                      : item.mealType === "dinner"
                        ? "restaurant-outline"
                        : "cafe-outline"
                }
                size={20}
                className="dark:bg-white"
              />
              <Text className=" dark:text-white">{item.mealType}</Text>
            </View>
            <TouchableOpacity className="flex-row items-center gap-2 flex-1 bg-secondary-light dark:bg-secondary-dark p-2 rounded-2xl "
             onPress={()=>router.push({pathname:'/[recipeId]',params:{recipeId:item.recipeId}})}  >
              <Image
                source={item.recipe?.imageUrl}
                style={{ width: 50, height: 50, borderRadius: 12 }}
              />
              <View className="flex-1">
                <Text numberOfLines={2} className="text-black dark:text-white">
                  {item.recipe?.title}{" "}
                </Text>
                <View
                  className={`
                px-3 py-1 rounded-2xl
               ${
                 item.recipe?.difficulty === "easy"
                   ? "bg-green-500"
                   : item.recipe?.difficulty === "medium"
                     ? "bg-yellow-200"
                     : "bg-red-400"
               }
          `}
                >
                  <Text>{item.recipe?.difficulty}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleCompleteMeal}>
                <Ionicons
                  name={
                    completed
                      ? "checkmark-circle-outline"
                      : "close-circle-outline"
                  }
                  color={completed ? "green" : "red"}
                  size={20}
                />
              </TouchableOpacity>
            </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* add meal to meal plan */}
        {/* Add Recipe Button */}
      <TouchableOpacity 
        onPress={() => setShowAddRecipeModal(true)}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Recipe Modal */}
      {mealplan && (
        <AddRecipeToMealPlan 
          open={showAddRecipeModal}
          onOpen={setShowAddRecipeModal}
          mealPlanId={mealplanId as Id<'mealPlans'>}
          mealPlanStartDate={mealplan.startDate}
          mealPlanEndDate={mealplan.endDate}
        />
      )}
    </View>
  );
}
