import { useTheme } from '@/providers/themeProvider';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [PasswordVisible, setPasswordVisible] = React.useState(false);
    const {colorScheme}= useTheme();
  // Handle the submission of the sign-in form
  React.useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(''), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }
}, [error]);
  const onSignInPress = async () => {
    if (!isLoaded) return

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
    
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      setError('Invalid email address or password')
    }
  }

  return (
     <KeyboardAvoidingView
        className='p-4 bg-white dark:bg-black flex-1 '
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={60}
        >
        <ScrollView showsVerticalScrollIndicator={false}  className='flex-1' >
        
         <View className='flex ' >
                    {colorScheme === 'dark' ?(
                       <View className="items-center mb-8">
                                <Image
                                source={require('../../assets/images/ios-tinted.png')}
                                style={{ width: 200, height: 200 }}
                                className="rounded-3xl shadow-lg"
                                contentFit="cover"
                              />
                       </View>
                    ):(
                           <View className="items-center mb-8">
                                    <Image
                                    source={require('../../assets/images/ios-light.png')}
                                    style={{ width: 200, height: 200 }}
                                    className="rounded-3xl shadow-lg"
                                    contentFit="cover"
                                  />
                        </View>
                    )}
                   
                  </View>
      <View  className='flex' >
        <View className='flex justify-center ' >
          <Text className='text-3xl dark:text-white text-center font-bold' >Welcome Back </Text>
        <Text className='text-base text-center dark:text-white'>Sign in to continue</Text>
        </View>
        
        <View>
          <Text className='dark:text-white font-bold' >Email Address</Text>
          <TextInput 
          value={emailAddress}
          onChange={(e)=> setEmailAddress(e.nativeEvent.text)}
          className=' p-4 rounded-2xl mt-2 mb-2 dark:text-white dark:bg-secondary-dark bg-secondary-light '
          keyboardType='email-address'
          autoCapitalize='none'
          placeholder='name@example.com'
          placeholderTextColor={'grey'}
          />

          <View>
              <Text className='dark:text-white font-bold' >Password</Text>
              <TextInput 
              value={password}
              onChange={(e)=> setPassword(e.nativeEvent.text)}
              className='p-4 rounded-2xl mt-2 mb-2 dark:text-white dark:bg-secondary-dark bg-secondary-light'
              secureTextEntry={!PasswordVisible}
              placeholder='********'
              autoCapitalize='none'
              placeholderTextColor={'grey'}
              />

              <TouchableOpacity onPress={()=> setPasswordVisible(!PasswordVisible)} className='absolute right-4 bottom-5' >
                {PasswordVisible ? <Ionicons name='eye' size={24} color={
                  colorScheme === 'dark' ? 'white' : 'black'
                } /> :
                <Ionicons name='eye-off' size={24} color={
                  colorScheme === 'dark' ? 'white' : 'black'
                } />
         }
              </TouchableOpacity>
            </View>
          <Text className= 'text-right mb-4' >Forgot Password?</Text>
        </View>
        {error ? <Text className='text-red-500' >{error}</Text> : null}
        <TouchableOpacity onPress={onSignInPress} className='flex justify-center items-center bg-yellow-300 h-14 rounded-2xl' >
          <Text className='font-bold'> Continue</Text>
        </TouchableOpacity>
         <Text className='text-center mt-4 dark:text-white'> or</Text>  
          <TouchableOpacity className='flex  justify-center items-center bg-gray-200 h-14 rounded-2xl mt-4' >
             <Text className='text-center  font-bold' >Sign in with Google</Text>
          </TouchableOpacity>
          <View className='flex justify-center items-center' >
            <Text className='text-center mt-4 dark:text-white' >Don&apos;t have an account? <Text className='font-bold text-blue-500' onPress={()=> router.push('/sign-up')} >Sign up</Text> </Text>
          </View>
      </View>
   </ScrollView>
    </KeyboardAvoidingView>
  )
}