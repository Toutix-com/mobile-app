import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../../../utils/responsive';
import type { PaymentMethod } from '../store/profile.store';
import { ChevronRight } from 'lucide-react-native';
import { AppText } from '../../../components';

const brandStyles: Record<string, { bg: string; fg: string; label: string }> = {
  visa: { bg: '#1A1F71', fg: '#fff', label: 'VISA' },
  mastercard: { bg: '#EA001B', fg: '#fff', label: 'MC' },
  amex: { bg: '#2E77BC', fg: '#fff', label: 'AMEX' },
  generic: { bg: '#DADDE6', fg: '#0C0453', label: 'CARD' },
};

interface Props {
  method: PaymentMethod;
  onPress?: () => void;
}

const PaymentMethodItem: React.FC<Props> = ({ method, onPress }) => {
  const badge = brandStyles[method.brand] || brandStyles.generic;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.brandBadge, { backgroundColor: badge.bg }]}> 
        <AppText style={[styles.brandText, { color: badge.fg }]}>{badge.label}</AppText>
      </View>
      <View style={styles.info}>
        <AppText style={styles.nickname}>{method.nickname}</AppText>
        <AppText style={styles.meta}>{`•••• ${method.last4}`}</AppText>
      </View>
      <ChevronRight color="#0C0453" size={normalize(18)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F0FF',
    padding: normalize(12),
    borderRadius: normalize(12),
  },
  brandBadge: {
    width: normalize(44),
    height: normalize(28),
    borderRadius: normalize(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '800',
    fontSize: normalize(12),
  },
  info: {
    flex: 1,
    marginLeft: normalize(12),
  },
  nickname: {
    color: '#0C0453',
    fontWeight: '600',
    fontSize: normalize(14),
  },
  meta: {
    color: '#5A677D',
    fontSize: normalize(12),
    marginTop: normalize(2),
  },
});

export default PaymentMethodItem; 