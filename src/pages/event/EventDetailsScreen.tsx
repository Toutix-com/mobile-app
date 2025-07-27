import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
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

const EventDetailsScreen = () => {
  useSignals();
  const navigation = useNavigation();

  // Show loading state
  if (eventLoading.value) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0C0453" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading event details...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (eventError.value) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#ff0000', textAlign: 'center', padding: 20 }}>{eventError.value}</Text>
      </SafeAreaView>
    );
  }

  // Show event details
  const event = selectedEvent.value;
  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#666', textAlign: 'center', padding: 20 }}>No event data available</Text>
      </SafeAreaView>
    );
  }

  const startDate = formatDate(event.startTimeStamp);
  const timeRange = formatTimeRange(event.startTimeStamp, event.endTimeStamp);
  const priceRange = formatPrice(event);

  return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <EventHeader 
            imageUrl={event.image} 
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
            imageUrl={event.image}
            onShowMap={() => {}} 
          />
          <Divider dividerStyle={{ marginVertical: normalize(5), marginHorizontal: normalize(16) }} />
          <EventHostSection 
            avatarUrl={event.organization.organizationLogo || ''} 
            hostName={`${event.organization.organizationName}`} 
            eventsHosted={event.hostedEventCount} 
            onViewProfile={() => {}} 
          />
          <Divider dividerStyle={{ marginVertical: normalize(10), marginHorizontal: normalize(16) }} />
          <EventPriceFooter price={priceRange} />
          <TouchableOpacity
                  onPress={() => (navigation as any).navigate('EventTickets')}
                  style={{ flex: 1, marginHorizontal: 5, backgroundColor: '#0C0453', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Get tickets</Text>
                </TouchableOpacity>
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