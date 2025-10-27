import { useTheme } from '@/providers/themeProvider';
import { useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

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
  const {colorScheme}= useTheme();

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
      
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <View className='p-4 bg-white flex-1 items-center dark:bg-black ' >
        <Text className='text-2xl font-bold dark:text-white ' >Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          className=' p-4 rounded-2xl mt-2 mb-2 dark:text-white bg-gray-200 dark:bg-secondary-dark h-14 w-full'
        />
        <TouchableOpacity onPress={onVerifyPress} className='flex justify-center items-center bg-yellow-300 h-14 w-full rounded-2xl mt-4' >
          <Text className='text-black' >Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    
   <KeyboardAwareScrollView
     bottomOffset={40} className='flex-1 bg-white dark:bg-black p-4'
     >
    
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
              <Text className='text-3xl text-center font-bold dark:text-white' >Welcome to Whisk </Text>
            <Text className='text-base text-center dark:text-white '>Sign Up to continue</Text>
            </View>
            
            <View>
              <Text className=' font-bold dark:text-white ' >Email Address</Text>
              <TextInput 
              value={emailAddress}
              onChange={(e)=> setEmailAddress(e.nativeEvent.text)}
              className=' p-4 rounded-2xl mt-2 mb-2 dark:text-white dark:bg-secondary-dark bg-secondary-light h-14'
              keyboardType='email-address'
              autoCapitalize='none'
              placeholder='name@example.com'
              />
            <View>
              <Text className=' font-bold dark:text-white' >Password</Text>
              <TextInput 
              value={password}
              onChange={(e)=> setPassword(e.nativeEvent.text)}
              className='p-4 rounded-2xl mt-2 mb-2 dark:text-white dark:bg-secondary-dark bg-secondary-light h-14'
              secureTextEntry={!PasswordVisible}
              placeholder='********'
              autoCapitalize='none'
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
            <View>
              <Text className='dark:text-white font-bold' >Confirm Password</Text>
              <TextInput 
              value={confirmPassword}
              onChange={(e)=> setConfirmPassword(e.nativeEvent.text)}
              className='p-4 rounded-2xl mt-2 mb-2 dark:text-white dark:bg-secondary-dark bg-secondary-light '
              secureTextEntry={!ConfirmPasswordVisible}
              placeholder='********'
              autoCapitalize='none'
              />
              <TouchableOpacity onPress={()=> setConfirmPasswordVisible(!ConfirmPasswordVisible)} className='absolute right-4 bottom-5' >
                {ConfirmPasswordVisible ? <Ionicons name='eye' size={24} color={
                  colorScheme === 'dark' ? 'white' : 'black'
                } /> :
                <Ionicons name='eye-off' size={24} color={
                  colorScheme === 'dark' ? 'white' : 'black'
                } />
         }
              </TouchableOpacity>
              </View>
            </View>
            <View >
              {error ? <Text className='text-red-500' >{error}</Text> : null}
            </View>
            
            <TouchableOpacity onPress={onSignUpPress} className='flex justify-center items-center bg-yellow-300 p-4 rounded-2xl mt-4' >
              <Text className='font-bold'> Continue</Text>
            </TouchableOpacity>
             <Text className='text-center mt-4 dark:text-white'> or</Text>  
              <TouchableOpacity className='flex-row gap-2  justify-center items-center bg-secondary-light p-4  rounded-2xl mt-4' >
              <Ionicons name='logo-google' size={24}  />
                 <Text className='text-center  font-bold' >Sign Up with Google</Text>
              </TouchableOpacity>
              <View className='flex justify-center items-center' >
                <Text className='text-center mt-4 dark:text-white ' >Already have an account? <Text className='font-bold text-blue-600' onPress={()=> router.push('/sign-in')} >Sign In</Text> </Text>
              </View>
          </View>
        </KeyboardAwareScrollView>
  )
}