import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import {
  X,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react-native';
import {
  useStripe,
  CardField,
  CardForm,
  useConfirmPayment,
  usePaymentSheet
} from '@stripe/stripe-react-native';
import {
  isProcessingPayment,
  paymentError,
  billingAddress,
  appliedCoupon,
  couponCode,
  isCouponValid,
  couponError,
  updateBillingAddress,
  applyCoupon,
  removeCoupon,
  getOrderSummary,
  clearCheckout,
  loadCheckoutObject,
  checkoutPayload,
  reservationSecondsRemaining,
  isReservationExpired,
  startReservationTimer,
  stopReservationTimer
} from './store/checkout.store';
import { createMockPaymentIntent } from '../../services/stripeService';

const TicketCheckoutScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const { confirmPayment: confirmPaymentHook, } = useConfirmPayment();
  const { presentPaymentSheet , initPaymentSheet, loading } = usePaymentSheet();

  const orderSummary = getOrderSummary();

  useEffect(() => {
    loadCheckoutObject();
    initializePaymentSheet();
    // Ensure timer starts even if backend call delays
    startReservationTimer(300);
    return () => {
      stopReservationTimer();
    };
  }, []);

  const initializePaymentSheet = async () => {
    console.log(checkoutPayload.value, "Checkout Payload");
    
    const { error } = await initPaymentSheet({
      customerId: checkoutPayload.value?.customerId,
      paymentIntentClientSecret: checkoutPayload.value?.clientSecret,
      intentConfiguration: {
        paymentMethodTypes: 'Card',
      },
      merchantDisplayName: 'Toutix',
    });

    console.log(error, "Error");
    
  }

  if (!orderSummary) {
    return (
      <View style={styles.container}>
        <Text>No order data available</Text>
      </View>
    );
  }

  const hanldeBuy = async () => {
    initializePaymentSheet(); 
    const { error } = await presentPaymentSheet();
    if (error) {
      console.log(error, "Error");
    }else{
      console.log("Payment Sheet Presented");
    }
  }

  const { event, tickets, subtotal, transactionFee, discount, total } = orderSummary;

  const handlePayment = async () => {
    try {
      isProcessingPayment.value = true;
      paymentError.value = null;

      // Use client secret from checkout payload returned by backend
      const clientSecret = checkoutPayload.value?.clientSecret;

      console.log("Client secret", clientSecret);
      
      if (!clientSecret) {
        throw new Error('Missing client secret. Please try again.');
      }

      // Confirm payment with Stripe
      const { error, paymentIntent: confirmedPaymentIntent } = await confirmPaymentHook(
        clientSecret,
        {
          paymentMethodType: 'Card',
        }
      );

      console.log(confirmedPaymentIntent, "Confirmed Payment Intent");

      if (error) {
        console.log("Errore", error);
        
        paymentError.value = error.message;
        Alert.alert('Payment Failed', error.message);
      } else if (confirmedPaymentIntent?.status === 'Succeeded') {
        Alert.alert(
          'Payment Successful!',
          'Your tickets have been purchased successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCheckout();
                navigation.navigate('Tickets' as never);
              },
            },
          ]
        );
      }
    } catch (error: any) {
      paymentError.value = error.message || 'Payment failed';
      Alert.alert('Payment Failed', error.message || 'Please try again');
    } finally {
      isProcessingPayment.value = false;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>9:41</Text>
        <View style={styles.statusIcons}>
          <View style={styles.signalIcon} />
          <View style={styles.wifiIcon} />
          <View style={styles.batteryIcon} />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <X color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.eventDetails}>
            <Text style={styles.eventTitle} numberOfLines={2}>Night Pulse: An Immersive Ele...</Text>
            <Text style={styles.eventDate}>Saturday, August 10, 2025</Text>
            <Text style={styles.eventTime}>5:00PM - 3:00AM</Text>
          </View>
        </View>

        {/* Ticket Items */}
        <View style={styles.ticketItems}>
          <View style={styles.ticketItem}>
            <Text style={styles.ticketItemText}>1 X Early bird general admission</Text>
            <Text style={styles.ticketItemPrice}>$18.00</Text>
          </View>
          <View style={styles.ticketItem}>
            <Text style={styles.ticketItemText}>2 X Bundled Pass (4 general admission tickets)</Text>
            <Text style={styles.ticketItemPrice}>$150.00</Text>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.costBreakdown}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Sub total</Text>
            <Text style={styles.costValue}>$168.00</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Transaction fee (10%)</Text>
            <Text style={styles.costValue}>$16.80</Text>
          </View>
          <View style={[styles.costRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$183.80</Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Pay using</Text>
          
          <View style={styles.paymentForm}>
            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card number</Text>
              <View style={styles.cardInputContainer}>
                <CardField
                  placeholders={{
                    number: '1234 5678 9012 3456',
                  }}
                  cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                    borderWidth: 1,
                    borderColor: '#e9ecef',
                    borderRadius: 8,
                    fontSize: 16,
                    placeholderColor: '#999999',
                  }}
                  style={styles.cardField}
                  postalCodeEnabled={false}
                />
                {/* <CardForm
  style={{ height: 250 }}
  cardStyle={{
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    textColor: '#000',
  }}
  onFormComplete={(cardDetails) => {
    console.log('card details', cardDetails);
  }}
/> */}
              </View>
            </View>

            {/* Name on Card */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name on card</Text>
              <TextInput
                style={styles.nameInput}
                placeholder="e.g. Sam Fisher"
                placeholderTextColor="#999"
                value={billingAddress.value.firstName + ' ' + billingAddress.value.lastName}
                onChangeText={(text) => {
                  const names = text.split(' ');
                  updateBillingAddress('firstName', names[0] || '');
                  updateBillingAddress('lastName', names.slice(1).join(' ') || '');
                }}
              />
            </View>
          </View>
        </View>

        {/* Reservation Timer */}
        <View style={styles.reservationContainer}>
          <Text style={styles.reservationText}>
            Your tickets are reserved for you until: <Text style={styles.reservationTime}>{`${Math.floor(reservationSecondsRemaining.value/60)}:${(reservationSecondsRemaining.value%60).toString().padStart(2,'0')}`}</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.payButtonContainer}>
        <TouchableOpacity
          style={[styles.payButton, (isProcessingPayment.value || isReservationExpired.value) && styles.payButtonDisabled]}
          onPress={hanldeBuy}
          disabled={isProcessingPayment.value || isReservationExpired.value}
        >
          <Text style={styles.payButtonText}>
            {isProcessingPayment.value ? 'Processing...' : 'Pay'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{height:normalize(90)}}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    paddingBottom: 8,
  },
  statusTime: {
    fontSize: normalize(17),
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalIcon: {
    width: 18,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  wifiIcon: {
    width: 16,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  batteryIcon: {
    width: 24,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
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
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  eventImage: {
    width: 80,
    height: 80,
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
  },
  eventDate: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: normalize(14),
    color: '#666',
  },
  ticketItems: {
    marginBottom: 24,
  },
  ticketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ticketItemText: {
    fontSize: normalize(16),
    color: '#000',
    flex: 1,
  },
  ticketItemPrice: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#000',
  },
  costBreakdown: {
    marginBottom: 32,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: normalize(16),
    color: '#666',
  },
  costValue: {
    fontSize: normalize(16),
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#000',
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  paymentForm: {
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: normalize(16),
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  cardInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  nameInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: normalize(16),
    color: '#000',
  },
  reservationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  reservationText: {
    fontSize: normalize(16),
    color: '#666',
    textAlign: 'center',
  },
  reservationTime: {
    fontWeight: 'bold',
    color: '#000',
  },
  payButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  payButton: {
    backgroundColor: '#0C0453',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
});

export default TicketCheckoutScreen;
