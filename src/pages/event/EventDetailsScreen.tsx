import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
// Placeholder imports for modular components
import EventHeader from './components/EventHeader';
import EventTitleCard from './components/EventTitleCard';
import EventDetailsSection from './components/EventDetailsSection';
import EventLocationSection from './components/EventLocationSection';
import EventMap from './components/EventMap';
import EventHostSection from './components/EventHostSection';
import EventPriceFooter from './components/EventPriceFooter';
import EventDetailsModal from './components/EventDetailsModal';
import { 
  selectedEvent, 
  eventLoading, 
  eventError, 
  clearSelectedEvent,
  showDetailsModal,
  setShowDetailsModal,
  formatDate,
  formatTimeRange,
  formatPrice
} from './store/event.store';
import { useNavigation } from '@react-navigation/native';
import Divider from '@components/divider';
import { normalize } from '@utils/responsive';
import { Button, AppText, Icon } from '../../components';

const EventDetailsScreen = () => {
  useSignals();
  const navigation = useNavigation();

  

  // Show loading state
  if (eventLoading.value) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0C0453" />
        <AppText style={{ marginTop: 16, color: '#666' }}>Loading event details...</AppText>
      </SafeAreaView>
    );
  }

  // Show error state
  if (eventError.value) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <AppText style={{ color: '#ff0000', textAlign: 'center', padding: 20 }}>{eventError.value}</AppText>
      </SafeAreaView>
    );
  }

  // Show event details
  const event = selectedEvent.value;
  console.log("eventLoading", event);
  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <AppText style={{ color: '#666', textAlign: 'center', padding: 20 }}>No event data available</AppText>
      </SafeAreaView>
    );
  }

  const startDate = formatDate(event.startTimeStamp);
  const timeRange = formatTimeRange(event.startTimeStamp, event.endTimeStamp);
  const priceRange = formatPrice(event);

  const handleShowOnMap = () => {
    const lat = event.location.lat;
    const lon = event.location.lon;
    const label = encodeURIComponent(event.location.name || 'Event Location');
    console.log(lat, lon, label, "Pressed");
    
    if (Platform.OS === 'ios') {
      const googleMapsUrl = `comgooglemaps://?q=${lat},${lon}`;
      Linking.canOpenURL(googleMapsUrl).then((supported) => {
        if (supported) {
          Linking.openURL(googleMapsUrl);
        } else {
          const appleMapsUrl = `maps://?q=${lat},${lon}`;
          Linking.canOpenURL(appleMapsUrl).then((appleSupported) => {
            if (appleSupported) {
              Linking.openURL(appleMapsUrl);
            } else {
              const webMapsUrl = `https://maps.apple.com/?ll=${lat},${lon}&q=${label}`;
              Linking.openURL(webMapsUrl);
            }
          });
        }
      });
    } else {
      // Android implementation
      const url = `geo:${lat},${lon}?q=${lat},${lon}(${label})`;
      Linking.openURL(url);
    }
  };

  return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <EventHeader 
            imageUrls={(() => {
              const base = [event.image];
              const fromImages = Array.isArray((event as any).images) ? (event as any).images : [];
              const fromEventImages = Array.isArray((event as any).eventImages) ? (event as any).eventImages : [];
              const merged = [...base, ...fromImages, ...fromEventImages];
              return merged.filter((u) => typeof u === 'string' && u.trim().length > 0);
            })()} 
            onBack={() => navigation.goBack()} 
            onShare={() => {}} 
            onFavorite={() => {}} 
            isFavorite={false} 
            status={event.status} 
          />
          <EventTitleCard
            title={event.name}
            date={startDate}
            time={timeRange}
            onShowMore={() => setShowDetailsModal(true)}
            isExpanded={showDetailsModal.value}
            description={event.description}
          />
          {/* <EventDetailsSection description={event.description} /> */}
          <EventLocationSection 
            venue={event.location.name} 
            address={event.location.address} 
            onShowMap={handleShowOnMap} 
            lat={event.location.lat || 0}
            lon={event.location.lon || 0}
          />
         
          <Divider dividerStyle={{ marginVertical: normalize(5), marginHorizontal: normalize(16) }} />
          <EventHostSection 
            avatarUrl={event.organization.organizationLogo || ''}
            hostName={event.organization.organizationName || ''}
            eventsHosted={event.hostedEventCount} 
            onViewProfile={() => (navigation as any).navigate('OrganizerProfile', { id: event.organization.id })} 
          />
          <Divider dividerStyle={{ marginVertical: normalize(10), marginHorizontal: normalize(16) }} />
          <EventPriceFooter price={priceRange} />
          <Button
            title={event.status === 'SOLD_OUT' ? 'Sold Out' : 'Get tickets'}
            variant={event.status === 'SOLD_OUT' ? 'secondary' : 'primary'}
            disabled={event.status === 'SOLD_OUT'}
            onPress={() => {
              if (event.status !== 'SOLD_OUT') {
                (navigation as any).navigate('EventTickets');
              }
            }}
            style={{ 
              flex: 1, 
              marginHorizontal: 5
            }}
            
          />
            <EventDetailsModal
          visible={showDetailsModal.value}
          onClose={() => setShowDetailsModal(false)}
          aboutText={event.htmlDescription.replace(/<[^>]*>/g, '')} // Remove HTML tags
          lineup={event.ticketCategories.map(ticket => ticket.title)}
          ageLimit={'18+ only. ID required at entry.'}
          note={'Outside food and beverages, illegal substances, and professional cameras are not allowed.'}
        />
        </ScrollView>
        
      </View>
    
  );
};

export default EventDetailsScreen; 