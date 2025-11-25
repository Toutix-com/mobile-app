import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface IconProps {
  /** Icon component from lucide-react-native or custom SVG */
  icon: React.ReactNode;
  /** Icon size preset or custom number */
  size?: IconSize;
  /** Icon color */
  color?: string;
  /** Background color for icon container */
  backgroundColor?: string;
  /** Border radius for icon container */
  rounded?: boolean;
  /** Padding around icon */
  padding?: number;
  /** Border radius for icon container */
  borderRadius?: number;
  /** Custom container style */
  style?: ViewStyle;
  /** On press handler */
  onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = 'md',
  color = '#000000',
  backgroundColor,
  rounded = false,
  borderRadius,
  padding,
  style,
  onPress,
}) => {
  const getIconSize = (): number => {
    if (typeof size === 'number') {
      return normalize(size);
    }

    const sizeMap: Record<string, number> = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    };

    return normalize(sizeMap[size] || sizeMap.md);
  };

  const iconSize = getIconSize();

  const containerStyle: ViewStyle = {
    ...(backgroundColor && { backgroundColor }),
    ...(rounded && { borderRadius: borderRadius || iconSize }),
    ...(padding && { padding: normalize(padding) }),
  };

  // Clone the icon element and pass size and color props
  const clonedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        size: iconSize,
        color,
      })
    : icon;

  const iconElement = (
    <View style={[styles.container, containerStyle, style]}>
      {clonedIcon}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {iconElement}
      </TouchableOpacity>
    );
  }

  return iconElement;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Icon;

