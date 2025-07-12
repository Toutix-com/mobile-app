import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

const Divider = ({dividerStyle}: {dividerStyle: StyleProp<ViewStyle>}) => {
  return <View style={[styles.divider, dividerStyle]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});

export default Divider;
