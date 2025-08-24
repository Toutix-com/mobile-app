import React from 'react';
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
} from './store/profile.store';
import { Bell, LogOut, Plus } from 'lucide-react-native';

const ProfileScreen: React.FC = () => {
  useSignals();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.bellButton}>
            <Bell color="#0C0453" size={normalize(18)} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <ProfileHeaderCard />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
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
            <TouchableOpacity>
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
    marginBottom: normalize(16),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: '#0C0453',
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
});

export default ProfileScreen; 