import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import {
  X,
  CheckCircle,
} from 'lucide-react-native';
import { getOrderSummary } from './store/checkout.store';
import { Button, AppText, Icon } from '../../components';

const SuccessReceiptScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  const orderSummary = getOrderSummary();

  if (!orderSummary) {
    return (
      <View style={styles.container}>
        <AppText>No order data available</AppText>
      </View>
    );
  }

  const { event, tickets, total } = orderSummary;

  const handleContactUs = () => {
    // You can implement contact functionality here
    Linking.openURL('mailto:support@toutix.com');
  };

  const handleViewTickets = () => {
    navigation.navigate('Tickets' as never);
  };

  const handleMoreEvents = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Icon 
          icon={<X />}
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        />
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Icon icon={<CheckCircle />} size={24} color="#008136" />
            <AppText style={styles.successTitle}>Ticket purchase successful</AppText>
          </View>
          
          <AppText style={styles.successMessage}>
            Thank you for your payment. This transaction is now completed
          </AppText>
        </View>

        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.eventDetails}>
            <AppText style={styles.eventTitle} numberOfLines={2}>{event.name}</AppText>
            <AppText style={styles.eventDateLocationTitle}>{'Date'}</AppText>
            <AppText style={styles.eventDate}>
              {new Date(event.startTimeStamp).toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })} - {new Date(event.startTimeStamp).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })}
            </AppText>
            <AppText style={styles.eventDateLocationTitle}>{'Location'}</AppText>
            <AppText style={styles.eventLocation}>{event.location.name}</AppText>
          </View>
          {/* Order Summary */}
        <View style={styles.orderSummary}>
          <AppText style={styles.orderTitle}>Your order</AppText>
          {tickets.map((ticket, index) => (
            <View key={index} style={styles.orderItem}>
              <AppText style={styles.orderItemText}>
                {ticket.quantity}  x  {ticket.category.title}
              </AppText>
              <AppText style={styles.orderItemPrice}>${ticket.total.toFixed(2)}</AppText>
            </View>
          ))}
        </View>
        </View>

        

        {/* Confirmation and Help */}
        <View style={styles.confirmationContainer}>
          <AppText style={styles.confirmationText}>
            A confirmation email has been sent to your registered email.
          </AppText>
          <AppText style={styles.helpText}>
            Need help? <AppText style={styles.contactLink} onPress={handleContactUs}>Contact us</AppText>
          </AppText>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="View your tickets"
          variant="primary"
          size='small'
          onPress={handleViewTickets}
          style={styles.viewTicketsButton}
          textStyle={styles.viewTicketsButtonText}
          fullWidth
        />
        <Button
          title="More events"
          variant="secondary"
          size='small'
          onPress={handleMoreEvents}
          textStyle={styles.moreEventsButtonText}
          style={styles.moreEventsButton}
          fullWidth
        />
      </View>
      <View style={styles.footer}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: normalize(60),
  },
  closeButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  successContainer: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  successIcon: {
    flexDirection: 'row',
    alignItems:'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  successTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#008136',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: normalize(16),
    color: '#1B2026',
    textAlign: 'left',
    lineHeight: 24,
  },
  eventCard: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E7E7EA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  eventDetails: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 10,
  },
  eventDateLocationTitle:{
    fontSize: normalize(14),
    color: '#666',
    marginBottom: 4,
    marginTop: 10,
  },
  eventDate: {
    fontSize: normalize(14),
    color: '#1B2026',
    fontWeight: '500',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: normalize(14),
    color: '#1B2026',
    fontWeight: '500',
    marginBottom: 4,
  },
  orderSummary: {
    marginBottom: 32,
  },
  orderTitle: {
    fontSize: normalize(14),
    fontWeight: '400',
    color: '#5C636E',
    marginBottom: 8,
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
    borderTopColor: '#DCE0E7',
    marginLeft: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  orderItemText: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: '#1B2026',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: '#1B2026',
  },
  confirmationContainer: {
    marginBottom: 32,
  },
  confirmationText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'left',
    marginBottom: 16,
    lineHeight: 24,
  },
  helpText: {
    fontSize: normalize(16),
    color: '#1B2026',
    fontWeight: '500',
    textAlign: 'left',
  },
  contactLink: {
    color: '#0C0453',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    gap: 12,
  },
  viewTicketsButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  viewTicketsButtonText: {
    color: '#0C0453',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  moreEventsButton: {
    flex: 1,
    backgroundColor: '#0C0453',
    borderRadius: 30,
    paddingVertical: 8,
    alignItems: 'center',
  },
  moreEventsButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  footer: {
    height: normalize(100),
  },
});

export default SuccessReceiptScreen;
