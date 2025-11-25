import { normalize } from '@utils/responsive';
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronRight, Building2 } from 'lucide-react-native';
import { Icon } from '../../../components';
import { AppText } from '../../../components';

interface EventHostSectionProps {
  avatarUrl: string;
  hostName: string;
  eventsHosted: number;
  onViewProfile: () => void;
}

const EventHostSection: React.FC<EventHostSectionProps> = ({ avatarUrl, hostName, eventsHosted, onViewProfile }) => {
  return (
    <>
    <View style={styles.container}>
      <Icon icon={<Building2 />} size={15} color='white' backgroundColor='#0C0453' rounded padding={4} />
      <AppText variant='bodyBold' style={styles.label}>Organized by</AppText>
    </View>
    
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <AppText style={styles.hostName}>{hostName}</AppText>
        <AppText style={styles.eventsHosted}>{eventsHosted} events hosted</AppText>
      </View>
      <TouchableOpacity onPress={onViewProfile} style={styles.profileBtn}>
        <AppText style={styles.profileBtnText}>View profile</AppText>
        <ChevronRight color="#0C0433" size={16} />
      </TouchableOpacity>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: normalize(7),
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eee',
  },
  hostName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  eventsHosted: {
    color: '#666',
    fontSize: 13,
    marginTop: 0,
  },
  
  profileBtnText: {
    color: '#0C0453',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  label: {
    marginBottom: 6,
    marginLeft: normalize(16),
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(5),
  },
});

export default EventHostSection; 