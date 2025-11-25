import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { normalize } from '@utils/responsive';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface EventMapProps {
  lat: number;
  lon: number;
  name: string;
  address?: string;
  onPress?: () => void;
}

const EventMap: React.FC<EventMapProps> = ({ lat, lon, name, address, onPress }) => {
  
  // Validate coordinates
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid coordinates</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsIndoors={true}
        mapType="standard"
        loadingEnabled={false}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#ffffff"
        googleRenderer="LEGACY"
        
      >
        <Marker 
          coordinate={{ latitude: lat, longitude: lon }} 
          title={name}
          description={address}
          onPress={onPress}
        />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: '#666',
    fontSize: 14,
  },
});

export default EventMap; 