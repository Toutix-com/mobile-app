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
import { userStore } from './src/store/rootStore';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(userStore.value.isAuthenticated)
  );

  useEffect(() => {
    // Initialize Google Sign-In
    GoogleSignInService.init();
    const interval = setInterval(() => {
      setIsAuthenticated(Boolean(userStore.value.isAuthenticated));
    }, 500); // crude polling approach

    return () => clearInterval(interval);
  }, []);


  const handleSplashComplete = () => {
    setShowSplash(false);
  };


  return showSplash ? (
    <SplashScreen onComplete={handleSplashComplete} />
  ) : (
    <NavigationContainer>
      {!isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default App;
