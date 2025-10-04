import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { X, Search, MapPin, Building2, Calendar, Flame, ArrowLeft , ChevronLeft } from 'lucide-react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import {
  searchQuery,
  selectedCity,
  selectedVenue,
  selectedDate,
  selectedMonth,
  activeInputField,
  showTrending,
  showSuggestions,
  showNoResults,
  showCategories,
  trendingEvents,
  searchSuggestions,
  setSearchQuery,
  setSelectedCity,
  setSelectedVenue,
  setSelectedDate,
  setSelectedMonth,
  setActiveInputField,
  clearSearchQuery,
  clearAllFilters,
  citySheetOpen,
  venueSheetOpen,
  dateSheetOpen,
  citySearch,
  venueSearch,
  eventCount,
  setCitySheetOpen,
  setVenueSheetOpen,
  setDateSheetOpen,
  setCitySearch,
  setVenueSearch,
  updateEventCount,
  updateSearchSuggestions,
  handleInputFocus,
  performSearch,
  selectCategory,
  searchResults,
  selectedCategory,
  categoryResults,
  clearSelectedCategory,
  clearSearchResults,
} from './store/search.store';
import { moreEvents } from '../home/store/home.store';
import CitySelectionBottomSheet from './components/CitySelectionBottomSheet';
import VenueSelectionBottomSheet from './components/VenueSelectionBottomSheet';
import DatePickerBottomSheet from './components/DatePickerBottomSheet';
import EventCard from '../../components/EventCard';
import { Music, Drama, Dribbble, Baby, FileText, Heart } from 'lucide-react-native';
import { fetchEventById } from '@pages/event/store/event.store';

const { width, height } = Dimensions.get('window');

const categories = [
  { name: 'Music', icon: Music },
  { name: 'Theater', icon: Drama },
  { name: 'Sports', icon: Dribbble },
  { name: 'Family', icon: Baby },
  { name: 'Workshops', icon: FileText },
  { name: 'Saved', icon: Heart },
];

const SearchScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  
  // Local state to force re-render when suggestion is selected
  const [localSearchValue, setLocalSearchValue] = React.useState('');

  // Sync local state with signal changes
  React.useEffect(() => {
    setLocalSearchValue(searchQuery.value);
  }, [searchQuery.value]);

  // --- UI State Logic ---
  const isInputFocused = activeInputField.value === 'eventName';
  const query = searchQuery.value.trim();
  const isShowingResults = searchResults.value.length > 0 || categoryResults.value.length > 0;
  const currentCategory = selectedCategory.value;

  // Filter trendingEvents and moreEvents by query (case-insensitive, no duplicates)
  type SimpleEvent = { id: string; name: string };
  const filteredResults = React.useMemo(() => {
    const searchValue = localSearchValue || query;
    if (!searchValue) return [];
    const lower = searchValue.toLowerCase();
    const trending = (trendingEvents.value as SimpleEvent[]).filter((e: SimpleEvent) => e.name.toLowerCase().includes(lower));
    const more = (moreEvents.value as SimpleEvent[]).filter((e: SimpleEvent) => e.name && e.name.toLowerCase().includes(lower));
    const seen = new Set(trending.map((e: SimpleEvent) => e.id));
    const merged = [...trending, ...more.filter((e: SimpleEvent) => !seen.has(e.id))];
    return merged;
  }, [localSearchValue, query, trendingEvents.value, moreEvents.value]);

  // --- Render Logic ---
  // 1. Only categories if not focused
  const showOnlyCategories = !isInputFocused;
  // 2. Only trending if focused and empty
  const showOnlyTrending = isInputFocused && !(localSearchValue || query);
  // 3. Show search results if focused and has query
  const showSearchResults = isInputFocused && !!(localSearchValue || query);

  const handleClose = () => {
    if (isShowingResults) {
      // Clear results and go back to search form
      clearSearchQuery();
      clearSelectedCategory();
      clearSearchResults();
      setLocalSearchValue('');
    } else {
      navigation.goBack();
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleCancel = () => {
    clearSearchQuery();
    clearAllFilters();
    setLocalSearchValue('');
    setActiveInputField('');
  };

  // Override clearAllFilters to also clear local state
  const handleClearAllFilters = () => {
    clearAllFilters();
    setLocalSearchValue('');
  };

  const handleEventPress = async (event: any) => {
    await fetchEventById(event.id);
    navigation.navigate('EventDetails');
  };

  const handleFavoritePress = (eventId: string) => {
    // Toggle favorite status
    console.log('Toggle favorite for event:', eventId);
  };

      const handleSuggestionPress = (suggestion: string) => {
      console.log('suggestion', suggestion);  
      console.log('before setSearchQuery, searchQuery.value:', searchQuery.value);
      
      // Update both signal and local state
      setSearchQuery(suggestion);
      setLocalSearchValue(suggestion);
      console.log('after setSearchQuery, searchQuery.value:', searchQuery.value);
    };

  const handleTrendingPress = (trending: string) => {
    setSearchQuery(trending);
    setLocalSearchValue(trending);
  };

  const handleCityPress = () => {
    setCitySheetOpen(true);
  };

  const handleVenuePress = () => {
    setVenueSheetOpen(true);
  };

  const handleDatePress = () => {
    setDateSheetOpen(true);
  };

  const handleClearCity = () => {
    setSelectedCity('');
  };

  const handleClearVenue = () => {
    setSelectedVenue('');
  };

  const handleClearDate = () => {
    setSelectedDate('');
    setSelectedMonth('');
  };

  const handleUseSelectedCity = () => {
    setCitySheetOpen(false);
  };

  const handleUseSelectedVenue = () => {
    setVenueSheetOpen(false);
  };

  const handleUseSelectedDate = () => {
    setDateSheetOpen(false);
  };

  const getResultsTitle = () => {
    if (currentCategory) {
      return (
        <Text style={styles.resultsTitle}>
          Showing all <Text style={styles.boldText}>{currentCategory}</Text> <Text style={styles.boldText}>category</Text> events
        </Text>
      );
    }
    return (
      <Text style={styles.resultsTitle}>
        Showing <Text style={styles.boldText}>{searchResults.value.length}</Text> <Text style={styles.boldText}>matched</Text> events for your search
      </Text>
    );
  };

  const getResultsData = () => {
    if (currentCategory) {
      return categoryResults.value;
    }
    return searchResults.value;
  };

  return (
    <ScrollView style={styles.container}>
      {isShowingResults ? (
        // Results View with Gradient Header
        <View style={styles.resultsContainer}>
          <View style={styles.gradientContainer}>
            <View style={styles.gradientTop} />
            <View style={styles.gradientHeader}>
              <View style={styles.resultsHeader}>
                <TouchableOpacity onPress={handleClose} style={styles.backButtonResults}>
                  <ChevronLeft color="#000" size={24} />
                </TouchableOpacity>
                <View style={styles.resultsTitleContainer}>
                  {getResultsTitle()}
                </View>
              </View>
            </View>
            <View style={styles.gradientBottom} />
          </View>
          <ScrollView style={styles.resultsScrollView} showsVerticalScrollIndicator={false}>
            {getResultsData().map((event: any) => (
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
      ) : (
        // Search Form View
        <>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <ArrowLeft color="#000" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Search events</Text>

            <View style={styles.searchContainer}>
              {/* Event Name Search */}
              <View style={styles.inputContainer}>
                <Search color="#666" size={20} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { height: normalize(40) }]}
                  placeholder="Search an event name..."
                  placeholderTextColor="#666"
                  value={localSearchValue || searchQuery.value}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    setLocalSearchValue(text);
                  }}
                  onFocus={() => handleInputFocus('eventName')}
                  onBlur={() => setActiveInputField('')}
                />
                {(searchQuery.value || localSearchValue) && (
                  <TouchableOpacity onPress={() => {
                    clearSearchQuery();
                    setLocalSearchValue('');
                  }} style={styles.clearButton}>
                    <X color="#666" size={16} />
                  </TouchableOpacity>
                )}
              </View>

              {/* City Filter */}
              <TouchableOpacity style={styles.inputContainer} onPress={handleCityPress}>
                <MapPin color="#666" size={20} style={styles.inputIcon} />
                <Text style={[styles.input, selectedCity.value ? styles.selectedText : styles.placeholderText]}>
                  {selectedCity.value || 'Select a city...'}
                </Text>
                {selectedCity.value && (
                  <TouchableOpacity onPress={handleClearCity} style={styles.clearButton}>
                    <X color="#666" size={16} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Venue Filter */}
              <TouchableOpacity style={styles.inputContainer} onPress={handleVenuePress}>
                <Building2 color="#666" size={20} style={styles.inputIcon} />
                <Text style={[styles.input, selectedVenue.value ? styles.selectedText : styles.placeholderText]}>
                  {selectedVenue.value || 'Select a venue...'}
                </Text>
                {selectedVenue.value && (
                  <TouchableOpacity onPress={handleClearVenue} style={styles.clearButton}>
                    <X color="#666" size={16} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {/* Date Filter */}
              <TouchableOpacity style={styles.inputContainer} onPress={handleDatePress}>
                <Calendar color="#666" size={20} style={styles.inputIcon} />
                <Text style={[styles.input, (selectedDate.value || selectedMonth.value) ? styles.selectedText : styles.placeholderText]}>
                  {selectedDate.value || selectedMonth.value || 'Pick a date...'}
                </Text>
                {(selectedDate.value || selectedMonth.value) && (
                  <TouchableOpacity onPress={handleClearDate} style={styles.clearButton}>
                    <X color="#666" size={16} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>

            {/* Categories Section */}
            {showOnlyCategories && (
              <View style={styles.categoriesContainer}>
                <Text style={styles.categoriesTitle}>Browse by category</Text>
                <View style={styles.categoriesGrid}>
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.categoryButton}
                      onPress={() => {
                        selectCategory(category.name);
                      }}
                    >
                      <category.icon color="#0C0453" size={20} style={styles.categoryIcon} />
                      <Text style={styles.categoryText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trending Section */}
            {showOnlyTrending && (
              <View style={styles.trendingContainer}>
                <Text style={styles.trendingTitle}>Trending</Text>
                {trendingEvents.value.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.trendingItem}
                    onPress={() => {
                      console.log("asasas");
                      
                      handleSuggestionPress(event.name);
                    }}
                  >
                    <Flame color="#FF6B6B" size={16} style={styles.trendingIcon} />
                    <Text style={styles.trendingText}>{event.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Search Results Section */}
            {showSearchResults && (
              <View style={styles.suggestionsContainer}>
                {filteredResults.length > 0 ? (
                  filteredResults.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      style={styles.suggestionItem}
                      onPress={() => {
                        console.log('event', event);
                        handleSuggestionPress(event.name);
                      }}
                    >
                      <Search color="#666" size={16} style={styles.suggestionIcon} />
                      <Text style={styles.suggestionText}>{event.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      Sorry! couldn't find any event with this name
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>
                Search {eventCount.value > 0 ? `(${eventCount.value})` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: normalize(100) }} />

          </ScrollView>

          
        </>
      )}

      {/* City Selection Bottom Sheet */}
      <CitySelectionBottomSheet
        visible={citySheetOpen.value}
        onClose={() => setCitySheetOpen(false)}
        onUseSelected={handleUseSelectedCity}
        citySearch={citySearch.value}
        setCitySearch={setCitySearch}
      />

      {/* Venue Selection Bottom Sheet */}
      <VenueSelectionBottomSheet
        visible={venueSheetOpen.value}
        onClose={() => setVenueSheetOpen(false)}
        onUseSelected={handleUseSelectedVenue}
        venueSearch={venueSearch.value}
        setVenueSearch={setVenueSearch}
      />

      {/* Date Picker Bottom Sheet */}
      <DatePickerBottomSheet
        visible={dateSheetOpen.value}
        onClose={() => setDateSheetOpen(false)}
        onUseSelected={handleUseSelectedDate}
      />
    </ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    marginTop: Platform.OS === 'ios' ? normalize(10) : normalize(20),
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientContainer: {
    position: 'relative',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#f0f2f5',
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
    position: 'relative',
    zIndex: 1,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#ffffff',
    zIndex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 20,
  },
  backButtonResults: {
    width: 40,
    height: 40,
    marginBottom: 15,
    marginTop: Platform.OS === 'ios' ? normalize(10) : normalize(20),
  },
  resultsTitleContainer: {
    marginBottom: 10,
  },
  resultsTitle: {
    fontSize: normalize(18),
    fontWeight: '400',
    color: '#000',
    lineHeight: normalize(24),
  },
  boldText: {
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginLeft: 15,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsScrollView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: normalize(30),
  },
  searchContainer: {
    marginBottom: normalize(30),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    marginBottom: normalize(16),
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#B2BBC8',
    minHeight: normalize(56), // Fixed height for all input fields
  },
  inputIcon: {
    marginRight: normalize(12),
  },
  input: {
    fontSize: normalize(16),
    color: '#000',
  },
  placeholderText: {
    color: '#666',
  },
  selectedText: {
    color: '#000',
  },
  clearButton: {
    padding: normalize(4),
  },
  categoriesContainer: {
    marginBottom: normalize(30),
  },
  categoriesTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: normalize(20),
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: (width - 60) / 3,
    backgroundColor: '#F8F9FA',
    borderRadius: normalize(12),
    padding: normalize(16),
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  categoryIcon: {
    marginBottom: normalize(8),
  },
  categoryText: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#0C0453',
    textAlign: 'center',
  },
  trendingContainer: {
    marginBottom: normalize(30),
  },
  trendingTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: normalize(20),
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  trendingIcon: {
    marginRight: normalize(12),
  },
  trendingText: {
    fontSize: normalize(16),
    color: '#000',
  },
  suggestionsContainer: {
    marginBottom: normalize(30),
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionIcon: {
    marginRight: normalize(12),
  },
  suggestionText: {
    fontSize: normalize(16),
    color: '#000',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: normalize(40),
  },
  noResultsIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  ticketIcon: {
    fontSize: normalize(40),
  },
  xIcon: {
    fontSize: normalize(30),
    marginLeft: normalize(10),
    color: '#FF6B6B',
  },
  noResultsText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    gap: normalize(12),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: normalize(12),
    paddingVertical: normalize(16),
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#666',
  },
  searchButton: {
    flex: 1,
    backgroundColor: '#0C0453',
    borderRadius: normalize(12),
    paddingVertical: normalize(16),
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SearchScreen; 