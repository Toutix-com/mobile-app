import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Divider from '../../components/divider';
import { useNavigation } from '@react-navigation/native';
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
import { categories, featuredEvents } from '../../contants/HomeConstant';
import AllCitiesBottomSheet from './components/AllCitiesBottomSheet';
import AllVenuesBottomSheet from './components/AllVenuesBottomSheet';
import FilterModal from './components/FilterModal';
import DatePickerBottomSheet from './components/DatePickerBottomSheet';
import EventCard from '../../components/EventCard';
import { startDate, endDate,
      selectedCategories, setEndDate, setSelectedCities, 
      setSelectedCategories,
      allCities, allVenues, setAllCities, setAllVenues,
      filteredCities, selectVenue, deselectVenue, clearSelectedVenues, citySearch, setCitySearch, moreEvents, setMoreEvents, offset, hasMore, setOffset, setHasMore,
      } from './store/home.store';
import { 
  selectedCities,
  setStartDate, setDateType, allCitiesSheetOpen, selectedVenues, filteredVenues, allVenuesSheetOpen,
  setSelectedVenues, venueSearch, setVenueSearch,
  loading, setLoading,
  filterVisible, setFilterVisible, dateSheetOpen, setDateSheetOpen, activeIndex, setActiveIndex,
  calendarMonth, calendarYear, setCalendarMonth, setCalendarYear,
  loadMoreEvents, handleNextPress, openFilter, handleShowAllCities, handleShowAllVenues,
  handleUseSelectedCities, handleUseSelectedVenues, handleClearVenues,
  clearAllFilters, mapFilteredAllCities, mapFilteredAllVenues, getFilteredEvents,
  hasActiveFilters, initializeData, initializeSelectedItems, handleSelectVenueInSheet
} from './store/home.store';
import { useSignals } from '@preact/signals-react/runtime';
import { fetchEventById } from '../event/store/event.store';
import { userStore } from '@pages/login/store/login.store';
import { Button, AppText, Icon } from '../../components';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  useSignals();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const LIMIT = 9;

  const isLoggedIn = userStore.value.email || (userStore.value as any).mobileNumber;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    clearAllFilters()
    initializeData();
    initializeSelectedItems();
    loadMoreEvents();
    console.log("hasActiveFilters", hasActiveFilters());
    
  }, []);




  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredEvents.length > 1) {
        const nextIndex = (activeIndex.value + 1) % featuredEvents.length;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [activeIndex.value, featuredEvents.length]);


  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 51 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const renderFooter = () => {
    if (!loading.value) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} size="large" color="#0C0453" />;
  };

  useEffect(() => {
    mapFilteredAllCities();
  }, [selectedCities.value]);

  useEffect(() => {
    mapFilteredAllVenues();
  }, [selectedVenues.value]);

  const filteredEvents = getFilteredEvents(selectedCategory);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setOffset(0);
      setHasMore(true);
      setMoreEvents([]);
      await initializeData();
      await loadMoreEvents();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Button 
                variant="ghost"
                style={styles.searchContainer} 
                onPress={() => (navigation as any).navigate('Search')}
              >
                <View style={styles.searchContent}>
                  <Icon icon={<Search />} size="md" color="#666" />
                  <TextInput
                    placeholder="Search events"
                    style={styles.searchInput}
                    placeholderTextColor="#666"
                    editable={false}
                    pointerEvents="none"
                  />
                  <Icon 
                    icon={<SlidersHorizontal />} 
                    size="md" 
                    color="#fff"
                    backgroundColor="#0C0453"
                    rounded
                    padding={12}
                    onPress={openFilter}
                  />
                </View>
              </Button>
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
                      <AppText style={[
                        styles.categoryText,
                        selectedCategory === category.name ? { color: '#fff' } : {}
                      ]}>
                        {category.name}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {!hasActiveFilters() && (
              <View style={styles.section}>
                <AppText style={[styles.sectionTitle, { marginBottom: normalize(15) }]}>Featured events</AppText>
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
                            <AppText style={styles.featuredTitle}>{item.title}</AppText>
                            <AppText style={styles.featuredVenue}>{item.venue}</AppText>
                            <AppText style={styles.featuredDate}>{item.date}</AppText>
                          </View>
                          <Icon 
                            icon={<ArrowRight />}
                            size={24}
                            color="#0C0453"
                            backgroundColor="#BCCEFF"
                            rounded
                            padding={12}
                            onPress={() => handleNextPress(flatListRef)}
                          />
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
                        activeIndex.value === index ? styles.activeDot : styles.inactiveDot,
                      ]}
                    />
                  ))}
                </View>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(15) }}>
              {!hasActiveFilters() ? <AppText style={styles.sectionTitle}>More events for you</AppText> :
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View>
                    <AppText style={styles.sectionTitle}>Showing {filteredEvents.length} events</AppText>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: normalize(20) }}>
                    <Icon icon={<X />} size="md" color="#0C0453" />
                    <Button 
                      variant="ghost" 
                      onPress={clearAllFilters}
                      style={{ padding: 0 }}
                    >
                      <AppText style={{ color: '#0C0453', textDecorationLine: 'underline', fontSize: 15}}>Clear</AppText>
                    </Button>
                  </View>
                </View>}
            </View>
          </>
        }
        data={filteredEvents}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            onPress={async () => {
              try {
                await fetchEventById(item.id);
                (navigation as any).navigate('EventDetails');
              } catch (error) {
              }
            }}
            showTag={true}
            showPrice={true}
          />
        )}
        keyExtractor={item => item.id}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0C0453']}
            tintColor="#0C0453"
          />
        }
        ListFooterComponent={
          loading.value ? (
            <ActivityIndicator size="large" color="#0C0453" style={styles.loadingIndicator} />
          ) : null
        }
      />
      <View style={styles.gap} />

      {/* Filter Modal */}
      <FilterModal
        visible={filterVisible.value}
        onClose={() => setFilterVisible(false)}
        setSelectedVenues={setSelectedVenues}
        onShowAllCities={handleShowAllCities}
        onShowAllVenues={handleShowAllVenues}
        onShowDatePicker={(dateType: string) => {
          setDateType(dateType);
          setFilterVisible(false);
          setTimeout(() => {
            setDateSheetOpen(true);
          }, 100);
        }}
        onApplyFilters={() => {
          // Apply filters and show results
          getFilteredEvents(selectedCategory);
          setFilterVisible(false);
        }}
        onClearAllFilters={clearAllFilters}
        calendarMonth={calendarMonth.value}
        calendarYear={calendarYear.value}
        setCalendarMonth={setCalendarMonth}
        setCalendarYear={setCalendarYear}
      />

      {/* All Cities Bottom Sheet */}
      <AllCitiesBottomSheet
        visible={allCitiesSheetOpen.value}
        onClose={() => allCitiesSheetOpen.value = false}
        onUseSelected={() => {
          handleUseSelectedCities()
        }}
      />

      {/* All Venues Bottom Sheet */}
      <AllVenuesBottomSheet
        visible={allVenuesSheetOpen.value}
        onClose={() => allVenuesSheetOpen.value = false}
        filteredVenues={filteredVenues.value}
        onToggleVenue={handleSelectVenueInSheet}
        onClear={handleClearVenues}
        onUseSelected={handleUseSelectedVenues}
        venueSearch={venueSearch.value}
        setVenueSearch={setVenueSearch}
      />

      {/* Date Picker Bottom Sheet */}
      <DatePickerBottomSheet
        visible={dateSheetOpen.value}
        onClose={() => setDateSheetOpen(false)}
        onClear={() => { setStartDate(null); setDateSheetOpen(false); }}
        month={calendarMonth.value}
        year={calendarYear.value}
        setMonth={setCalendarMonth}
        setYear={setCalendarYear}
        onSelectStartDate={() => {
          setDateSheetOpen(false);
          setTimeout(() => {
            openFilter();
          }, 600);
        }}
        onSelectEndDate={() => {
          setDateSheetOpen(false);
          setTimeout(() => {
            openFilter();
          }, 600);
        }}
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
    minHeight: 60,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    height: normalize(50),
    fontSize: normalize(16),
    color: '#333',
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
  },
  loadingIndicator: {
    marginVertical: normalize(20),
  },
});

export default HomeScreen; 