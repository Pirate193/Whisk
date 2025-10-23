import React from 'react';
import { View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";



interface Props{
    nutrition?:{
        calories:number,
        carbs:number,
        fat:number,
        protein:number
    }
}
export default function NutritionRings({nutrition}:Props) {
    if(!nutrition) return null;

    const {calories,carbs,fat,protein}= nutrition;

    const total = calories ||1;
    const fatPercentage = Math.min((fat/total)*100,100);
    const carbsPercentage = Math.min((carbs/total)*100,100);
    const proteinPercentage = Math.min((protein/total)*100,100);

    const commonProps ={
    activeStrokeWidth: 15,
    inActiveStrokeWidth: 15,
    inActiveStrokeOpacity: 0.2,
    duration: 1500,
    valueSuffix: "%",
    }
  return (
    <View className='mr-2' >
        <CircularProgressBase
        {...commonProps}
        value={fatPercentage}
        radius={75}
        activeStrokeColor='#FF6B6B'
        inActiveStrokeColor='#FF6B6B'
        >
         <CircularProgressBase
         {...commonProps}
         value={carbsPercentage}
         radius={50}
         activeStrokeColor="#FFD93D"
          inActiveStrokeColor="#FFD93D"
         >
         <CircularProgressBase
          {...commonProps}
            value={proteinPercentage}
            radius={25}
            activeStrokeColor="#6BCB77"
            inActiveStrokeColor="#6BCB77"
         >
           {/* <View className="items-center">
              <Text className="text-lg font-semibold dark:text-white ">Calories</Text>
              <Text className="text-xl font-bold dark:text-white">{calories}</Text>
            </View> */}
         </CircularProgressBase>
         </CircularProgressBase>
        </CircularProgressBase>
    </View>
  )
}
