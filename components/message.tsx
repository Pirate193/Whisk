import React from 'react';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface Props{
  id:string,
  text:any ,
  role?:"user" | "assistant" | "tool" | "system",
  message?:any
}


const Message = ({id, text, role,message }:Props) => {
  const isUser = role === 'user';
  // const isTool = role === 'tool';
  // const hasToolCalls = message?.content && Array.isArray(message.content)
  // const renderToolCalls = ()=>{
  //   if(!hasToolCalls) return null
  //   return message.content.map((item:any,index:number)=>{
  //     //skip if not a tool
  //     if(item.type !== 'tool-call') return null;
  //     const {toolName,args,toolCallId} = item;
  //     //serch tool
  //     if(toolName === 'searchRecipe') {
        
  //       return (
  //        <View key={toolCallId} >
  //           <LoadingToolUI toolName={toolName} />
  //        </View>
  //       )
  //     }
  //     if(toolName === 'generateMealPlan'){
        
  //       return(
  //         <View key={toolCallId} className="mb-2">
  //           <View className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
  //             <View className="flex-row items-center">
  //               <View className="w-8 h-8 rounded-full bg-purple-500 items-center justify-center mr-3">
  //                 <Ionicons name="calendar" size={16} color="white" />
  //               </View>
  //               <View className="flex-1">
  //                 <Text className="text-sm font-semibold text-purple-900 dark:text-purple-100">
  //                   Creating your meal plan...
  //                 </Text>
  //                 <Text className="text-xs text-purple-700 dark:text-purple-300 mt-1">
  //                   {args.name || 'Custom Plan'}
  //                 </Text>
  //               </View>
  //             </View>
  //           </View>
  //         </View>
  //       )
  //     }
  //     //to do a recipe display tool
  //     return <LoadingToolUI key={toolCallId} toolName={toolName} />
  //   })
  // }
  // const renderToolResults =()=>{
  //   if (!hasToolCalls || !isTool) return null;
    
  //   return message.content.map((item: any, index: number) => {
  //     // Only handle tool-result items
  //     if (item.type !== 'tool-result') return null;
      
  //     const { toolName, output, toolCallId } = item;
      
  //     // Search Recipe Results
  //     if (toolName === 'searchRecipe' && output?.value) {
  //       return (
  //         <SearchRecipeToolUI
  //           key={toolCallId}
  //           args={{ query: '' }} // Query not available in result, but we can handle it
  //           results={output.value}
  //         />
  //       );
  //     }
      
  //     // Meal Plan Creation Result
  //     if (toolName === 'generateMealPlan' && output?.value) {
  //       // Get the original args from the previous assistant message if needed
  //       // For now, we'll just show the result
  //       const result = output.value;
        
  //       if (result.success) {
  //         return (
  //           <View key={toolCallId} className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 mb-2 border border-purple-200 dark:border-purple-800">
  //             <View className="flex-row items-center justify-between mb-2">
  //               <View className="flex-row items-center flex-1">
  //                 <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center mr-2">
  //                   <Ionicons name="checkmark" size={16} color="white" />
  //                 </View>
  //                 <View className="flex-1">
  //                   <Text className="text-sm font-semibold text-purple-900 dark:text-purple-100">
  //                     Meal Plan Created!
  //                   </Text>
  //                 </View>
  //               </View>
  //               <TouchableOpacity
  //                 onPress={() => router.push({ 
  //                   pathname: '/mealplan/[mealplanId]', 
  //                   params: { mealplanId: result.mealPlanId } 
  //                 })}
  //                 className="bg-purple-500 px-3 py-1.5 rounded-full"
  //               >
  //                 <Text className="text-xs text-white font-semibold">View Plan</Text>
  //               </TouchableOpacity>
  //             </View>
              
  //             <Text className="text-xs text-purple-700 dark:text-purple-300">
  //               {result.message}
  //             </Text>
  //           </View>
  //         );
  //       }
  //     }
      
  //     return null;
  //   });
  // }
  //   if (isTool) {
  //   return (
  //     <View className="mb-2">
  //       {renderToolResults()}
  //     </View>
  //   );
  // }
  return (
    <View className={`mb-2 ${isUser ? 'items-end' :'items-start'}`}>
      <View
      className={`max-w-[85%] px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-yellow-100 rounded-tr-sm' 
              : 'bg-background-light dark:bg-secondary-dark '
          }`}
      >
        {/* {!isUser && hasToolCalls&&(
          <View className="" >
            {renderToolCalls()}
          </View>
        )} */}
        { isUser ?(
          <View>
            <Text>{text} </Text>
            </View>
        ):(
          <Markdown  >
            {text}
          </Markdown>
        )
        }
      </View>
    </View>
  )
}

export default Message

