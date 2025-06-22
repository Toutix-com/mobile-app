import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Home, Ticket, Store, User } from 'lucide-react-native';
import { BlurView } from '@react-native-community/blur';

import HomeScreen from '../pages/HomeScreen';
import TicketsScreen from '../pages/TicketsScreen';
import MarketplaceScreen from '../pages/MarketplaceScreen';
import ProfileScreen from '../pages/ProfileScreen';
import { normalize } from '../utils/responsive';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#0C0453',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarBackground: () => (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={15}
          />
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
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