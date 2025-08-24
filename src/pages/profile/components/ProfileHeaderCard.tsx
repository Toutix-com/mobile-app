import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { profile } from '../store/profile.store';
import { normalize } from '../../../utils/responsive';
import { Pencil } from 'lucide-react-native';

const ProfileHeaderCard: React.FC = () => {
  useSignals();
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: profile.value.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{profile.value.name}</Text>
          <Text style={styles.email}>{profile.value.email}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Pencil color="#0C0453" size={normalize(16)} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailRow}>
        <Text style={styles.detailIcon}>📞</Text>
        <Text style={styles.detailText}>{profile.value.phone}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailIcon}>🗓️</Text>
        <Text style={styles.detailText}>{profile.value.dob}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailIcon}>📍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailText}>{profile.value.addressLine1}</Text>
          {!!profile.value.addressLine2 && (
            <Text style={styles.detailText}>{profile.value.addressLine2}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E9F0FF',
    borderRadius: normalize(12),
    padding: normalize(16),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: normalize(26),
    marginRight: normalize(12),
  },
  info: { flex: 1 },
  name: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#0C0453',
  },
  email: {
    marginTop: normalize(2),
    color: '#5A677D',
    fontSize: normalize(12),
  },
  editButton: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#D7DDEA',
    marginVertical: normalize(12),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: normalize(8),
  },
  detailIcon: {
    width: normalize(20),
    textAlign: 'center',
    marginRight: normalize(10),
  },
  detailText: {
    color: '#0C0453',
    fontSize: normalize(13),
  },
});

export default ProfileHeaderCard; 