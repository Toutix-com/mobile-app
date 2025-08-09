import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/login/LoginScreen';
import RegisterScreen from '../pages/register/RegisterScreen';
import OTPVerificationScreen from '../pages/otpVerification/OTPVerificationScreen';


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
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack; 