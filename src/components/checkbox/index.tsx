import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CheckBoxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onPress, label, style, labelStyle }) => (
  <TouchableOpacity
    style={[styles.container, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <View style={styles.innerBox} />}
    </View>
    <Text style={[styles.label, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0C0453',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  boxChecked: {
    // Optionally change background if checked
  },
  innerBox: {
    width: 12,
    height: 12,
    backgroundColor: '#0C0453',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#222',
    fontSize: 15,
    marginLeft: 10,
  },
});

export default CheckBox;
