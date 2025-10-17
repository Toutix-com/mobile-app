import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import { X, Search as SearchIcon, Building2 } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import CheckBox from '../../../components/checkbox';
import Divider from '../../../components/divider';
import { useSignals } from '@preact/signals-react/runtime';
import { selectedVenues, allVenues, selectVenue, deselectVenue,clearSelectedVenues, allCities, selectedCities, selectCity, deselectCity, filteredVenues } from '../store/home.store';
import { Button, AppText, Icon } from '../../../components';

const { width } = Dimensions.get('window');

import { Venue } from '../store/home.store';

interface AllVenuesBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  filteredVenues: Venue[];
  onToggleVenue: (venueId: string) => void;
  onClear: () => void;
  onUseSelected: () => void;
  venueSearch: string;
  setVenueSearch: (search: string) => void;
}

const AllVenuesBottomSheet: React.FC<AllVenuesBottomSheetProps> = ({
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
            selected: !!selectedVenues.value.find(sel => sel.id === venue.id)
          })),
        [venueSearch, allVenues.value, selectedVenues.value]
      );

      const handleToggleVenue = (venueId: string) => {
        const venue = allVenues.value.find(v => v.id === venueId);
        if (!venue) return;
        if (selectedVenues.value.find(v => v.id === venueId)) {
          deselectVenue(venueId);
        } else {
          selectVenue(venue);
        }
      };
  // You can count selected venues elsewhere if needed
  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.9}>
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <AppText style={{ fontWeight: 'bold', fontSize: 22 }}>Select a venue</AppText>
        <Icon 
          icon={<X />}
          size={28}
          color="#222"
          onPress={onClose}
        />
      </View>
      <View style={{ backgroundColor: '#F5F6FA', borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 12 }}>
        <Icon icon={<SearchIcon />} size="md" color="#666" />
        <TextInput
          style={{ flex: 1, height: 44, fontSize: 16 }}
          placeholder="Search venue"
          value={venueSearch}
          onChangeText={setVenueSearch}
          placeholderTextColor="#A0A0A0"
        />
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {filteredVenues.map((venue) => (
          <View
            key={venue.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              flex: 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 7}}>
              <Icon icon={<Building2 />} size="md" color="#0C0453" />
              <AppText style={{ fontSize: 16, marginLeft: 15, fontWeight: '400'}}>{venue.label}</AppText>
            </View>
            <View style={{ alignItems:'flex-end',  flex: 1}}>
              <CheckBox
                checked={venue.selected} // You can pass a selected prop if needed
                onPress={() => handleToggleVenue(venue.id)}
              />
            </View>
          </View>
        ))}
        <Divider dividerStyle={{ marginVertical: 20 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
          <Button 
            title="Clear selection"
            variant="secondary"
            onPress={clearSelectedVenues}
            style={{ flex: 1, marginRight: 10 }}
          />
          <Button 
            title="Use selected"
            variant="primary"
            onPress={onUseSelected}
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  </BottomSheet>
  );
};

export default AllVenuesBottomSheet; 