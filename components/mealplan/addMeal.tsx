import RecipeCard from '@/components/RecipeCard';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import ChooseRecipe from './ChooseRecipe';

interface Props {
  open: boolean;
  onOpen: (open: boolean) => void;
  mealPlanId: Id<'mealPlans'>;
  mealPlanStartDate: string; // YYYY-MM-DD
  mealPlanEndDate: string;   // YYYY-MM-DD
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const AddRecipeToMealPlan = ({ 
  open, 
  onOpen, 
  mealPlanId, 
  mealPlanStartDate, 
  mealPlanEndDate 
}: Props) => {
  const addMealToPlan = useMutation(api.mealplan.addMealToPlan);
  
  // Form state
  const [selectedRecipe, setSelectedRecipe] = useState<Id<'recipes'> | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date(mealPlanStartDate));
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [servings, setServings] = useState(1);
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipe?: string; date?: string }>({});

  // Meal types configuration
  const mealTypes: { type: MealType; icon: string; label: string }[] = [
    { type: 'breakfast', icon: 'cafe-outline', label: 'Breakfast' },
    { type: 'lunch', icon: 'restaurant-outline', label: 'Lunch' },
    { type: 'dinner', icon: 'restaurant-outline', label: 'Dinner' },
    { type: 'snack', icon: 'fast-food-outline', label: 'Snack' },
  ];

  // Get selected recipe details (only fetch when we have a selection)
  const selectedRecipeDetails = useQuery(
    api.recipe.getRecipe, 
    selectedRecipe ? { recipeId: selectedRecipe } : 'skip'
  );

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date for backend (YYYY-MM-DD)
  const formatDateForBackend = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Validation
  const validate = () => {
    const newErrors: { recipe?: string; date?: string } = {};
    
    if (!selectedRecipe) {
      newErrors.recipe = 'Please select a recipe';
    }
    
    const startDate = parseDate(mealPlanStartDate);
    const endDate = parseDate(mealPlanEndDate);
    
    if (selectedDate < startDate || selectedDate > endDate) {
      newErrors.date = 'Date must be within meal plan range';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle date change
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      if (errors.date) setErrors({ ...errors, date: undefined });
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await addMealToPlan({
        mealPlanId,
        meal: {
          date: formatDateForBackend(selectedDate),
          mealType: selectedMealType,
          recipeId: selectedRecipe!,
          servings,
          notes: notes.trim() || undefined,
        }
      });
      
      Alert.alert('Success', 'Recipe added to meal plan!');
      handleClose();
    } catch (error) {
      console.error('Error adding recipe:', error);
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setSelectedRecipe(null);
    setSelectedDate(new Date(mealPlanStartDate));
    setSelectedMealType('breakfast');
    setServings(1);
    setNotes('');
    setErrors({});
    setShowRecipeModal(false);
    onOpen(false);
  };

  // Handle recipe selection 
  const handleRecipeSelect = (recipeId: Id<'recipes'>) => {
    setSelectedRecipe(recipeId);
    setShowRecipeModal(false);
    if (errors.recipe) setErrors({ ...errors, recipe: undefined });
  };

  return (
    <>
      <Modal
        animationType="slide"
        visible={open}
        onRequestClose={handleClose}
        transparent
      >
        <View className="flex-1 justify-end bg-black/50">
          <View 
            style={{ height: '75%' }} 
            className="rounded-t-3xl bg-white dark:bg-black"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 ">
              <View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add to Meal Plan
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Configure your meal details
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleClose}
                className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              className="flex-1 px-6 py-4"
              showsVerticalScrollIndicator={false}
            >
              {/* Date Selection */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Date <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-dark"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-3">
                      <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        Selected Date
                      </Text>
                      <Text className="text-base font-semibold text-gray-900 dark:text-white">
                        {formatDate(selectedDate)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
                {errors.date && (
                  <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
                )}
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  minimumDate={parseDate(mealPlanStartDate)}
                  maximumDate={parseDate(mealPlanEndDate)}
                />
              )}

              {/* Meal Type Selection */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Meal Type <Text className="text-red-500">*</Text>
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {mealTypes.map((meal) => (
                    <TouchableOpacity
                      key={meal.type}
                      onPress={() => setSelectedMealType(meal.type)}
                      className={`flex-1 min-w-[45%] p-4 rounded-xl border-2 ${
                        selectedMealType === meal.type
                          ? 'border-white bg-blue-50 dark:bg-secondary-light dark:border-black'
                          : 'border-gray-200 dark:border-black bg-gray-50 dark:bg-secondary-dark'
                      }`}
                    >
                      <View className="items-center">
                        <Ionicons 
                          name={meal.icon as any} 
                          size={28} 
                          color={selectedMealType === meal.type ? '#3b82f6' : '#9ca3af'} 
                        />
                        <Text className={`text-sm font-semibold mt-2 ${
                          selectedMealType === meal.type
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {meal.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Recipe Selection Button */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Recipe <Text className="text-red-500">*</Text>
                </Text>
                
                {errors.recipe && (
                  <Text className="text-red-500 text-sm mb-2">{errors.recipe}</Text>
                )}

                <TouchableOpacity
                  onPress={() => setShowRecipeModal(true)}
                  className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-dark "
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-3">
                      <Ionicons name="restaurant-outline" size={20} color="#a855f7" />
                    </View>
                    <View className="flex-1">
                      {selectedRecipeDetails ? (
                        <>
                          <Text className="text-xs text-gray-500 dark:text-gray-400">
                            Selected Recipe
                          </Text>
                          <Text 
                            className="text-base font-semibold text-gray-900 dark:text-white"
                            numberOfLines={1}
                          >
                            {selectedRecipeDetails.title}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text className="text-base font-semibold text-gray-900 dark:text-white">
                            Choose a Recipe
                          </Text>
                          <Text className="text-xs text-gray-500 dark:text-gray-400">
                            Tap to browse {selectedMealType} recipes
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Selected Recipe Preview */}
              {selectedRecipeDetails && (
                <View className="mb-6">
                  <View className="pointer-events-none">
                    <RecipeCard 
                      id={selectedRecipeDetails._id}
                      imageUrl={selectedRecipeDetails.imageUrl}
                      title={selectedRecipeDetails.title}
                      difficulty={selectedRecipeDetails.difficulty}
                      duration={selectedRecipeDetails.totalTime}
                      dietaryTags={selectedRecipeDetails.dietaryTags}
                    />
                  </View>
                  <View className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Text className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      {selectedRecipeDetails.nutrition.calories} cal • 
                     {selectedRecipeDetails.nutrition.protein}g protein • 
                       {selectedRecipeDetails.nutrition.carbs}g carbs • 
                       {selectedRecipeDetails.nutrition.fat}g fat
                    </Text>
                  </View>
                </View>
              )}

              {/* Servings */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Servings
                </Text>
                <View className="flex-row items-center justify-center bg-gray-50 dark:bg-black rounded-xl py-3 ">
                  <TouchableOpacity
                    onPress={() => setServings(Math.max(1, servings - 1))}
                    className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-900 items-center justify-center"
                  >
                    <Ionicons name="remove" size={24} color="#6b7280" />
                  </TouchableOpacity>

                  <Text className="text-3xl font-bold text-gray-900 dark:text-white mx-8">
                    {servings}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setServings(servings + 1)}
                    className="w-12 h-12 rounded-full bg-secondary-dark items-center justify-center"
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notes */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  Notes (Optional)
                </Text>
                <TextInput
                  className="p-4 rounded-xl bg-gray-50 dark:bg-secondary-dark text-gray-900 dark:text-white border "
                  placeholder="Add meal notes or reminders..."
                  placeholderTextColor="#9ca3af"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notes.length}/200 characters
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="px-6 py-4 border-t border-gray-200 dark:border-secondary-dark">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                className={`h-14 rounded-xl items-center justify-center ${
                  isLoading 
                    ? 'bg-gray-300 dark:bg-gray-700' 
                    : 'bg-primary-dark'
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-black text-base font-bold">
                    Add to Meal Plan
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
       

       <ChooseRecipe
        open={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        onSelect={handleRecipeSelect}
        mealType={selectedMealType}
       />

 
    </>
  );
};

export default AddRecipeToMealPlan;