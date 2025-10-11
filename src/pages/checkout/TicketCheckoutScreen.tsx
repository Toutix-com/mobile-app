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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSignals } from '@preact/signals-react/runtime';
import { normalize } from '../../utils/responsive';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Trash2
} from 'lucide-react-native';
import {
  useStripe,
  CardField,
  CardForm,
  useConfirmPayment,
  usePaymentSheet,
  PaymentSheet
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
  stopReservationTimer,
  resetReservationTimer
} from './store/checkout.store';
import { createMockPaymentIntent } from '../../services/stripeService';
import { showErrorToast } from '@components/toast';

const TicketCheckoutScreen: React.FC = () => {
  useSignals();
  const navigation = useNavigation();
  const { confirmPayment } = useStripe();
  const { confirmPayment: confirmPaymentHook, } = useConfirmPayment();
  const { presentPaymentSheet , initPaymentSheet, loading } = usePaymentSheet();

  const orderSummary = getOrderSummary();
  

  useEffect(() => {
    return () => {
      stopReservationTimer();
      resetReservationTimer();
      removeCoupon();
    };
  }, []);

  const initializePaymentSheet = async () => {
    console.log(checkoutPayload.value, "Checkout Payload");
    
    if (checkoutPayload.value?.clientSecret) {
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: checkoutPayload.value.clientSecret,
        merchantDisplayName: 'Toutix',
      });

      console.log(error, "Error");
    }
  }

  if (!orderSummary) {
    return (
      <View style={styles.container}>
        <Text>No order data available</Text>
      </View>
    );
  }

  const hanldeBuy = async () => {
    startReservationTimer(300);
    loadCheckoutObject(navigation).then(async () => {
      await initializePaymentSheet();
      if (checkoutPayload.value?.isFreeCheckout) {
        navigation.navigate('SuccessReceipt');
        return;
      }
      
      const { error } = await presentPaymentSheet();
      if (error) {
        console.log(error, "Error Payment Sheet");
        showErrorToast('Payment Failed', error.message || 'Please try again');
      } else {
        console.log("Payment Sheet Presented Successfully");
        navigation.navigate('SuccessReceipt' as never);
      }
    });
  }

  const { event, tickets, subtotal, transactionFee, discount, total } = orderSummary;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      

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
          {tickets.map((ticket, index) => (
            <View style={styles.ticketItem} key={index}>
              <Text style={styles.ticketItemText}>{ticket.quantity} X {ticket.category.title}</Text>
              <Text style={styles.ticketItemPrice}>${ticket.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.costBreakdown}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Sub total</Text>
            <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Transaction fee</Text>
            <Text style={styles.costValue}>${transactionFee.toFixed(2)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Discount</Text>
              <Text style={[styles.costValue, styles.discountValue]}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={[styles.costRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Have a coupon?</Text>
          
          <View style={styles.paymentForm}>
            <View style={[styles.inputGroup, styles.couponInputRow]}>
              <TextInput
                style={[styles.nameInput, appliedCoupon.value && styles.nameInputDisabled]}
                placeholder="Enter coupon code"
                placeholderTextColor="#999"
                value={couponCode.value}
                onChangeText={(text) => {
                  // Update coupon code in store
                  couponCode.value = text;
                }}
                editable={!appliedCoupon.value}
              />
              <TouchableOpacity 
                style={[
                  styles.applyCouponButton, 
                  (couponCode.value.trim().length > 0 || appliedCoupon.value) && styles.applyCouponButtonActive
                ]}
                onPress={() => {
                  if (appliedCoupon.value) {
                    removeCoupon();
                  } else {
                    applyCoupon(couponCode.value);
                  }
                }}
                disabled={!appliedCoupon.value && couponCode.value.trim().length === 0}
              >
                {appliedCoupon.value ? (
                  <Trash2 
                    color="#fff" 
                    size={20} 
                  />
                ) : (
                  <CheckCircle 
                    color={couponCode.value.trim().length > 0 ? "#fff" : "#000"} 
                    size={24} 
                  />
                )}
              </TouchableOpacity>
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
    marginTop: normalize(60),
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
  discountValue: {
    color: '#28a745',
    fontWeight: '600',
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
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    marginRight: 12,
  },
  nameInputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    borderColor: '#dee2e6',
  },
  applyCouponButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  applyCouponButtonActive: {
    backgroundColor: '#0C0453',
    borderColor: '#0C0453',
  },
  couponApplied: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  couponAppliedText: {
    fontSize: normalize(14),
    color: '#2d5a2d',
    flex: 1,
  },
  couponDiscount: {
    fontWeight: 'bold',
    color: '#1a4a1a',
  },
  removeCouponText: {
    fontSize: normalize(14),
    color: '#0C0453',
    fontWeight: '600',
  },
  couponError: {
    fontSize: normalize(14),
    color: '#dc3545',
    marginTop: 8,
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
