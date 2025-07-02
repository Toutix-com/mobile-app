import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import { X, Search as SearchIcon, Building2 } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import CheckBox from '../../../components/checkbox';
import Divider from '../../../components/divider';

const { width } = Dimensions.get('window');

interface VenueObj {
  label: string;
  selected: boolean;
}

interface AllVenuesBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filteredVenues: VenueObj[];
  onToggleVenue: (venueLabel: string) => void;
  onClear: () => void;
  onUseSelected: () => void;
  venueSearch: string;
  setVenueSearch: (search: string) => void;
}

const AllVenuesBottomSheet: React.FC<AllVenuesBottomSheetProps> = ({
  visible,
  onClose,
  filteredVenues,
  onToggleVenue,
  onClear,
  onUseSelected,
  venueSearch,
  setVenueSearch,
}) => {
  const selectedCount = filteredVenues.filter(venue => venue.selected).length;

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.9}>
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 22 }}>Select a cities</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ fontSize: 28, color: '#222' }}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#F5F6FA', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 12 }}>
      <SearchIcon color="#666" size={20} />
        <TextInput
          style={{ flex: 1, height: 44, fontSize: 16 }}
          placeholder="Search city"
          value={venueSearch}
          onChangeText={setVenueSearch}
          placeholderTextColor="#A0A0A0"
        />
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {filteredVenues.map((venue, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              flex: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Building2 color="#0C0453" size={20} />
              <Text style={{ fontSize: 16, marginLeft: 15, fontWeight: '400' }}>{venue.label}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <CheckBox
                checked={venue.selected}
                onPress={() => onToggleVenue(venue.label)}
              />
            </View>
          </View>
        ))}
        <Divider />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
          <TouchableOpacity onPress={onClear} style={{ flex: 1, marginRight: 10, alignItems: 'center', paddingVertical: 14, borderRadius: 8, backgroundColor: '#F5F6FA' }}>
            <Text style={{ color: '#0C0453', fontWeight: 'bold', fontSize: 16 }}>Clear selection</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUseSelected} style={{ flex: 1, marginLeft: 10, alignItems: 'center', paddingVertical: 14, borderRadius: 8, backgroundColor: '#0C0453' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Use selected</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    marginTop: normalize(10),
  },
  title: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: '#222',
  },
  searchContainer: {
    backgroundColor: '#F5F6FA', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 12 
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(16),
    color: '#333',
  },
  content: {
    flex: 1,
  },
  venueList: {
    flex: 1,
  },
  venueItem: {
    marginBottom: normalize(15),
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: normalize(20),
    marginBottom: normalize(120),
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: normalize(8),
    paddingVertical: normalize(14),
    alignItems: 'center',
    marginRight: normalize(10),
  },
  clearButtonText: {
    color: '#0C0453',
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
  useSelectedButton: {
    flex: 1,
    backgroundColor: '#0C0453',
    borderRadius: normalize(8),
    paddingVertical: normalize(14),
    alignItems: 'center',
    marginLeft: normalize(10),
  },
  useSelectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default AllVenuesBottomSheet; 