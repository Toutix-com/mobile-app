import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/LoginScreen';
import RegisterScreen from '../pages/RegisterScreen';
import VerificationScreen from '../pages/VerificationScreen';
import OTPVerificationScreen from '../pages/OTPVerificationScreen';


export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Verification: {
    email: string;
    mobileNumber?: string;
  };
  OTPVerification: {
    email?: string;
    mobileNumber?: string;
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
             
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack; 