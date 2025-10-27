import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import FilteredResults from './filteredResults';
import SwipeableModal from './ui/SwipableModal';

interface Props {
  open: boolean;
  onOpen: (open: boolean) => void;
}

const FilterSearch = ({ open, onOpen }: Props) => {
  // Filter states
  const [mealType, setMealType] = useState<string[]>([]);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [diets, setDiets] = useState<string[]>([]);
  const [includeIngredients, setIncludeIngredients] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string[]>([]);
  
  // UI states
  const [showResults, setShowResults] = useState(false);
  const [includeInput, setIncludeInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');

  // Options
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
  const dietOptions = [
    'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 
    'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 
    'Primal', 'Low FODMAP', 'Whole30'
  ];
  const cuisineOptions = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 
    'Thai', 'French', 'American', 'Mediterranean', 'Korean'
  ];
  const difficultyOptions = ['easy', 'medium', 'hard'];

  // Query filtered recipes
  const filteredRecipes = useQuery(
    api.filterrecipe.filterRecipes,
    showResults
      ? {
          mealTypes: mealType.length > 0 ? mealType : undefined,
          maxCookTime: maxCookTime || undefined,
          diets: diets.length > 0 ? diets : undefined,
          includeIngredients: includeIngredients.length > 0 ? includeIngredients : undefined,
          excludeIngredients: excludeIngredients.length > 0 ? excludeIngredients : undefined,
          cuisines: cuisine.length > 0 ? cuisine : undefined,
          difficulties: difficulty.length > 0 ? difficulty : undefined,
        }
      : 'skip'
  );

  // Toggle functions for multi-select
  const toggleMealType = (type: string) => {
    setMealType(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleDiet = (diet: string) => {
    setDiets(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const toggleCuisine = (cuisineType: string) => {
    setCuisine(prev => 
      prev.includes(cuisineType) ? prev.filter(c => c !== cuisineType) : [...prev, cuisineType]
    );
  };

  const toggleDifficulty = (level: string) => {
    setDifficulty(prev => 
      prev.includes(level) ? prev.filter(d => d !== level) : [...prev, level]
    );
  };

  // Add ingredient
  const addIncludeIngredient = () => {
    if (includeInput.trim()) {
      setIncludeIngredients(prev => [...prev, includeInput.trim()]);
      setIncludeInput('');
    }
  };

  const removeIncludeIngredient = (ingredient: string) => {
    setIncludeIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const addExcludeIngredient = () => {
    if (excludeInput.trim()) {
      setExcludeIngredients(prev => [...prev, excludeInput.trim()]);
      setExcludeInput('');
    }
  };

  const removeExcludeIngredient = (ingredient: string) => {
    setExcludeIngredients(prev => prev.filter(i => i !== ingredient));
  };

  // Reset filters
  const resetFilters = () => {
    setMealType([]);
    setMaxCookTime(null);
    setDiets([]);
    setIncludeIngredients([]);
    setExcludeIngredients([]);
    setCuisine([]);
    setDifficulty([]);
    setShowResults(false);
  };

  // Apply filters
  const applyFilters = () => {
    setShowResults(true);
  };

  // Close
  const handleClose = () => {
    setShowResults(false);
    onOpen(false);
  };

  return (
    <>
   <SwipeableModal
   visible={open}
   onClose={()=>onOpen(false)}
   height='90%'
   showHandle={true}
   closeOnBackdropPress={true}
   >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-2">
              <View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  Filter Recipes
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Customize your search
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

          <KeyboardAwareScrollView className="flex-1 px-6 py-4" 
          bottomOffset={20} showsVerticalScrollIndicator={false} >
       
              {/* Meal Type */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Meal Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {mealTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => toggleMealType(type)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        mealType.includes(type)
                          ? 'bg-primary-light dark:bg-primary-dark'
                          : 'bg-secondary-light dark:bg-secondary-dark border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium capitalize ${
                          mealType.includes(type)
                            ? 'text-black'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cook Time */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Maximum Cook Time
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[15, 30, 45, 60, 90].map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => setMaxCookTime(maxCookTime === time ? null : time)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        maxCookTime === time
                          ? 'bg-primary-light dark:bg-primary-dark'
                          : 'bg-secondary-light dark:bg-secondary-dark border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          maxCookTime === time
                            ? 'text-black'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {time} min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Difficulty */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Difficulty Level
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {difficultyOptions.map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => toggleDifficulty(level)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        difficulty.includes(level)
                          ? level === 'easy'
                            ? 'bg-green-500 border-green-500'
                            : level === 'medium'
                            ? 'bg-yellow-500 border-yellow-500'
                            : 'bg-red-500 border-red-500'
                          : 'bg-secondary-light dark:bg-secondary-dark border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium capitalize ${
                          difficulty.includes(level)
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Diets (Multi-select) */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Dietary Preferences
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {dietOptions.map((diet) => (
                    <TouchableOpacity
                      key={diet}
                      onPress={() => toggleDiet(diet)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        diets.includes(diet)
                          ? 'bg-green-500 border-green-500'
                          : 'bg-secondary-light dark:bg-secondary-dark border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          diets.includes(diet)
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {diet}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cuisine */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Cuisine Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {cuisineOptions.map((cuisineType) => (
                    <TouchableOpacity
                      key={cuisineType}
                      onPress={() => toggleCuisine(cuisineType)}
                      className={`px-4 py-2 rounded-full border-2 ${
                        cuisine.includes(cuisineType)
                          ? 'bg-purple-500 border-purple-500'
                          : 'bg-secondary-light dark:bg-secondary-dark border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          cuisine.includes(cuisineType)
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {cuisineType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Include Ingredients */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Must Include Ingredients
                </Text>
                <View className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 p-3 rounded-xl bg-secondary-light dark:bg-secondary-dark text-gray-900 dark:text-white mr-2"
                    placeholder="e.g., chicken, tomatoes"
                    placeholderTextColor="#9ca3af"
                    value={includeInput}
                    onChangeText={setIncludeInput}
                    onSubmitEditing={addIncludeIngredient}
                  />
                  <TouchableOpacity
                    onPress={addIncludeIngredient}
                    className="w-12 h-12 rounded-xl bg-blue-500 items-center justify-center"
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {includeIngredients.map((ingredient) => (
                    <View
                      key={ingredient}
                      className="flex-row items-center bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full"
                    >
                      <Text className="text-sm text-green-900 dark:text-green-100 mr-2">
                        {ingredient}
                      </Text>
                      <TouchableOpacity onPress={() => removeIncludeIngredient(ingredient)}>
                        <Ionicons name="close-circle" size={18} color="#22c55e" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* Exclude Ingredients */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Exclude Ingredients
                </Text>
                <View className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 p-3 rounded-xl bg-secondary-light dark:bg-secondary-dark text-gray-900 dark:text-white mr-2"
                    placeholder="e.g., nuts, dairy"
                    placeholderTextColor="#9ca3af"
                    value={excludeInput}
                    onChangeText={setExcludeInput}
                    onSubmitEditing={addExcludeIngredient}
                  />
                  <TouchableOpacity
                    onPress={addExcludeIngredient}
                    className="w-12 h-12 rounded-xl bg-red-500 items-center justify-center"
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {excludeIngredients.map((ingredient) => (
                    <View
                      key={ingredient}
                      className="flex-row items-center bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-full"
                    >
                      <Text className="text-sm text-red-900 dark:text-red-100 mr-2">
                        {ingredient}
                      </Text>
                      <TouchableOpacity onPress={() => removeExcludeIngredient(ingredient)}>
                        <Ionicons name="close-circle" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
              </KeyboardAwareScrollView>
        

            {/* Footer Buttons */}
            <View className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex-row gap-3">
              <TouchableOpacity
                onPress={resetFilters}
                className="flex-1 h-14 rounded-xl bg-gray-200 dark:bg-gray-800 items-center justify-center"
              >
                <Text className="text-gray-900 dark:text-white font-semibold">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                className="flex-1 h-14 rounded-xl bg-primary-light items-center justify-center"
              >
                <Text className="text-black font-bold">Show Recipes</Text>
              </TouchableOpacity>
            </View>
           
      </SwipeableModal>
     
      <FilteredResults filteredRecipes={filteredRecipes!} showResults={showResults}
            setShowResults={setShowResults} />
     
    </>
  );
};

export default FilterSearch;