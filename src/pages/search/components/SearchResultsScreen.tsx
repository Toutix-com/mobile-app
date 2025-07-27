import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../../utils/responsive';
import { searchQuery, searchResults, clearSearchQuery, SearchResultEvent } from '../store/search.store';
import EventCard from '../../../components/EventCard';

const { width } = Dimensions.get('window');

const SearchResultsScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  const query = searchQuery.value;
  const results = searchResults.value;

  const handleBack = () => {
    clearSearchQuery();
    navigation.goBack();
  };

  const handleEventPress = (event: SearchResultEvent) => {
    // Navigate to event details
    // navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleFavoritePress = (eventId: string) => {
    // Toggle favorite status
    console.log('Toggle favorite for event:', eventId);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Showing {results.length} matched events for your search
        </Text>
      </View>

      {/* Results List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {results.map((event: SearchResultEvent) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => handleEventPress(event)}
            onFavoritePress={handleFavoritePress}
            showTag={true}
            showPrice={true}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default SearchResultsScreen; 