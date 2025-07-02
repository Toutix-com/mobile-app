import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import Divider from '../../components/divider';
import moment from 'moment';
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
  X,
  MapPin,
  SearchIcon
} from 'lucide-react-native';
import { normalize } from '../../utils/responsive';
import { BlurView } from '@react-native-community/blur';
import { getEvents } from '../../services/eventService';
import BottomSheet from '../../components/bottomsheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AllCitiesBottomSheet from './components/AllCitiesBottomSheet';
import AllVenuesBottomSheet from './components/AllVenuesBottomSheet';
import FilterModal from './components/FilterModal';
import DatePickerBottomSheet from './components/DatePickerBottomSheet';
import { startDate, endDate, selectedCities, selectedCategories, selectedSubCategories, selectedBrands, selectedProducts, setStartDate, setEndDate, setSelectedCities, setSelectedCategories, setSelectedSubCategories } from './store/home.store';

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
          <Text style={styles.dateMonth}>{moment(event.startTimeStamp).format('MMM')}</Text>
          <Text style={styles.dateDay}>{moment(event.startTimeStamp).format('DD')}</Text>
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
        <Text style={styles.moreEventTitle}>{event.name}</Text>
      </View>
      {event.status && (
        <View style={[styles.tagContainer, { backgroundColor: event.tag?.color }]}>
          <Text style={styles.tagText}>{event.status}</Text>
        </View>
      )}
    </View>
    <Text style={styles.moreEventVenue}>{event.location?.name}</Text>
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

  // Filter options (mock data)
  const cityOptions = ['South Carolina', 'Texas', 'California', 'Florida', 'New York'];
  const venueOptions = [
    'Indiana Convention Center',
    'Dallas Exhibition Center',
    'Los Angeles Convention Center',
    'Miami Beach Convention Center',
    'Grand Central Terminal',
  ];

  const [allCitiesList] = useState([
    'South Carolina', 'Indiana', 'Alabama', 'Florida', 'Georgia', 'Ohio', 'Tennessee', 'Texas', 'California', 'Washington', 'New York', 'Illinois', 'North Carolina', 'Michigan', 'Dubai'
  ]);
  const [allVenuesList] = useState([
    'Indiana Convention Center', 'Dallas Exhibition Center', 'Los Angeles Convention Center', 'Miami Beach Convention Center', 'Grand Central Terminal', 'McCormick Place', 'Georgia World Congress Center', 'Orange County Convention Center', 'Las Vegas Convention Center', 'San Diego Convention Center', 'Phoenix Convention Center', 'Nashville Music City Center', 'Austin Convention Center', 'Denver Convention Center', 'Central Park'
  ]);

  // Replace selectedCities state
  type CityObj = { label: string; selected: boolean };
  const [selectedCities, setSelectedCities] = useState<CityObj[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityObj[]>([]);
  const [allCitiesSheetOpen, setAllCitiesSheetOpen] = useState(false);

  // Venues state
  type VenueObj = { label: string; selected: boolean };
  const [selectedVenues, setSelectedVenues] = useState<VenueObj[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<VenueObj[]>([]);
  const [allVenuesSheetOpen, setAllVenuesSheetOpen] = useState(false);

  const [citySearch, setCitySearch] = useState('');
  const [venueSearch, setVenueSearch] = useState('');

  // Date picker bottom sheet state
  const [dateSheetOpen, setDateSheetOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // For main filter: show first 5 cities plus any selected not in first 5
  const previewCities = allCitiesList.slice(0, 5);
  const extraSelectedCities = selectedCities.filter(city => city.selected && !previewCities.includes(city.label));
  const citiesToShow = [
    ...previewCities.map(label => selectedCities.find(city => city.label === label) || { label, selected: false }),
    ...extraSelectedCities
  ];

  // For main filter: show first 5 venues plus any selected not in first 5
  const previewVenues = allVenuesList.slice(0, 5);
  const extraSelectedVenues = selectedVenues.filter(venue => venue.selected && !previewVenues.includes(venue.label));
  const venuesToShow = [
    ...previewVenues.map(label => selectedVenues.find(venue => venue.label === label) || { label, selected: false }),
    ...extraSelectedVenues
  ];

  // On mount, initialize with 5 unselected cities if empty
  useEffect(() => {
    if (selectedCities.length === 0) {
      setSelectedCities(
        allCitiesList.slice(0, 5).map(city => ({ label: city, selected: false }))
      );
    }
    if (selectedVenues.length === 0) {
      setSelectedVenues(
        allVenuesList.slice(0, 5).map(venue => ({ label: venue, selected: false }))
      );
    }
  }, []);

  // Handle select in bottom sheet
  const handleSelectCityInSheet = (cityLabel: string) => {
    setSelectedCities(prev => {
      const exists = prev.find(city => city.label === cityLabel);
      if (exists) {
        // Toggle selection
        return prev.map(city =>
          city.label === cityLabel ? { ...city, selected: !city.selected } : city
        );
      } else {
        // Add new city as selected
        return [...prev, { label: cityLabel, selected: true }];
      }
    });
  };

  // Handle select venue in bottom sheet
  const handleSelectVenueInSheet = (venueLabel: string) => {
    setSelectedVenues(prev => {
      const exists = prev.find(venue => venue.label === venueLabel);
      if (exists) {
        // Toggle selection
        return prev.map(venue =>
          venue.label === venueLabel ? { ...venue, selected: !venue.selected } : venue
        );
      } else {
        // Add new venue as selected
        return [...prev, { label: venueLabel, selected: true }];
      }
    });
  };

  // Open filter: reset animation and show modal
  const openFilter = () => {
    setFilterVisible(true);
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

  const loadMoreEvents = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const apiResponse = await getEvents(offset, LIMIT);
      console.log(apiResponse, "apiResponse");

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

          console.log(event, "event.location");


          return {
            ...event,
            tag: tag,
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

  // Show all cities handler
  const handleShowAllCities = () => {
    setFilterVisible(false)
    console.log("handleShowAllCities");
    setTimeout(() => {
      setAllCitiesSheetOpen(true);
      setCitySearch('');
    }, 100);
  };

  // Show all venues handler
  const handleShowAllVenues = () => {
    setFilterVisible(false)
    console.log("handleShowAllVenues");
    setTimeout(() => {
      setAllVenuesSheetOpen(true);
      setVenueSearch('');
    }, 100);
  };

  const handleSheetChange = useCallback(() => {
    console.log("handleSheetChange");
  }, []);

  // Use selected handler
  const handleUseSelectedCities = () => {
    setAllCitiesSheetOpen(false);
    setTimeout(() => {
      openFilter()
    }, 600);
  };

  // Use selected venues handler
  const handleUseSelectedVenues = () => {
    setAllVenuesSheetOpen(false);
    setTimeout(() => {
      openFilter()
    }, 600);
  };

  // Clear selection handler
  const handleClearCities = () => {
    setSelectedCities(prev =>
      prev.map(city => ({ ...city, selected: false }))
    );
  };

  // Clear venues selection handler
  const handleClearVenues = () => {
    setSelectedVenues(prev =>
      prev.map(venue => ({ ...venue, selected: false }))
    );
  };

  // Clear all filters handler
  const clearAllFilters = () => {
    // Clear cities
    setSelectedCities(prev =>
      prev.map(city => ({ ...city, selected: false }))
    );

    // Clear venues
    setSelectedVenues(prev =>
      prev.map(venue => ({ ...venue, selected: false }))
    );

    // Clear categories
    setSelectedCategories([]);

    // Clear dates
    setStartDate(null);
    setEndDate(null);

    // Clear category chip
    setSelectedCategory(null);

    console.log('All filters cleared');
  };

  useEffect(() => {
    mapFilteredAllCities();
    console.log(filteredCities, "filteredCities");
  }, [selectedCities]);

  useEffect(() => {
    mapFilteredAllVenues();
    console.log(filteredVenues, "filteredVenues");
  }, [selectedVenues]);

  // Filtered city list for search
  const mapFilteredAllCities = () => {
    const filteredAllCities = allCitiesList.map(city => ({ label: city, selected: false }));

    const mergedCities = filteredAllCities.map(city => {
      const match = selectedCities.find(sel => sel.label === city.label);
      return {
        ...city,
        selected: match ? match.selected : city.selected
      };
    });

    setFilteredCities(mergedCities);
  }

  // Filtered venue list for search
  const mapFilteredAllVenues = () => {
    const filteredAllVenues = allVenuesList.map(venue => ({ label: venue, selected: false }));

    const mergedVenues = filteredAllVenues.map(venue => {
      const match = selectedVenues.find(sel => sel.label === venue.label);
      return {
        ...venue,
        selected: match ? match.selected : venue.selected
      };
    });

    setFilteredVenues(mergedVenues);
  }

  // Comprehensive filtering method
  const filterEvents = (events: any[]) => {
    return events.filter(event => {
      // 1. Filter by selected cities
      const selectedCityLabels = selectedCities
        .filter(city => city.selected)
        .map(city => city.label);
      if (selectedCityLabels.length > 0) {
        const eventCity = event.location?.city?.name;
        console.log(eventCity, "eventCity", event);
        if (!eventCity || !selectedCityLabels.includes(eventCity)) {
          return false;
        }
      }

      // 2. Filter by selected venues
      const selectedVenueLabels = selectedVenues
        .filter(venue => venue.selected)
        .map(venue => venue.label);

      if (selectedVenueLabels.length > 0) {
        const eventVenue = event.location?.name;
        if (!eventVenue || !selectedVenueLabels.includes(eventVenue)) {
          return false;
        }
      }

      // 3. Filter by selected categories
      const selectedCategoryNames = selectedCategories.value
        .filter(category => category !== '');

      if (selectedCategoryNames.length > 0) {
        const eventCategory = event.category?.name;
        if (!eventCategory || !selectedCategoryNames.includes(eventCategory)) {
          return false;
        }
      }

      // 4. Filter by start date
      if (startDate.value) {
        const eventStartDate = new Date(event.startTimeStamp);
        if (eventStartDate < startDate.value) {
          return false;
        }
      }

      // 5. Filter by end date
      if (endDate.value) {
        const eventEndDate = new Date(event.endTimeStamp);
        if (eventEndDate > endDate.value) {
          return false;
        }
      }

      // If all filters pass, include the event
      return true;
    });
  };

  // Get filtered events for display
  const getFilteredEvents = () => {
    // First apply category filter (from chip selection)
    let events = selectedCategory
      ? moreEvents.filter(event => event.category?.name === selectedCategory)
      : moreEvents;

    // Then apply all other filters from the filter modal
    events = filterEvents(events);

    return events;
  };

  const filteredEvents = getFilteredEvents();

  // Check if any filters are active
  const hasActiveFilters = () => {
    const hasCityFilters = selectedCities.some(city => city.selected);
    const hasVenueFilters = selectedVenues.some(venue => venue.selected);
    const hasCategoryFilters = selectedCategories.value.length > 0;
    const hasDateFilters = startDate.value !== null || endDate.value !== null;

    return hasCityFilters || hasVenueFilters || hasCategoryFilters || hasDateFilters || selectedCategory !== null;
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCities.some(city => city.selected)) count++;
    if (selectedVenues.some(venue => venue.selected)) count++;
    if (selectedCategories.value.length > 0) count++;
    if (startDate.value !== null) count++;
    if (endDate.value !== null) count++;
    if (selectedCategory !== null) count++;
    return count;
  };

  // Re-filter events when filter criteria change
  useEffect(() => {
    // This will trigger re-render with filtered events
    console.log('Filter criteria changed, re-filtering events...');
  }, [selectedCities, selectedVenues, selectedCategories.value, startDate.value, endDate.value, selectedCategory]);

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

            {!hasActiveFilters() && (
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
            )}

            {!hasActiveFilters() && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { marginBottom: normalize(15) }]}>Featured events</Text>
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
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(15) }}>
              {!hasActiveFilters() ? <Text style={styles.sectionTitle}>More events for you</Text> :
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View>
                    <Text style={styles.sectionTitle}>Showing {filteredEvents.length} events</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: normalize(20) }}>
                    <X color="#0C0453" size={normalize(20)} />
                    <TouchableOpacity onPress={clearAllFilters}>
                      <Text style={{ color: '#0C0453', textDecorationLine: 'underline', fontSize: 15}}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                </View>}
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
      <View style={styles.gap} />

      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
        selectedVenues={selectedVenues}
        setSelectedVenues={setSelectedVenues}
        allCitiesList={allCitiesList}
        allVenuesList={allVenuesList}
        onShowAllCities={handleShowAllCities}
        onShowAllVenues={handleShowAllVenues}
        onShowDatePicker={() => {
          setFilterVisible(false);
          setTimeout(() => {
            setDateSheetOpen(true);
          }, 100);
        }}
        onApplyFilters={() => {
          // Apply filters and show results
          const filtered = getFilteredEvents();
          console.log('Applied filters:', {
            selectedCities: selectedCities.filter(c => c.selected).map(c => c.label),
            selectedVenues: selectedVenues.filter(v => v.selected).map(v => v.label),
            selectedCategories: selectedCategories.value,
            startDate: startDate.value,
            endDate: endDate.value,
            totalEvents: moreEvents.length,
            filteredEvents: filtered.length,
            filteredEventsList: filtered.map(e => ({ name: e.name, city: e.location?.city?.name, venue: e.location?.name }))
          });
          setFilterVisible(false);
        }}
        onClearAllFilters={clearAllFilters}
        calendarMonth={calendarMonth}
        calendarYear={calendarYear}
        setCalendarMonth={setCalendarMonth}
        setCalendarYear={setCalendarYear}
      />

      {/* All Cities Bottom Sheet */}
      <AllCitiesBottomSheet
        visible={allCitiesSheetOpen}
        onClose={() => setAllCitiesSheetOpen(false)}
        filteredCities={filteredCities}
        onToggleCity={handleSelectCityInSheet}
        onClear={handleClearCities}
        onUseSelected={() => {
          handleUseSelectedCities()
        }}
        citySearch={citySearch}
        setCitySearch={setCitySearch}
      />

      {/* All Venues Bottom Sheet */}
      <AllVenuesBottomSheet
        visible={allVenuesSheetOpen}
        onClose={() => setAllVenuesSheetOpen(false)}
        filteredVenues={filteredVenues}
        onToggleVenue={handleSelectVenueInSheet}
        onClear={handleClearVenues}
        onUseSelected={handleUseSelectedVenues}
        venueSearch={venueSearch}
        setVenueSearch={setVenueSearch}
      />

      {/* Date Picker Bottom Sheet */}
      <DatePickerBottomSheet
        visible={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
        onClear={() => { setStartDate(null); setDateSheetOpen(false); }}
        month={calendarMonth}
        year={calendarYear}
        setMonth={setCalendarMonth}
        setYear={setCalendarYear}
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
  gap: {
    height: normalize(120),
  }
});

export default HomeScreen; 