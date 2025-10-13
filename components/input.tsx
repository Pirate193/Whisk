import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TextInput, View } from 'react-native'

const InputComponent = () => {
  return (
    <View className='absolute bottom-0' >
       <View className='flex flex-row bg-secondary-light dark:bg-secondary-dark p-2 rounded-2xl' >
        <View className='mr-2 bg-gray-500' >
            <Ionicons name='add' size={20} />
        </View>
        <View>
          <TextInput
            placeholder='Type your message here'
            className='flex-1 ml-2'
         />
        </View>
         <View>
            <Ionicons name='send' size={20} />
         </View>
       </View>
    </View>
  )
}

export default InputComponent