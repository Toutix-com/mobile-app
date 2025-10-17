import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { normalize } from '../../utils/responsive';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface AppTextProps extends TextProps {
  /** Typography variant */
  variant?: TextVariant;
  /** Font weight */
  weight?: TextWeight;
  /** Text color */
  color?: string;
  /** Text alignment */
  align?: TextAlign;
  /** Text opacity */
  opacity?: number;
  /** Children content */
  children: React.ReactNode;
  /** Custom style */
  style?: TextStyle | TextStyle[];
}

const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  weight,
  color,
  align,
  opacity,
  children,
  style,
  ...props
}) => {
  const getTextStyle = (): TextStyle => {
    const variantStyle = styles[variant];
    const weightStyle = weight ? styles[weight] : {};
    const colorStyle = color ? { color } : {};
    const alignStyle = align ? { textAlign: align } : {};
    const opacityStyle = opacity !== undefined ? { opacity } : {};

    return {
      ...variantStyle,
      ...weightStyle,
      ...colorStyle,
      ...alignStyle,
      ...opacityStyle,
    };
  };

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Variant styles
  h1: {
    fontSize: normalize(32),
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: normalize(40),
  },
  h2: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: normalize(36),
  },
  h3: {
    fontSize: normalize(24),
    fontWeight: '600',
    color: '#000000',
    lineHeight: normalize(32),
  },
  h4: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: '#000000',
    lineHeight: normalize(28),
  },
  title: {
    fontSize: normalize(24),
    fontWeight: '600',
    color: '#000000',
    lineHeight: normalize(32),
  },
  subtitle: {
    fontSize: normalize(18),
    fontWeight: '500',
    color: '#5A677D',
    lineHeight: normalize(26),
  },
  body: {
    fontSize: normalize(16),
    fontWeight: '400',
    color: '#1C1C1E',
    lineHeight: normalize(24),
  },
  bodySmall: {
    fontSize: normalize(14),
    fontWeight: '400',
    color: '#5C636E',
    lineHeight: normalize(20),
  },
  caption: {
    fontSize: normalize(12),
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: normalize(16),
  },
  label: {
    fontSize: normalize(16),
    fontWeight: '400',
    color: '#000000',
    lineHeight: normalize(20),
  },
  button: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Weight styles
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default AppText;

