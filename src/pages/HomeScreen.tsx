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
  Animated,
  Modal,
  TouchableWithoutFeedback
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
  FileText,
  Baby,
  X
} from 'lucide-react-native';
import { normalize } from '../utils/responsive';
import { BlurView } from '@react-native-community/blur';
import { getEvents } from '../services/eventService';
import { Easing } from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { name: 'Music', icon: Music },
  { name: 'Theater', icon: Drama },
  { name: 'Sports', icon: Dribbble },
  { name: 'Family', icon: Baby },
  { name: 'Workshops', icon: FileText },
  { name: 'Saved', icon: Heart },
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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter modal state and animation
  const [filterVisible, setFilterVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  // Filter options (mock data)
  const cityOptions = ['South Carolina', 'Texas', 'California', 'Florida', 'New York'];
  const venueOptions = [
    'Indiana Convention Center',
    'Dallas Exhibition Center',
    'Los Angeles Convention Center',
    'Miami Beach Convention Center',
    'Grand Central Terminal',
  ];
  const categoryOptions = ['Music', 'Theater', 'Sports', 'Family', 'Festivals', 'Workshops'];
  const dateOptions = ['Any date', 'This week', 'This weekend'];

  // Filter state
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('Any date');
  const [endDate, setEndDate] = useState('Any date');

  // Open filter: reset animation and show modal
  const openFilter = () => {
    slideAnim.setValue(-width);
    setFilterVisible(true);
  };

  // Close filter: animate out, then hide modal
  const handleCloseFilter = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => setFilterVisible(false));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredEvents.length > 1) {
        const nextIndex = (activeIndex + 1) % featuredEvents.length;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [activeIndex, featuredEvents.length]);

  useEffect(() => {
    if (filterVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [filterVisible]);

  const loadMoreEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const apiResponse = await getEvents(offset, LIMIT);
      console.log(apiResponse,"apiResponse");
      
      const newEvents = apiResponse?.data?.list || [];
      
      if (newEvents.length > 0) {
        const formattedEvents = newEvents.map((event: any) => {
          const eventDate = new Date(event.startTimeStamp || new Date());
          const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const day = eventDate.getDate();

          let tag = null;
          if (event.status) {
            const tagData = event.status;
            if (tagData === 'PUBLISHED') {
              tag = { text: 'Published', color: '#5A677D' };
            } else if (tagData === 'SOLD_OUT') {
              tag = { text: 'Sold out', color: '#B08F2B' };
            }
          }

          return {
            id: event.id,
            title: event.name || 'Untitled Event',
            venue: event.location?.name || '',
            price: event.price_range || 'N/A',
            image: event.image,
            date: { month, day },
            tag: tag,
            isLiked: false,
            category: event.category,
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

  const filteredEvents = selectedCategory
    ? moreEvents.filter(event => event.category?.name === selectedCategory)
    : moreEvents;

  // Checkbox handler
  const toggleSelection = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Radio handler
  const selectRadio = (value: string, setter: (v: string) => void) => {
    setter(value);
  };

  // Apply filters (placeholder)
  const handleApplyFilters = () => {
    // TODO: Connect to event filtering logic
    handleCloseFilter();
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
                <TouchableOpacity style={styles.filterButton} onPress={openFilter}>
                  <SlidersHorizontal color="#fff" size={normalize(20)} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.categoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.name && { backgroundColor: '#0C0453' }
                    ]}
                    onPress={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                  >
                    <category.icon color={selectedCategory === category.name ? "#fff" : "#333"} size={normalize(18)} />
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category.name && { color: '#fff' }
                    ]}>
                      {category.name}
                    </Text>
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
        data={filteredEvents}
        renderItem={({ item }) => <MoreEventCard event={item} />}
        keyExtractor={item => item.id}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.gap}/>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="none"
        transparent
        onRequestClose={handleCloseFilter}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Overlay */}
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
            activeOpacity={1}
            onPress={handleCloseFilter}
          />
          {/* Sliding Panel */}
          <Animated.View
            style={{
              width: width,
              backgroundColor: '#fff',
              transform: [{ translateX: slideAnim }],
              padding: 20,
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{  marginTop: normalize(50) }}>
              <TouchableOpacity onPress={handleCloseFilter}>
                <X color="#000" size={normalize(20)} />
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', fontSize: 22, marginTop:normalize(20) }}>Filter events</Text>
            </View>

            {/* Cities */}
            <Text style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(30), marginBottom: normalize(10), color: '#444' }}>Cities</Text>
            {cityOptions.map(city => (
              <TouchableOpacity
                key={city}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => toggleSelection(city, selectedCities, setSelectedCities)}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#1a237e',
                  marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: selectedCities.includes(city) ? '#1a237e' : '#fff'
                }}>
                  {selectedCities.includes(city) && <View style={{ width: 12, height: 12, backgroundColor: '#fff', borderRadius: 2, justifyContent: 'center', alignItems: 'center', }} />}
                </View>
                <Text style={{ color: '#222', fontSize: 15 }}>{city}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ marginBottom: 16 }}>
              <Text style={{ color: '#2a2aee', textDecorationLine: 'underline', fontSize: 15 }}>Show all cities</Text>
            </TouchableOpacity>

            {/* Venues */}
            <Text style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(10), marginBottom: normalize(10), color: '#444' }}>Venues</Text>
            {venueOptions.map(venue => (
              <TouchableOpacity
                key={venue}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => toggleSelection(venue, selectedVenues, setSelectedVenues)}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#1a237e',
                  marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: selectedVenues.includes(venue) ? '#1a237e' : '#fff'
                }}>
                  {selectedVenues.includes(venue) && <View style={{ width: 12, height: 12, backgroundColor: '#fff', borderRadius: 2 }} />}
                </View>
                <Text style={{ color: '#222', fontSize: 15 }}>{venue}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ marginBottom: 16 }}>
              <Text style={{ color: '#2a2aee', textDecorationLine: 'underline', fontSize: 15 }}>Show all venues</Text>
            </TouchableOpacity>

            {/* Categories */}
            <Text style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(10), marginBottom: normalize(10), color: '#444' }}>Categories</Text>
            {categoryOptions.map(category => (
              <TouchableOpacity
                key={category}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#1a237e',
                  marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: selectedCategories.includes(category) ? '#1a237e' : '#fff'
                }}>
                  {selectedCategories.includes(category) && <View style={{ width: 12, height: 12, backgroundColor: '#fff', borderRadius: 2 }} />}
                </View>
                <Text style={{ color: '#222', fontSize: 15 }}>{category}</Text>
              </TouchableOpacity>
            ))}

            {/* Start date */}
            <Text style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(18), marginBottom: normalize(10), color: '#444' }}>Start date</Text>
            {dateOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => selectRadio(opt, setStartDate)}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#1a237e',
                  marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
                }}>
                  {startDate === opt && <View style={{ width: 12, height: 12, backgroundColor: '#1a237e', borderRadius: 6 }} />}
                </View>
                <Text style={{ color: '#222', fontSize: 15 }}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ marginBottom: 8 }}>
              <Text style={{ color: '#2a2aee', textDecorationLine: 'underline', fontSize: 15 }}>Choose a date</Text>
            </TouchableOpacity>

            {/* End date */}
            <Text style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(18), marginBottom: normalize(10), color: '#444' }}>End date</Text>
            {dateOptions.map(opt => (
              <TouchableOpacity
                key={opt}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => selectRadio(opt, setEndDate)}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#1a237e',
                  marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
                }}>
                  {endDate === opt && <View style={{ width: 12, height: 12, backgroundColor: '#1a237e', borderRadius: 6 }} />}
                </View>
                <Text style={{ color: '#222', fontSize: 15 }}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ marginBottom: 16 }}>
              <Text style={{ color: '#2a2aee', textDecorationLine: 'underline', fontSize: 15 }}>Choose a date</Text>
            </TouchableOpacity>

            {/* Footer buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: normalize(30), marginBottom: normalize(20) }}>
              <TouchableOpacity
                onPress={handleCloseFilter}
                style={{ flex: 1, marginRight: 10, backgroundColor: '#f5f5f5', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#0C0453', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApplyFilters}
                style={{ flex: 1, marginLeft: 10, backgroundColor: '#0C0453', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Apply filters</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
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
  gap:{
    height: normalize(100),
  }
});

export default HomeScreen; 