import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { normalize } from '@utils/responsive';
import ShowMoreText from './ShowMoreText';

interface EventTitleCardProps {
  title: string;
  date: string;
  time: string;
  onShowMore: () => void;
  isExpanded: boolean;
  description: string;
}

const EventTitleCard: React.FC<EventTitleCardProps> = ({ title, date, time, onShowMore, isExpanded, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.datetime}>{date} • {time}</Text>
      <Text style={styles.label}>Details</Text>
      <Text style={styles.description} numberOfLines={6}>{description}</Text>
      <TouchableOpacity style={styles.showMoreBtn} onPress={onShowMore}>
        <Text style={styles.showMoreText}>{'Show more'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: normalize(-18),
    marginBottom: 8,
    paddingHorizontal: 18,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginBottom: 4,
    marginTop: normalize(30),
  },
  datetime: {
    color: '#444',
    fontSize: 16,
    marginBottom: 8,
    marginTop: normalize(10),
  },
  showMoreBtn: {
    borderWidth: 1,
    borderColor: '#0C0453',
    borderRadius: 8,
    width: '100%',
    height: normalize(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(5),
  },
  showMoreText: {
    color: '#0C0453',
    fontWeight: '500',
    fontSize: 14,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1B2026',
    marginTop: normalize(10),
  },
  description: {
    color: '#0D1117',
    fontSize: 15,
    marginBottom: 8,
    marginTop: normalize(10),
    lineHeight: normalize(20),
  },
});

export default EventTitleCard; 