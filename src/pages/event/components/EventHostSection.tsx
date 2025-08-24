import { normalize } from '@utils/responsive';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface EventHostSectionProps {
  avatarUrl: string;
  hostName: string;
  eventsHosted: number;
  onViewProfile: () => void;
}

const EventHostSection: React.FC<EventHostSectionProps> = ({ avatarUrl, hostName, eventsHosted, onViewProfile }) => {
  return (
    <>
    <Text style={styles.label}>Organized by</Text>
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.hostName}>{hostName}</Text>
        <Text style={styles.eventsHosted}>{eventsHosted} events hosted</Text>
      </View>
      <TouchableOpacity onPress={onViewProfile} style={styles.profileBtn}>
        <Text style={styles.profileBtnText}>View profile</Text>
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
    marginTop: 2,
  },
  
  profileBtnText: {
    color: '#0C0453',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1B2026',
    marginBottom: 6,
    marginLeft: normalize(16),
    marginTop: normalize(10),
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(5),
  },
});

export default EventHostSection; 