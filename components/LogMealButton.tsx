import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
interface LogMealButtonProps {
  recipeId: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function LogMealButton({
  recipeId,
  nutrition,
}: LogMealButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [servings, setServings] = useState(1);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
  const logMeal = useMutation(api.mealplan.logMeal);
  const { userId } = useAuth();
  const date = new Date().toISOString().split("T")[0];
  const Calories = nutrition?.calories || 0;
  const protein = nutrition?.protein || 0;
  const carbs = nutrition?.carbs || 0;
  const fat = nutrition?.fat || 0;

  const handleMealLog = async () => {
    try {
      await logMeal({
        userId: userId as string,
        recipeId: recipeId as Id<"recipes">,
        date,
        mealType,
        servings,
        nutrition: {
          calories: Calories,
          protein: protein,
          carbs: carbs,
          fat: fat,
        },
        notes: notes || undefined,
        rating: rating > 0 ? rating : undefined,
        photoUrl: photoUrl || undefined,
      });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  //    const takePhoto = async ()=>{
  //       const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  //       if(!permissionResult.granted){
  //         Alert.alert('Permission denied');
  //         return;
  //       }
  //       const result = await ImagePicker.launchCameraAsync({

  //       })
  //    }
  return (
    <View className="absolute bottom-0">
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-black p-2 rounded-lg dark:bg-secondary-light  "
      >
        <Text className="text-white text-center font-bold"> Log Meal</Text>
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        animationType="slide"
        
        onRequestClose={() => setIsOpen(false)}
      >
        <BlurView intensity={20} className="flex-1 h-1/2 bg-gray-50 dark:bg-black">
          <View className="bg-white dark:bg-zinc-800 rounded-t-3xl p-4 h-1/2 w-full">
            {/* meal type */}
            <View className="mb-4">
              <Text className="text-lg font-semibold dark:text-white mb-2">
                Meal Type:
              </Text>
              <View className="flex-row justify-around">
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setMealType(type)}
                    className={`py-2 px-2 flex-row items-center rounded-full ${mealType === type ? "bg-primary-light" : "bg-gray-200 dark:bg-zinc-700"}`}
                  >
                    <Ionicons
                      name={
                        type === "breakfast"
                          ? "cafe-outline"
                          : type === "lunch"
                            ? "restaurant-outline"
                            : type === "dinner"
                              ? "restaurant-outline"
                              : "cafe-outline"
                      }
                      size={20}
                    />
                    <Text
                      className={`${mealType === type ? "text-white" : "text-gray-700 dark:text-gray-300"} capitalize`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* servings */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Servings
              </Text>
              <View className="flex-row items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl py-3">
                <TouchableOpacity
                  onPress={() => setServings(Math.max(1, servings - 1))}
                  className="bg-gray-200 dark:bg-gray-700 w-12 h-12 rounded-full items-center justify-center active:bg-gray-300"
                >
                  <Ionicons name="remove" size={24} color="white" />
                </TouchableOpacity>

                <View className="mx-8">
                  <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                    {servings}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setServings(servings + 1)}
                  className="bg-primary-light w-12 h-12 rounded-full items-center justify-center active:bg-blue-600"
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
              {/* notes */}
              <View>
                <Text className="text-lg font-semibold dark:text-white mb-2">
                  Notes:
                </Text>
                <TextInput
                  className="border border-gray-300 dark:border-zinc-600 rounded-lg p-3 dark:text-white"
                  placeholder="Add some notes about your meal..."
                  placeholderTextColor="gray"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                />
              </View>
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  How was it? (Optional)
                </Text>
                <View className="flex-row justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(rating === star ? 0 : star)}
                    >
                      <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={32}
                        color={star <= rating ? "#fbbf24" : "#d1d5db"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* photo */}
              {/* <View>
              <Text className='text-lg font-semibold dark:text-white mb-2'>Photo:</Text>
              <TouchableOpacity onPress={takePhoto} className='bg-gray-200 dark:bg-zinc-700 p-2 rounded-full items-center' >
                <Ionicons name='camera-outline' size={20} />
                <Text className='text-gray-700 dark:text-gray-300'>Take Photo</Text>
              </TouchableOpacity>
           </View> */}
              {/* log Button */}
              <TouchableOpacity
                onPress={handleMealLog}
                className="bg-primary-light p-4 rounded-lg items-center"
              >
                <Text className="text-white text-xl font-bold">Log Meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
