import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EventPriceFooterProps {
  price: string;
}

const EventPriceFooter: React.FC<EventPriceFooterProps> = ({ price }) => {
  return (
    <View style={styles.footer}>
      <Text style={styles.price}>{`Tickets from ${price}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#fff',
    padding: 18,
    alignItems: 'center',
    zIndex: 100,
  },
  price: {
    fontWeight: '400',
    fontSize: 14,
    color: '#5C636E',
  },
});

export default EventPriceFooter; 