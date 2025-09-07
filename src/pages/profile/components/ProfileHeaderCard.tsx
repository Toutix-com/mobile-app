import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { userStore } from '../../login/store/login.store';
import { normalize } from '../../../utils/responsive';
import { Pencil, Phone , Cake, House} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileHeaderCard: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  const user = userStore.value;
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const formattedBirthday = user.birthday ? user.birthday.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }) : 'Not set';
  
  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.firstName?.[0] || user.lastName?.[0] || 'U'}
            </Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{user.email || 'No email'}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Pencil color="#0C0453" size={normalize(16)} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
        <Phone color='white' size={normalize(17)} />
        </View>
        
        <Text style={styles.detailText}>{user.contactNumber || 'No phone number'}</Text>
      </View>
      <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
        <Cake color='white' size={normalize(17)} />
        </View>
        <Text style={styles.detailText}>{formattedBirthday}</Text>
      </View>
      <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
        <House color='white' size={normalize(17)} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.detailText}>{user.address || 'No address'}</Text>
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
  avatarPlaceholder: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: normalize(26),
    marginRight: normalize(12),
    backgroundColor: '#D7DDEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#0C0453',
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
    width: normalize(25),
    height: normalize(25),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginRight: normalize(10),
    backgroundColor: '#1D2470',
    padding: normalize(5),
  },
  detailText: {
    color: '#0C0453',
    fontSize: normalize(13),
  },
});

export default ProfileHeaderCard; 