import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import Loading from '@/components/ui/loading';
import NotFound from '@/components/ui/notFound';
import { api } from '@/convex/_generated/api';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Search = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [search]);

  const recipe = useQuery(
    api.recipe.searchRecipe, 
    debouncedSearch.length > 0 ? { query: debouncedSearch } : 'skip'
  );
  const popular = useQuery(api.recipe.getRecipes, { limit: 50 });

  const isSearching = search.length > 0;
  const isLoadingSearch = isSearching && search !== debouncedSearch;
  const hasSearchResults = recipe && recipe.length > 0;
  const showNoResults = isSearching && !isLoadingSearch && recipe && recipe.length === 0;

  return (
    <View className='flex-1 bg-gray-50 dark:bg-black'>
      {/* Header */}
      <View className='bg-white dark:bg-black  pb-4 shadow-sm'>
        <Text className='text-2xl font-bold text-gray-900 dark:text-white px-4 mb-3'>
          {isSearching ? 'Search Results' : 'Discover Recipes'}
        </Text>
        <SearchBar value={search} onChangeText={setSearch} />
        
      </View>

      {/* Content */}
      {isSearching ? (
        <View className='flex-1'>
          {/* Loading state while debouncing */}
          {isLoadingSearch && (
            <View className='flex-1 items-center justify-start'>
              <Loading />
            </View>
          )}

          {/* Search results */}
          {!isLoadingSearch && hasSearchResults && (
            <View className='flex-1 px-2 bg-white dark:bg-black '>
              <Text className='text-sm text-black dark:text-gray-400 px-2 py-3'>
                Found {recipe.length} recipe{recipe.length !== 1 ? 's' : ''}
              </Text>
              <FlashList
                data={recipe}
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
              />
            </View>
          )}

          {/* No results state */}
          {showNoResults && (
            <View className='flex-1 items-center justify-center px-8'>
              <NotFound />
              <Text className='text-gray-500 dark:text-gray-400 mt-4 text-base' > No results found</Text>
            </View>
          )}
        </View>
      ) : (
        /* Popular recipes */
        <View className='flex-1 bg-white dark:bg-black '>
          {popular === undefined ? (
            <View className='flex-1 items-center justify-center'>
              <Loading />
              <Text className='text-gray-500 dark:text-gray-400 mt-4 text-base'>
                Loading recipes...
              </Text>
            </View>
          ) : (
            <View className='flex-1 '>
              <Text className='text-sm font-semibold text-gray-600 dark:text-gray-400 px-2 py-3'>
                Recent Recipes
              </Text>
              <FlashList
                data={popular}
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
              />
            </View>
          )}
        </View>
      )}
      
    </View>
  );
};

export default Search;