import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Home, Ticket, Store, User } from 'lucide-react-native';


import HomeStack from './HomeStack';
import TicketsScreen from '../pages/TicketsScreen';
import MarketplaceScreen from '../pages/MarketplaceScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';
import { normalize } from '../utils/responsive';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        const routeName = route.name;
        const state = navigation.getState();
        const currentRoute = state.routes[state.index];

        const isSearchScreen = currentRoute?.name === 'HomeStack' && 
          currentRoute?.state?.routes && 
          currentRoute.state.index !== undefined &&
          currentRoute.state.routes[currentRoute.state.index]?.name === 'Search';
        
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: isSearchScreen ? { display: 'none' } : styles.tabBar,
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
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home
              color={color}
              size={normalize(28)}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ticket
              color={color}
              size={normalize(28)}
              strokeWidth={focused ? 2.5 : 2}
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
            <Store
              color={color}
              size={normalize(28)}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User
              color={color}
              size={normalize(28)}
              strokeWidth={focused ? 2.5 : 2}
            />
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
    height: normalize(90),
    paddingTop: normalize(10),
  },
  tabBarLabel: {
    fontSize: normalize(12),
    fontWeight: '700',
    marginBottom: normalize(10),
  },
});

export default TabNavigator; 