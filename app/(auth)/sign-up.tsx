import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [PasswordVisible, setPasswordVisible] = React.useState(false);
  const [ConfirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);
  const [error, setError] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

    React.useEffect(() => {
     if (error) {
       const timer = setTimeout(() => setError(''), 3000); // 3 seconds
       return () => clearTimeout(timer);
     }
   }, [error]);
  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }

  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)/home')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View className='p-4 bg-white flex-1 items-center ' >
        <Text className='text-2xl font-bold' >Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          className=' p-4 rounded-2xl mt-2 mb-2 bg-gray-200 h-14 w-full'
        />
        <TouchableOpacity onPress={onVerifyPress} className='flex justify-center items-center bg-yellow-300 h-14 w-full rounded-2xl mt-4' >
          <Text>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
    className='p-4 bg-white flex-1 '
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={60}
    >
    <ScrollView showsVerticalScrollIndicator={false} className='flex-1' >
    
          <View className='flex ' >
            <Image 
            source={require('../../assets/images/logo.png')}
            className='w-40 h-40 self-center bg-white rounded-lg'
            
            />
          </View>
          <View  className='flex mt-4' >
            <View className='flex justify-center ' >
              <Text className='text-2xl text-center font-bold' >Welcome to Whisk </Text>
            <Text className='text-base text-center'>Sign Up to continue</Text>
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
            <View>
              <Text className='mt-4 font-bold' >Confirm Password</Text>
              <TextInput 
              value={confirmPassword}
              onChange={(e)=> setConfirmPassword(e.nativeEvent.text)}
              className='p-4 rounded-2xl mt-2 mb-2 bg-gray-200 h-14'
              secureTextEntry={!ConfirmPasswordVisible}
              placeholder='********'
              autoCapitalize='none'
              />
              <TouchableOpacity onPress={()=> setConfirmPasswordVisible(!ConfirmPasswordVisible)} className='absolute right-4 bottom-5' >
                {ConfirmPasswordVisible ? <Ionicons name='eye' size={24} color='black' /> :
                <Ionicons name='eye-off' size={24} color='black' />
         }
              </TouchableOpacity>
              </View>
            </View>
            <View >
              {error ? <Text className='text-red-500' >{error}</Text> : null}
            </View>
            
            <TouchableOpacity onPress={onSignUpPress} className='flex justify-center items-center bg-yellow-300 h-14 rounded-2xl mt-4' >
              <Text className='font-bold'> Continue</Text>
            </TouchableOpacity>
             <Text className='text-center mt-4'> or</Text>  
              <TouchableOpacity className='flex  justify-center items-center bg-gray-200 h-14 rounded-2xl mt-4' >
                 <Text className='text-center  font-bold' >Sign Up with Google</Text>
              </TouchableOpacity>
              <View className='flex justify-center items-center' >
                <Text className='text-center mt-4' >Already have an account? <Text className='font-bold' onPress={()=> router.push('/sign-in')} >Sign In</Text> </Text>
              </View>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
  )
}