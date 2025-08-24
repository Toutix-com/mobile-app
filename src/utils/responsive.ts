import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Based on a standard screen size to scale from
const scale = SCREEN_WIDTH / 375;

/**
 * Normalizes a size value based on the screen's width.
 * @param size The original size.
 * @returns The scaled size.
 */
export const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}; 