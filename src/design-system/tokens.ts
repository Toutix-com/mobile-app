import { Platform } from 'react-native';

// Design tokens with full color palette and simple utilities
export const tokens = {
  colors: {
    // Full color palette (keeping your existing structure)
    flashPurple: {
      1: '#FCFCFE',
      2: '#F6F7FF',
      3: '#EDF0FF',
      4: '#E1E6FF',
      5: '#D3DAFF',
      6: '#C3CCFF',
      7: '#ADB7FF',
      8: '#9199FF',
      9: '#5E50FF',
      10: '#5142E4',
      11: '#5142E4',
      12: '#272271',
    },
    flashGreen: {
      1: '#F9FDF9',
      2: '#F3FBF2',
      3: '#DFFADB',
      4: '#CAF6C5',
      5: '#B5EFAF',
      6: '#9DE496',
      7: '#7DD476',
      8: '#48C140',
      9: '#27D51D',
      10: '#05C900',
      11: '#018400',
      12: '#1B4218',
    },
    sageGreen: {
      1: '#FAFCFA',
      2: '#F4FAF4',
      3: '#E1F8DF',
      4: '#CEF4CC',
      5: '#BBEBB9',
      6: '#A7DFA6',
      7: '#8FCD8E',
      8: '#6CBA6C',
      9: '#8DF48D',
      10: '#7CEB7D',
      11: '#407D40',
      12: '#284328',
    },
    sereneTeal: {
      1: '#F8FCFE',
      2: '#F1FAFD',
      3: '#E4F2F7',
      4: '#D8EBF2',
      5: '#CEE5ED',
      6: '#C2DEE9',
      7: '#B1D4E1',
      8: '#96C3D3',
      9: '#00171F',
      10: '#173039',
      11: '#426977',
      12: '#09232C',
    },
    forestGreen: {
      1: '#F9FEF9',
      2: '#F2FBF4',
      3: '#E2F8E6',
      4: '#CFF3D6',
      5: '#B9ECC4',
      6: '#9DE3AD',
      7: '#74D58E',
      8: '#4ABD6E',
      9: '#30A85B',
      10: '#1D9B4F',
      11: '#008136',
      12: '#0D3F1F',
    },
    lemonYellow: {
      1: '#FDFCF7',
      2: '#FFFBE3',
      3: '#FFEF6E',
      4: '#FFEF6E',
      5: '#FFE52D',
      6: '#F4D72A',
      7: '#E2C839',
      8: '#CFB100',
      9: '#FFE500',
      10: '#FFDB00',
      11: '#8D7700',
      12: '#453D14',
    },
    cherryRed: {
      1: '#FEFBFB',
      2: '#FEF6F5',
      3: '#FEEAE7',
      4: '#FFDAD4',
      5: '#FFCBC4',
      6: '#FFBBB3',
      7: '#F7A69D',
      8: '#EE8B81',
      9: '#E13333',
      10: '#D21B23',
      11: '#D21F25',
      12: '#661715',
    },
    // Primary colors for the app
    oceanBlue: {
      1: '#FBFCFF',
      2: '#F5F8FF',
      3: '#EBF1FF',
      4: '#DDE7FF',
      5: '#CEDCFF',
      6: '#BCCEFF',
      7: '#A5BAFF',
      8: '#859EFF',
      9: '#0C0453', // Main color for the app
      10: '#1D2470',
      11: '#485ABC',
      12: '#1E2572',
    },
    stoneNeutral: {
      0: '#FFFFFF',
      1: '#FAFBFD',
      2: '#F6F8FB',
      3: '#EDEFF4',
      4: '#E4E7ED',
      5: '#DCE0E7',
      6: '#D3D9E1',
      7: '#C7CED9',
      8: '#B2BBC8',
      9: '#0D1117',
      10: '#262A31',
      11: '#5C636E',
      12: '#1B2026',
    },

    // Simple semantic colors for easy usage
    primary: '#0C0453',
    secondary: '#8DF48D',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#0D1117',
    textSecondary: '#5C636E',
    textInverse: '#FFFFFF',
    border: '#EDEFF4',
    success: '#27D51D',
    warning: '#FFE500',
    error: '#E13333',
  },

  // Typography
  typography: {
    fontFamily: {
      primary: Platform.select({
        ios: 'System',
        android: 'GoogleSans',
        default: 'System',
      }),
      secondary: 'Inter',
    },

    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      bold: '600',
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    default: 6,
    full: 9999,
  },

} as const;

export type DesignTokens = typeof tokens;
export type ColorScale = keyof typeof tokens.colors.oceanBlue;
export type SpacingScale = keyof typeof tokens.spacing;
export type TypographyScale = keyof typeof tokens.typography.fontSize;
