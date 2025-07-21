import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../pages/HomeScreen';

export type AppStackParamList = {
  Home: undefined;
  // Add more main app screens here
};

const Stack = createStackNavigator<AppStackParamList>();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* Add more screens here */}
  </Stack.Navigator>
);

export default AppStack; 