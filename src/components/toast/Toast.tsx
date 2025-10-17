import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { CheckCircle, XCircle, Info, X } from 'lucide-react-native';
import { normalize } from '../../utils/responsive';
import { ToastMessage, ToastType } from './ToastStore';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto slide out before removal
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onRemove(toast.id);
      });
    }, toast.duration! - 300);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, slideAnim, opacityAnim, onRemove]);

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'info':
      default:
        return styles.infoToast;
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="#fff" size={20} />;
      case 'error':
        return <XCircle color="#fff" size={20} />;
      case 'info':
      default:
        return <Info color="#fff" size={20} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(toast.type),
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.toastContent}>
        <View style={styles.iconContainer}>
          {getIcon(toast.type)}
        </View>
        <Text style={styles.toastText} numberOfLines={2}>
          {toast.message}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onRemove(toast.id)}
        >
          <X color="#fff" size={16} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    marginHorizontal: normalize(16),
    marginVertical: normalize(4),
    borderRadius: normalize(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    backgroundColor: '#10B981', // Green
  },
  errorToast: {
    backgroundColor: '#EF4444', // Red
  },
  infoToast: {
    backgroundColor: '#3B82F6', // Blue
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
  },
  iconContainer: {
    marginRight: normalize(12),
  },
  toastText: {
    flex: 1,
    color: '#fff',
    fontSize: normalize(14),
    fontWeight: '500',
    lineHeight: normalize(20),
  },
  closeButton: {
    marginLeft: normalize(12),
    padding: normalize(4),
  },
});

export default Toast;

