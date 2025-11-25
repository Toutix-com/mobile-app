import { signal } from '@preact/signals-react';
import { selectedEvent, ticketQuantities, getSubtotal, getTransactionFee, getTotal } from '../../event/store/event.store';
import { createMockPaymentIntent, confirmMockPayment, validateCoupon as validateCouponAPI } from '../../../services/stripeService';
import { getCheckoutObject } from '../../../services/ticketServices';
import { getErrorDataFromResponse } from '../../../services/ApiService';

// Checkout interfaces
export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

// Signals
export const isProcessingPayment = signal<boolean>(false);
export const paymentError = signal<string | null>(null);
export const selectedPaymentMethod = signal<PaymentMethod | null>(null);
export const billingAddress = signal<BillingAddress>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
});
export const appliedCoupon = signal<Coupon | null>(null);
export const couponCode = signal<string>('');
export const isCouponValid = signal<boolean>(false);
export const couponError = signal<string | null>(null);
// Legacy UI toggles (no longer used)
// Removed to avoid confusion and unused state

// Checkout payload from backend (client secret, amount, etc.)
export interface CheckoutPayload {
  currency: string;
  amount: number;
  clientSecret: string;
  customerId?: string;
  isFreeCheckout?: boolean;
}

export interface CouponData {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  amountOff: number | null;
  percentOff: number;
  maxUseCount: number;
  useCount: number;
  expire: string;
  events: {
    id: string;
  }[];
}

export const checkoutPayload = signal<CheckoutPayload | null>(null);

// Reservation timer (5 minutes default)
export const reservationSecondsRemaining = signal<number>(300);
export const isReservationExpired = signal<boolean>(false);
let reservationTimerHandle: ReturnType<typeof setInterval> | null = null;

export const startReservationTimer = (totalSeconds: number = 300) => {
  // Reset
  if (reservationTimerHandle) {
    clearInterval(reservationTimerHandle);
    reservationTimerHandle = null;
  }
  reservationSecondsRemaining.value = totalSeconds;
  isReservationExpired.value = false;

  reservationTimerHandle = setInterval(() => {
    const next = reservationSecondsRemaining.value - 1;
    reservationSecondsRemaining.value = Math.max(0, next);
    if (reservationSecondsRemaining.value === 0) {
      isReservationExpired.value = true;
      if (reservationTimerHandle) {
        clearInterval(reservationTimerHandle);
        reservationTimerHandle = null;
      }
    }
  }, 1000);
};

export const stopReservationTimer = () => {
  if (reservationTimerHandle) {
    clearInterval(reservationTimerHandle);
    reservationTimerHandle = null;
  }
};

export const resetReservationTimer = () => {
  reservationSecondsRemaining.value = 300;
  isReservationExpired.value = false;
  stopReservationTimer();
};

// Payment methods
export const paymentMethods = signal<PaymentMethod[]>([
  {
    id: 'card',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
  },
  {
    id: 'apple_pay',
    type: 'apple_pay',
  },
  {
    id: 'google_pay',
    type: 'google_pay',
  },
]);

// Functions
export const setSelectedPaymentMethod = (method: PaymentMethod) => {
  selectedPaymentMethod.value = method;
};

export const updateBillingAddress = (field: keyof BillingAddress, value: string) => {
  billingAddress.value = {
    ...billingAddress.value,
    [field]: value,
  };
};

export const applyCoupon = async (code: string) => {
  try {
    couponError.value = null;
    isCouponValid.value = false;
    
    if (!selectedEvent.value) {
      couponError.value = 'No event selected';
      return;
    }

    const [data, error] = await validateCouponAPI(code, selectedEvent.value.id);
    if (error) {
      couponError.value = 'Invalid coupon code';
      return;
    }

    const couponData = data as CouponData;

    
    // Check if coupon is expired
    if (couponData.expire && new Date(couponData.expire) < new Date()) {
      couponError.value = 'Coupon has expired';
      return;
    }

    // Check if coupon has reached max use count
    if (couponData.maxUseCount && couponData.useCount >= couponData.maxUseCount) {
      couponError.value = 'Coupon usage limit reached';
      return;
    }

    // Check if coupon is valid for this event
    const isValidForEvent = couponData.events?.some((event: any) => event.id === selectedEvent.value?.id);
    if (!isValidForEvent) {
      couponError.value = 'Coupon is not valid for this event';
      return;
    }

    // Determine discount amount and type
    let discount = 0;
    let type: 'percentage' | 'fixed' = 'fixed';
    
    if (couponData.percentOff) {
      discount = couponData.percentOff;
      type = 'percentage';
    } else if (couponData.amountOff) {
      discount = couponData.amountOff;
      type = 'fixed';
    }

    appliedCoupon.value = {
      code: code.toUpperCase(),
      discount,
      type,
    };
    isCouponValid.value = true;
  } catch (error) {
    couponError.value = 'Failed to validate coupon';
  }
};

