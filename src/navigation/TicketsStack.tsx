import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TicketsScreen from '@pages/tickets/TicketsScreen';
import TicketDetailsScreen from '@pages/tickets/TicketDetailsScreen';
import EventDetailsScreen from '@pages/event/EventDetailsScreen';

const Stack = createStackNavigator();

const TicketsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TicketsHome" component={TicketsScreen} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    </Stack.Navigator>
  );
};

export default TicketsStack;


