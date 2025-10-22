import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (recipeId: Id<"recipes">) => void;
  mealType: MealType;
}

const ChooseRecipe = ({ open, onClose, onSelect, mealType }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const recipes = useQuery(api.filterrecipe.getRecipeByMealType, {
    mealType,
    limit: 200,
  });
  const filteredRecipes =
    recipes?.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <Modal
      visible={open}
      onRequestClose={onClose}
      animationType="slide"
      transparent
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          style={{ height: "85%" }}
          className="rounded-t-3xl bg-white dark:bg-black"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Select Recipe
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {mealType} recipes • {recipes?.length || 0} available
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-secondary-dark"
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-6 py-4">
            <View className="flex-row items-center px-4  rounded-full bg-gray-50 dark:bg-secondary-dark border border-gray-200 dark:border-black">
              <Ionicons name="search-outline" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-900 dark:text-white"
                placeholder="Search recipes..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Recipe List */}
          <View className="flex-1 px-2">
            {recipes === undefined ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-500 dark:text-gray-400 mt-4">
                  Loading {mealType} recipes...
                </Text>
              </View>
            ) : filteredRecipes.length === 0 ? (
              <View className="flex-1 items-center justify-center px-8">
                <View className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
                  <Ionicons
                    name="restaurant-outline"
                    size={48}
                    color="#9ca3af"
                  />
                </View>
                <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  No recipes found
                </Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
                  {searchQuery
                    ? "Try adjusting your search"
                    : `No ${mealType} recipes available`}
                </Text>
              </View>
            ) : (
              <FlashList
                data={filteredRecipes}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => onSelect(item._id)}
                    activeOpacity={0.7}
                  >
                    <View className="bg-secondary-light  mb-2 mx-2 flex-1 rounded-xl  dark:bg-secondary-dark">
                      <View className="relative ">
                        <Image
                          source={item.imageUrl}
                          style={{
                            width: "100%",
                            height: 160,
                            borderRadius: 12,
                          }}
                          className="rounded-2xl"
                          contentFit="cover"
                        />
                        <View className="flex flex-row justify-between absolute bottom-2 ml-2">
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
                          <View className="bg-text-dark px-2  ml-2 justify-center rounded-full ">
                            <Text className="text-base">
                              {item.totalTime} min{" "}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="mt-2 px-2">
                        <Text
                          className="text-base text-text-light dark:text-text-dark"
                          numberOfLines={2}
                        >
                          {item.title}{" "}
                        </Text>
                      </View>
                      {item.dietaryTags && item.dietaryTags.length > 0 && (
                        <View className="flex flex-row flex-wrap p-2 ">
                          {item.dietaryTags.slice(0, 3).map((tags) => (
                            <View
                              key={tags}
                              className="gap-2 rounded-full bg-primary-light px-2 mt-2 dark:bg-primary-dark "
                            >
                              <Text className="text-text-light ">{tags}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                numColumns={2}
                masonry
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseRecipe;
