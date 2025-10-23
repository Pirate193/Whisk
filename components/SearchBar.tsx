import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import FilterSearch from "./FilterSearch";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onPress,
  onFilterPress,
  placeholder = "Search recipes...",
}: SearchBarProps) {

  const [open,setOpen]= useState(false);
  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View className="flex-row items-center gap-3 px-4 py-2">
      {/* Search Input Container */}
      <View className="flex-1 bg-gray-100 dark:bg-gray-800 flex-row items-center rounded-full px-4 py-1 shadow-sm">
        <TouchableOpacity onPress={onPress} className="mr-2">
          <Ionicons name="search" size={20} color="#6b7280" />
        </TouchableOpacity>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          className="flex-1 text-base text-gray-900 dark:text-white"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="ml-2">
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        onPress={()=>setOpen(true)}
        className="bg-primary-light w-11 h-11 rounded-full items-center justify-center shadow-sm active:bg-blue-600"
      >
        <Ionicons name="options-outline" size={22} color="white" />
      </TouchableOpacity>
      <FilterSearch onOpen={setOpen} open={open} />
    </View>
  );
}
