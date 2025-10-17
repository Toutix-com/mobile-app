import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components';

interface EventPriceFooterProps {
  price: string;
}

const EventPriceFooter: React.FC<EventPriceFooterProps> = ({ price }) => {
  return (
    <View style={styles.footer}>
      <AppText style={styles.price}>{`Tickets from ${price}`}</AppText>
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