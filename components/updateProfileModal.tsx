import { api } from "@/convex/_generated/api";
import { useToast } from "@/providers/toastProvider";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import SwipeableModal from "./ui/SwipableModal";

interface Props {
  open: boolean;
  onOpen: (open: boolean) => void;
}

const UpdateProfile = ({ open, onOpen }: Props) => {
  const { userId } = useAuth();
  const user = useQuery(api.users.getUser, { userId: userId! });
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUrl = useMutation(api.reviews.generatePhotoUrl);
  const { success, error: showError } = useToast();

  // Form state
  const [photo, setPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dietary preferences
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);

  // Health goals
  const [goal, setGoal] = useState<
    "lose_weight" | "gain_muscle" | "maintain" | "eat_healthy"
  >("maintain");
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "active"
  >("moderate");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  // Daily targets
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  // Cuisine & skill
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [cookingSkillLevel, setCookingSkillLevel] = useState<
    "beginner" | "intermediate" | "expert"
  >("beginner");

  useEffect(() => {
    if (user && open) {
      setUsername(user.username || "");
      setDietaryPreferences(user.dietaryPreferences || []);
      setAllergies(user.allergies || []);
      setDislikes(user.dislikes || []);
      setCuisinePreferences(user.cuisinePreferences || []);
      setCookingSkillLevel(user.cookingSkillLevel || "beginner");

      if (user.healthGoals) {
        setGoal(user.healthGoals.goal);
        setActivityLevel(user.healthGoals.activityLevel);
        setCurrentWeight(user.healthGoals.currentWeight?.toString() || "");
        setTargetWeight(user.healthGoals.targetWeight?.toString() || "");
        setAge(user.healthGoals.age?.toString() || "");
        setGender(user.healthGoals.gender || null);
      }

      if (user.dailyTargets) {
        setCalories(user.dailyTargets.calories?.toString() || "");
        setProtein(user.dailyTargets.protein?.toString() || "");
        setCarbs(user.dailyTargets.carbs?.toString() || "");
        setFat(user.dailyTargets.fat?.toString() || "");
      }
    }
  }, [user, open]);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets) {
      setPhoto(result.assets[0].uri);
    }
  };

  const toggleArrayItem = (
    arr: string[],
    setArr: (arr: string[]) => void,
    item: string
  ) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleUpdate = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      let avatarId = undefined;

      // Upload photo if changed
      if (photo) {
        const postUrl = await generateUrl();
        const response = await fetch(photo);
        const blob = await response.blob();
        const uploadResponse = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });
        const { storageId } = await uploadResponse.json();
        avatarId = storageId;
      }

      await updateProfile({
        userId: userId as string,
        username: username || undefined,
        avatarId,
        dietaryPreferences:
          dietaryPreferences.length > 0 ? dietaryPreferences : [],
        allergies: allergies.length > 0 ? allergies : [],
        dislikes: dislikes.length > 0 ? dislikes : [],
        healthGoals: {
          goal,
          activityLevel,
          currentWeight: currentWeight ? parseFloat(currentWeight) : undefined,
          targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
        },
        dailyTargets: {
          calories: parseFloat(calories) || 2000,
          protein: parseFloat(protein) || 50,
          carbs: parseFloat(carbs) || 250,
          fat: parseFloat(fat) || 70,
        },
        cuisinePreferences:
          cuisinePreferences.length > 0 ? cuisinePreferences : [],
        cookingSkillLevel,
      });

      success("Profile updated successfully!");
      onOpen(false);
    } catch (err) {
      showError("Failed to update profile");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Paleo",
    "Low-Carb",
  ];
  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Thai",
    "Mediterranean",
    "American",
  ];
  const commonAllergies = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Eggs",
    "Soy",
    "Wheat",
    "Fish",
    "Shellfish",
  ];

  return (
    <SwipeableModal
      visible={open}
      onClose={() => onOpen(false)}
      height="95%"
      showHandle={true}
      closeOnBackdropPress={true}
    >
      <KeyboardAwareScrollView
        className="flex-1 py-2 px-2 "
        bottomOffset={40}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text>Edit Profile </Text>
        </View>
        {/*  */}
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              source={
                photo || user?.avatarUrl || "https://via.placeholder.com/120"
              }
              style={{ width: 120, height: 120, borderRadius: 60 }}
              className="bg-gray-200 dark:bg-gray-800"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="absolute bottom-0 right-0 bg-primary-light rounded-full p-2"
            >
              <Ionicons name="camera-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={takePhoto} className="mt-2">
            <Text className="text-black dark:text-white font-medium">
              Take Photo
            </Text>
          </TouchableOpacity>
        </View>
        {/* user input */}
        <View className="mx-2 ">
          <Text className="dark:text-white">Username: </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="p-4 dark:bg-secondary-dark dark:text-white bg-secondary-light rounded-lg"
          />
        </View>
        {/* cooking skill level */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Cooking Skill Level
          </Text>
          <View className="flex-row gap-2">
            {(["beginner", "intermediate", "expert"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setCookingSkillLevel(level)}
                className={`flex-1 py-3 rounded-lg ${
                  cookingSkillLevel === level
                    ? "bg-primary-light"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              >
                <Text
                  className={`text-center capitalize ${
                    cookingSkillLevel === level
                      ? "text-black font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* dietary prefarences  */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dietary Preferences
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() =>
                  toggleArrayItem(
                    dietaryPreferences,
                    setDietaryPreferences,
                    option
                  )
                }
                className={`px-4 py-2 rounded-full ${
                  dietaryPreferences.includes(option)
                    ? "bg-green-500"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              >
                <Text
                  className={
                    dietaryPreferences.includes(option)
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* cuisine preferences */}
        <View>
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Cuisine Preferences{" "}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {cuisineOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() =>
                  toggleArrayItem(
                    cuisinePreferences,
                    setCuisinePreferences,
                    option
                  )
                }
                className={`p-4 rounded-lg ${
                  cuisinePreferences.includes(option)
                    ? "bg-green-500"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              >
                <Text
                  className={
                    cuisinePreferences.includes(option)
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* allergies */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Allergies
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {commonAllergies.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                onPress={() =>
                  toggleArrayItem(allergies, setAllergies, allergy)
                }
                className={`px-4 py-2 rounded-full ${
                  allergies.includes(allergy)
                    ? "bg-red-500"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              >
                <Text
                  className={
                    allergies.includes(allergy)
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }
                >
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* health goals */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Health Goal
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(
              ["lose_weight", "gain_muscle", "maintain", "eat_healthy"] as const
            ).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGoal(g)}
                className={`px-4 py-2 rounded-full ${
                  goal === g
                    ? "bg-primary-light"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              >
                <Text
                  className={
                    goal === g
                      ? "text-black"
                      : "text-gray-700 dark:text-gray-300"
                  }
                >
                  {g.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* activity level */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Activity Level
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {(["sedentary", "light", "moderate", "active"] as const).map(
              (level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setActivityLevel(level)}
                  className={`px-4 py-2 rounded-full ${
                    activityLevel === level
                      ? "bg-primary-light"
                      : "bg-secondary-light dark:bg-secondary-dark"
                  }`}
                >
                  <Text
                    className={`capitalize ${
                      activityLevel === level
                        ? "text-black"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
        {/* gender */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Gender
          </Text>
          <View className="flex-row gap-2">
            {(["male", "female"] as const).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                className={`flex-1 py-3 rounded-lg ${
                  gender === g
                    ? "bg-primary-light"
                    : "bg-secondary-light dark:bg-secondary-dark"
                }`}
              >
                <Text
                  className={`text-center capitalize ${
                    gender === g
                      ? "text-black font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* age */}
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Age
            </Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="25"
              keyboardType="numeric"
              className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>
          {/* current weight */}
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Current Weight (kg)
            </Text>
            <TextInput
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="70"
              keyboardType="decimal-pad"
              className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
        {/* target weight */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Target Weight (kg)
          </Text>
          <TextInput
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder="65"
            keyboardType="decimal-pad"
            className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
            placeholderTextColor="#9ca3af"
          />
        </View>
        {/* nutritional targets */}
        <View>
          <Text className="text-gray-500 dark:text-gray-400 mb-4">
            Set your daily nutritional targets
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Daily Calories
            </Text>
            <TextInput
              value={calories}
              onChangeText={setCalories}
              placeholder="2000"
              keyboardType="numeric"
              className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Protein (g)
              </Text>
              <TextInput
                value={protein}
                onChangeText={setProtein}
                placeholder="50"
                keyboardType="numeric"
                className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Carbs (g)
              </Text>
              <TextInput
                value={carbs}
                onChangeText={setCarbs}
                placeholder="250"
                keyboardType="numeric"
                className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Fat (g)
            </Text>
            <TextInput
              value={fat}
              onChangeText={setFat}
              placeholder="70"
              keyboardType="numeric"
              className="bg-secondary-light dark:bg-secondary-dark rounded-lg px-4 py-3 text-gray-900 dark:text-white"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
        {/* save button */}
        <TouchableOpacity
          onPress={handleUpdate}
          className="flex-1 bg-primary-light py-4 rounded-lg mx-2 mb-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center font-semibold text-black">
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SwipeableModal>
  );
};

export default UpdateProfile;
