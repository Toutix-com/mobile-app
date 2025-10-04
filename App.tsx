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
import StripeProvider from './src/components/StripeProvider';
import { userStore, showSplash, setShowSplash, showAuthStack} from './src/pages/login/store/login.store';
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
    <StripeProvider>
      <NavigationContainer>
        {showAuthStack.value ? <AuthStack /> : <AppStack />}
      </NavigationContainer>
    </StripeProvider>
  );
}

export default App;
