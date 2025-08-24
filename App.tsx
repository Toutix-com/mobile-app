/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from './src/pages/SplashScreen';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import GoogleSignInService from './src/services/GoogleSignInService';
import { userStore , showSplash, setShowSplash} from './src/pages/login/store/login.store';
import { useSignals } from '@preact/signals-react/runtime';

function App(): React.JSX.Element {
  useSignals();

  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignInService.init();
  }, []);


  const handleSplashComplete = () => {
    setShowSplash(false);
  };


  return showSplash.value ? (
    <SplashScreen onComplete={handleSplashComplete} />
  ) : (
    <NavigationContainer>
      {!userStore.value.isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default App;
