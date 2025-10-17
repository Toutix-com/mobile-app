import { normalize } from '@utils/responsive';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import EventMap from './EventMap';
import { AppText } from '../../../components';

interface EventLocationSectionProps {
  venue: string;
  address: string;
  onShowMap: () => void;
  lat: number;
  lon: number;
}

const EventLocationSection: React.FC<EventLocationSectionProps> = ({ venue, address, onShowMap, lat, lon }) => {
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>Location</AppText>
      <AppText style={styles.venue}>{venue}</AppText>
      <AppText style={styles.address} numberOfLines={2}>{address}</AppText>
      {lat && lon && (
            <EventMap
              lat={lat}
              lon={lon}
              name={venue}
              address={address}
            />
          )}
      <TouchableOpacity style={styles.mapBtn} onPress={onShowMap}>
        <AppText style={styles.mapBtnText}>Show on map</AppText>
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