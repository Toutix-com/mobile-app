import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { restoreAuthState } from './login/store/login.store';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(1);
  const logoTranslateY = new Animated.Value(0);
  const logoTranslateZ = new Animated.Value(0);

  useEffect(() => {
    
    const fadeInAnimations = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

   
    const forwardAndFadeAnimation = Animated.parallel([
      
      Animated.timing(logoScale, {
        toValue: 1.5,
        duration: 800,
        easing: Easing.cubic,
        useNativeDriver: true,
      }),
     
      Animated.timing(logoTranslateY, {
        toValue: -50,
        duration: 800,
        easing: Easing.cubic,
        useNativeDriver: true,
      }),
     
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]);

   
    // Start auth restoration in parallel with animations
    const authRestoration = restoreAuthState();
    
    Animated.sequence([
      fadeInAnimations,
      Animated.delay(1500), 
      forwardAndFadeAnimation,
    ]).start(async () => {
      // Wait for both animation and auth restoration to complete
      await authRestoration;
      setTimeout(onComplete, 100);
    });

    
    return () => {
      logoOpacity.setValue(0);
      logoScale.setValue(1);
      logoTranslateY.setValue(0);
      logoTranslateZ.setValue(0);
    };
  }, []);

  return (
    <View style={styles.container}>
     
      <LinearGradient
        colors={[
          'rgba(94, 80, 255, 0.08)',
          'rgba(94, 80, 255, 0.05)',
          'rgba(94, 80, 255, 0.02)',
          'rgba(255, 255, 255, 0)',
        ]}
        style={[styles.gradient, { position: 'absolute', bottom: 0 }]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        locations={[0, 0.3, 0.6, 1]}
      />
     
      <LinearGradient
        colors={[
          'rgba(94, 80, 255, 0.08)',
          'rgba(94, 80, 255, 0.05)',
          'rgba(94, 80, 255, 0.02)',
          'rgba(255, 255, 255, 0)',
        ]}
        style={[styles.gradient, { position: 'absolute', top: 0 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.3, 0.6, 1]}
      />
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { translateY: logoTranslateY },
                { perspective: 1000 },
              ],
            },
          ]}>
          <Image
            source={require('../assets/logos/toutix_logo_full.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    width: '100%',
    height: height * 0.8,
    opacity: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#20232a',
    textAlign: 'center',
    marginHorizontal: 20,
  },
}); 