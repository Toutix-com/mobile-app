import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { normalize } from '../../utils/responsive';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'social';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button text content */
  title?: string;
  /** Button variant style */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom container style */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: TextStyle;
  /** Loading indicator color */
  loadingColor?: string;
  /** Children elements (alternative to title) */
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
  loadingColor,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[`${size}Container`],
      ...(fullWidth && styles.fullWidth),
    };

    const variantStyle = styles[`${variant}Container`];
    const disabledStyle = isDisabled ? styles.disabledContainer : {};

    return { ...baseStyle, ...variantStyle, ...disabledStyle };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.baseText,
      ...styles[`${size}Text`],
    };

    const variantTextStyle = styles[`${variant}Text`];
    const disabledTextStyle = isDisabled ? styles.disabledText : {};

    return { ...baseTextStyle, ...variantTextStyle, ...disabledTextStyle };
  };

  const getLoadingColor = (): string => {
    if (loadingColor) return loadingColor;
    
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
      case 'outline':
      case 'ghost':
      case 'social':
      default:
        return '#1E1B4B';
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          {children || (
            <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          )}
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: normalize(8),
  },
  rightIcon: {
    marginLeft: normalize(8),
  },

  // Size variants - Container
  smallContainer: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    minHeight: normalize(32),
  },
  mediumContainer: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    minHeight: normalize(44),
  },
  largeContainer: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(20),
    minHeight: normalize(52),
  },

  // Size variants - Text
  smallText: {
    fontSize: normalize(14),
  },
  mediumText: {
    fontSize: normalize(16),
  },
  largeText: {
    fontSize: normalize(18),
  },

  // Base text style
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },

  // Variant styles - Primary
  primaryContainer: {
    backgroundColor: '#1E1B4B',
  },
  primaryText: {
    color: '#FFFFFF',
  },

  // Variant styles - Secondary
  secondaryContainer: {
    backgroundColor: '#F3F4F6',
  },
  secondaryText: {
    color: '#1E1B4B',
  },

  // Variant styles - Outline
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E1B4B',
  },
  outlineText: {
    color: '#1E1B4B',
  },

  // Variant styles - Ghost
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#1E1B4B',
  },

  // Variant styles - Danger
  dangerContainer: {
    backgroundColor: '#DC2626',
  },
  dangerText: {
    color: '#FFFFFF',
  },

  // Variant styles - Social
  socialContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0C0453',
  },
  socialText: {
    color: '#000000',
    fontWeight: '500',
  },

  // Disabled state
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;

