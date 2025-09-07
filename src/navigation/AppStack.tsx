import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../pages/profile/EditProfileScreen';
import TicketsStack from './TicketsStack';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="TicketsStack" component={TicketsStack} />
    </Stack.Navigator>
  );
};

export default AppStack; 