export const removeCoupon = () => {
  appliedCoupon.value = null;
  couponCode.value = '';
  isCouponValid.value = false;
  couponError.value = null;
};

export const calculateDiscount = () => {
  if (!appliedCoupon.value) return 0;
  
  const subtotal = getSubtotal();
  if (appliedCoupon.value.type === 'percentage') {
    return (subtotal * appliedCoupon.value.discount) / 100;
  } else {
    return Math.min(appliedCoupon.value.discount, subtotal);
  }
};

export const getFinalTotal = () => {
  const subtotal = getSubtotal();
  const transactionFee = getTransactionFee();
  const discount = calculateDiscount();
  return Math.max(0, subtotal + transactionFee - discount);
};

export const getOrderSummary = () => {
  const event = selectedEvent.value;
  if (!event) return null;

  const subtotal = getSubtotal();
  const transactionFee = getTransactionFee();
  const discount = calculateDiscount();
  const total = getFinalTotal();

  const selectedTickets = event.ticketCategories
    .filter(cat => (ticketQuantities.value[cat.id] || 0) > 0)
    .map(cat => ({
      category: cat,
      quantity: ticketQuantities.value[cat.id] || 0,
      price: cat.price,
      total: (ticketQuantities.value[cat.id] || 0) * cat.price,
    }));

  return {
    event,
    tickets: selectedTickets,
    subtotal,
    transactionFee,
    discount,
    total,
    appliedCoupon: appliedCoupon.value,
  };
};

export const loadCheckoutObject = async (navigation: any) => {
    const orderSummary = getOrderSummary();
    
    const ticketPayload = (orderSummary?.tickets || []).map((e) => ({
        id: e.category.id,
        quantity: e.quantity,
    }));
    const [response, error] = await getCheckoutObject(
        ticketPayload as any,
        couponCode.value ?? "",
    );
    if (!response || error) {
        const errorObject = getErrorDataFromResponse(error);
        return;
    }
    // Expecting response in shape: { currency, amount, clientSecret, customerId, isFreeCheckout }
    checkoutPayload.value = {
      currency: response.currency,
      amount: response.amount,
      clientSecret: response.clientSecret,
      customerId: response.customerId,
      isFreeCheckout: response.isFreeCheckout,
    } as CheckoutPayload;

    // Start 5 minute reservation timer when checkout object is ready
    startReservationTimer(300);
};

export const processPayment = async () => {
  try {
    isProcessingPayment.value = true;
    paymentError.value = null;

    if (!selectedEvent.value || !selectedPaymentMethod.value) {
      throw new Error('Missing required payment information');
    }

    // Create payment intent
    const paymentIntent = await createMockPaymentIntent({
      amount: Math.round(getFinalTotal() * 100), // Convert to cents
      currency: 'usd',
      eventId: selectedEvent.value.id,
      ticketQuantities: ticketQuantities.value,
      billingAddress: billingAddress.value,
      couponCode: appliedCoupon.value?.code,
    });

    // Confirm payment with Stripe
    const result = await confirmMockPayment(
      paymentIntent.clientSecret,
      selectedPaymentMethod.value.id
    );

    if (result.success) {
      return { success: true, paymentIntentId: result.paymentIntentId };
    } else {
      throw new Error(result.error || 'Payment failed');
    }
  } catch (error: any) {
    paymentError.value = error.message || 'Payment failed';
    return { success: false, error: error.message };
  } finally {
    isProcessingPayment.value = false;
  }
};

export const clearCheckout = () => {
  isProcessingPayment.value = false;
  paymentError.value = null;
  selectedPaymentMethod.value = null;
  appliedCoupon.value = null;
  couponCode.value = '';
  isCouponValid.value = false;
  couponError.value = null;
  stopReservationTimer();
  
  // Import and clear event-related data
  const { clearSelectedEvent, clearTicketQuantities } = require('../../event/store/event.store');
  clearSelectedEvent();
  clearTicketQuantities();
};
