import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Linking, Platform, Alert, Animated, Dimensions } from 'react-native';
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
import { ChevronLeft, Share, Heart } from 'lucide-react-native';

const EventDetailsScreen = () => {
  useSignals();
  const navigation = useNavigation();
  
  // Animation values for sticky header effect
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_HEIGHT = normalize(120); // Height of the header image
  const STICKY_HEADER_HEIGHT = 50; // Height of the sticky header
  
  // Animated values for the sticky header
  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - STICKY_HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  

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
        {/* Sticky Header with 3 icons */}
        <Animated.View 
          style={[
            styles.stickyHeader,
            {
              opacity: stickyHeaderOpacity,
            }
          ]}
        >
          <View style={styles.stickyHeaderContent}>
            <Icon 
              icon={<ChevronLeft />}
              size={24}
              color="#000"
              backgroundColor="rgba(255,255,255,0.9)"
              rounded
              padding={8}
              onPress={() => navigation.goBack()}
            />
            <View style={{ flexDirection: 'row' }}>
              <Icon 
                icon={<Share />}
                size={22}
                color="#000"
                backgroundColor="rgba(255,255,255,0.9)"
                rounded
                padding={8}
                onPress={() => {}}
              />
              <Icon 
                icon={<Heart color="#000" fill="transparent" />}
                size={22}
                backgroundColor="rgba(255,255,255,0.9)"
                rounded
                padding={8}
                onPress={() => {}}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.ScrollView 
          contentContainerStyle={{ paddingBottom: 120 }} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Header with animated transform */}
          <Animated.View style={{ transform: [{ translateY: headerTranslateY }] }}>
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
          </Animated.View>
          
          {/* Content with animated transform */}
          <Animated.View style={{ transform: [{ translateY: contentTranslateY }] }}>
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
          </Animated.View>
        </Animated.ScrollView>
        
        {/* Sticky Footer with Get Tickets Button */}
        <View style={styles.stickyFooter}>
          <Button
            title={event.status === 'SOLD_OUT' ? 'Sold Out' : 'Get tickets'}
            variant={event.status === 'SOLD_OUT' ? 'secondary' : 'primary'}
            disabled={event.status === 'SOLD_OUT'}
            onPress={() => {
              if (event.status !== 'SOLD_OUT') {
                (navigation as any).navigate('EventTickets');
              }
            }}
            style={styles.getTicketsButton}
            fullWidth
          />
        </View>
        
        <EventDetailsModal
          visible={showDetailsModal.value}
          onClose={() => setShowDetailsModal(false)}
          aboutText={event.htmlDescription.replace(/<[^>]*>/g, '')} // Remove HTML tags
          lineup={event.ticketCategories.map(ticket => ticket.title)}
          ageLimit={'18+ only. ID required at entry.'}
          note={'Outside food and beverages, illegal substances, and professional cameras are not allowed.'}
        />
      </View>
    
  );
};

const styles = StyleSheet.create({
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stickyHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 40, // Account for tab bar height
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 10,
    zIndex: 1000,
  },
  getTicketsButton: {
    marginHorizontal: 0,
  },
});

export default EventDetailsScreen; 