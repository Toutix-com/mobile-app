import React from 'react';
import { StyleSheet, StatusBar, ViewStyle, View, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { tokens, normalize } from '../../design-system';

interface BlurredCirclesBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const BlurredCirclesBackground: React.FC<BlurredCirclesBackgroundProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <StatusBar barStyle="light-content" backgroundColor={tokens.colors.stoneNeutral[9]} />
      
      {/* Base background */}
      <View style={styles.baseBackground} />
      
      {/* Purple blurred circle */}
      <View style={styles.purpleCircleContainer}>
        <View style={styles.purpleCircle} />
      </View>
      
      {/* Green blurred circle */}
      <View style={styles.greenCircleContainer}>
        <View style={styles.greenCircle} />
      </View>
      
      {/* Blur overlay for the entire background */}
      <BlurView
        style={styles.blurOverlay}
        blurType="dark"
        blurAmount={Platform.OS === 'android' ? 25 : 80}
        reducedTransparencyFallbackColor="transparent"
      />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  baseBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colors.stoneNeutral[9],
  },
  purpleCircleContainer: {
    position: 'absolute',
    top: normalize(150),
    right: Platform.select({
      android: normalize(-100),
      ios: normalize(-50),
    }),
    width: Platform.select({
      android: normalize(400),
      ios: normalize(200),
    }),
    height: Platform.select({
      android: normalize(400),
      ios: normalize(200),
    }),
  },
  purpleCircle: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(999),
    backgroundColor: tokens.colors.flashPurple[9],
    opacity: 0.8,
  },
  greenCircleContainer: {
    position: 'absolute',
    top: normalize(200),
    left: Platform.select({
      android: normalize(-100),
      ios: normalize(-50),
    }),
    width: Platform.select({
      android: normalize(400),
      ios: normalize(200),
    }),
    height: Platform.select({
      android: normalize(400),
      ios: normalize(200),
    }),
  },
  greenCircle: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(999),
    backgroundColor: tokens.colors.flashGreen[9],
    opacity: 0.8,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default BlurredCirclesBackground;
