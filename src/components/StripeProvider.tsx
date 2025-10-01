import React from 'react';
import { StripeProvider as StripeProviderComponent } from '@stripe/stripe-react-native';

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51OjNO1L6oeMlaoGU6CjNs3HlOgqKEXnwOmJXQnfraRe5PDL7q3Q7AkrFVezntaCZ8h2NYibYtjjEwEK7BFoVnWkv001eJdfSBQ';

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return (
    <StripeProviderComponent
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.toutix.app" // Replace with your merchant ID
      urlScheme="toutix://" // Replace with your app's URL scheme
    >
      {children as React.ReactElement}
    </StripeProviderComponent>
  );
};

export default StripeProvider;
