import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { normalize } from '@utils/responsive';
import ShowMoreText from './ShowMoreText';
import { AppText, Icon } from '../../../components';
import { Calendar, CardSim, Ellipsis } from 'lucide-react-native';

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
      <AppText variant='h2' style={styles.title} numberOfLines={2}>{title}</AppText>
      <View style={styles.dateContainer}>
      <Icon icon={<Calendar />} size={15} color='white' backgroundColor='#0C0453' rounded padding={4} />
      <AppText variant='bodyBold'  style={styles.datetime}>{date} • {time}</AppText>
      </View>
      <View style={styles.detailsContainer}>
      <Icon icon={<CardSim />} size={15} color='white' backgroundColor='#0C0453' rounded padding={4} />
      <AppText variant='bodyBold' style={styles.label}>Details</AppText>
      </View>
      <View style={styles.descriptionContainer}>
      <AppText style={styles.description} numberOfLines={6}>{description}</AppText>
      <Icon icon={<Ellipsis />} size={20} color='#1B2026' padding={4} style={{alignSelf: 'flex-end'}} onPress={onShowMore} />
      </View>
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
    marginBottom: 8,
    marginTop: normalize(10),
  },
  description: {
    color: '#0D1117',
    fontSize: 15,
    marginBottom: 8,
    marginTop: normalize(10),
    lineHeight: normalize(20),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
    width: '90%',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
    width: '90%',
    marginTop: normalize(10),
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: normalize(10),
    marginTop: normalize(10),
    backgroundColor: '#F6F8FB',
  },
});

export default EventTitleCard; 