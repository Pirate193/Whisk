import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';

const NotFound = () => {
  return (
    <View>
       <LottieView
           source={require('../../assets/animations/empty.json')}
           autoPlay
           loop
           style={{width:200,height:200}}
           />
    </View>
  )
}

export default NotFound