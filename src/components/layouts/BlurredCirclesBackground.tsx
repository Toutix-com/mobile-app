import React from 'react';
import { StyleSheet, StatusBar, ViewStyle, View } from 'react-native';
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
        blurAmount={100}
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
    right: normalize(-50),
    width: normalize(300),
    height: normalize(300),
  },
  purpleCircle: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(200),
    backgroundColor: tokens.colors.flashPurple[9],
    opacity: 1,
  },
  greenCircleContainer: {
    position: 'absolute',
    top: normalize(200),
    left: normalize(-50),
    width: normalize(300),
    height: normalize(300),
  },
  greenCircle: {
    width: '100%',
    height: '100%',
    borderRadius: normalize(250),
    backgroundColor: tokens.colors.flashGreen[9],
    opacity: 1,
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
