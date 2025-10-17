import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { normalize } from '../../../utils/responsive';
import { AppText } from '../../../components';

interface Props {
  image: string;
  title: string;
  subtitle: string;
  price: string;
}

const TicketHistoryItem: React.FC<Props> = ({ image, title, subtitle, price }) => {
  return (
    <View style={styles.row}>
      <Image source={{ uri: image }} style={styles.thumb} />
      <View style={styles.info}>
        <AppText style={styles.title} numberOfLines={1}>{title}</AppText>
        <AppText style={styles.subtitle}>{subtitle}</AppText>
      </View>
      <AppText style={styles.price}>{price}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
  },
  thumb: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(8),
    marginRight: normalize(12),
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#0C0453',
    fontWeight: '700',
    fontSize: normalize(14),
  },
  subtitle: {
    color: '#5A677D',
    fontSize: normalize(12),
    marginTop: normalize(2),
  },
  price: {
    color: '#0C0453',
    fontSize: normalize(14),
    fontWeight: '600',
  },
});

export default TicketHistoryItem; 