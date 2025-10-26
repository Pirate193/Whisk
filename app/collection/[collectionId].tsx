
import RecipeCard from '@/components/RecipeCard';
import AlertDialog from '@/components/ui/Alert';
import Loading from '@/components/ui/loading';
import NotFound from '@/components/ui/notFound';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useToast } from '@/providers/toastProvider';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function CollectionDetailPage() {
  const { collectionId } = useLocalSearchParams();
  const collection = useQuery(api.favourites.getCollectionId, {
    id: collectionId as Id<'collections'>,
  });
  
  const removeRecipe = useMutation(api.favourites.addRecipetoCollection);
  const allRecipes = useQuery(api.recipe.getRecipes, { limit: 100 });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [RecipeTodelete, setRecipeTodelete] = useState<Id<'recipes'> | null>();
  const {success,error}=useToast();

  
 
  // Get recipes that are in this collection
  const collectionRecipes = collection?.recipeIds
    .map((id) => allRecipes?.find((r) => r._id === id))
    .filter(Boolean);


  const recipetodelete = collectionRecipes?.find((recipe)=> recipe?._id===RecipeTodelete) // this functon is used to get the recipe we are deleteing inorder to show in the alertdialog which will look good
    // Handle remove recipe
  const handleRemoveRecipe = async () => {
      if (!collectionId || !RecipeTodelete) {
        return;
      }
     try{
      await removeRecipe({
                userId: collection!.userId,
                collectionId: collectionId as Id<'collections'>,
                recipeId:RecipeTodelete as Id<'recipes'>
              });
              success('Success','Recipe removed from collection');
            } catch (err) {
              console.error('Error removing recipe:', err);
              error('Error','Something went wrong. Please try again.');
            }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="bg-white dark:bg-black px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={28} color="#6b7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-3xl mr-2">{collection?.emoji || '📁'}</Text>
              <Text className="text-2xl font-bold text-gray-900 dark:text-white flex-1" numberOfLines={1}>
                {collection?.name}
              </Text>
            </View>
            {collection?.description && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {collection.description}
              </Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Ionicons name="restaurant-outline" size={16} color="#3b82f6" />
            <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {collection?.recipeIds.length || 0} recipe{collection?.recipeIds.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#9ca3af" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              Updated {collection ? new Date(collection.updatedAt).toLocaleDateString() : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      {collection === undefined ? (
        <View className="flex-1 items-center justify-center">
          <Loading />
          <Text className="text-gray-500 dark:text-gray-400 mt-4">Loading collection...</Text>
        </View>
      ) : collection?.recipeIds.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8  ">
           <NotFound />
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
            No Recipes Yet
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-6">
            Start adding recipes to this collection
          </Text>

        </View>
      ) : (
        <View className="flex-1 px-2 pt-4">
          <FlashList
            data={collectionRecipes}
            keyExtractor={(item) => item?._id || ''}
            renderItem={({ item }) => {
              if (!item) return null;
              return (
                <View className="relative">
                  <RecipeCard
                    id={item._id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    difficulty={item.difficulty}
                    duration={item.totalTime}
                    dietaryTags={item.dietaryTags}
                  />
                  {/* Remove button */}
                  <TouchableOpacity
                    onPress={() =>{
                      setRecipeTodelete(item._id);
                      setAlertVisible(true);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 items-center justify-center"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <Ionicons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              );
            }}
            numColumns={2}
            masonry
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      { collectionRecipes &&(
      <AlertDialog 
      visible={alertVisible}
      onClose={()=>setAlertVisible(false)}
      title='Remove Recipe'
      description={`Are you sure you want to delete ${recipetodelete?.title} from this collection?`}
       cancelText="Cancel"
      confirmText="Delete"
      variant="destructive"
      onConfirm={handleRemoveRecipe}
     />
      )
      }
    </View>
  );
}
