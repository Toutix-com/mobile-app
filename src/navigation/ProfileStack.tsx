import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@pages/profile/ProfileScreen';
import EditProfileScreen from '@pages/profile/EditProfileScreen';
import TicketsScreen from '@pages/tickets/TicketsScreen';
import TicketDetailsScreen from '@pages/tickets/TicketDetailsScreen';
import EventDetailsScreen from '@pages/event/EventDetailsScreen';
import OrganizerProfileScreen from '@pages/organizerProfile/OrganizerProfileScreen';

const Stack = createStackNavigator();

const TicketsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="TicketsScreen" component={TicketsScreen} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="OrganizerProfile" component={OrganizerProfileScreen} />
    </Stack.Navigator>
  );
};

export default TicketsStack;


