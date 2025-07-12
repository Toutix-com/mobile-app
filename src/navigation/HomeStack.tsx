import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/home/HomeScreen';
import EventDetailsScreen from '../pages/event/EventDetailsScreen';
import EventTicketsScreen from '@pages/event/EventTicketsScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="EventTickets" component={EventTicketsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack; 