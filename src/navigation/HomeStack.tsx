import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/home/HomeScreen';
import EventDetailsScreen from '../pages/event/EventDetailsScreen';
import EventTicketsScreen from '@pages/event/EventTicketsScreen';
import TicketCheckoutScreen from '@pages/checkout/TicketCheckoutScreen';
import SearchScreen from '../pages/search/SearchScreen';
import OrganizerProfileScreen from '@pages/organizerProfile/OrganizerProfileScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="EventTickets" component={EventTicketsScreen} />
      <Stack.Screen name="TicketCheckout" component={TicketCheckoutScreen} />
      <Stack.Screen name="OrganizerProfile" component={OrganizerProfileScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack; 