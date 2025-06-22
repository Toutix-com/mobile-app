import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { normalize } from '../utils/responsive';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: normalize(20),
  },
});

export default ProfileScreen; 