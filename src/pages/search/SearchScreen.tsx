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
import { X, Search, MapPin, Building2, Calendar, Flame } from 'lucide-react-native';
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
} from './store/search.store';
import { moreEvents } from '../home/store/home.store';
import CitySelectionBottomSheet from './components/CitySelectionBottomSheet';
import VenueSelectionBottomSheet from './components/VenueSelectionBottomSheet';
import DatePickerBottomSheet from './components/DatePickerBottomSheet';
import { Music, Drama, Dribbble, Baby, FileText, Heart } from 'lucide-react-native';

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

  // --- UI State Logic ---
  const isInputFocused = activeInputField.value === 'eventName';
  const query = searchQuery.value.trim();

  // Filter trendingEvents and moreEvents by query (case-insensitive, no duplicates)
  type SimpleEvent = { id: string; name: string };
  const filteredResults = React.useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    const trending = (trendingEvents.value as SimpleEvent[]).filter((e: SimpleEvent) => e.name.toLowerCase().includes(lower));
    const more = (moreEvents.value as SimpleEvent[]).filter((e: SimpleEvent) => e.name && e.name.toLowerCase().includes(lower));
    const seen = new Set(trending.map((e: SimpleEvent) => e.id));
    const merged = [...trending, ...more.filter((e: SimpleEvent) => !seen.has(e.id))];
    return merged;
  }, [query, trendingEvents.value, moreEvents.value]);

  // --- Render Logic ---
  // 1. Only categories if not focused
  const showOnlyCategories = !isInputFocused;
  // 2. Only trending if focused and empty
  const showOnlyTrending = isInputFocused && !query;
  // 3. Show search results if focused and has query
  const showSearchResults = isInputFocused && !!query;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    performSearch();
    navigation.navigate('SearchResults' as never);
  };

  const handleCancel = () => {
    clearAllFilters();
    navigation.goBack();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const handleTrendingPress = (trending: string) => {
    setSearchQuery(trending);
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
    updateEventCount();
  };

  const handleClearVenue = () => {
    setSelectedVenue('');
    updateEventCount();
  };

  const handleClearDate = () => {
    setSelectedDate('');
    setSelectedMonth('');
    updateEventCount();
  };

  const handleUseSelectedCity = () => {
    setCitySheetOpen(false);
    updateEventCount();
  };

  const handleUseSelectedVenue = () => {
    setVenueSheetOpen(false);
    updateEventCount();
  };

  const handleUseSelectedDate = () => {
    setDateSheetOpen(false);
    updateEventCount();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Search events</Text>

        {/* Search Input Fields */}
        <View style={styles.searchContainer}>
          {/* Event Name Search */}
          <View style={styles.inputContainer}>
            <Search color="#666" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search event name..."
              placeholderTextColor="#A0A0A0"
              value={searchQuery.value}
              onChangeText={setSearchQuery}
              onFocus={() => setActiveInputField('eventName')}
              onBlur={() => setActiveInputField('')}
            />
            {searchQuery.value.length > 0 && (
              <TouchableOpacity onPress={clearSearchQuery} style={styles.clearButton}>
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
                    navigation.navigate('CategoryResults' as never);
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
                onPress={() => setSearchQuery(event.name)}
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
                  onPress={() => setSearchQuery(event.name)}
                >
                  <Search color="#666" size={16} style={styles.suggestionIcon} />
                  <Text style={styles.suggestionText}>{event.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <View style={styles.noResultsIcon}>
                  <Text style={styles.ticketIcon}>🎫</Text>
                  <Text style={styles.xIcon}>✕</Text>
                </View>
                <Text style={styles.noResultsText}>
                  Sorry! couldn't find any event with this name
                </Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

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
    </KeyboardAvoidingView>
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
    marginTop: normalize(10),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  inputIcon: {
    marginRight: normalize(12),
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: '#000',
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingContainer: {
    marginBottom: normalize(30),
  },
  trendingTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#000',
    marginBottom: normalize(16),
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    marginBottom: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendingIcon: {
    marginRight: normalize(12),
  },
  trendingText: {
    fontSize: normalize(16),
    color: '#000',
    flex: 1,
  },
  suggestionsContainer: {
    marginBottom: normalize(30),
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    marginBottom: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionIcon: {
    marginRight: normalize(12),
  },
  suggestionText: {
    fontSize: normalize(16),
    color: '#000',
    flex: 1,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(60),
  },
  noResultsIcon: {
    position: 'relative',
    marginBottom: normalize(20),
  },
  ticketIcon: {
    fontSize: normalize(60),
  },
  xIcon: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    fontSize: normalize(24),
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
    lineHeight: normalize(24),
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: normalize(16),
    marginRight: normalize(12),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: '#0C0453',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#0C0453',
  },
  searchButton: {
    flex: 1,
    paddingVertical: normalize(16),
    backgroundColor: '#0C0453',
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#fff',
  },
  selectedText: {
    color: '#000',
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoriesTitle: {
    fontSize: normalize(16),
    fontWeight: '400',
    color: '#5C636E',
    marginBottom: 13,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: (width - 60) / 3,
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: '#0D1117',
    textAlign: 'center',
  },
});

export default SearchScreen; 