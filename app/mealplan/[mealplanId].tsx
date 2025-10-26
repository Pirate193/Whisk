import AddRecipeToMealPlan from "@/components/mealplan/addMeal";
import NotFound from "@/components/ui/notFound";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MealPlanPage() {
  const { mealplanId } = useLocalSearchParams();
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  
  const completeMeals = useMutation(api.mealplan.markMealCompleted);
  const mealplan = useQuery(api.mealplan.getMealplanById, {
    mealPlanId: mealplanId as Id<"mealPlans">,
  });

  // Group meals by date
  const groupedMeals = mealplan?.mealswithRecipes?.reduce((acc: any, meal: any) => {
    if (!acc[meal.date]) {
      acc[meal.date] = [];
    }
    acc[meal.date].push(meal);
    return acc;
  }, {}) || {};

  // Sort dates
  const sortedDates = Object.keys(groupedMeals).sort();

  const handleCompleteMeal = async () => {
    try {
      await completeMeals({ mealPlanId: mealplanId as Id<"mealPlans"> });
    } catch (err) {
      console.log(err);
    }
  };

  // Format date nicely
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Format as "Mon, Oct 21"
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Enhanced Header */}
      <View className="px-4 pt-4 pb-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#6b7280" />
          </TouchableOpacity>
          <View className="flex-1" >
             <Text numberOfLines={1} className="text-2xl font-bold dark:text-white mb-1">
          {mealplan?.name}
        </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

       
        
        {mealplan?.description && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {mealplan.description}
          </Text>
        )}

        {/* Stats Cards */}
        <View className="flex-row gap-3 mt-3">
          <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={16} color="#3b82f6" />
              <Text className="text-xs text-blue-600 dark:text-blue-400 ml-1 font-medium">
                Duration
              </Text>
            </View>
            <Text className="text-sm text-gray-900 dark:text-white font-semibold">
              {mealplan?.startDate} to
            </Text>
            <Text className="text-sm text-gray-900 dark:text-white font-semibold">
              {mealplan?.endDate}
            </Text>
          </View>

          <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="restaurant-outline" size={16} color="#22c55e" />
              <Text className="text-xs text-green-600 dark:text-green-400 ml-1 font-medium">
                Recipes
              </Text>
            </View>
            <Text className="text-2xl text-gray-900 dark:text-white font-bold">
              {mealplan?.totalRecipes || 0}
            </Text>
          </View>

          <View className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="checkmark-circle-outline" size={16} color="#a855f7" />
              <Text className="text-xs text-purple-600 dark:text-purple-400 ml-1 font-medium">
                Done
              </Text>
            </View>
            <Text className="text-2xl text-gray-900 dark:text-white font-bold">
              {mealplan?.completedMeals || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Meals List */}
      <ScrollView 
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {sortedDates.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <NotFound />
            <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Meals Yet
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center px-8">
              Start building your meal plan by adding recipes
            </Text>
          </View>
        ) : (
          sortedDates.map((date) => (
            <View key={date} className="mb-6">
              {/* Date Header */}
              <View className="flex-row items-center mb-3">
                <View className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                <Text className="px-4 text-base font-bold text-gray-900 dark:text-white">
                  {formatDate(date)}
                </Text>
                <View className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </View>

              {/* Meals for this date */}
              {groupedMeals[date].map((item: any, index: number) => (
                <View key={`${item.recipeId}_${index}`} className="mb-3">
                  {/* Meal Type Label */}
                  <View className="flex-row items-center mb-2 px-2">
                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                      item.mealType === 'breakfast' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      item.mealType === 'lunch' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      item.mealType === 'dinner' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-pink-100 dark:bg-pink-900/30'
                    }`}>
                      <Ionicons
                        name={
                          item.mealType === "breakfast"
                            ? "cafe-outline"
                            : item.mealType === "lunch"
                              ? "restaurant-outline"
                              : item.mealType === "dinner"
                                ? "restaurant-outline"
                                : "fast-food-outline"
                        }
                        size={16}
                        color={
                          item.mealType === 'breakfast' ? '#f97316' :
                          item.mealType === 'lunch' ? '#3b82f6' :
                          item.mealType === 'dinner' ? '#a855f7' :
                          '#ec4899'
                        }
                      />
                    </View>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                      {item.mealType}
                    </Text>
                  </View>

                  {/* Meal Card */}
                  <TouchableOpacity
                    className="bg-secondary-light dark:bg-secondary-dark rounded-2xl p-3 border border-gray-200 dark:border-black"
                    onPress={() => router.push({ pathname: '/[recipeId]', params: { recipeId: item.recipeId } })}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      {/* Recipe Image */}
                      <Image
                        source={item.recipe?.imageUrl}
                        style={{ width: 80, height: 80, borderRadius: 12 }}
                      />

                      {/* Recipe Info */}
                      <View className="flex-1 ml-3">
                        <Text 
                          numberOfLines={2} 
                          className="text-base font-semibold text-gray-900 dark:text-white mb-2"
                        >
                          {item.recipe?.title}
                        </Text>

                        <View className="flex-row items-center gap-2">
                          {/* Difficulty Badge */}
                          <View
                            className={`px-3 py-1 rounded-full ${
                              item.recipe?.difficulty === "easy"
                                ? "bg-green-500"
                                : item.recipe?.difficulty === "medium"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                            }`}
                          >
                            <Text className="text-xs font-semibold text-white">
                              {item.recipe?.difficulty}
                            </Text>
                          </View>

                          {/* Time */}
                          <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={14} color="#9ca3af" />
                            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              {item.recipe?.totalTime} min
                            </Text>
                          </View>

                          {/* Servings */}
                          <View className="flex-row items-center">
                            <Ionicons name="people-outline" size={14} color="#9ca3af" />
                            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              {item.servings} serving{item.servings > 1 ? 's' : ''}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Complete Button */}
                      <TouchableOpacity 
                        onPress={handleCompleteMeal}
                        className="ml-2"
                      >
                        <View className={`w-10 h-10 rounded-full items-center justify-center ${
                          item.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
                        }`}>
                          <Ionicons
                            name={item.completed ? "checkmark" : "close"}
                            color={item.completed ? "white" : "#9ca3af"}
                            size={20}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Notes */}
                    {item.notes && (
                      <View className="mt-3 pt-3 ">
                        <View className="flex-row items-start">
                          <Ionicons name="document-text-outline" size={14} color="#9ca3af" />
                          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2 flex-1">
                            {item.notes}
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setShowAddRecipeModal(true)}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-black items-center justify-center shadow-lg"
        style={{
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add Recipe Modal */}
      {mealplan && (
        <AddRecipeToMealPlan
          open={showAddRecipeModal}
          onOpen={setShowAddRecipeModal}
          mealPlanId={mealplanId as Id<"mealPlans">}
          mealPlanStartDate={mealplan.startDate}
          mealPlanEndDate={mealplan.endDate}
        />
      )}
    </View>
  );
}