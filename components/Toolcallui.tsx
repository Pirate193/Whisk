// Tool Call UI Components for Message.tsx
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Search Recipe Tool Call UI
interface SearchRecipeToolProps {
  args: {
    query: string;
  };
  results?: {
    id: string;
    title: string;
    description?: string;
    calories?: number;
    protein?: number;
    difficulty: string;
    totalTime: number;
  }[];
}

export const SearchRecipeToolUI = ({ args, results }: SearchRecipeToolProps) => {
  return (
    <View className="bg-secondary-light dark:bg-secondary-dark rounded-2xl p-2">
      <View className="flex-row items-center">
          <Ionicons name="search" size={16} color="white" />
        <Text className="text-sm font-semibold text-black dark:text-white ml-2">
          Searching Recipes
        </Text>
        <Text className="text-base text-black dark:text-blue-200 ml-2 ">
          for {args.query}
      </Text>
      </View>
      
      

      {/* {results && results.length > 0 && (
        <View>
          <Text className="text-xs text-blue-700 dark:text-blue-300 mb-2">
            Found {results.length} recipe{results.length > 1 ? 's' : ''}
          </Text>
          <View className="gap-2">
            {results.slice(0, 3).map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => router.push({ pathname: '/[recipeId]', params: { recipeId: recipe.id } })}
                className="bg-white dark:bg-gray-800 rounded-xl p-3"
              >
                <Text className="text-sm font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
                  {recipe.title}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className={`px-2 py-0.5 rounded-full ${
                    recipe.difficulty === 'easy' ? 'bg-green-500' :
                    recipe.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}>
                    <Text className="text-xs text-white font-medium">{recipe.difficulty}</Text>
                  </View>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {recipe.totalTime} min
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )} */}
    </View>
  );
};

// Meal Plan Tool Call UI
interface MealPlanToolProps {
  args: {
    userId: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    meals: {
      date: string;
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      recipeId: string;
      servings: number;
      notes?: string;
    }[];
  };
  result?: {
    success: boolean;
    mealPlanId: string;
    message: string;
  };
}

export const MealPlanToolUI = ({ args, result }: MealPlanToolProps) => {
  // Group meals by date
  const mealsByDate = args.meals.reduce((acc: any, meal) => {
    if (!acc[meal.date]) acc[meal.date] = [];
    acc[meal.date].push(meal);
    return acc;
  }, {});

  const dates = Object.keys(mealsByDate).sort();
  const totalMeals = args.meals.length;

  return (
    <View className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 mb-2 border border-purple-200 dark:border-purple-800">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 rounded-full bg-purple-500 items-center justify-center mr-2">
            <Ionicons name="calendar" size={16} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              Meal Plan Created
            </Text>
            <Text className="text-xs text-purple-700 dark:text-purple-300">
              {totalMeals} meals planned
            </Text>
          </View>
        </View>
        {result?.success && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/mealplan/[mealplanId]', params: { mealplanId: result.mealPlanId } })}
            className="bg-purple-500 px-3 py-1.5 rounded-full"
          >
            <Text className="text-xs text-white font-semibold">View Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-base font-bold text-purple-900 dark:text-purple-100 mb-1">
        {args.name}
      </Text>
      
      {args.description && (
        <Text className="text-xs text-purple-700 dark:text-purple-300 mb-3">
          {args.description}
        </Text>
      )}

      <View className="flex-row items-center gap-3 mb-3 flex-wrap">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={12} color="#a855f7" />
          <Text className="text-xs text-purple-700 dark:text-purple-300 ml-1">
            {args.startDate} to {args.endDate}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={12} color="#a855f7" />
          <Text className="text-xs text-purple-700 dark:text-purple-300 ml-1">
            {dates.length} days
          </Text>
        </View>
      </View>

      {/* Meal Summary */}
      <View className="bg-white dark:bg-gray-800 rounded-xl p-3">
        <Text className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
          Daily Breakdown:
        </Text>
        {dates.slice(0, 2).map((date) => (
          <View key={date} className="mb-2">
            <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <View className="flex-row flex-wrap gap-1">
              {mealsByDate[date].map((meal: any, index: number) => (
                <View
                  key={index}
                  className={`px-2 py-0.5 rounded-full ${
                    meal.mealType === 'breakfast' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    meal.mealType === 'lunch' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    meal.mealType === 'dinner' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    'bg-pink-100 dark:bg-pink-900/30'
                  }`}
                >
                  <Text className="text-xs capitalize text-gray-700 dark:text-gray-300">
                    {meal.mealType}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        {dates.length > 2 && (
          <Text className="text-xs text-gray-500 dark:text-gray-400 italic">
            + {dates.length - 2} more day{dates.length - 2 > 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

// Recipe with Image Tool Call UI
interface RecipeToolProps {
  recipeId: string;
}

export const RecipeToolUI = ({ recipeId }: RecipeToolProps) => {
  const recipe = useQuery(api.recipe.getRecipe, { recipeId: recipeId as Id<'recipes'> });

  if (!recipe) {
    return (
      <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-2">
        <Text className="text-sm text-gray-500 dark:text-gray-400">Loading recipe...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/[recipeId]', params: { recipeId } })}
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden mb-2 border border-gray-200 dark:border-gray-800"
      activeOpacity={0.8}
    >
      <View className="flex-row">
        <Image
          source={recipe.imageUrl}
          style={{ width: 100, height: 100 }}
        />
        <View className="flex-1 p-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1" numberOfLines={2}>
            {recipe.title}
          </Text>
          <View className="flex-row items-center gap-2 flex-wrap">
            <View className={`px-2 py-0.5 rounded-full ${
              recipe.difficulty === 'easy' ? 'bg-green-500' :
              recipe.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
            }`}>
              <Text className="text-xs text-white font-medium">{recipe.difficulty}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {recipe.totalTime} min
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="flame-outline" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {recipe.nutrition.calories} cal
              </Text>
            </View>
          </View>
        </View>
        <View className="justify-center pr-3">
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Loading Tool Call UI
export const LoadingToolUI = ({ toolName }: { toolName: string }) => {
  const getToolIcon = () => {
    if (toolName.includes('search')) return 'search';
    if (toolName.includes('meal') || toolName.includes('plan')) return 'calendar';
    if (toolName.includes('recipe')) return 'restaurant';
    return 'cog';
  };

  const getToolLabel = () => {
    if (toolName.includes('search')) return 'Searching recipes';
    if (toolName.includes('meal') || toolName.includes('plan')) return 'Creating meal plan';
    if (toolName.includes('recipe')) return 'Finding recipe';
    return 'Processing';
  };

  return (
    <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-2">
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3">
          <Ionicons name={getToolIcon() as any} size={16} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900 dark:text-white">
            {getToolLabel()}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-1 animate-pulse" />
            <View className="w-2 h-2 rounded-full bg-blue-400 mr-1 animate-pulse" style={{ animationDelay: '150ms' }} />
            <View className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: '300ms' }} />
          </View>
        </View>
      </View>
    </View>
  );
};