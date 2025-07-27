import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import { X, Building2, Check, Search } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import CheckBox from '../../../components/checkbox';
import Divider from '../../../components/divider';
import { useSignals } from '@preact/signals-react/runtime';
import { allVenues, selectedVenues, selectVenue, deselectVenue, clearSelectedVenues } from '../../home/store/home.store';
import { selectedVenue, setSelectedVenue } from '../store/search.store';

const { width } = Dimensions.get('window');

interface VenueSelectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onUseSelected: () => void;
  venueSearch: string;
  setVenueSearch: (search: string) => void;
}

const VenueSelectionBottomSheet: React.FC<VenueSelectionBottomSheetProps> = ({
  visible,
  onClose,
  onUseSelected,
  venueSearch,
  setVenueSearch,
}) => {
  useSignals();

  const filteredVenues = useMemo(() =>
    allVenues.value
      .filter(venue => venue.name.toLowerCase().includes(venueSearch.toLowerCase()))
      .map(venue => ({
        label: venue.name,
        id: venue.id,
        selected: selectedVenue.value === venue.name
      })),
    [venueSearch, allVenues.value, selectedVenue.value]
  );

  const handleToggleVenue = (venueId: string) => {
    const venue = allVenues.value.find(v => v.id === venueId);
    if (!venue) return;
    
    if (selectedVenue.value === venue.name) {
      setSelectedVenue('');
    } else {
      setSelectedVenue(venue.name);
    }
    onUseSelected();
  };

  const selectedCount = selectedVenue.value ? 1 : 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      heightPercent={0.93}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select a venue</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#666" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search venue"
            placeholderTextColor="#A0A0A0"
            value={venueSearch}
            onChangeText={setVenueSearch}
          />
        </View>

        <ScrollView style={styles.venuesList} showsVerticalScrollIndicator={false}>
          {filteredVenues.map((venue) => (
            <TouchableOpacity
              key={venue.id}
              style={styles.venueItem}
              onPress={() => handleToggleVenue(venue.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Building2 color="#000" size={20} />
                <Text style={{ fontSize: 16, marginLeft: 15, fontWeight: '400' }}>{venue.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(6),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B2BBC8',
  },
  searchIcon: {
    marginRight: normalize(12),
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(16),
    color: '#000',
  },
  venuesList: {
    flex: 1,
  },
  venueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(4),
  },
  divider: {
    backgroundColor: '#E5E5E5',
    height: 1,
  },
});

export default VenueSelectionBottomSheet; 