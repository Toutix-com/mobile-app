import React from 'react';
import {
  View,
  Text,
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

const SuccessReceiptScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  const orderSummary = getOrderSummary();

  if (!orderSummary) {
    return (
      <View style={styles.container}>
        <Text>No order data available</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X color="#000" size={24} />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Message */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle color="#008136" size={24} />
            <Text style={styles.successTitle}>Ticket purchase successful</Text>
          </View>
          
          <Text style={styles.successMessage}>
            Thank you for your payment. This transaction is now completed
          </Text>
        </View>

        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.eventDetails}>
            <Text style={styles.eventTitle} numberOfLines={2}>{event.name}</Text>
            <Text style={styles.eventDateLocationTitle}>{'Date'}</Text>
            <Text style={styles.eventDate}>
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
            </Text>
            <Text style={styles.eventDateLocationTitle}>{'Location'}</Text>
            <Text style={styles.eventLocation}>{event.location.name}</Text>
          </View>
          {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderTitle}>Your order</Text>
          {tickets.map((ticket, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.orderItemText}>
                {ticket.quantity}  x  {ticket.category.title}
              </Text>
              <Text style={styles.orderItemPrice}>${ticket.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        </View>

        

        {/* Confirmation and Help */}
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>
            A confirmation email has been sent to your registered email.
          </Text>
          <Text style={styles.helpText}>
            Need help? <Text style={styles.contactLink} onPress={handleContactUs}>Contact us</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewTicketsButton}
          onPress={handleViewTickets}
        >
          <Text style={styles.viewTicketsButtonText}>View your tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreEventsButton}
          onPress={handleMoreEvents}
        >
          <Text style={styles.moreEventsButtonText}>More events</Text>
        </TouchableOpacity>
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
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0C0453',
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
    paddingVertical: 16,
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
