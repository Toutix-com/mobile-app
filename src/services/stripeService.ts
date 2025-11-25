import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { getAuthToken } from '../utils/authToken';
import { api, commonApiWrapper } from '../utils/apiUtils';
import { showErrorToast } from '@components/toast';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here'; // Replace with your actual key
const API_BASE_URL = 'https://uc9avpfy2a.eu-west-2.awsapprunner.com';

export interface PaymentIntentRequest {
  amount: number; // Amount in cents
  currency: string;
  eventId: string;
  ticketQuantities: { [ticketId: string]: number };
  billingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  couponCode?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

// Create payment intent on your backend
export const createPaymentIntent = async (request: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 200) {
      throw new Error(data.message || 'Failed to create payment intent');
    }

    return data.data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create payment intent');
  }
};

// Confirm payment with Stripe
export const confirmPayment = async (
  clientSecret: string,
  paymentMethodId: string
): Promise<PaymentResult> => {
  try {
    // For now, return mock success since we're using payment sheet
    return {
      success: true,
      paymentIntentId: 'pi_mock_' + Date.now(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment confirmation failed',
    };
  }
};

// Validate coupon code - API call only
export const validateCoupon = (couponCode: string, eventId: string) => {
  return commonApiWrapper(api.get(`/coupons/validate?couponCode=${encodeURIComponent(couponCode)}&eventId=${encodeURIComponent(eventId)}`));
};

// Get payment methods for user
export const getPaymentMethods = async (): Promise<any[]> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment/methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 200) {
      throw new Error(data.message || 'Failed to fetch payment methods');
    }

    return data.data || [];
  } catch (error: any) {
    showErrorToast('Failed to fetch payment methods');
  }
};

// Save payment method
export const savePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment/save-method`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.status === 200;
  } catch (error: any) {
    showErrorToast('Failed to save payment method');
    return false;
  }
};

// Mock implementation for development
export const createMockPaymentIntent = async (request: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
  // Simulate API delay
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  
  return {
    clientSecret: 'pi_mock_client_secret_' + Date.now(),
    paymentIntentId: 'pi_mock_' + Date.now(),
    amount: request.amount,
    currency: request.currency,
  };
};

export const confirmMockPayment = async (
  clientSecret: string,
  paymentMethodId: string
): Promise<PaymentResult> => {
  // Simulate payment processing
  await new Promise<void>(resolve => setTimeout(resolve, 2000));
  
  // Mock success (90% success rate for testing)
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      paymentIntentId: 'pi_mock_' + Date.now(),
    };
  } else {
    return {
      success: false,
      error: 'Payment was declined. Please try a different payment method.',
    };
  }
};
