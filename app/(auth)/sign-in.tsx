import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [PasswordVisible, setPasswordVisible] = React.useState(false);
  // Handle the submission of the sign-in form
  React.useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(''), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }
}, [error]);
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)/home')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError('Invalid email address or password')
    }
  }

  return (
     <KeyboardAvoidingView
        className='p-4 bg-white flex-1 '
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}
        >
        <ScrollView showsVerticalScrollIndicator={false} >
        

      <View className='flex ' >
        <Image 
        source={require('../../assets/images/logo.png')}
        className='w-40 h-40 self-center bg-white rounded-lg'
        
        />
      </View>
      <View  className='flex mt-4' >
        <View className='flex justify-center ' >
          <Text className='text-2xl text-center font-bold' >Welcome Back </Text>
        <Text className='text-base text-center'>Sign in to continue</Text>
        </View>
        
        <View>
          <Text className='mt-4 font-bold' >Email Address</Text>
          <TextInput 
          value={emailAddress}
          onChange={(e)=> setEmailAddress(e.nativeEvent.text)}
          className=' p-4 rounded-2xl mt-2 mb-2 bg-gray-200 h-14'
          keyboardType='email-address'
          autoCapitalize='none'
          placeholder='name@example.com'
          />

          <View>
              <Text className='mt-4 font-bold' >Password</Text>
              <TextInput 
              value={password}
              onChange={(e)=> setPassword(e.nativeEvent.text)}
              className='p-4 rounded-2xl mt-2 mb-2 bg-gray-200 h-14'
              secureTextEntry={!PasswordVisible}
              placeholder='********'
              autoCapitalize='none'
              />

              <TouchableOpacity onPress={()=> setPasswordVisible(!PasswordVisible)} className='absolute right-4 bottom-5' >
                {PasswordVisible ? <Ionicons name='eye' size={24} color='black' /> :
                <Ionicons name='eye-off' size={24} color='black' />
         }
              </TouchableOpacity>
            </View>
          <Text className= 'text-right mb-4' >Forgot Password?</Text>
        </View>
        {error ? <Text className='text-red-500' >{error}</Text> : null}
        <TouchableOpacity onPress={onSignInPress} className='flex justify-center items-center bg-yellow-300 h-14 rounded-2xl' >
          <Text className='font-bold'> Continue</Text>
        </TouchableOpacity>
         <Text className='text-center mt-4'> or</Text>  
          <TouchableOpacity className='flex  justify-center items-center bg-gray-200 h-14 rounded-2xl mt-4' >
             <Text className='text-center  font-bold' >Sign in with Google</Text>
          </TouchableOpacity>
          <View className='flex justify-center items-center' >
            <Text className='text-center mt-4' >Don&apos;t have an account? <Text className='font-bold' onPress={()=> router.push('/sign-up')} >Sign up</Text> </Text>
          </View>
      </View>
   </ScrollView>
    </KeyboardAvoidingView>
  )
}