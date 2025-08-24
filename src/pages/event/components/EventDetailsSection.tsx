import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowMoreText from './ShowMoreText';

interface EventDetailsSectionProps {
  description: string;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Details</Text>
      <ShowMoreText text={description} numberOfLines={6} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 18,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
});

export default EventDetailsSection; 