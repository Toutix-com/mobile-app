import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Search,
  SlidersHorizontal,
  Music,
  Drama,
  Dribbble,
  Users,
  ArrowRight,
  Heart,
} from 'lucide-react-native';
import { normalize } from '../utils/responsive';
import { BlurView } from '@react-native-community/blur';
import { getEvents } from '../services/eventService';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Music', icon: Music },
  { name: 'Theater', icon: Drama },
  { name: 'Sports', icon: Dribbble },
  { name: 'Family', icon: Users },
];

const featuredEvents = [
  {
    id: '1',
    title: 'Moshing music fest - 2025',
    venue: 'Belgrave Music hall',
    date: 'August 13 2025 at 3:30 AM',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  },
  {
    id: '2',
    title: 'Indie Rock Concert',
    venue: 'The Garage',
    date: 'September 5 2025 at 8:00 PM',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  },
];

const MoreEventCard = ({ event }: { event: any }) => (
  <View style={styles.moreEventCard}>
    <ImageBackground
      source={{ uri: event.image }}
      style={styles.moreEventImage}
      imageStyle={{ borderRadius: normalize(15) }}>
      <View style={styles.imageOverlay}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{event.date.month}</Text>
          <Text style={styles.dateDay}>{event.date.day}</Text>
        </View>
        <TouchableOpacity style={styles.heartButton}>
          <Heart
            size={normalize(22)}
            color={event.isLiked ? '#FF6B6B' : 'white'}
            fill={event.isLiked ? '#FF6B6B' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
    <View style={styles.moreEventDetailsRow}>
      <View style={styles.moreEventInfo}>
        <Text style={styles.moreEventTitle}>{event.title}</Text>
      </View>
      {event.tag && (
        <View style={[styles.tagContainer, { backgroundColor: event.tag.color }]}>
          <Text style={styles.tagText}>{event.tag.text}</Text>
        </View>
      )}
    </View>
    <Text style={styles.moreEventVenue}>{event.venue}</Text>
    <Text style={styles.moreEventPrice}>{event.price}</Text>
  </View>
);

const HomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const [moreEvents, setMoreEvents] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 9;

  const loadMoreEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const apiResponse = await getEvents(offset, LIMIT);
      console.log(apiResponse,"apiResponse");
      
      const newEvents = apiResponse?.data?.list || [];
      
      if (newEvents.length > 0) {
        const formattedEvents = newEvents.map((event: any) => {
          const eventDate = new Date(event.start_date_time || new Date());
          const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const day = eventDate.getDate();

          let tag = null;
          if (event.tags && event.tags.length > 0) {
            const tagData = event.tags[0];
            if (tagData.name?.toLowerCase() === 'resale') {
              tag = { text: 'Resale', color: '#5A677D' };
            } else if (tagData.name?.toLowerCase() === 'limited tickets') {
              tag = { text: 'Limited tickets', color: '#B08F2B' };
            }
          }

          return {
            id: event.id,
            title: event.name || 'Untitled Event',
            venue: event.venue?.name || 'TBA',
            price: event.price_range || 'N/A',
            image: event.images?.[0]?.url || 'https://i.imgur.com/KzX9efA.jpeg',
            date: { month, day },
            tag: tag,
            isLiked: false,
          };
        });

        setMoreEvents(prev => [...prev, ...formattedEvents]);
        setOffset(prev => prev + LIMIT);
        if (newEvents.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more events", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  useEffect(() => {
    loadMoreEvents();
  }, [loadMoreEvents]);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 51 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const handleNextPress = () => {
    if (activeIndex < featuredEvents.length - 1) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: activeIndex + 1,
      });
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#0C0453" />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.searchContainer}>
                <Search color="#666" size={normalize(20)} />
                <TextInput
                  placeholder="Search events"
                  style={styles.searchInput}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity style={styles.filterButton}>
                  <SlidersHorizontal color="#fff" size={normalize(20)} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.categoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category, index) => (
                  <TouchableOpacity key={index} style={styles.categoryChip}>
                    <category.icon color="#333" size={normalize(18)} />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured events</Text>
              <FlatList
                ref={flatListRef}
                horizontal
                data={featuredEvents}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.featuredCardContainer}>
                    <ImageBackground
                      source={{ uri: item.image }}
                      style={styles.featuredCard}
                      imageStyle={{ borderRadius: normalize(20) }}>
                      <View style={styles.featuredCardOverlay}>
                        <BlurView
                          style={StyleSheet.absoluteFill}
                          blurType="light"
                          blurAmount={10}
                        />
                        <View>
                          <Text style={styles.featuredTitle}>{item.title}</Text>
                          <Text style={styles.featuredVenue}>{item.venue}</Text>
                          <Text style={styles.featuredDate}>{item.date}</Text>
                        </View>
                        <TouchableOpacity style={styles.arrowButton} onPress={handleNextPress}>
                          <ArrowRight color="#0C0453" size={normalize(24)} />
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  </View>
                )}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
              />
              <View style={styles.pagination}>
                {featuredEvents.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeIndex === index ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>More events for you</Text>
            </View>
          </>
        }
        data={moreEvents}
        renderItem={({ item }) => <MoreEventCard event={item} />}
        keyExtractor={item => item.id}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingTop: normalize(50),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(20),
    marginTop: normalize(30),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(30),
    paddingLeft: normalize(15),
    paddingRight: normalize(5),
    paddingVertical: normalize(5),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    height: normalize(50),
    fontSize: normalize(16),
    color: '#333',
  },
  filterButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    backgroundColor: '#0C0453',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingLeft: normalize(20),
    marginBottom: normalize(20),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(20),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    marginRight: normalize(10),
    elevation: 1,
     shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  categoryText: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#333',
  },
  section: {
    marginBottom: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(15),
  },
  featuredCardContainer: {
    width: width,
    paddingHorizontal: normalize(20),
  },
  featuredCard: {
    width: '100%',
    height: normalize(220),
    justifyContent: 'flex-end',
    borderRadius: normalize(20),
    overflow: 'hidden',
  },
  featuredCardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: normalize(20),
    marginHorizontal: normalize(10),
    marginBottom: normalize(10),
    padding: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  featuredTitle: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: normalize(20),
    fontWeight: 'bold',
  },
  featuredVenue: {
    color: '#E0E0E0',
    fontSize: normalize(16),
    marginTop: normalize(4),
  },
  featuredDate: {
    color: '#E0E0E0',
    fontSize: normalize(14),
    marginTop: normalize(4),
  },
  arrowButton: {
    backgroundColor: '#BCCEFF',
    padding: normalize(12),
    borderRadius: normalize(22),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(15),
  },
  dot: {
    height: normalize(8),
    borderRadius: normalize(4),
    marginHorizontal: normalize(4),
  },
  activeDot: {
    backgroundColor: '#0C0453',
    width: normalize(20),
  },
  inactiveDot: {
    backgroundColor: '#D8D8D8',
    width: normalize(8),
  },
  moreEventsContainer: {
    paddingHorizontal: normalize(20),
    marginTop: normalize(20),
  },
  moreEventCard: {
    marginBottom: normalize(25),
    paddingHorizontal: normalize(20),
  },
  moreEventImage: {
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
  moreEventDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: normalize(4),
  },
  moreEventInfo: {
    flex: 1,
  },
  moreEventTitle: {
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
  moreEventVenue: {
    fontSize: normalize(16),
    color: '#5A677D',
    marginBottom: normalize(6),
  },
  moreEventPrice: {
    fontSize: normalize(16),
    color: '#1C1C1E',
    fontWeight: '500',
  },
});

export default HomeScreen; 