import React from 'react';
import { View, StyleSheet } from 'react-native';
import { normalize } from '@utils/responsive';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface EventMapProps {
  lat: number;
  lon: number;
  name: string;
  address?: string;
}

const EventMap: React.FC<EventMapProps> = ({ lat, lon, name, address }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude: lat, longitude: lon }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: normalize(180),
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default EventMap; 