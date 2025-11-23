import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import { Home, Ticket, Store, User } from 'lucide-react-native';
import { Icon } from '../components';


import HomeStack from './HomeStack';
import TicketsStack from '@navigation/TicketsStack';
import MarketplaceScreen from '../pages/MarketplaceScreen';
import {userStore} from '@pages/login/store/login.store';
import { normalize } from '../utils/responsive';
import { useSignals } from '@preact/signals-react/runtime';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();
const isLoggedIn = userStore.value.email || userStore.value.phoneNumber;

console.log(isLoggedIn, "TAB" , userStore.value);


const TabNavigator = () => {
  useSignals();
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        const routeName = route.name;
        const state = navigation.getState();
        const currentRoute = state.routes[state.index];

        // Check if current screen is Search or EventDetails within HomeStack
        const isTicketCheckoutScreen  = currentRoute?.name === 'Home' && 
          currentRoute?.state?.routes && 
          currentRoute.state.index !== undefined &&
          currentRoute.state.routes[currentRoute.state.index]?.name === 'TicketCheckout';
        
        const isEventTicketsScreen = currentRoute?.name === 'Home' && 
          currentRoute?.state?.routes && 
          currentRoute.state.index !== undefined &&
          currentRoute.state.routes[currentRoute.state.index]?.name === 'EventTickets';
        
        const isEventDetailsScreen = currentRoute?.name === 'Home' && 
          currentRoute?.state?.routes && 
          currentRoute.state.index !== undefined &&
          currentRoute.state.routes[currentRoute.state.index]?.name === 'EventDetails';
        
        const shouldHideTabBar = isTicketCheckoutScreen || isEventDetailsScreen || isEventTicketsScreen;
        
        
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: shouldHideTabBar ? { display: 'none' } : styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: '#0C0453',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarBackground: () => (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            />
          ),
        };
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              icon={<Home strokeWidth={focused ? 2.5 : 2} />}
              size={normalize(20)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon
              icon={<Ticket strokeWidth={focused ? 2.5 : 2} />}
              size={normalize(20)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarLabel: 'marketplace',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              icon={<Store strokeWidth={focused ? 2.5 : 2} />}
              size={normalize(20)}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            isLoggedIn && userStore.value.image ? (
              <Image source={{ uri: userStore.value.image || '' }} style={styles.avatar} />
            ) : (
              <Icon
                icon={<User strokeWidth={focused ? 2.5 : 2} />}
                size={normalize(20)}
                color={color}
              />
            )
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: normalize(75),
    paddingBottom: normalize(10),
  },
  tabBarLabel: {
    fontSize: normalize(12),
    fontWeight: '700',
    marginBottom: normalize(10),
  },
  avatar: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
  },
});

export default TabNavigator; 