import React from 'react';
import { Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface Props{
  id:string,
  text:any ,
  role?:"user" | "assistant" | "tool" | "system",
}

const Message = ({id, text, role }:Props) => {
  const isUser = role === 'user'
  return (
    <View className={`mb-2 ${isUser ? 'items-end' :'items-start'}`}>
      <View
      className={`max-w-[85%] px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-yellow-100 rounded-tr-sm' 
              : 'bg-background-light '
          }`}
      >
        { isUser ?(
          <View>
            <Text>{text} </Text>
            </View>
        ):(
          <Markdown>
            {text}
          </Markdown>
        )
        }
      </View>
    </View>
  )
}

export default Message