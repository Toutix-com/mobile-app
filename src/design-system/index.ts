// Simple design system exports for easy usage
import { tokens } from './tokens';
export { tokens };
export { 
  getColor, 
  getPaletteColor,
  getFontSize, 
  getFontWeight, 
  getSpacing, 
  getBorderRadius,
  createTextStyle,
  createContainerStyle,
  createButtonStyle
} from './utils';

// Re-export normalize for convenience
export { normalize } from '../utils/responsive';
