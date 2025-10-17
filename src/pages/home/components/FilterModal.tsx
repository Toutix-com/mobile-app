import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import { Easing } from 'react-native';
import CheckBox from '../../../components/checkbox';
import Divider from '../../../components/divider';
import moment from 'moment';
import { useSignals } from '@preact/signals-react/runtime';
import { allCities, selectedCities, selectCity, deselectCity, startDate, endDate, setStartDate, setEndDate, selectedCategories, setSelectedCategories, allVenues, selectedVenues, selectVenue, deselectVenue } from '../store/home.store';
import { Button, AppText, Icon } from '../../../components';

const { width } = Dimensions.get('window');

interface VenueObj {
  label: string;
  selected: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  setSelectedVenues: (venues: any[]) => void;
  onShowAllCities: () => void;
  onShowAllVenues: () => void;
  onShowDatePicker: (dateType: string) => void;
  onApplyFilters: () => void;
  onClearAllFilters: () => void;
  calendarMonth: number;
  calendarYear: number;
  setCalendarMonth: (month: number) => void;
  setCalendarYear: (year: number) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  setSelectedVenues,
  onShowAllCities,
  onShowAllVenues,
  onShowDatePicker,
  onApplyFilters,
  onClearAllFilters,
  calendarMonth,
  calendarYear,
  setCalendarMonth,
  setCalendarYear,
}) => {
  useSignals();
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const categoryOptions = ['Music', 'Theater', 'Sports', 'Family', 'Festivals', 'Workshops'];
  const startDateOptions = ['Any date', 'This week', 'This weekend', startDate.value ? moment(startDate.value).format('MMMM DD, YYYY') : 'Choose a date'];
  const endDateOptions = ['Any date', 'This week', 'This weekend', endDate.value ? moment(endDate.value).format('MMMM DD, YYYY') : 'Choose a date'];

  // For main filter: show first 5 venues plus any selected not in first 5
  // Map signals to UI shape for venues
  const previewVenues = (allVenues.value || []).slice(0, 5);
  const previewVenueIds = previewVenues.map(venue => venue.id);
  const extraSelectedVenues = (selectedVenues.value || []).filter(
    venue => !previewVenueIds.includes(venue.id) && venue.name
  );
  const venuesToShow = [
    ...previewVenues.map(venue => ({
      label: venue.name,
      id: venue.id,
      selected: !!(selectedVenues.value || []).find(sel => sel.id === venue.id)
    })),
    ...extraSelectedVenues.map(venue => ({
      label: venue.name,
      id: venue.id,
      selected: true
    }))
  ];

  // Map signals to UI shape
  const previewCities = (allCities.value || []).slice(0, 5);
  const extraSelectedCities = (selectedCities.value || []).filter(
    city => !previewCities.find(c => c.id === city.id)
  );
  const citiesToShow = [
    ...previewCities.map(city => ({
      label: city.name,
      id: city.id,
      selected: !!(selectedCities.value || []).find(sel => sel.id === city.id)
    })),
    ...extraSelectedCities.map(city => ({
      label: city.name,
      id: city.id,
      selected: true
    }))
  ];

  const toggleCitySelection = (cityId: string) => {
    const city = allCities.value.find(c => c.id === cityId);
    if (!city) return;
    if ((selectedCities.value || []).find(c => c.id === cityId)) {
      deselectCity(cityId);
    } else {
      selectCity(city);
    }
  };

  // Toggle venue selection in main filter
  const toggleVenueSelection = (venueId: string) => {
    const venue = allVenues.value.find(v => v.id === venueId);
    if (!venue) return;
    if ((selectedVenues.value || []).find(v => v.id === venueId)) {
      deselectVenue(venueId);
    } else {
      selectVenue(venue);
    }
  };

  // Checkbox handler
  const toggleSelection = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else {
      setSelected([...selected, value]);
    }
    console.log(selected, "selected");
    console.log(selectedCities, "Selected value");
  };

  // For startDate (Date | null)
  const selectStartDateRadio = (opt: string) => {
    if (opt === 'Any date') {
      setStartDate(null);
    } else if (opt === 'This week') {
      // Set to the end of this week
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      setStartDate(endOfWeek);
    } else if (opt === 'This weekend') {
      // Set to next Saturday
      const now = new Date();
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
      setStartDate(saturday);
    } else {
      // opt is a date string, parse it
      const parsed = new Date(opt);
      if (!isNaN(parsed.getTime())) {
        setStartDate(parsed);
      }
    }
  };

  // For endDate (string)
  const selectEndDateRadio = (value: string) => {
    if (value === 'Any date') {
      setEndDate(null);
    } else if (value === 'This week') {
      // Set to the end of this week
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      setEndDate(endOfWeek);
    } else if (value === 'This weekend') {
      // Set to next Saturday
      const now = new Date();
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
      setEndDate(saturday);
    } else {
      // opt is a date string, parse it
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setEndDate(parsed);
      }
    }
    console.log("End date selected:", value);
  };

  // Helper for radio checked state for startDate
  const isStartDateRadioChecked = (opt: string) => {
    if (opt === 'Any date') return startDate.value === null;
    if (opt === 'This week') {
      // Check if startDate.value is end of this week
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      return startDate.value && startDate.value.toDateString() === endOfWeek.toDateString();
    }
    if (opt === 'This weekend') {
      const now = new Date();
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
      return startDate.value && startDate.value.toDateString() === saturday.toDateString();
    }
    // Otherwise, compare formatted date string
    return startDate.value && moment(startDate.value).format('MMMM DD, YYYY') === opt;
  };

  const isEndDateRadioChecked = (opt: string) => {
    if (opt === 'Any date') return endDate.value === null;
    if (opt === 'This week') {
      const now = new Date();
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      return endDate.value && endDate.value.toDateString() === endOfWeek.toDateString();
    }
    if (opt === 'This weekend') {
      const now = new Date();
      const saturday = new Date(now);
      saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
      return endDate.value && endDate.value.toDateString() === saturday.toDateString();
    }
    return endDate.value && moment(endDate.value).format('MMMM DD, YYYY') === opt;
  };

  // Close filter: animate out, then hide modal
  const handleCloseFilter = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => onClose());
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
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
            <View style={{ marginTop: normalize(50) }}>
              <Icon 
                icon={<X />}
                size={normalize(20)}
                color="#000"
                onPress={handleCloseFilter}
                style={{ alignSelf: 'flex-start' }}
              />
              <AppText style={{ fontWeight: 'bold', fontSize: 22, marginTop: normalize(20) }}>Filter events</AppText>

              {/* Cities */}
              <AppText style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(10), marginBottom: normalize(10), color: '#444' }}>Cities</AppText>
              {citiesToShow.map(city => (
                <View key={city.label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
                  <CheckBox
                    key={city.label}
                    checked={city.selected}
                    onPress={() => toggleCitySelection(city.id)}
                    label={city.label}
                  />
                </View>
              ))}
              <TouchableOpacity style={{ marginBottom: 8 }} onPress={onShowAllCities}>
                <AppText style={{ color: '#0C0453', textDecorationLine: 'underline', fontSize: 15 }}>Show all cities</AppText>
              </TouchableOpacity>

              {/* Venues */}
              <AppText style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(10), marginBottom: normalize(10), color: '#444' }}>Venues</AppText>
              {venuesToShow.map(venue => (
                <View key={venue.label} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
                  <CheckBox
                    key={venue.label}
                    checked={venue.selected}
                    onPress={() => toggleVenueSelection(venue.id)}
                    label={venue.label}
                  />
                </View>
              ))}
              <TouchableOpacity style={{ marginBottom: 8 }} onPress={onShowAllVenues}>
                <AppText style={{ color: '#0C0453', textDecorationLine: 'underline', fontSize: 15 }}>Show all venues</AppText>
              </TouchableOpacity>

              {/* Categories */}
              <AppText style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(10), marginBottom: normalize(10), color: '#444' }}>Categories</AppText>
              {categoryOptions.map(category => (
                <View key={category} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' }}>
                  <CheckBox
                    key={category}
                    checked={selectedCategories.value.includes(category)}
                    onPress={() => toggleSelection(category, selectedCategories.value, setSelectedCategories)}
                    label={category}
                  />
                </View>
              ))}

              {/* Start date */}
              <AppText style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(18), marginBottom: normalize(10), color: '#444' }}>Start date</AppText>
              {startDateOptions.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                  onPress={() => selectStartDateRadio(opt)}
                >
                  <View style={{
                    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#1a237e',
                    marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
                  }}>
                    {isStartDateRadioChecked(opt) && <View style={{ width: 12, height: 12, backgroundColor: '#1a237e', borderRadius: 6 }} />}
                  </View>
                  <AppText style={{ color: '#222', fontSize: 15 }}>{opt}</AppText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={{ marginBottom: 8 }} onPress={() => onShowDatePicker('startDate')}>
                <AppText style={{ color: '#0C0453', textDecorationLine: 'underline', fontSize: 15 }}>Choose a date</AppText>
              </TouchableOpacity>

              {/* End date */}
              <AppText style={{ fontWeight: '600', fontSize: 16, marginTop: normalize(18), marginBottom: normalize(10), color: '#444' }}>End date</AppText>
              {endDateOptions.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                  onPress={() => selectEndDateRadio(opt)}
                >
                  <View style={{
                    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#1a237e',
                    marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
                  }}>
                    {isEndDateRadioChecked(opt) && <View style={{ width: 12, height: 12, backgroundColor: '#1a237e', borderRadius: 6 }} />}
                  </View>
                  <AppText style={{ color: '#222', fontSize: 15 }}>{opt}</AppText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={{ marginBottom: 16 }} onPress={() => onShowDatePicker('endDate')}>
                <AppText style={{ color: '#0C0453', textDecorationLine: 'underline', fontSize: 15 }}>Choose a date</AppText>
              </TouchableOpacity>
              <Divider dividerStyle={{ marginVertical: normalize(10) }} />
              {/* Footer buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: normalize(10), marginBottom: normalize(20) }}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={handleCloseFilter}
                  style={{ flex: 1, marginHorizontal: 5 }}
                />
                <Button
                  title="Apply filters"
                  variant="primary"
                  onPress={onApplyFilters}
                  style={{ flex: 1, marginLeft: 5 }}
                />
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FilterModal; 