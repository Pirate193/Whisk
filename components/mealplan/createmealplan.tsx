import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation } from 'convex/react';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  open: boolean;
  onOpen: (open: boolean) => void;
}

const CreateMealPlan = ({ open, onOpen }: Props) => {
  const { userId } = useAuth();
  const createMealPlan = useMutation(api.mealplan.createMealPlan);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; dates?: string }>({});

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format date for backend (YYYY-MM-DD)
  const formatDateForBackend = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validation
  const validate = () => {
    const newErrors: { title?: string; dates?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      newErrors.dates = 'Start date cannot be in the past';
    }
    
    if (endDate <= startDate) {
      newErrors.dates = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle date changes
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      // If end date is before new start date, adjust it
      if (endDate <= selectedDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 7);
        setEndDate(newEndDate);
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await createMealPlan({
        userId: userId!,
        name: title.trim(),
        description: description.trim() || undefined,
        startDate: formatDateForBackend(startDate),
        endDate: formatDateForBackend(endDate),
        meals: [], // Empty initially
        totalCalories: 0,
        totalRecipes: 0,
        generatedBy: 'user',
        isActive: true,
        completedMeals: 0,
        updatedAt: Date.now(),
      });
      
      // Success - close modal and reset
      Alert.alert('Success', 'Meal plan created successfully!');
      handleClose();
    } catch (error) {
      console.error('Error creating meal plan:', error);
      Alert.alert('Error', 'Failed to create meal plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    setErrors({});
    onOpen(false);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleClose}
      transparent
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          style={{ height: '85%' }} 
          className="rounded-t-3xl bg-white dark:bg-black"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 ">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Meal Plan
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Plan your meals in advance
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
            {/* Title Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Title <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className={`p-4 rounded-xl bg-gray-50 dark:bg-secondary-dark text-gray-900 dark:text-white border ${
                  errors.title ? 'border-red-500' : 'border-white dark:border-black'
                }`}
                placeholder="e.g., Weekly Meal Plan, Keto October"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                maxLength={50}
              />
              {errors.title && (
                <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>
              )}
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {title.length}/50 characters
              </Text>
            </View>

            {/* Description Input */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Description (Optional)
              </Text>
              <TextInput
                className="p-4 rounded-xl bg-gray-50 dark:bg-secondary-dark text-gray-900 dark:text-white border border-gray-200 dark:border-black"
                placeholder="Add notes about this meal plan..."
                placeholderTextColor="#9ca3af"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
              />
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/200 characters
              </Text>
            </View>

            {/* Date Range Section */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Date Range <Text className="text-red-500">*</Text>
              </Text>
              
              {/* Start Date */}
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="flex-row items-center justify-between p-4 mb-3 rounded-xl bg-gray-50 dark:bg-secondary-dark "
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mr-3">
                    <Ionicons name="calendar-outline" size={20} color="#22c55e" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Start Date
                    </Text>
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {formatDate(startDate)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              {/* End Date */}
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-secondary-dark border border-gray-200 dark:border-black"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3">
                    <Ionicons name="calendar-outline" size={20} color="#ef4444" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      End Date
                    </Text>
                    <Text className="text-base font-semibold text-gray-900 dark:text-white">
                      {formatDate(endDate)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              {errors.dates && (
                <Text className="text-red-500 text-sm mt-2">{errors.dates}</Text>
              )}

              {/* Duration Info */}
              <View className="flex-row items-center mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Ionicons name="time-outline" size={20} color="#3b82f6" />
                <Text className="text-sm text-blue-700 dark:text-blue-400 ml-2">
                  Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </Text>
              </View>
            </View>

            {/* Date Pickers */}
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onStartDateChange}
                minimumDate={getMinDate()}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onEndDateChange}
                minimumDate={startDate}
              />
            )}

            {/* Info Box */}
            <View className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-6">
              <View className="flex-row items-start">
                <Ionicons name="information-circle-outline" size={20} color="#f59e0b" />
                <Text className="text-sm text-yellow-800 dark:text-yellow-200 ml-2 flex-1">
                  Youll be able to add recipes to your meal plan after creation
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="px-6 py-4 ">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`h-14 rounded-xl items-center justify-center ${
                isLoading 
                  ? 'bg-gray-300 dark:bg-gray-700' 
                  : 'bg-primary-light'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-black text-base font-bold">
                  Create Meal Plan
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateMealPlan;