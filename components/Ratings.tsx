import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useMutation, useQuery } from 'convex/react'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import AddReview from './addReview'

interface RatingProps{
  recipeId:Id<'recipes'>;
}

export default function Ratings({recipeId}:RatingProps) {
  const reviews = useQuery(api.reviews.getReviews,{recipeId:recipeId})
  const helpfull = useMutation(api.reviews.helpfulCount)
  const {userId} = useAuth()
  const [open,setOpen]= useState(false)
  const reviewId = reviews?.filter((id)=>id._id !== id._id )
  const formatDateTime =(timestamp:number)=>{
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }
  const handlehelpfull = async(reviewId:Id<'recipeReviews'>)=>{
       await helpfull({
        recipeId:recipeId,
        userId:userId as string,
        reviewId:reviewId,
       })
  }
  return (
    <View className='flex-1' >
      <FlashList 
      data={reviews}
      keyExtractor={(item)=>item._id}
      renderItem={({item})=>(
        <View className='bg-secondary-light mx-2 p-4 rounded-lg mt-2 dark:bg-secondary-dark ' >
            <View className='flex-row' >
              {[1,2,3,4,5].map((star)=>(
                <View key={star} >
                  <Ionicons name={star <= item.rating ?'star' :'star-outline'}
                    size={20}
                    color={star <= item.rating ? "#fbbf24" : "#d1d5db"}
                  />
                  </View>
              ))}
              </View>
           <View className='flex-1' >
            <Text className='dark:text-white' >{item.review} </Text>
            </View>
            <View className='flex-row justify-between items-center' >
        <TouchableOpacity className='bg-black p-2 rounded-lg '
        onPress={()=>handlehelpfull(item._id)} >
          <Text className='text-white' >Helpful {item.helpfulCount} </Text>
        </TouchableOpacity>
        <Text className='dark:text-white' > {formatDateTime(item._creationTime)} </Text>
        </View>
        </View>
      )}
      ListEmptyComponent={
        <View className='flex justify-center items-center' >
          <Text className='dark:text-white text-lg' >
            No rating added yet .. be the first 
          </Text>
          </View>
      }
      />

      <TouchableOpacity className='bg-black p-4 flex justify-center items-center' 
       onPress={()=>setOpen(true)} >
        <Text className='text-white' >Add Review </Text>
      </TouchableOpacity>
      <AddReview 
      open={open}
      onOpen={setOpen}
      recipeId={recipeId}
      />
    </View>
  )
}