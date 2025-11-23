import { normalize } from '@utils/responsive';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import EventMap from './EventMap';
import { AppText, Icon } from '../../../components';
import { MapPin } from 'lucide-react-native';

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
      <View style={styles.locationContainer}>
        <Icon icon={<MapPin />} size={15} color='white' backgroundColor='#0C0453' rounded padding={4} />
        <AppText variant='bodyBold' style={styles.venue}>{venue}</AppText>
      </View>
      <AppText style={styles.address} numberOfLines={2}>{address}</AppText>
      
      {lat && lon && (
            <EventMap
              lat={lat}
              lon={lon}
              name={venue}
              address={address}
              onPress={onShowMap}
            />
          )}
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
    marginBottom: 2,
  },
  address: {
    color: '#5C636E',
    fontSize: 14,
    marginBottom: 10,
    paddingLeft: normalize(30),
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
    width: '100%',
  },
});

export default EventLocationSection; 