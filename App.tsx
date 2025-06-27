/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen } from './src/pages/SplashScreen';
import AppStack from './src/navigation/AppStack';

function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return showSplash ? (
    <SplashScreen onComplete={handleSplashComplete} />
  ) : (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

export default App;
