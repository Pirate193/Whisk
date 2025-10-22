import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  open: boolean;
  onOpen: (open: boolean) => void;
  recipeId: Id<"recipes">;
}

const AddReview = ({ open, onOpen, recipeId }: Props) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const addreview = useMutation(api.reviews.addReview);
  const { userId } = useAuth();
  const generateUploadUrl = useMutation(api.reviews.generatePhotoUrl);
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
  const handleAddreview = async () => {
    try {
      if (!photo) {
        console.log("no photo detected");
      } else {
        const postUrl = await generateUploadUrl();
        const response = await fetch(photo);
        const blob = await response.blob();

        const uploadResponse = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });

        const { storageId } = await uploadResponse.json();

        await addreview({
          userId: userId as string,
          recipeId: recipeId,
          rating: rating,
          review: review,
          photoUrls: [storageId],
          helpfulCount: 0,
        });
      }
      onOpen(false)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal visible={open} onRequestClose={() => onOpen(false)} transparent>
      <View className="flex-1 justify-end bg-black/50">
        <View
          style={{ height: "50%" }}
          className="rounded-t-3xl bg-white dark:bg-black"
        >
        <ScrollView showsVerticalScrollIndicator={false} >
          <View className="flex-row items-center p-4 gap-2">
            <Text className="dark:text-white " > How was it ?</Text>
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
          <TouchableOpacity className="bg-secondary-light dark:bg-secondary-dark 
            w-40 h-40 mx-2 justify-center items-center rounded-lg my-2 "
           onPress={takePhoto} >
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={{ width: '100%', height: '100%',borderRadius:12 }}
                contentFit='cover'
              />
            ):(
              <View>
                <Ionicons name="camera-outline" size={20} />
              </View>
            )}
          </TouchableOpacity>
          <View className="flex mx-2">
            <Text className="dark:text-white " >Review: </Text>
            <TextInput
              value={review}
              onChangeText={setReview}
              className="bg-secondary-light p-4 rounded-lg dark:bg-secondary-dark dark:text-white"
              multiline
            />
            <Text className="text-sm text-end dark:text-white ">{review.length}/300 </Text>
          </View>
          
          <TouchableOpacity onPress={handleAddreview} 
           className="bg-primary-light items-center p-4 justify-center rounded-lg mx-2"  >
            <Text> Add Review </Text>
          </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddReview;
