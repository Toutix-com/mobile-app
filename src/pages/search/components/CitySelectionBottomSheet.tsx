import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, TextInput, Dimensions } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import { X, MapPin, Check, Search } from 'lucide-react-native';
import { normalize } from '../../../utils/responsive';
import CheckBox from '../../../components/checkbox';
import Divider from '../../../components/divider';
import { useSignals } from '@preact/signals-react/runtime';
import { allCities, selectedCities, selectCity, deselectCity, clearSelectedCities } from '../../home/store/home.store';
import { selectedCity, setSelectedCity } from '../store/search.store';
import { Button, AppText, Icon } from '../../../components';

const { width } = Dimensions.get('window');

interface CitySelectionBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onUseSelected: () => void;
  citySearch: string;
  setCitySearch: (search: string) => void;
}

const CitySelectionBottomSheet: React.FC<CitySelectionBottomSheetProps> = ({
  visible,
  onClose,
  onUseSelected,
  citySearch,
  setCitySearch,
}) => {
  useSignals();

  const filteredCities = useMemo(() =>
    allCities.value
      .filter(city => city.name.toLowerCase().includes(citySearch.toLowerCase()))
      .map(city => ({
        label: city.name,
        id: city.id,
        selected: selectedCity.value === city.name
      })),
    [citySearch, allCities.value, selectedCity.value]
  );

  const handleToggleCity = (cityId: string) => {
    const city = allCities.value.find(c => c.id === cityId);
    if (!city) return;
    
    if (selectedCity.value === city.name) {
      setSelectedCity('');
    } else {
      setSelectedCity(city.name);
    }
    onUseSelected();
  };

  const selectedCount = selectedCity.value ? 1 : 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      heightPercent={0.93}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.title}>Select a city</AppText>
          <Icon 
            icon={<X />}
            size={24}
            color="#000"
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        <View style={styles.searchContainer}>
          <Search color="#666" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city"
            placeholderTextColor="#A0A0A0"
            value={citySearch}
            onChangeText={setCitySearch}
          />
        </View>

        <ScrollView style={styles.citiesList} showsVerticalScrollIndicator={false}>
          {filteredCities.map((city) => (
            <TouchableOpacity
              key={city.id}
              style={styles.cityItem}
              onPress={() => handleToggleCity(city.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin color="#000" size={20} />
                <AppText style={{ fontSize: 16, marginLeft: 15, fontWeight: '400' }}>{city.label}</AppText>
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
    color: '#0D1117',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(6),
    paddingHorizontal: normalize(10),
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
  citiesList: {
    flex: 1,
  },
  cityItem: {
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

export default CitySelectionBottomSheet; 