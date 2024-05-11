import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './screens/Home';
import QbilaScreen from './screens/QbilaScreen';
import FindMosque from './screens/FindMosque';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import PrayerCalendar from './screens/PrayerCalendar';
import AllScreen from './screens/AllScreen';
import QuranScreen from './screens/QuranScreen';
import HijriCalendar from './screens/HijriCalendar';
import AboutScreen from './screens/AboutScreen';
import AdminScreen from './screens/AdminScreen';
import SettingsScreen from './screens/SettingsScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function MyTabs() {
  return (
    <Tab.Navigator initalRouteName="Hjem"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Hjem') {
            iconName = focused ? 'home-outline' : 'home';
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === 'Qibla') {
            iconName = focused ? 'kaaba' : 'kaaba';
            return <FontAwesome5 name={iconName} size={size} color={color} />
          } else if(route.name === 'Finn Moske'){
            iconName = focused ? 'mosque' : 'mosque'
            return <FontAwesome5 name={iconName} size={size} color={color} />
          }else if(route.name === 'Meny'){
            iconName = focused ? 'list-outline' : 'list'
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        headerShown: route.name === 'Hjem' ? false : true
      })}
    >
        <Tab.Screen name="Hjem" component={Home}/>
        <Tab.Screen name="Qibla" component={QbilaScreen} screenOptions={{headerShown: true}}/>
        <Tab.Screen name="Finn Moske" component={FindMosque}/>
        <Tab.Screen name="Meny" component={AllScreen}/>
    </Tab.Navigator>
  )
}

const Routes = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MyTabs} options={{ headerShown: false }}/>
      <Stack.Screen name="Calendar" component={PrayerCalendar} options={{ headerShown: true }}/>
      <Stack.Screen name="Quran" component={QuranScreen} options={{headerShown: true}} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{headerShown: true}} />
      <Stack.Screen name="Info" component={AboutScreen} options={{headerShown: true}} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: true}} />
      <Stack.Screen name="HijriCalendar" component={HijriCalendar} options={{headerShown: true}} />

    </Stack.Navigator>
  );
}

export default Routes