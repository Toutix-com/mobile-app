import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface EventMapProps {
  imageUrl: string;
}

const EventMap: React.FC<EventMapProps> = ({ imageUrl }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.mapImage} resizeMode="cover" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

export default EventMap; 