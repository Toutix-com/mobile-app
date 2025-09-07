import React , { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import ProfileHeaderCard from './components/ProfileHeaderCard';
import PaymentMethodItem from './components/PaymentMethodItem';
import TicketHistoryItem from './components/TicketHistoryItem';
import {
  paymentMethods,
  ticketHistory,
  emailNotifications,
  appNotifications,
  setEmailNotifications,
  setAppNotifications,
  isLoadingProfile,
  profileError,
  fetchUserProfileData,
  handleLoginPress,
  handleLogout,
  fetchTicketHistory,
  handleViewAllTicketHistory
} from './store/profile.store';
import { Bell, LogOut, Plus, User } from 'lucide-react-native';
import { userStore } from '../login/store/login.store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<any, 'Profile'>,
  StackNavigationProp<any>
>;

const ProfileScreen: React.FC = () => {
  useSignals();
  const isAuthenticated = userStore.value?.isAuthenticated;
  const isLoggedIn = userStore.value.email || userStore.value.mobileNumber;
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  console.log("isAuthenticated", userStore.value);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfileData();
      fetchTicketHistory();
    }
  }, []);

  // Not authenticated - show login prompt
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { marginTop: normalize(50), marginLeft: normalize(20) }]}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.notLoggedInContainer}>
          {/* Profile Icon Placeholder */}
          <View style={styles.profileIconContainer}>
            <User color="#0C0453" size={normalize(60)} />
          </View>
          
          {/* Message */}
          <Text style={styles.notLoggedInMessage}>
            Hey, looks like you are not logged in
          </Text>
          
          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Log in now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Authenticated - show profile content
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.bellButton}>
              <Bell color="#0C0453" size={normalize(18)} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {isLoadingProfile.value && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>...</Text>
          </View>
        )}

        {/* Profile Content - Only show when not loading and no errors */}
        {!isLoadingProfile.value && !profileError.value && (
          <>
            {/* Profile card */}
            <View style={styles.profileCard}>
              <ProfileHeaderCard />
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout(navigation)}>
              <LogOut color="#D73A49" size={normalize(16)} />
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>

            {/* Payment methods */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment methods</Text>
                <TouchableOpacity style={styles.addNewButton}>
                  <Plus color="#0C0453" size={normalize(16)} />
                  <Text style={styles.addNewText}>Add new</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardList}>
                {paymentMethods.value.map((m) => (
                  <View key={m.id} style={{ marginBottom: normalize(10) }}>
                    <PaymentMethodItem method={m} />
                  </View>
                ))}
              </View>
            </View>

            {/* Notifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Email notifications</Text>
                <Switch
                  value={emailNotifications.value}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: '#D7DDEA', true: '#0C0453' }}
                  thumbColor={'#fff'}
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>App notifications</Text>
                <Switch
                  value={appNotifications.value}
                  onValueChange={setAppNotifications}
                  trackColor={{ false: '#D7DDEA', true: '#0C0453' }}
                  thumbColor={'#fff'}
                />
              </View>
            </View>

            {/* Ticket history */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ticket purchase history</Text>
                <TouchableOpacity style={{zIndex: 1000}} onPress={() => handleViewAllTicketHistory(navigation)}>
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.historyList}>
                {ticketHistory.value.map((t, idx) => (
                  <View key={t.id}>
                    <TicketHistoryItem image={t.image} title={t.title} subtitle={t.subtitle} price={t.price} />
                    {idx < ticketHistory.value.length - 1 && <View style={styles.historyDivider} />}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: normalize(120) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingTop: normalize(60),
    paddingHorizontal: normalize(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(0),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: '#0D1117',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(10),
  },
  refreshButton: {
    backgroundColor: '#EFF3FF',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(8),
  },
  refreshButtonText: {
    color: '#0C0453',
    fontSize: normalize(14),
    fontWeight: '600',
  },
  bellButton: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    backgroundColor: '#EFF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: normalize(14),
    borderWidth: 1,
    borderColor: '#EA8A8A',
    paddingVertical: normalize(12),
    borderRadius: normalize(10),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(8),
  },
  logoutText: {
    color: '#D73A49',
    fontWeight: '700',
  },
  section: {
    marginTop: normalize(22),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: normalize(12),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '700',
    color: '#0C0453',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(6),
  },
  addNewText: {
    color: '#0C0453',
    fontWeight: '600',
  },
  cardList: {
    gap: normalize(10),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F9FF',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(12),
    marginBottom: normalize(10),
  },
  toggleLabel: {
    color: '#0C0453',
    fontSize: normalize(14),
  },
  viewAllText: {
    color: '#0C0453',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  historyList: {},
  historyDivider: {
    height: 1,
    backgroundColor: '#E5EAF5',
    marginVertical: normalize(10),
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Account for header space
  },
  profileIconContainer: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    backgroundColor: '#EFF3FF',
    borderWidth: 2,
    borderColor: '#0C0453',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  notLoggedInMessage: {
    fontSize: normalize(18),
    color: '#0C0453',
    textAlign: 'center',
    marginBottom: normalize(20),
  },
  loginButton: {
    backgroundColor: '#0C0453',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(25),
    borderRadius: normalize(30),
    width: '80%',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
    textAlign: 'center',
  },
  editProfileButton: {
    backgroundColor: '#0C0453',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(25),
    borderRadius: normalize(10),
    alignItems: 'center',
    marginTop: normalize(14),
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  loadingText: {
    fontSize: normalize(18),
    color: '#0C0453',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(20),
  },
  errorText: {
    fontSize: normalize(18),
    color: '#D73A49',
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  retryButton: {
    backgroundColor: '#0C0453',
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
  },
  profileCard: {
    marginTop: normalize(20),
  },
});

export default ProfileScreen; 