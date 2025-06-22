import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Verification: {
    email: string;
    mobileNumber?: string;
  };
  OTPVerification: {
    email: string;
    type: 'email' | 'mobile';
  };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack; 