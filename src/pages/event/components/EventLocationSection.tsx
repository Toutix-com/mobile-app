import { normalize } from '@utils/responsive';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface EventLocationSectionProps {
  venue: string;
  address: string;
  onShowMap: () => void;
  imageUrl: string;
}

const EventLocationSection: React.FC<EventLocationSectionProps> = ({ venue, address, onShowMap, imageUrl }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <Text style={styles.venue}>{venue}</Text>
      <Text style={styles.address} numberOfLines={2}>{address}</Text>
      <Image source={{ uri: imageUrl }} style={styles.mapImage} resizeMode="cover" />
      <TouchableOpacity style={styles.mapBtn} onPress={onShowMap}>
        <Text style={styles.mapBtnText}>Show on map</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1B2026',
    marginBottom: 6,
    marginTop: normalize(10),
  },
  venue: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0D1117',
    marginBottom: 2,
    marginTop: normalize(5),
  },
  address: {
    color: '#5C636E',
    fontSize: 14,
    marginBottom: 10,
  },
  mapBtn: {
    borderWidth: 1,
    borderColor: '#0C0453',
    borderRadius: 8,
    width: '100%',
    height: normalize(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
    marginBottom: normalize(10),
  },
  mapBtnText: {
    color: '#0C0453',
    fontWeight: '500',
    fontSize: 14,
  },
  mapImage: {
    width: '100%',
    height: normalize(120),
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default EventLocationSection; 