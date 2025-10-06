import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
    <Tabs
    screenOptions={{tabBarShowLabel:false,
        headerShown:false,
        tabBarActiveTintColor:'#e1e65c',
        tabBarInactiveTintColor:'#000000',
        tabBarStyle:{
            backgroundColor:'#eff0da',
            borderTopWidth:0,
            position:'absolute',
            elevation:0,
            height:50,
            paddingBottom:8
        }
        }} 
    >
       <Tabs.Screen name="home" options={{
                tabBarIcon:({color,size})=> <Ionicons name="home" color={color} size={size}/>
            }} />
       <Tabs.Screen name="search" options={{
                tabBarIcon:({color,size})=> <Ionicons name="search" color={color} size={size}/>
            }} />
       <Tabs.Screen name="add"
        options={{
                tabBarIcon:({color,size})=> <Ionicons name="add-circle" color={color} size={size}/>
            }} />
       <Tabs.Screen name="logs" options={{
        tabBarIcon:({color,size})=> <Ionicons name="list" color={color} size={size}/>
       }} />
       <Tabs.Screen name="profile" options={{
                tabBarIcon:({color,size})=> <Ionicons name="person-circle" color={color} size={size}/>
            }}/>
    </Tabs>
    );
}