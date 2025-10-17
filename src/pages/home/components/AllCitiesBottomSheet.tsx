import { allCities, selectedCities, selectCity, deselectCity, clearSelectedCities, setCitySearch , citySearch } from '../store/home.store';
import { useSignals } from '@preact/signals-react/runtime';
import React, { useMemo } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import BottomSheet from '../../../components/bottomsheet';
import CheckBox from '../../../components/checkbox';
import Divider from '../../../components/divider';
import { MapPin, SearchIcon, X } from 'lucide-react-native';
import { Button, AppText, Icon } from '../../../components';

type CityObj = { label: string; selected: boolean };

interface AllCitiesBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onToggleCity: (cityLabel: string) => void;
  onClear: () => void;
  onUseSelected: () => void;
}

const AllCitiesBottomSheet: React.FC<Omit<AllCitiesBottomSheetProps, 'filteredCities' | 'onToggleCity' | 'onClear'> & { onUseSelected: () => void }> = ({
  visible,
  onClose,
  onUseSelected,
}) => {
  useSignals();
  // Filter and map cities for UI
  const filteredCities = useMemo(() =>
    allCities.value
      .filter(city => city.name.toLowerCase().includes(citySearch.value.toLowerCase()))
      .map(city => ({
        label: city.name,
        id: city.id,
        selected: !!selectedCities.value.find(sel => sel.id === city.id)
      })),
    [citySearch, allCities.value, selectedCities.value]
  );

  const handleToggleCity = (cityId: string) => {
    const city = allCities.value.find(c => c.id === cityId);
    if (!city) return;
    if (selectedCities.value.find(c => c.id === cityId)) {
      deselectCity(cityId);
    } else {
      selectCity(city);
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} heightPercent={0.9}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <AppText style={{ fontWeight: 'bold', fontSize: 22 }}>Select a cities</AppText>
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
            placeholder="Search city"
            value={citySearch.value}
            onChangeText={setCitySearch}
            placeholderTextColor="#A0A0A0"
          />
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {filteredCities.map((city, index) => (
            <View
              key={city.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                flex: 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon icon={<MapPin />} size="md" color="#0C0453" />
                <AppText style={{ fontSize: 16, marginLeft: 15, fontWeight: '400' }}>{city.label}</AppText>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <CheckBox
                  checked={city.selected}
                  onPress={() => handleToggleCity(city.id)}
                />
              </View>
            </View>
          ))}
          <Divider dividerStyle={{ marginVertical: 20 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
            <Button 
              title="Clear selection"
              variant="secondary"
              onPress={clearSelectedCities}
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

export default AllCitiesBottomSheet; 