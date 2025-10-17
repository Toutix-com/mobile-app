import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSignal } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import TicketListItem from './components/TicketListItem';
import { tickets, isLoadingTickets, isRefreshing, refreshTickets } from './store/tickets.store';
import { loadTickets } from './store/tickets.store';
import { useNavigation } from '@react-navigation/native';
import { useSignals } from '@preact/signals-react/runtime';
import { userStore } from '@pages/login/store/login.store';
import { User } from 'lucide-react-native';
import { handleLoginPress } from '@pages/profile/store/profile.store';
import { Button, AppText, Icon } from '../../components';

const TicketsScreen: React.FC = () => {
  useSignals();
  const isLoggedIn = userStore.value.email || userStore.value.phoneNumber;
  console.log(isLoggedIn,userStore.value, "Is Logged In");
  

  React.useEffect(() => {
    if (tickets.value.length === 0) {
      loadTickets();
    }
  }, []);
  const navigation = useNavigation<any>();

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerWhenNotLoggin}>
          <AppText style={styles.headerTitle}>Tickets</AppText>
        </View>
        
        <View style={styles.notLoggedInContainer}>
          {/* Profile Icon Placeholder */}
          <View style={styles.profileIconContainer}>
            <User color="#0C0453" size={normalize(60)} />
          </View>
          
          {/* Message */}
          <AppText style={styles.notLoggedInMessage}>
            Hey, looks like you are not logged in
          </AppText>
          
          {/* Login Button */}
          <Button
            title="Log in now"
            variant="primary"
            onPress={handleLoginPress}
            style={styles.loginButton}
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Tickets</AppText>
      <FlatList
        data={tickets.value}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketListItem
            image={item.event?.image || ''}
            title={item.title}
            dateLabel={item.dateLabel}
            timeLabel={item.timeLabel}
            price={item.price || ''}
            onPress={() => navigation.navigate('TicketDetails', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing.value}
            onRefresh={refreshTickets}
            tintColor="#0C0453"
            colors={['#0C0453']}
          />
        }
      />
      <View style={styles.footer}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: normalize(28),
    fontWeight: '600',
    color: '#0D1117',
    paddingHorizontal: normalize(16),
    paddingTop: normalize(24),
    paddingBottom: normalize(8),
    marginTop: normalize(30)
  },
  listContent: {
    paddingBottom: normalize(24),
  },
  footer: {
    height: normalize(100),
  },
  headerWhenNotLoggin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(50),
    marginLeft: normalize(20),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: '#0D1117',
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
});

export default TicketsScreen;


