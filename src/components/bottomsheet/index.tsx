import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, TouchableWithoutFeedback, View, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  heightPercent?: number; // e.g. 0.9 for 90% of screen
}

const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children, heightPercent = 1 }) => {
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      // Reset position before animating in
      translateY.setValue(height);
      Animated.timing(translateY, {
        toValue: height * (1 - heightPercent),
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (isMounted) {
      // Animate out, then unmount
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [visible, heightPercent, translateY, isMounted]);

  if (!isMounted) return null;

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.sheet,
          {
            height: height * heightPercent,
            transform: [{ translateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default BottomSheet; 