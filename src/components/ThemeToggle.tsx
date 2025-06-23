import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { currentTheme, storeActions } from '../store';

export const ThemeToggle = () => {
  const theme = currentTheme.value;
  
  console.log('ThemeToggle rendered with theme:', theme);

  const handlePress = () => {
    console.log('ThemeToggle pressed, current theme:', theme);
    storeActions.toggleTheme();
  };
  
  return (
    <View>
      <TouchableOpacity 
        style={[
          styles.container,
          { backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0' }
        ]} 
        onPress={handlePress}
      >
        <Text style={[
          styles.text,
          { color: theme === 'dark' ? '#fff' : '#333' }
        ]}>
          Current Theme: {theme}
        </Text>
        <Text style={[
          styles.subText,
          { color: theme === 'dark' ? '#ccc' : '#666' }
        ]}>
          Tap to toggle theme
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    marginTop: 4,
  },
}); 