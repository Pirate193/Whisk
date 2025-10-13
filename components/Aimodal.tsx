import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { useThreadMessages } from "@convex-dev/agent/react";
import { Ionicons } from '@expo/vector-icons';
import { useAction, useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import Message from './message';


const AiModal = () => {
  const [showModal,setShowModal] = useState(false);
  const [input,setInput] = useState('');
  const [isloading,setIsLoading] = useState(false);

  const [threadId,setThreadId]= useState<string>('');
  const {userId}= useAuth();
  const createThread = useMutation(api.ai.createThread)
  const chat = useAction(api.ai.chat)
  //this is for listing messages 
  const {results,status} = useThreadMessages(
    api.ai.listMessages,
    {threadId },
    {initialNumItems:10 ,stream:true}
  )
   

   //create a thread on component mount 
   useEffect(()=>{
     if(userId && !threadId){
      createThread({userId,title:'New chat'}).then((result)=>{
        setThreadId(result.threadId)
      })
     }
   })
  const sendMessage = async ()=>{
     setInput('')
     setIsLoading(true)

     try{
      await chat({threadId,message:input})
     }catch(error){
      console.log(error)
    
     }finally{
      setIsLoading(false)
     }
  }

  return (
    <>
      <View className='absolute bottom-12 right-2 ' >
      <TouchableOpacity onPress={() => setShowModal(true)} className='bg-background-light dark:bg-background-light rounded-full p-2'  >
           <Ionicons name='sparkles' size={20} />
      </TouchableOpacity>
      </View>
      <Modal
      visible={showModal}
      animationType='slide'
      onRequestClose={() => setShowModal(false)}
      >
          <View className='flex-1 bg-background-light dark:bg-background-dark '>
              

              <FlatList 
               data={results} 
               keyExtractor={(item)=>item._id}
               renderItem={({item})=>(
                <Message id={item._id} text={item.text} role={item.message?.role} />
               )}  
              
              />

             
             {/* Input Field */}
            
                   <View className='flex flex-row bg-secondary-light dark:bg-secondary-dark p-2 rounded-2xl w-100 justify-between items-center' >
                    <View className='mr-2 ' >
                        <Ionicons name='add' size={20} />
                    </View>
                    <View>
                      <TextInput
                        placeholder='Type your message here'
                        className='flex-1 ml-2'
                        value={input}
                        onChangeText={setInput}
                        style={{minHeight:30}}
                        returnKeyType='send'
                        onSubmitEditing={sendMessage}
                        multiline
                        
                     />
                    </View>
                     <TouchableOpacity className='ml-2 w-10 h-10 items-center justify-center' onPress={sendMessage} disabled={isloading} >
                        <Ionicons name='send' size={20} />
                     </TouchableOpacity>
                   </View>
              
          </View>
      </Modal>
    </>
  )
}

export default AiModal