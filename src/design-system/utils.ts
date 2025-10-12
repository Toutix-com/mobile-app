import { tokens } from './tokens';
import { normalize } from '../utils/responsive';

// Simple utility functions for easy token usage
export const getColor = (colorPath: string): string => {
  const path = colorPath.split('.');
  let value: any = tokens.colors;
  
  for (const key of path) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color not found: ${colorPath}`);
      return '#000000'; // Fallback color
    }
  }
  
  return value;
};

// Helper to get colors from the full palette
export const getPaletteColor = (palette: string, shade: number): string => {
  const colorPalette = tokens.colors[palette as keyof typeof tokens.colors];
  if (typeof colorPalette === 'object' && colorPalette !== null) {
    return colorPalette[shade as keyof typeof colorPalette] || '#000000';
  }
  console.warn(`Color palette not found: ${palette}`);
  return '#000000';
};

// Typography utilities
export const getFontSize = (size: keyof typeof tokens.typography.fontSize): number => {
  return normalize(tokens.typography.fontSize[size]);
};

export const getFontWeight = (weight: keyof typeof tokens.typography.fontWeight): string => {
  return tokens.typography.fontWeight[weight];
};

// Spacing utilities
export const getSpacing = (size: keyof typeof tokens.spacing): number => {
  return normalize(tokens.spacing[size]);
};

// Border radius utilities
export const getBorderRadius = (size: keyof typeof tokens.borderRadius): number => {
  return normalize(tokens.borderRadius[size]);
};

// Common style helpers
export const createTextStyle = (
  size: keyof typeof tokens.typography.fontSize = 'base',
  weight: keyof typeof tokens.typography.fontWeight = 'normal',
  color: string = tokens.colors.text
) => ({
  fontSize: getFontSize(size),
  fontWeight: getFontWeight(weight),
  color,
});

export const createContainerStyle = (
  padding: keyof typeof tokens.spacing = 'md',
  backgroundColor: string = tokens.colors.background
) => ({
  padding: getSpacing(padding),
  backgroundColor,
});

export const createButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline' = 'primary',
  size: keyof typeof tokens.spacing = 'lg'
) => {
  const baseStyle = {
    padding: getSpacing(size),
    borderRadius: getBorderRadius('md'),
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: tokens.colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: tokens.colors.secondary,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: tokens.colors.primary,
      };
    default:
      return baseStyle;
  }
};

// Export tokens for direct access
export { tokens };
