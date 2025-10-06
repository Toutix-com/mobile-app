# Simple Design System

A lightweight, easy-to-use design system for the Toutix mobile app with minimal changes required.

## Quick Start

### 1. Import what you need

```typescript
import { tokens, getColor, getSpacing, normalize } from '../design-system';
```

### 2. Use in your existing StyleSheet

**Before:**
```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0C0453',
    padding: 16,
    borderRadius: 8,
  },
  text: {
    color: '#000000',
    fontSize: 16,
  },
});
```

**After:**
```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.colors.primary,
    padding: getSpacing('lg'),
    borderRadius: normalize(8),
  },
  text: {
    color: tokens.colors.text,
    fontSize: normalize(16),
  },
});
```

### 3. Use in dynamic styles

```typescript
const MyComponent = () => {
  return (
    <View style={{
      backgroundColor: tokens.colors.background,
      padding: getSpacing('md'),
    }}>
      <Text style={{
        color: tokens.colors.text,
        fontSize: normalize(16),
      }}>
        Hello World
      </Text>
    </View>
  );
};
```

## Available Tokens

### Colors

#### Simple Semantic Colors (Easy to use)
```typescript
tokens.colors.primary          // #0C0453 - Main brand color
tokens.colors.secondary        // #8DF48D - Secondary color
tokens.colors.background       // #FFFFFF - Main background
tokens.colors.surface          // #FFFFFF - Surface color
tokens.colors.text            // #0D1117 - Primary text
tokens.colors.textSecondary   // #5C636E - Secondary text
tokens.colors.textInverse     // #FFFFFF - Inverse text
tokens.colors.border          // #EDEFF4 - Border color
tokens.colors.success         // #27D51D - Success color
tokens.colors.warning         // #FFE500 - Warning color
tokens.colors.error          // #E13333 - Error color
```

#### Full Color Palette (Your existing structure)
```typescript
tokens.colors.oceanBlue[9]     // #0C0453 - Main brand color
tokens.colors.stoneNeutral[0]  // #FFFFFF - White
tokens.colors.stoneNeutral[9]  // #0D1117 - Dark text
tokens.colors.sageGreen[9]     // #8DF48D - Sage green
tokens.colors.cherryRed[9]     // #E13333 - Error red
tokens.colors.flashGreen[9]    // #27D51D - Success green
```

#### Using Palette Colors with Helper
```typescript
import { getPaletteColor } from '../design-system';

getPaletteColor('oceanBlue', 9)    // #0C0453
getPaletteColor('stoneNeutral', 0) // #FFFFFF
getPaletteColor('sageGreen', 9)    // #8DF48D
```

### Spacing
```typescript
getSpacing('xs')    // 4px
getSpacing('sm')    // 8px
getSpacing('md')    // 12px
getSpacing('lg')    // 16px
getSpacing('xl')    // 20px
getSpacing('2xl')   // 24px
```

### Typography
```typescript
getFontSize('sm')     // 14px
getFontSize('base')   // 16px
getFontSize('lg')     // 18px
getFontSize('xl')     // 20px
```

## Migration Strategy

### Phase 1: Start with new components
Use tokens in any new components you create.

### Phase 2: Gradual migration
When you touch existing components, replace hardcoded values with tokens.

### Phase 3: Full migration
Replace all hardcoded values across the app.

## Examples

### Button Component
```typescript
import { tokens, getSpacing, normalize } from '../design-system';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: tokens.colors.primary,
    padding: getSpacing('lg'),
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: tokens.colors.textInverse,
    fontSize: normalize(16),
    fontWeight: '600',
  },
});
```

### Input Component
```typescript
import { tokens, getSpacing, normalize } from '../design-system';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: normalize(8),
    padding: getSpacing('lg'),
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    fontSize: normalize(16),
  },
});
```

### Card Component
```typescript
import { tokens, getSpacing, normalize } from '../design-system';

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: normalize(12),
    padding: getSpacing('lg'),
    margin: getSpacing('md'),
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
});
```

## Benefits

- ✅ **Minimal changes** to existing code
- ✅ **Gradual adoption** - use when you want
- ✅ **Consistent colors** across the app
- ✅ **Responsive spacing** with normalize()
- ✅ **Type safety** with TypeScript
- ✅ **Easy to maintain** - change once, update everywhere

## Tips

1. **Start small** - Use tokens in new components first
2. **Be consistent** - Use the same spacing values for similar elements
3. **Use semantic names** - `tokens.colors.primary` instead of `tokens.colors.oceanBlue.9`
4. **Leverage utilities** - Use `getSpacing()` instead of hardcoded values
5. **Keep it simple** - Don't over-engineer, use what you need
