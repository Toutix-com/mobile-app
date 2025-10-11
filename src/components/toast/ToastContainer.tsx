import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { toastMessages, removeToast } from './ToastStore';
import Toast from './Toast';
import { normalize } from '../../utils/responsive';

const ToastContainer: React.FC = () => {
  useSignals();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toastMessages.value.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: normalize(100), // Above bottom tab bar
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});

export default ToastContainer;

