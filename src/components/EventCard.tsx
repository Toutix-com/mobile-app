import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Heart } from 'lucide-react-native';
import { normalize } from '../utils/responsive';
import moment from 'moment';

interface EventCardProps {
  event: {
    id: string;
    name: string;
    image: string;
    startTimeStamp: string;
    location?: {
      name: string;
    };
    price?: string;
    status?: string;
    tag?: {
      text: string;
      color: string;
    };
    isLiked?: boolean;
    minTicketPrice?: number;
    maxTicketPrice?: number;
  };
  onPress?: () => void;
  onFavoritePress?: (eventId: string) => void;
  showTag?: boolean;
  showPrice?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onPress, 
  onFavoritePress, 
  showTag = true,
  showPrice = true 
}) => {
  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(event.id);
    }
  };

  const formatPrice = () => {
    if (event.price) {
      return event.price;
    }
    if (event.minTicketPrice !== undefined && event.maxTicketPrice !== undefined) {
      return `$${event.minTicketPrice} - $${event.maxTicketPrice}`;
    }
    return 'Price not available';
  };

  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <ImageBackground
        source={{ uri: event.image }}
        style={styles.eventImage}
        imageStyle={{ borderRadius: normalize(15) }}>
        <View style={styles.imageOverlay}>
          <View style={styles.dateBox}>
            <Text style={styles.dateMonth}>{moment(event.startTimeStamp).format('MMM')}</Text>
            <Text style={styles.dateDay}>{moment(event.startTimeStamp).format('DD')}</Text>
          </View>
          <TouchableOpacity style={styles.heartButton} onPress={handleFavoritePress}>
            <Heart
              size={normalize(22)}
              color={event.isLiked ? '#FF6B6B' : 'white'}
              fill={event.isLiked ? '#FF6B6B' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.eventDetailsRow}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.name}</Text>
        </View>
        {showTag && event.status && event.tag && (
          <View style={[styles.tagContainer, { backgroundColor: event.tag.color }]}>
            <Text style={styles.tagText}>{event.tag.text}</Text>
          </View>
        )}
      </View>
      <Text style={styles.eventVenue}>{event.location?.name || 'Venue not available'}</Text>
      {showPrice && (
        <Text style={styles.eventPrice}>{formatPrice()}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: normalize(25),
    paddingHorizontal: normalize(20),
  },
  eventImage: {
    width: '100%',
    height: normalize(180),
    marginBottom: normalize(12),
  },
  imageOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(12),
  },
  dateBox: {
    backgroundColor: 'white',
    borderRadius: normalize(8),
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(50),
  },
  dateMonth: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: '#333',
  },
  dateDay: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  heartButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: normalize(4),
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#1C1C1E',
    flexWrap: 'wrap',
  },
  tagContainer: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(15),
    marginLeft: normalize(10),
  },
  tagText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: 'bold',
  },
  eventVenue: {
    fontSize: normalize(16),
    color: '#5A677D',
    marginBottom: normalize(6),
  },
  eventPrice: {
    fontSize: normalize(16),
    color: '#1C1C1E',
    fontWeight: '500',
  },
});

export default EventCard; 