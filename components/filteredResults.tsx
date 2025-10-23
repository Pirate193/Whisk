import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import React from 'react'
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native'
import RecipeCard from './RecipeCard'

interface Props{
    filteredRecipes: any[];
    showResults:boolean;
    setShowResults:(showResults: boolean) => void
}

const FilteredResults = ({filteredRecipes, showResults, setShowResults}: Props) => {
  return (
      <Modal
           visible={showResults}
           animationType="slide"
           onRequestClose={() => setShowResults(false)}
         >
           <View className="flex-1 justify-end bg-black/50">
           <View 
           style={{ height: "100%" }}
           className="rounded-t-3xl bg-white dark:bg-black"
           >
             {/* Header */}
             <View className="flex-row items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-800">
               <View className="flex-1">
                 <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                   Filtered Results
                 </Text>
                 <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                   {filteredRecipes?.length || 0} recipes found
                 </Text>
               </View>
               <TouchableOpacity
                 onPress={() => setShowResults(false)}
                 className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
               >
                 <Ionicons name="close" size={24} color="#6b7280" />
               </TouchableOpacity>
             </View>
   
             {/* Results List */}
             <View className="flex-1 px-2 pt-4">
               {filteredRecipes === undefined ? (
                 <View className="flex-1 items-center justify-center">
                   <ActivityIndicator size="large" color="#3b82f6" />
                   <Text className="text-gray-500 dark:text-gray-400 mt-4">
                     Searching recipes...
                   </Text>
                 </View>
               ) : filteredRecipes.length === 0 ? (
                 <View className="flex-1 items-center justify-center px-8">
                   <View className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
                     <Ionicons name="search-outline" size={48} color="#9ca3af" />
                   </View>
                   <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                     No recipes found
                   </Text>
                   <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
                     Try adjusting your filters
                   </Text>
                 </View>
               ) : (
                 <FlashList
                   data={filteredRecipes}
                   keyExtractor={(item) => item._id}
                   renderItem={({ item }) => (
                     <RecipeCard
                       id={item._id}
                       imageUrl={item.imageUrl}
                       title={item.title}
                       difficulty={item.difficulty}
                       duration={item.totalTime}
                       dietaryTags={item.dietaryTags}
                     />
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
  )
}

export default FilteredResults