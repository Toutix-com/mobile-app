import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { normalize } from '../../../utils/responsive';

interface Props {
  image: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  price: string;
  onPress?: () => void;
}

const TicketListItem: React.FC<Props> = ({ image, title, dateLabel, timeLabel, price, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Image source={{ uri: image }} style={styles.thumb} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.subtitle}>{dateLabel}</Text>
          <Text style={styles.subtitle}>{timeLabel}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(16),
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(14),
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
    color: '#1B2026',
    fontWeight: '700',
    fontSize: normalize(14),
  },
  subtitle: {
    color: '#1B2026',
    fontSize: normalize(12),
    marginTop: normalize(2),
  },
  price: {
    color: '#5C636E',
    fontSize: normalize(14),
    fontWeight: '600',
    marginLeft: normalize(8),
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E7E7EA',
  },
});

export default TicketListItem;


