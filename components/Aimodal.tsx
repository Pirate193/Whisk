import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useAuth } from '@clerk/clerk-expo';
import { useThreadMessages } from "@convex-dev/agent/react";
import { Ionicons } from '@expo/vector-icons';
import { useAction, useMutation } from 'convex/react';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Message from './message';
import SwipeableModal from './ui/SwipableModal';
const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: event => {
        'worklet';
        height.value = Math.max(event.height, 0);
      },
    },
    []
  );
  return { height };
};
interface contextProps{
  recipeId?: Id<"recipes">;
  recipeData?: {
    title: string;
    ingredients: any[];
    instructions: any[];
    nutrition: any;
    difficulty: string;
    totalTime: number;
  };
}

const AiModal = ({recipeId,recipeData}:contextProps) => {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>('');
  
  const { userId } = useAuth();
  const createThread = useMutation(api.ai.createThread);
  const chat = useAction(api.ai.chat);
  const flatListRef = useRef<FlatList>(null);
  const hasCreatedThread = useRef(false);

  // This is for listing messages - only call when threadId exists
  const { results } = useThreadMessages(
    api.ai.listMessages,
    threadId ? { threadId: threadId as any } : 'skip',
    { initialNumItems: 10, stream: true }
  );

  // Create a thread only once when modal opens
  useEffect(() => {
    if (showModal && userId && !threadId && !hasCreatedThread.current) {
      hasCreatedThread.current = true;
      createThread({ userId, title: 'New chat' })
        .then((result) => {
          setThreadId(result.threadId);
        })
        .catch((error) => {
          console.error('Failed to create thread:', error);
          hasCreatedThread.current = false;
        });
    }
  }, [showModal, userId, threadId, createThread]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (results && results.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [results]);

  const sendMessage = async () => {
    if (!input.trim() || !threadId) return;

    const messageText = input;
    setInput('');
    setIsLoading(true);

    try {
      await chat({ threadId: threadId as any, message: messageText,userId:userId as string,
        recipeId:recipeId ,
        recipeData:recipeData
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setInput(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
     const { height } = useGradualAnimation();
   
     const fakeView = useAnimatedStyle(() => {
       return {
         height: Math.abs(height.value),
       };
  }, []);
  return (
    <>
      {/* Floating AI Button */}
      <View className='absolute bottom-20 right-4 z-50'>
        <TouchableOpacity 
          onPress={() => setShowModal(true)} 
          className=' rounded-full '
        >
          <LottieView
          source={require('../assets/animations/Loading loop animation.json')}
          style={{width:80,height:80}} 
          autoPlay
          loop
          />
        </TouchableOpacity>
      </View>

      {/* Modal */}
     <SwipeableModal
     visible={showModal}
     onClose={handleCloseModal}
     height='95%'
     showHandle={true}
     closeOnBackdropPress={true}
     >
    

          {/* Messages */}
          {!threadId ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size="large" color="#a855f7" />
              <Text className='text-gray-500 dark:text-gray-400 mt-4'>
                Starting conversation...
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={results || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Message 
                  id={item._id} 
                  text={item.text} 
                  role={item.message?.role} 
                  message={item.message}
                />
              )}
              contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className='flex-1 items-center justify-center py-20'>
                  <View className='w-20 h-20 rounded-full bg-black dark:bg-secondary-dark items-center justify-center mb-4'>
                    <Ionicons name='chatbubbles-outline' size={40} color='white' />
                  </View>
                  <Text className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Start a conversation
                  </Text>
                  <Text className='text-gray-500 dark:text-gray-400 text-center px-8'>
                    Ask me anything about recipes, cooking tips, or meal planning!
                  </Text>
                </View>
              }
            />
          )}

          {/* Input Field */}
          <View className='bg-white dark:bg-black px-4 py-3 border-gray-200 dark:border-gray-800'>
            <View className='flex-row bg-gray-100 dark:bg-secondary-dark rounded-2xl px-4 py-2 items-center'>
              <TouchableOpacity className='mr-2'>
                <Ionicons name='add-circle-outline' size={24} color='#6b7280' />
              </TouchableOpacity>
              
              <TextInput
                placeholder='Ask me anything...'
                placeholderTextColor='#9ca3af'
                className='flex-1 text-base text-gray-900 dark:text-white py-2'
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
                returnKeyType='send'
                onSubmitEditing={sendMessage}
               
              />
              
              <TouchableOpacity 
                className='ml-2 w-10 h-10 items-center justify-center rounded-full bg-black ' 
                onPress={sendMessage} 
                disabled={isLoading || !input.trim() || !threadId}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name='send' size={18} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
           <Animated.View style={fakeView} />
       </SwipeableModal>
    </>
  );
};

export default AiModal;